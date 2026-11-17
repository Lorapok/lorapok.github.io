import { useCallback, useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import {
  Activity, AlertTriangle, CheckCircle2, Cloud, Database, Globe2,
  HardDrive, Network, RefreshCw, Server, ShieldCheck,
} from "lucide-react";
import { db } from "../../lib/firebase";
import {
  type OfficeObservabilityResult,
  formatBytes,
  formatCompact,
  loadCloudflareOverview,
} from "../../lib/officeObservability";

interface ProductMetric {
  label: string;
  count: number;
  pct: number;
}

const emptyCloudflare: OfficeObservabilityResult = {
  state: "unavailable",
  data: null,
  message: "Connecting to the protected infrastructure gateway…",
};

function formatTime(value: string | null | undefined): string {
  if (!value) return "Not reported";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not reported" : date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function TrafficChart({ values }: { values: { timestamp: string; requests: number }[] }) {
  const points = useMemo(() => {
    if (values.length === 0) return "";
    const max = Math.max(...values.map((item) => item.requests), 1);
    return values.map((item, index) => {
      const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100;
      const y = 94 - (item.requests / max) * 84;
      return `${x},${y}`;
    }).join(" ");
  }, [values]);

  return (
    <div className="infra-chart" role="img" aria-label="Cloudflare request volume over the selected period">
      {points ? (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="infraArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#67f5bb" stopOpacity=".3" />
              <stop offset="1" stopColor="#67f5bb" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline className="infra-chart__area" points={`0,100 ${points} 100,100`} />
          <polyline className="infra-chart__line" points={points} />
        </svg>
      ) : <div className="infra-empty">Traffic series is not available for this Cloudflare plan.</div>}
    </div>
  );
}

export default function AnalyticsPanel() {
  const [cloudflare, setCloudflare] = useState<OfficeObservabilityResult>(emptyCloudflare);
  const [productMetrics, setProductMetrics] = useState<ProductMetric[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const load = useCallback(async (signal?: AbortSignal, manual = false) => {
    if (manual) setRefreshing(true); else setLoading(true);
    const [infrastructure, analytics] = await Promise.all([
      loadCloudflareOverview(signal),
      getDocs(collection(db, "analytics")).then((snapshot) => snapshot.docs.map((item) => item.data())).catch(() => []),
    ]);
    if (signal?.aborted) return;

    const providerUsage: Record<string, number> = {};
    analytics.filter((event) => event.category === "ai").forEach((event) => {
      const provider = typeof event.metadata?.provider === "string" ? event.metadata.provider : "unknown";
      providerUsage[provider] = (providerUsage[provider] || 0) + 1;
    });
    const providerTotal = Object.values(providerUsage).reduce((sum, value) => sum + value, 0);

    setCloudflare(infrastructure);
    setTotalEvents(analytics.length);
    setUniqueUsers(new Set(analytics.map((event) => event.uid).filter(Boolean)).size);
    setProductMetrics(Object.entries(providerUsage).sort(([, a], [, b]) => b - a).map(([label, count]) => ({
      label,
      count,
      pct: providerTotal > 0 ? (count / providerTotal) * 100 : 0,
    })));
    setLastRefresh(new Date());
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const initial = window.setTimeout(() => void load(controller.signal), 0);
    const timer = window.setInterval(() => void load(controller.signal), 120_000);
    return () => { controller.abort(); window.clearTimeout(initial); window.clearInterval(timer); };
  }, [load]);

  const overview = cloudflare.data;
  const cacheRate = overview && overview.totals.requests > 0
    ? Math.round((overview.totals.cachedRequests / overview.totals.requests) * 100)
    : 0;
  const healthLabel = cloudflare.state === "operational" ? "Operational" : cloudflare.state === "degraded" ? "Partial data" : "Not connected";

  return (
    <div className="infra-office">
      <header className="infra-header">
        <div>
          <div className="dev-kicker"><Cloud size={13} /> Cloudflare command center</div>
          <h1>Infrastructure observability</h1>
          <p>Live traffic, security, DNS, edge workloads, and product signals—visible only to authorized Office roles.</p>
        </div>
        <div className="infra-header__actions">
          <span className={`infra-state state-${cloudflare.state}`}><i />{healthLabel}</span>
          <button className="dev-btn dev-btn-ghost" onClick={() => void load(undefined, true)} disabled={refreshing}>
            <RefreshCw size={15} className={refreshing ? "is-spinning" : ""} /> {refreshing ? "Refreshing" : "Refresh data"}
          </button>
        </div>
      </header>

      <div className={`infra-notice state-${cloudflare.state}`}>
        {cloudflare.state === "operational" ? <CheckCircle2 size={17} /> : <AlertTriangle size={17} />}
        <span><strong>{cloudflare.message}</strong>{lastRefresh && ` Last checked ${lastRefresh.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`}</span>
      </div>

      <section className="infra-metrics" aria-label="Cloudflare summary">
        {[
          { icon: Activity, value: overview ? formatCompact(overview.totals.requests) : "—", label: `${overview?.periodHours ?? 24}h requests` },
          { icon: HardDrive, value: overview ? formatBytes(overview.totals.bandwidth) : "—", label: "edge bandwidth" },
          { icon: Database, value: overview ? `${cacheRate}%` : "—", label: "cache hit rate" },
          { icon: ShieldCheck, value: overview?.totals.threats == null ? "Plan N/A" : formatCompact(overview.totals.threats), label: "security events" },
          { icon: AlertTriangle, value: overview ? formatCompact(overview.totals.originErrors) : "—", label: "origin 5xx" },
          { icon: Globe2, value: overview?.zone.status ?? "—", label: "zone status" },
        ].map(({ icon: Icon, value, label }) => (
          <article key={label}><Icon size={18} /><strong>{loading ? "…" : value}</strong><span>{label}</span></article>
        ))}
      </section>

      <section className="infra-grid">
        <article className="infra-card infra-card--wide">
          <div className="infra-card__heading">
            <div><span>Edge traffic</span><h2>Request activity</h2></div>
            <small>{overview ? `${overview.periodHours} hour window` : "Awaiting live data"}</small>
          </div>
          <TrafficChart values={overview?.traffic ?? []} />
          <div className="infra-chart__footer">
            <span><strong>{overview ? formatCompact(overview.totals.visits) : "—"}</strong> estimated visits</span>
            <span><strong>{overview?.traffic.length ?? 0}</strong> hourly samples</span>
            <span><strong>{overview?.zone.plan ?? "—"}</strong> Cloudflare plan</span>
          </div>
        </article>

        <article className="infra-card">
          <div className="infra-card__heading"><div><span>Zone posture</span><h2>{overview?.zone.name ?? "lorapok.tech"}</h2></div><Network size={19} /></div>
          <dl className="infra-definition-list">
            <div><dt>Status</dt><dd>{overview?.zone.status ?? "Not available"}</dd></div>
            <div><dt>Plan</dt><dd>{overview?.zone.plan ?? "Not available"}</dd></div>
            <div><dt>Development mode</dt><dd>{overview ? (overview.zone.developmentMode > 0 ? "Enabled" : "Disabled") : "Not available"}</dd></div>
            <div><dt>Nameservers</dt><dd>{overview?.zone.nameServers.length ?? 0} active</dd></div>
            <div><dt>Gateway data</dt><dd>{formatTime(overview?.generatedAt)}</dd></div>
          </dl>
        </article>

        <article className="infra-card">
          <div className="infra-card__heading"><div><span>DNS inventory</span><h2>Published records</h2></div><Globe2 size={19} /></div>
          <div className="infra-table" role="table" aria-label="Cloudflare DNS records">
            {(overview?.dns ?? []).slice(0, 8).map((record, index) => (
              <div role="row" key={`${record.type}-${record.name}-${record.proxied ? "proxied" : "dns"}-${index}`}><b>{record.type}</b><span>{record.name}</span><em>{record.proxied ? "Proxied" : "DNS only"}</em></div>
            ))}
            {overview && overview.dns.length > 8 && <small>+ {overview.dns.length - 8} more records protected from this compact view</small>}
            {(!overview || overview.dns.length === 0) && <div className="infra-empty">DNS inventory unavailable.</div>}
          </div>
        </article>

        <article className="infra-card">
          <div className="infra-card__heading"><div><span>Edge workloads</span><h2>Workers</h2></div><Server size={19} /></div>
          <div className="infra-worker-list">
            {(overview?.workers ?? []).slice(0, 7).map((worker) => (
              <div key={worker.name}><span><i />{worker.name}</span><time>{formatTime(worker.modifiedAt)}</time></div>
            ))}
            {(!overview || overview.workers.length === 0) && <div className="infra-empty">Worker inventory unavailable.</div>}
          </div>
        </article>

        <article className="infra-card">
          <div className="infra-card__heading"><div><span>Office signals</span><h2>Product activity</h2></div><Activity size={19} /></div>
          <div className="infra-product-stats"><span><strong>{totalEvents}</strong>tracked events</span><span><strong>{uniqueUsers}</strong>maintainers</span></div>
          <div className="infra-provider-list">
            {productMetrics.map((metric) => <div key={metric.label}><span><b>{metric.label}</b><small>{metric.count} uses</small></span><i><b style={{ width: `${metric.pct}%` }} /></i></div>)}
            {productMetrics.length === 0 && <div className="infra-empty">No AI provider events have been recorded yet.</div>}
          </div>
        </article>
      </section>

      {overview && overview.notices.length > 0 && (
        <section className="infra-limitations"><AlertTriangle size={17} /><div><strong>Partial Cloudflare response</strong>{overview.notices.map((notice) => <p key={notice}>{notice}</p>)}</div></section>
      )}
    </div>
  );
}
