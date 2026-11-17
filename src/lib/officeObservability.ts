import { auth } from "./firebase";

export type InfrastructureState = "operational" | "degraded" | "unavailable";

export interface TrafficPoint {
  timestamp: string;
  requests: number;
  bandwidth: number;
  visits: number;
}

export interface DnsRecordSummary {
  name: string;
  type: string;
  proxied: boolean;
  ttl: number;
}

export interface WorkerSummary {
  name: string;
  modifiedAt: string | null;
  usageModel: string | null;
}

export interface CloudflareOverview {
  generatedAt: string;
  periodHours: number;
  zone: {
    name: string;
    status: string;
    plan: string;
    developmentMode: number;
    nameServers: string[];
  };
  totals: {
    requests: number;
    bandwidth: number;
    visits: number;
    cachedRequests: number;
    threats: number | null;
    originErrors: number;
  };
  traffic: TrafficPoint[];
  dns: DnsRecordSummary[];
  workers: WorkerSummary[];
  notices: string[];
}

export interface OfficeObservabilityResult {
  state: InfrastructureState;
  data: CloudflareOverview | null;
  message: string;
}

const endpoint = (import.meta.env.VITE_OFFICE_OBSERVABILITY_URL as string | undefined)?.replace(/\/$/, "");

function friendlyError(status: number): string {
  if (status === 401) return "Your Office session expired. Sign in again to refresh infrastructure access.";
  if (status === 403) return "Your Office role does not include infrastructure analytics.";
  if (status === 429) return "Cloudflare is rate-limiting this view. Wait a moment, then refresh.";
  return "The infrastructure gateway is temporarily unavailable.";
}

export async function loadCloudflareOverview(signal?: AbortSignal): Promise<OfficeObservabilityResult> {
  if (!endpoint) {
    return {
      state: "unavailable",
      data: null,
      message: "Cloudflare monitoring is not connected to this deployment yet.",
    };
  }

  const user = auth.currentUser;
  if (!user) {
    return { state: "unavailable", data: null, message: "Sign in to view infrastructure analytics." };
  }

  try {
    const token = await user.getIdToken();
    const response = await fetch(`${endpoint}/api/overview`, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });
    if (!response.ok) {
      return { state: response.status >= 500 ? "degraded" : "unavailable", data: null, message: friendlyError(response.status) };
    }
    const data = await response.json() as CloudflareOverview;
    return {
      state: data.notices.length > 0 ? "degraded" : "operational",
      data,
      message: data.notices.length > 0 ? "Live data loaded with limited Cloudflare sections." : "Live Cloudflare data is current.",
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    return { state: "degraded", data: null, message: "Could not reach the protected Cloudflare monitoring gateway." };
  }
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function formatBytes(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  return `${(value / (1024 ** index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}
