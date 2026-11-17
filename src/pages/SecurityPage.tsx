import { ArrowUpRight, BadgeCheck, CheckCircle2, Download, ExternalLink, FileCheck2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { SEOHead } from "../components/SEOHead";
import PageIntro from "../components/layout/PageIntro";
import "./SecurityPage.css";

const assuranceAreas = [
  {
    title: "Identity & access",
    text: "Verified-email bootstrap ownership, server-controlled roles, invitation boundaries, and least-privilege administrative updates were tested with the Firebase emulator.",
  },
  {
    title: "LoLaBo control plane",
    text: "Administrative, generation, export, telemetry, and webhook routes now fail closed behind a strong service token. Public post APIs exclude drafts.",
  },
  {
    title: "Input & destination safety",
    text: "Newsletter, analytics, and audit writes are schema- and size-bounded. Discord delivery accepts only canonical HTTPS webhook destinations and refuses redirects.",
  },
  {
    title: "Delivery & supply chain",
    text: "Production dependency trees were audited with zero known advisories, defensive response headers were verified, and the static production build completed successfully.",
  },
];

const evidence = [
  "Negative authorization tests for anonymous, pending, suspended, viewer, teammate, editor, researcher, admin, and owner roles",
  "Fail-closed API-token and webhook-destination regression tests",
  "Production dependency audits for the website and LoLaBo service",
  "Static build, route pre-render, SEO asset, and live response-header checks",
];

export default function SecurityPage() {
  return (
    <>
      <SEOHead
        title="Security & VAPT Attestation"
        description="Lorapok Labs security posture, internal VAPT attestation, remediation evidence, and responsible-disclosure contact."
        path="/security/"
      />
      <article className="security-page v4-inner-page">
        <div className="security-page__inner">
          <PageIntro
            tone="mint"
            eyebrow="LORAPOK LABS / SECURITY ASSURANCE"
            title={<>Security with<br /><em>evidence attached.</em></>}
            description="A transparent record of the controls tested across lorapok.tech, its Firebase access layer, and the LoLaBo automation service."
          />

          <section className="security-attestation" aria-labelledby="attestation-title">
            <div className="security-attestation__seal" aria-hidden="true">
              <ShieldCheck />
              <span>VAPT</span>
            </div>
            <div className="security-attestation__copy">
              <p className="security-eyebrow">INTERNAL VAPT ATTESTATION · LP-VAPT-2026-1118-R1</p>
              <h2 id="attestation-title">Remediated and re-tested</h2>
              <p>
                The assessed controls passed their documented regression checks on 18 November 2026. This attestation covers the reviewed revision and deployed surfaces; it does not promise that future changes are vulnerability-free.
              </p>
              <div className="security-attestation__meta">
                <span><BadgeCheck /> Assessment complete</span>
                <span><FileCheck2 /> Evidence published</span>
                <span><LockKeyhole /> Responsible disclosure open</span>
              </div>
            </div>
            <div className="security-attestation__actions">
              <a href="/security/vapt-attestation.svg" download>
                <Download /> Certificate
              </a>
              <a href="/security/vapt-attestation.json">
                Machine record <ExternalLink />
              </a>
            </div>
          </section>

          <section className="security-grid" aria-label="Assurance areas">
            {assuranceAreas.map((area, index) => (
              <article className="security-card" key={area.title}>
                <span className="security-card__number">0{index + 1}</span>
                <CheckCircle2 aria-hidden="true" />
                <h2>{area.title}</h2>
                <p>{area.text}</p>
              </article>
            ))}
          </section>

          <section className="security-evidence" aria-labelledby="evidence-title">
            <div>
              <p className="security-eyebrow">TESTED, NOT ASSUMED</p>
              <h2 id="evidence-title">Verification evidence</h2>
              <p>The assessment combined source review, abuse-case analysis, emulated authorization tests, dependency analysis, build verification, and live public-surface inspection.</p>
            </div>
            <ul>
              {evidence.map((item) => <li key={item}><CheckCircle2 /> {item}</li>)}
            </ul>
          </section>

          <section className="security-disclosure" aria-labelledby="disclosure-title">
            <div>
              <p className="security-eyebrow">RESPONSIBLE DISCLOSURE</p>
              <h2 id="disclosure-title">Found something we missed?</h2>
              <p>Send a concise report with the affected URL, reproduction steps, impact, and any safe proof. Please avoid accessing other people’s data or disrupting the service.</p>
            </div>
            <div className="security-disclosure__links">
              <a className="button" href="mailto:lorapokdev@gmail.com?subject=Lorapok%20Security%20Report"><Mail /> Report securely <ArrowUpRight /></a>
              <a href="/.well-known/security.txt">Read security.txt <ExternalLink /></a>
            </div>
          </section>

          <aside className="security-limits">
            <strong>Attestation boundary.</strong> This is a Lorapok Labs internal engineering attestation, not an independent third-party accreditation, legal guarantee, ISO certification, or PCI report. The assessment applies to the named revision and scope; material releases require re-testing.
          </aside>
        </div>
      </article>
    </>
  );
}
