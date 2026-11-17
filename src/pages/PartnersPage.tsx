import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BadgeCheck, Copy, Gift, Handshake, ShieldCheck } from "lucide-react";
import { SEOHead } from "../components/SEOHead";
import PageIntro from "../components/layout/PageIntro";
import PageMascotFeature from "../components/layout/PageMascotFeature";
import { partnerRelationshipLabels } from "../data/partners";
import { subscribePublishedPartners } from "../lib/partnerService";
import type { PublicPartnerRecord } from "../types/partners";

export default function PartnersPage() {
  const [partners, setPartners] = useState<PublicPartnerRecord[]>([]);
  const [copied, setCopied] = useState("");

  useEffect(() => subscribePublishedPartners(setPartners), []);

  const featured = useMemo(() => partners.filter((partner) => partner.featured), [partners]);

  const copyCode = async (partner: PublicPartnerRecord) => {
    if (!partner.discountCode) return;
    await navigator.clipboard.writeText(partner.discountCode);
    setCopied(partner.id);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const partnerJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://lorapok.tech/partners/#page",
        name: "Lorapok Labs Partner & Benefit Directory",
        url: "https://lorapok.tech/partners/",
        description: "Verified partner, affiliate, invitation, and community benefit references from Lorapok Labs.",
        isPartOf: { "@id": "https://lorapok.tech/#website" },
      },
      {
        "@type": "ItemList",
        "@id": "https://lorapok.tech/partners/#directory",
        name: "Published Lorapok partner and referral directory",
        numberOfItems: partners.length,
        itemListElement: partners.map((partner, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: partner.name,
          url: partner.offerUrl || partner.websiteUrl,
        })),
      },
    ],
  }), [partners]);

  return (
    <div className="v4-inner-page partners-page">
      <SEOHead
        title="Partners & Verified Benefits"
        description="Explore transparent Lorapok Labs partner, affiliate, and invitation references—including Higgsfield AI and Airtm—with verified links and clear relationship disclosures."
        path="/partners/"
        image="/assets/ribo/generated/20261117/founder-navigator.webp"
        keywords="Lorapok partners, Dynadot referral credit, Higgsfield referral code, Airtm invitation link, Lorapok affiliates, verified partner benefits"
        jsonLd={partnerJsonLd}
      />

      <div className="partners-page__intro wrap4">
        <PageIntro
          tone="gold"
          eyebrow="LORAPOK LABS / PARTNER CONSTELLATION"
          title={<>Useful relationships.<br /><em>Clear benefits.</em></>}
          description="Every listing names the relationship, the verified visitor benefit, and when we last checked it. No invented coupons. No hidden status."
        />
      </div>

      <div className="wrap4">
        <PageMascotFeature
          image="/assets/ribo/generated/20261117/founder-navigator.webp"
          alt="Founder Navigator, Lorapok's partner constellation guide"
          eyebrow="TRUST SIGNAL / VERIFIED CONNECTIONS"
          title="Meet the Founder Navigator"
          body="A guide for evaluating useful collaborations across the Lorapok ecosystem—keeping public benefits, relationship types and provider-controlled terms easy to understand."
          referenceImage="/assets/brand-library/ecosystem/co-branded-strip.webp"
          referenceAlt="Lorapok Labs ecosystem identity strip"
        />
      </div>

      {featured.length > 0 && (
        <section className="section partners-featured" aria-labelledby="featured-benefits-title"><div className="wrap4">
          <div className="partners-heading">
            <div><div className="eyebrow">FEATURED VERIFIED BENEFIT</div><h2 id="featured-benefits-title">A real benefit.<br /><em>Checked before launch.</em></h2></div>
            <p>Provider terms remain authoritative. We show the last verification date so you can judge how current each offer is.</p>
          </div>
          {featured.map((partner) => (
            <article className="partner-spotlight reveal" key={partner.id} style={{ "--partner-accent": partner.accent } as React.CSSProperties}>
              <div className="partner-monogram" aria-hidden="true">{partner.name.slice(0, 2).toUpperCase()}</div>
              <div className="partner-spotlight__copy">
                <span className="partner-kind"><BadgeCheck size={15} /> {partnerRelationshipLabels[partner.relationship]}</span>
                <h3>{partner.name}</h3>
                <p>{partner.description}</p>
              </div>
              <div className="partner-benefit">
                <span><Gift size={16} /> Verified visitor benefit</span>
                <strong>{partner.offerLabel}</strong>
                <p>{partner.offerDetail}</p>
                {partner.discountCode && (
                  <button type="button" onClick={() => copyCode(partner)} className="partner-code">
                    <code>{partner.discountCode}</code><Copy size={14} /> {copied === partner.id ? "Copied" : "Copy code"}
                  </button>
                )}
                <a className="button" href={partner.offerUrl} target="_blank" rel="sponsored noopener noreferrer">Open verified offer <ArrowUpRight size={17} /></a>
              </div>
            </article>
          ))}
        </div></section>
      )}

      <section className="section partners-directory" aria-labelledby="partner-directory-title"><div className="wrap4">
        <div className="partners-heading">
          <div><div className="eyebrow">THE CURRENT DIRECTORY</div><h2 id="partner-directory-title">Different relationships.<br /><em>One honest standard.</em></h2></div>
          <p>Approved affiliates and independent references are labeled separately. A tracked link may support Lorapok Labs, but it never changes the price unless an exact benefit is stated.</p>
        </div>
        <div className="partner-grid">
          {partners.map((partner) => (
            <article className="partner-card reveal" key={partner.id} style={{ "--partner-accent": partner.accent } as React.CSSProperties}>
              <div className="partner-card__top"><span className="partner-monogram small" aria-hidden="true">{partner.name.slice(0, 2).toUpperCase()}</span><span>{partnerRelationshipLabels[partner.relationship]}</span></div>
              <h3>{partner.name}</h3><p className="partner-tagline">{partner.tagline}</p><p>{partner.description}</p>
              <div className="partner-card__offer"><strong>{partner.offerLabel}</strong><span>{partner.discountCode ? `Code: ${partner.discountCode}` : "No discount code claimed"}</span></div>
              <div className="partner-card__meta"><span>Checked {new Date(`${partner.verifiedAt}T00:00:00`).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>{partner.termsUrl && <a href={partner.termsUrl} target="_blank" rel="noopener noreferrer">Provider terms ↗</a>}</div>
              <a className="button outline" href={partner.offerUrl || partner.websiteUrl} target="_blank" rel="sponsored noopener noreferrer">Visit {partner.name} <ArrowUpRight size={16} /></a>
            </article>
          ))}
        </div>
      </div></section>

      <section className="section partners-disclosure"><div className="wrap4"><div className="partners-disclosure__panel">
        <ShieldCheck size={28} />
        <div><span className="eyebrow">TRANSPARENT BY DESIGN</span><h2>How partner listings work</h2><p>Some links are affiliate links, which means Lorapok Labs may receive a commission or credit after a qualifying action. Providers set all prices, eligibility rules, fulfillment, privacy practices, and expiration dates. We publish a discount only when its exact benefit is verified.</p></div>
        <Handshake size={74} aria-hidden="true" />
      </div></div></section>
    </div>
  );
}
