"use strict";
// agent/keyManager.ts
// Intelligent Multi-Account API Key Rotator & Quota Manager for LoLaBo
// Supports rotating across multiple free-tier accounts with instant failover on 429 / Quota limits
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyManager = void 0;
class KeyManager {
    keys = new Map();
    roundRobinIndices = new Map();
    constructor() {
        this.initializeKeys();
    }
    /**
     * Scans environment variables for all available single and multi-account API keys
     */
    initializeKeys() {
        this.keys.clear();
        // 1. Google Gemini Multi-Account Pool (up to 4+ accounts)
        const geminiKeys = [];
        // Comma-delimited list: GEMINI_API_KEYS="key1,key2,key3,key4"
        if (process.env.GEMINI_API_KEYS) {
            process.env.GEMINI_API_KEYS.split(',')
                .map(k => k.trim())
                .filter(Boolean)
                .forEach(k => geminiKeys.push(k));
        }
        // Numbered environment variables: GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc.
        for (let i = 1; i <= 8; i++) {
            const key = process.env[`GEMINI_API_KEY_${i}`] || process.env[`GOOGLE_API_KEY_${i}`];
            if (key && key.trim()) {
                geminiKeys.push(key.trim());
            }
        }
        // Primary fallbacks
        if (process.env.GEMINI_API_KEY)
            geminiKeys.push(process.env.GEMINI_API_KEY.trim());
        if (process.env.GOOGLE_API_KEY)
            geminiKeys.push(process.env.GOOGLE_API_KEY.trim());
        if (process.env.AI_API_KEY && (process.env.AI_API_KEY.startsWith('AIza') || process.env.AI_API_KEY.startsWith('AQ.'))) {
            geminiKeys.push(process.env.AI_API_KEY.trim());
        }
        // Deduplicate while preserving order
        const uniqueGemini = Array.from(new Set(geminiKeys));
        uniqueGemini.forEach((k, idx) => {
            this.registerKey('gemini', k, `Google Account #${idx + 1}`);
        });
        // 2. Groq Free Tier Keys
        const groqKeys = [
            process.env.GROQ_API_KEY,
            process.env.GROQ_API_KEY_1,
            process.env.GROQ_API_KEY_2
        ].filter(Boolean);
        Array.from(new Set(groqKeys)).forEach((k, idx) => {
            this.registerKey('groq', k, `Groq Account #${idx + 1}`);
        });
        // 3. Cerebras Free Tier Keys
        const cerebrasKeys = [
            process.env.CEREBRAS_API_KEY,
            process.env.CEREBRAS_API_KEY_1
        ].filter(Boolean);
        Array.from(new Set(cerebrasKeys)).forEach((k, idx) => {
            this.registerKey('cerebras', k, `Cerebras Account #${idx + 1}`);
        });
        // 4. SambaNova Free Tier Keys
        const sambanovaKeys = [
            process.env.SAMBANOVA_API_KEY,
            process.env.SAMBANOVA_API_KEY_1
        ].filter(Boolean);
        Array.from(new Set(sambanovaKeys)).forEach((k, idx) => {
            this.registerKey('sambanova', k, `SambaNova Account #${idx + 1}`);
        });
        // 5. GitHub Models Token
        const githubTokens = [
            process.env.GITHUB_MODELS_TOKEN,
            process.env.GITHUB_TOKEN,
            process.env.GH_TOKEN
        ].filter(Boolean);
        Array.from(new Set(githubTokens)).forEach((k, idx) => {
            this.registerKey('github', k, `GitHub Models #${idx + 1}`);
        });
        // 6. Mistral AI Keys
        const mistralKeys = [
            process.env.MISTRAL_API_KEY,
            process.env.MISTRAL_API_KEY_1
        ].filter(Boolean);
        Array.from(new Set(mistralKeys)).forEach((k, idx) => {
            this.registerKey('mistral', k, `Mistral Account #${idx + 1}`);
        });
        // 7. OpenRouter Free Keys
        const openrouterKeys = [
            process.env.OPENROUTER_API_KEY,
            process.env.OPENROUTER_API_KEY_1
        ].filter(Boolean);
        Array.from(new Set(openrouterKeys)).forEach((k, idx) => {
            this.registerKey('openrouter', k, `OpenRouter Account #${idx + 1}`);
        });
    }
    registerKey(provider, key, label) {
        if (!this.keys.has(provider)) {
            this.keys.set(provider, []);
            this.roundRobinIndices.set(provider, 0);
        }
        const pool = this.keys.get(provider);
        pool.push({
            id: `${provider}_${pool.length + 1}`,
            provider,
            key,
            accountLabel: label,
            isExhausted: false,
            cooldownUntil: 0,
            requestCount: 0,
            lastUsedAt: 0,
            errorCount: 0
        });
    }
    /**
     * Retrieves an available key for the requested provider using round-robin rotation.
     * Skips keys that are currently cooling down after 429 quota exhaustion.
     */
    getKey(provider = 'gemini') {
        const prov = (provider === 'google' || provider.startsWith('gemini')) ? 'gemini' : provider;
        const pool = this.keys.get(prov);
        if (!pool || pool.length === 0)
            return null;
        const now = Date.now();
        const startIndex = this.roundRobinIndices.get(prov) || 0;
        for (let i = 0; i < pool.length; i++) {
            const idx = (startIndex + i) % pool.length;
            const profile = pool[idx];
            // Check if cooldown has expired
            if (profile.cooldownUntil > 0 && now >= profile.cooldownUntil) {
                profile.isExhausted = false;
                profile.cooldownUntil = 0;
                profile.errorCount = 0;
            }
            if (!profile.isExhausted) {
                this.roundRobinIndices.set(prov, (idx + 1) % pool.length);
                profile.requestCount++;
                profile.lastUsedAt = now;
                return profile;
            }
        }
        // If all keys are in cooldown, find the key with the earliest cooldown expiration
        let earliest = pool[0];
        for (const p of pool) {
            if (p.cooldownUntil < earliest.cooldownUntil) {
                earliest = p;
            }
        }
        return earliest;
    }
    /**
     * Reports a successful request on a key profile
     */
    reportSuccess(keyId) {
        for (const pool of this.keys.values()) {
            const found = pool.find(p => p.id === keyId);
            if (found) {
                found.errorCount = 0;
                return;
            }
        }
    }
    /**
     * Reports a rate limit (HTTP 429 / RESOURCE_EXHAUSTED) on a key profile and activates cooldown.
     * Default cooldown: 60 seconds for burst RPM; 1 hour for daily RPD quota exhaustion.
     */
    reportRateLimit(keyId, isDailyQuota = false) {
        for (const pool of this.keys.values()) {
            const found = pool.find(p => p.id === keyId);
            if (found) {
                found.isExhausted = true;
                found.errorCount++;
                const cooldownDuration = isDailyQuota ? 3600 * 1000 : 65 * 1000; // 1hr or 65s
                found.cooldownUntil = Date.now() + cooldownDuration;
                console.warn(`⏳ [KeyManager] Put ${found.accountLabel} on cooldown for ${Math.round(cooldownDuration / 1000)}s (Daily Quota: ${isDailyQuota})`);
                return;
            }
        }
    }
    /**
     * Returns complete diagnostics of the multi-account key pool
     */
    getStatus() {
        const summary = {};
        for (const [provider, pool] of this.keys.entries()) {
            summary[provider] = {
                totalAccounts: pool.length,
                activeAccounts: pool.filter(p => !p.isExhausted).length,
                accounts: pool.map(p => ({
                    label: p.accountLabel,
                    maskedKey: `${p.key.slice(0, 6)}...${p.key.slice(-4)}`,
                    isExhausted: p.isExhausted,
                    cooldownRemainingSeconds: Math.max(0, Math.round((p.cooldownUntil - Date.now()) / 1000)),
                    requests: p.requestCount
                }))
            };
        }
        return summary;
    }
    getAccountCount(provider = 'gemini') {
        const pool = this.keys.get(provider);
        return pool ? pool.length : 0;
    }
}
exports.keyManager = new KeyManager();
