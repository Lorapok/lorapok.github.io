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
        {referenceImage && (
          <img className="page-mascot-feature__reference" src={referenceImage} alt={referenceAlt} loading="lazy" decoding="async" />
        )}
      </div>
    </aside>
  );
}
