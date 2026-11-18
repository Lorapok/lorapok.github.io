import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Share2,
  X,
} from 'lucide-react';
import type { Project } from '../../data/lorapok';
import { projectSlug } from '../../lib/projectSlug';
import { ProjectGlyph } from './ProjectGlyph';

function wrapText(context: CanvasRenderingContext2D, value: string, maxWidth: number, maxLines: number) {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    line = word;
    if (lines.length === maxLines - 1) break;
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (words.join(' ').length > lines.join(' ').length && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[.,;:]?$/, '')}…`;
  }
  return lines;
}

async function loadImage(source?: string) {
  if (!source) return null;
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = source;
  });
}

async function createShareCard(project: Project) {
  await document.fonts?.ready;
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const context = canvas.getContext('2d');
  if (!context) return null;

  const gradient = context.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#061812');
  gradient.addColorStop(0.58, '#0b3026');
  gradient.addColorStop(1, '#15192c');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1200, 630);

  const image = await loadImage(project.image);
  if (image) {
    const scale = Math.max(1200 / image.width, 630 / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    context.globalAlpha = 0.68;
    context.drawImage(image, (1200 - width) / 2, (630 - height) / 2, width, height);
    context.globalAlpha = 1;
  }

  const veil = context.createLinearGradient(0, 0, 1040, 0);
  veil.addColorStop(0, 'rgba(2, 16, 12, .98)');
  veil.addColorStop(0.62, 'rgba(2, 16, 12, .79)');
  veil.addColorStop(1, 'rgba(2, 16, 12, .22)');
  context.fillStyle = veil;
  context.fillRect(0, 0, 1200, 630);

  context.strokeStyle = 'rgba(103, 245, 187, .38)';
  context.lineWidth = 2;
  context.strokeRect(34, 34, 1132, 562);

  context.fillStyle = '#67f5bb';
  context.font = '700 22px Arial, sans-serif';
  context.fillText('LORAPOK LABS  /  PROJECT SIGNAL', 82, 95);

  context.fillStyle = '#eafa87';
  context.font = '700 20px Arial, sans-serif';
  context.fillText(project.category.toUpperCase(), 82, 160);

  context.fillStyle = '#f4fff9';
  context.font = '700 72px Arial, sans-serif';
  const titleLines = wrapText(context, project.name, 720, 2);
  titleLines.forEach((line, index) => context.fillText(line, 82, 250 + index * 78));

  const taglineY = 250 + titleLines.length * 78 + 14;
  context.fillStyle = '#b9d8ca';
  context.font = '400 30px Arial, sans-serif';
  const taglineLines = wrapText(context, project.tagline || project.description, 690, 2);
  taglineLines.forEach((line, index) => context.fillText(line, 82, taglineY + index * 40));

  context.fillStyle = '#8cf3c3';
  context.font = '700 21px Arial, sans-serif';
  context.fillText(`${project.language}  ·  lorapok.tech/projects`, 82, 552);

  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
}

async function downloadShareCard(project: Project) {
  const blob = await createShareCard(project);
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${projectSlug(project)}-lorapok-social-card.png`;
  anchor.click();
  URL.revokeObjectURL(url);
}

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
};

const architectureProfiles: Record<Project['category'], { entry: string; core: string; delivery: string }> = {
  AI: { entry: 'Intent & interaction', core: 'Agent intelligence layer', delivery: 'Assisted output' },
  'Developer Tools': { entry: 'Operator surface', core: 'Developer workflow engine', delivery: 'Integration & distribution' },
  'Engineering Craft': { entry: 'Problem framing', core: 'System composition', delivery: 'Evidence & artifact' },
  Media: { entry: 'Media intake', core: 'Transform pipeline', delivery: 'Playback & export' },
  'Language/Input': { entry: 'Human input', core: 'Language processing', delivery: 'Contextual output' },
  'Laravel/PHP': { entry: 'Application surface', core: 'Domain & service layer', delivery: 'Web delivery' },
  'Desktop/Linux': { entry: 'Desktop interaction', core: 'Local systems layer', delivery: 'Device workflow' },
  'Browser Extensions': { entry: 'Browser surface', core: 'Extension runtime', delivery: 'Page & platform action' },
  'Games/Utilities': { entry: 'Player or operator input', core: 'Rules & utility engine', delivery: 'Interactive result' },
  'Mobile Apps': { entry: 'Touch experience', core: 'Mobile application layer', delivery: 'Device capability' },
  'Sensory & Hardware': { entry: 'Physical signal', core: 'Sensing & interpretation', delivery: 'Observable response' },
  '3D Art & Design': { entry: 'Creative direction', core: 'Material & visual practice', delivery: 'Exhibited work' },
};

function conciseArchitectureDetail(value: string, limit = 170) {
  const firstSentence = value.trim().split(/(?<=[.!?])\s+/)[0] || value;
  return firstSentence.length > limit ? `${firstSentence.slice(0, limit - 1).trimEnd()}…` : firstSentence;
}

function getProjectArchitecture(project: Project) {
  const profile = architectureProfiles[project.category];
  const evidence = project.links.map((link) => link.label).join(' · ') || 'Public project record';
  return [
    {
      step: '01 / ENTRY',
      title: profile.entry,
      detail: project.tagline,
    },
    {
      step: '02 / SYSTEM CORE',
      title: profile.core,
      detail: conciseArchitectureDetail(project.description),
    },
    {
      step: '03 / IMPLEMENTATION',
      title: project.language,
      detail: `Primary public implementation stack, cataloged within ${project.category}.`,
    },
    {
      step: '04 / DELIVERY',
      title: profile.delivery,
      detail: `${project.badge || 'Public project'} · ${evidence}`,
    },
  ];
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [copiedSlug, setCopiedSlug] = useState('');
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!project) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [project, onClose]);

  if (typeof document === 'undefined') return null;

  const modal = (
    <AnimatePresence>
      {project && (() => {
        const shareUrl = `${window.location.origin}/projects/?project=${encodeURIComponent(projectSlug(project))}`;
        const shareText = `${project.name} — ${project.tagline}`;
        const currentSlug = projectSlug(project);
        const copied = copiedSlug === currentSlug;
        const primaryLink = project.links[0];
        const architecture = getProjectArchitecture(project);
        const shareWindow = (url: string) => window.open(url, '_blank', 'noopener,noreferrer,width=760,height=640');
        const copyLink = async () => {
          await navigator.clipboard.writeText(shareUrl);
          setCopiedSlug(currentSlug);
          window.setTimeout(() => setCopiedSlug((value) => value === currentSlug ? '' : value), 2200);
        };
        const nativeShare = async () => {
          try {
            if (navigator.share) {
              const card = await createShareCard(project);
              const files = card ? [new File([card], `${currentSlug}-lorapok-social-card.png`, { type: 'image/png' })] : [];
              if (files.length && navigator.canShare?.({ files })) {
                await navigator.share({ title: project.name, text: `${shareText}\n${shareUrl}`, files });
              } else {
                await navigator.share({ title: project.name, text: shareText, url: shareUrl });
              }
              return;
            }
            await copyLink();
          } catch (error) {
            if (!(error instanceof DOMException && error.name === 'AbortError')) await copyLink();
          }
        };

        return (
          <motion.div
            className="project-modal-backdrop"
            role="presentation"
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) onClose();
            }}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.section
              className="project-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.975 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 22, scale: 0.985 }}
              transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <button ref={closeButtonRef} type="button" className="project-modal__close" onClick={onClose} aria-label="Close project details">
                <X size={20} />
              </button>

              <div className="project-modal__visual">
                {project.image ? (
                  <img src={project.image} alt={`${project.name} product visual`} />
                ) : (
                  <div className="project-modal__fallback" aria-hidden="true">
                    <span /><span />
                    <ProjectGlyph project={project} size={92} strokeWidth={1.25} />
                  </div>
                )}
                <div className="project-modal__visual-shade" />
                <div className="project-modal__signal">
                  <span>{project.category}</span>
                  {project.badge && <b>{project.badge}</b>}
                </div>
              </div>

              <div className="project-modal__body">
                <div className="project-modal__headline">
                  <div>
                    <span className="project-modal__eyebrow">PROJECT PROFILE / VERIFIED PUBLIC ENTRY</span>
                    <h2 id="project-modal-title">{project.name}</h2>
                    <p>{project.tagline}</p>
                  </div>
                  {project.featured && <span className="project-modal__featured">Featured work</span>}
                </div>

                <section className="project-architecture" aria-labelledby="project-architecture-title">
                  <div className="project-architecture__heading">
                    <div>
                      <span>PUBLIC SYSTEM MAP / FOUR-LAYER READING</span>
                      <h3 id="project-architecture-title">Project architecture</h3>
                    </div>
                    <p>A structured view of how this project moves from intent to implementation and public delivery, based only on its verified catalog metadata.</p>
                  </div>
                  <div className="project-architecture__flow">
                    {architecture.map((node) => (
                      <article key={node.step}>
                        <span>{node.step}</span>
                        <h4>{node.title}</h4>
                        <p>{node.detail}</p>
                      </article>
                    ))}
                  </div>
                  <div className="project-architecture__legend">
                    <span><i /> Public metadata</span>
                    <span><i /> Implementation signal</span>
                    <span><i /> Delivery evidence</span>
                    <b>Private internals are intentionally not inferred.</b>
                  </div>
                </section>

                <div className="project-modal__content-grid">
                  <div className="project-modal__overview">
                    <span>Project brief</span>
                    <p>{project.description}</p>
                    <div className="project-modal__facts">
                      <div><small>Discipline</small><strong>{project.category}</strong></div>
                      <div><small>Built with</small><strong>{project.language}</strong></div>
                      <div><small>Availability</small><strong>{project.badge || 'Public project'}</strong></div>
                    </div>
                    <div className="project-modal__links">
                      {project.links.map((link) => (
                        <a href={link.url} target="_blank" rel="noreferrer" key={`${link.label}-${link.url}`}>
                          {link.label}<ExternalLink size={14} />
                        </a>
                      ))}
                    </div>
                  </div>

                  <aside className="project-share-card" aria-label="Share this project">
                    <span className="project-share-card__kicker"><Share2 size={14} /> SHARE PROJECT</span>
                    <h3>{project.name}</h3>
                    <p>{project.tagline}</p>
                    <div className="project-share-card__preview">
                      {project.image && <img src={project.image} alt="" />}
                      <div><span>LORAPOK LABS</span><b>{project.category}</b></div>
                    </div>
                    <div className="project-share-card__actions">
                      <button type="button" onClick={nativeShare}><Share2 size={16} /><span>Share</span></button>
                      <button type="button" onClick={copyLink}>{copied ? <Check size={16} /> : <Copy size={16} />}<span>{copied ? 'Copied' : 'Copy link'}</span></button>
                      <button type="button" onClick={() => downloadShareCard(project)}><Download size={16} /><span>Card</span></button>
                    </div>
                    <div className="project-share-card__socials">
                      <button type="button" aria-label="Share on Facebook" onClick={() => shareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)}>f</button>
                      <button type="button" aria-label="Share on X" onClick={() => shareWindow(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`)}>X</button>
                      <button type="button" aria-label="Share on LinkedIn" onClick={() => shareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`)}>in</button>
                    </div>
                  </aside>
                </div>

                <div className="project-modal__footer">
                  <span>A Lorapok Labs project signal · share responsibly</span>
                  {primaryLink && <a href={primaryLink.url} target="_blank" rel="noreferrer">Open {primaryLink.label}<ExternalLink size={15} /></a>}
                </div>
              </div>
            </motion.section>
          </motion.div>
        );
      })()}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
