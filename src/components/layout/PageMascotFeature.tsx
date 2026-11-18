import LarvaePlanetSystem from './LarvaePlanetSystem';

type PageMascotFeatureProps = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  body: string;
  tone?: 'mint' | 'cyan' | 'lavender' | 'gold';
  referenceImage?: string;
  referenceAlt?: string;
  referenceLabel?: string;
  planet?: boolean;
};

export default function PageMascotFeature({
  image,
  alt,
  eyebrow,
  title,
  body,
  tone = 'mint',
  referenceImage,
  referenceAlt = '',
  referenceLabel = 'ECOSYSTEM ROUTE',
  planet = false,
}: PageMascotFeatureProps) {
  return (
    <aside className={`page-mascot-feature tone-${tone}`} aria-label={title}>
      <div className="page-mascot-feature__visual">
        {planet ? (
          <LarvaePlanetSystem variant="feature" />
        ) : (
          <>
            <span className="page-mascot-feature__moon" aria-hidden="true" />
            <img src={image} alt={alt} loading="lazy" decoding="async" />
          </>
        )}
      </div>
      <div className="page-mascot-feature__copy">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{body}</p>
        {referenceImage && <div className="page-mascot-feature__reference-card">
          <div className="page-mascot-feature__reference-head"><span>{referenceLabel}</span><i><b /> verified connection</i></div>
          <div className="page-mascot-feature__reference-visual">
            <img className="page-mascot-feature__reference" src={referenceImage} alt={referenceAlt} loading="lazy" decoding="async" />
            <span className="page-mascot-feature__reference-scan" aria-hidden="true" />
          </div>
          <div className="page-mascot-feature__reference-meta"><span>Discover</span><b aria-hidden="true" /><span>Evaluate</span><b aria-hidden="true" /><span>Open the source</span></div>
        </div>}
      </div>
    </aside>
  );
}
