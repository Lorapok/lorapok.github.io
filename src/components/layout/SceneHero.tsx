import type { ReactNode } from "react";
import LarvaePlanetSystem from "./LarvaePlanetSystem";

type SceneHeroProps = {
  image: string;
  alt: string;
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  tone?: "mint" | "lavender" | "gold";
  children?: ReactNode;
};

export default function SceneHero({
  image,
  alt,
  eyebrow,
  title,
  description,
  tone = "mint",
  children,
}: SceneHeroProps) {
  return (
    <section className={`scene-hero tone-${tone}`}>
      <img className="scene-hero__image" src={image} alt={alt} fetchPriority="high" />
      <div className="scene-hero__shade" aria-hidden="true" />
      <LarvaePlanetSystem variant="scene" />
      <div className="scene-hero__copy">
        <span className="scene-hero__eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </div>
    </section>
  );
}
