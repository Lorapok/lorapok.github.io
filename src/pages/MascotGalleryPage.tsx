import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { archiveArtwork, characterCollection, projectConstellation, sanctuarySpecies } from '../data/mascotGallery';

export default function MascotGalleryPage() {
  return (
    <div className="v4-home mascot-gallery-page">
      <SEOHead
        title="Larvae Planetarium & Mascot Archive"
        description="Explore Lorapok Labs' living mascot universe: restored cyber-biological species, operational Ribo roles, and original artwork from the drive archive."
        path="/mascots/"
        image="/assets/ribo/archive/metamorphosis-stages.webp"
        keywords="Lorapok mascot, Ribo, larvae characters, cyber biological design, mascot gallery, Instar"
      />

      <header className="mascot-gallery-hero">
        <div className="wrap4 mascot-gallery-hero__grid">
          <div className="mascot-gallery-hero__copy">
            <div className="eyebrow">LIVING CHARACTER ARCHIVE · DRIVE RESTORED</div>
            <h1>Meet the<br /><em>living universe.</em></h1>
            <p>From a friendly green larvae with glasses to bioluminescent researchers, guardians and explorers—this gallery preserves every major Lorapok character language while keeping the current production family coherent.</p>
            <div className="hero-actions">
              <a className="button" href="#species">Explore the species</a>
              <a className="button outline" href="#archive">Open the archive</a>
            </div>
          </div>
          <div className="mascot-gallery-hero__planet" aria-hidden="true">
            <span className="planet-arc arc-one" />
            <span className="planet-arc arc-two" />
            <img className="planet-core-mascot" src="/assets/ribo/generated/20261117/ai-orchestrator.webp" alt="" />
            {sanctuarySpecies.slice(0, 3).map((species, index) => (
              <img className={`planet-mascot planet-mascot-${index + 1}`} key={species.id} src={`/assets/ribo/species/${species.id}.webp`} alt="" />
            ))}
          </div>
        </div>
      </header>

      <section id="species" className="section v4-sanctuary" aria-labelledby="sanctuary-title"><div className="wrap4">
        <div className="v4-sanctuary-heading">
          <div><div className="eyebrow">LARVA SANCTUARY / ARCHIVE RESTORED</div><h2 id="sanctuary-title">One family.<br /><em>Five species.</em></h2></div>
          <p>Ribo remains the studio guide. The wider sanctuary restores Lorapok’s cyber-biological character system—each species carrying a different operational signal.</p>
        </div>
        <div className="v4-sanctuary-grid">
          {sanctuarySpecies.map((species, index) => (
            <article className={`v4-species-card species-${index + 1} reveal`} key={species.id}>
              <span className="v4-species-index">0{index + 1}</span>
              <img src={`/assets/ribo/species/${species.id}.webp`} alt={`${species.name}, a Lorapok 3D larva species`} loading="lazy" />
              <div><span>{species.role}</span><h3>{species.name}</h3><p>{species.signal}</p></div>
            </article>
          ))}
        </div>
        <p className="v4-sanctuary-note">Inspired by the six biological instar stages: Lorapok products evolve instead of standing still.</p>
      </div></section>

      <section className="section v4-character-collection" aria-labelledby="character-collection-title"><div className="wrap4">
        <div className="v4-character-heading">
          <div><div className="eyebrow">OPERATIONAL CHARACTER COLLECTION</div><h2 id="character-collection-title">One identity.<br /><em>Many useful roles.</em></h2></div>
          <p>The shared segmented anatomy, leaf antennae and sensory panels connect every product world while tools, palettes and role signals stay specific.</p>
        </div>
        <div className="v4-character-grid">
          {characterCollection.map((character) => (
            <article className="v4-character-card reveal" data-family={character.family} key={character.id}>
              <img src={`/assets/ribo/collections/${character.id}.webp`} alt={`${character.name}, Lorapok ${character.family} 3D mascot`} loading="lazy" />
              <div><span>{character.family}</span><h3>{character.name}</h3><p>{character.role}</p></div>
            </article>
          ))}
        </div>
      </div></section>

      <section className="section mascot-constellation" aria-labelledby="mascot-constellation-title"><div className="wrap4">
        <div className="mascot-archive__heading">
          <div><div className="eyebrow">PROJECT CONSTELLATION · NEW 3D CHARACTERS</div><h2 id="mascot-constellation-title">Six new guides.<br /><em>Six product worlds.</em></h2></div>
          <p>Generated from Lorapok's established anatomy, brand packs, and private project inventory—without exposing identity documents or confidential project data.</p>
        </div>
        <div className="mascot-constellation__grid">
          {projectConstellation.map((character) => (
            <article className="mascot-constellation-card reveal" key={character.id}>
              <div className="mascot-constellation-card__visual"><img src={`/assets/ribo/generated/20261117/${character.id}.webp`} alt={`${character.name}, a new Lorapok 3D project mascot`} loading="lazy" /></div>
              <div><span>{character.project}</span><h3>{character.name}</h3><p>{character.note}</p></div>
            </article>
          ))}
        </div>
      </div></section>

      <section id="archive" className="section mascot-archive" aria-labelledby="mascot-archive-title"><div className="wrap4">
        <div className="mascot-archive__heading">
          <div><div className="eyebrow">FROM THE LORAPOK DRIVE</div><h2 id="mascot-archive-title">Many eras.<br /><em>One living signal.</em></h2></div>
          <p>Selected originals from the permanent asset drive, optimized for the web without replacing or modifying their source masters.</p>
        </div>
        <div className="mascot-archive__grid">
          {archiveArtwork.map((artwork, index) => (
            <article className={`mascot-archive-card archive-${index + 1} reveal`} key={artwork.id}>
              <div className="mascot-archive-card__visual"><img src={artwork.path} alt={artwork.alt} loading="lazy" /></div>
              <div className="mascot-archive-card__copy"><span>{artwork.era}</span><h3>{artwork.title}</h3><p>{artwork.note}</p></div>
            </article>
          ))}
        </div>
      </div></section>

      <section className="section"><div className="wrap4"><div className="cta-band reveal">
        <h2>Characters grow<br />with the products.</h2>
        <p style={{ fontSize: 20, maxWidth: 650 }}>Explore the projects they guide, or meet the people who keep this living system useful.</p>
        <div className="hero-actions"><Link className="button" to="/projects/">Explore products</Link><Link className="button outline" to="/team/">Meet the collective</Link></div>
      </div></div></section>
    </div>
  );
}
