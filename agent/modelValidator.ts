// agent/modelValidator.ts
// Intelligent Model Health, Real-Time Validation & Automated Deprecation Pruning Engine
// Continuously audits candidate models against Google Gemini API metadata and runtime telemetry.
// Automatically prunes deprecated, retired, 404, or unsupported models from execution ladders.

import * as fs from 'fs';
import * as path from 'path';

export interface ModelHealthRecord {
  model: string;
  status: 'active' | 'deprecated' | 'unsupported' | 'rate_limited' | 'unknown';
  lastChecked: number;
  reason?: string;
  supportedMethods?: string[];
}

export class ModelValidator {
  private static instance: ModelValidator;
  private deprecatedModels: Set<string> = new Set();
  private verifiedActiveModels: Set<string> = new Set();
  private cacheFilePath: string;
  private lastRemoteSync: number = 0;
  private readonly SYNC_TTL_MS = 60 * 60 * 1000; // 1 hour TTL

  private constructor() {
    const debugDir = path.resolve(__dirname, '../.loragent-debug');
    try {
      if (!fs.existsSync(debugDir)) {
        fs.mkdirSync(debugDir, { recursive: true });
      }
    } catch {}
    this.cacheFilePath = path.join(debugDir, 'deprecated-models.json');
    this.loadState();
  }

  public static getInstance(): ModelValidator {
    if (!ModelValidator.instance) {
      ModelValidator.instance = new ModelValidator();
    }
    return ModelValidator.instance;
  }

  /**
   * Loads persisted deprecation list from disk
   */
  private loadState(): void {
    try {
      if (fs.existsSync(this.cacheFilePath)) {
        const raw = fs.readFileSync(this.cacheFilePath, 'utf8');
        const data = JSON.parse(raw);
        if (Array.isArray(data.deprecated)) {
          data.deprecated.forEach((m: string) => this.deprecatedModels.add(m));
        }
        if (Array.isArray(data.active)) {
          data.active.forEach((m: string) => this.verifiedActiveModels.add(m));
        }
      }
    } catch {}
  }

  /**
   * Persists deprecated models cache to disk
   */
  private saveState(): void {
    try {
      const data = {
        updatedAt: new Date().toISOString(),
        deprecated: Array.from(this.deprecatedModels),
        active: Array.from(this.verifiedActiveModels)
      };
      fs.writeFileSync(this.cacheFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch {}
  }

  /**
   * Checks if an API response indicates that the model is deprecated, not found, or unsupported
   */
  public isDeprecatedOrNotFound(status: number, data: any): { isDeprecated: boolean; reason: string } {
    const errMsg = (data?.error?.message || '').toLowerCase();
    const errStatus = (data?.error?.status || '').toLowerCase();
    const code = data?.error?.code || status;

    if (code === 404 || errStatus === 'not_found') {
      return { 
        isDeprecated: true, 
        reason: `HTTP 404 NOT_FOUND: ${data?.error?.message || 'Model does not exist on endpoint'}` 
      };
    }

    if (
      errMsg.includes('deprecated') ||
      errMsg.includes('no longer available') ||
      errMsg.includes('is not found for api version') ||
      errMsg.includes('unsupported model') ||
      errMsg.includes('not supported for generatecontent') ||
      errMsg.includes('unknown model') ||
      (code === 400 && errMsg.includes('invalid_argument') && errMsg.includes('model'))
    ) {
      return { 
        isDeprecated: true, 
        reason: data?.error?.message || 'Model deprecated or unsupported by API' 
      };
    }

    return { isDeprecated: false, reason: '' };
  }

  /**
   * Automatically registers a model as deprecated and quarantines it from all future execution
   */
  public markDeprecated(model: string, reason: string): void {
    const normalized = model.trim().replace(/^models\//, '');
    if (!this.deprecatedModels.has(normalized)) {
      this.deprecatedModels.add(normalized);
      this.verifiedActiveModels.delete(normalized);
      console.warn(`🚫 [ModelValidator] Automatically removed deprecated/unsupported model "${normalized}": ${reason}`);
      this.saveState();
    }
  }

  /**
   * Marks a model as verified active
   */
  public markActive(model: string): void {
    const normalized = model.trim().replace(/^models\//, '');
    this.verifiedActiveModels.add(normalized);
    this.deprecatedModels.delete(normalized);
  }

  /**
   * Checks if a model is currently marked as deprecated
   */
  public isDeprecated(model: string): boolean {
    const normalized = model.trim().replace(/^models\//, '');
    return this.deprecatedModels.has(normalized);
  }

  /**
   * Synchronizes active models from Google Gemini API endpoint:
   * GET https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}
   */
  public async syncRemoteModels(apiKey: string): Promise<void> {
    if (!apiKey || (Date.now() - this.lastRemoteSync < this.SYNC_TTL_MS && this.verifiedActiveModels.size > 0)) {
      return;
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) return;

      const data: any = await res.json();
      if (Array.isArray(data?.models)) {
        const remoteSupported = new Set<string>();
        for (const m of data.models) {
          if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
            const name = (m.name || '').replace(/^models\//, '');
            if (name) {
              remoteSupported.add(name);
              this.markActive(name);
            }
          }
        }
        this.lastRemoteSync = Date.now();
        this.saveState();
        console.log(`✅ [ModelValidator] Remote discovery verified ${remoteSupported.size} active generation models.`);
      }
    } catch {
      // Quiet fallback when offline or in sandbox
    }
  }

  /**
   * Filters candidate models array in real-time, removing any deprecated or unavailable models.
   */
  public async validateAndFilterCandidates(candidates: string[], apiKey?: string): Promise<string[]> {
    if (apiKey) {
      await this.syncRemoteModels(apiKey);
    }

    const filtered = candidates.filter(m => {
      const normalized = m.trim().replace(/^models\//, '');
      if (this.deprecatedModels.has(normalized)) {
        console.log(`ℹ️ [ModelValidator] Excluding deprecated model from execution ladder: ${normalized}`);
        return false;
      }
      return true;
    });

    // Resilience safeguard: never allow an empty ladder; fallback to core base models
    if (filtered.length === 0) {
      console.warn(`⚠️ [ModelValidator] All candidate models were marked deprecated! Restoring resilient fallback ladder.`);
      return ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    }

    return filtered;
  }

  /**
   * Get all currently known deprecated models
   */
  public getDeprecatedModels(): string[] {
    return Array.from(this.deprecatedModels);
  }

  /**
   * Get all currently verified active models
   */
  public getVerifiedModels(): string[] {
    return Array.from(this.verifiedActiveModels);
  }
}

export const modelValidator = ModelValidator.getInstance();
