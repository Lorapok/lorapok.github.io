import type { ReactNode } from 'react';
import LarvaePlanetSystem from './LarvaePlanetSystem';

interface PageIntroProps {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'mint' | 'lavender' | 'gold' | 'rose';
  children?: ReactNode;
}

export default function PageIntro({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'mint',
  children,
}: PageIntroProps) {
  return (
    <header className={`page-intro page-intro--${align} page-intro--${tone}`}>
      <LarvaePlanetSystem variant="intro" />
      <div className="page-intro__content">
        <div className="page-intro__eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p className="page-intro__description">{description}</p>}
        {children && <div className="page-intro__actions">{children}</div>}
      </div>
    </header>
  );
}
