import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, categories, CREATOR_WORKS_CATEGORY, categoryToSlug, type Project } from '../data/lorapok';
import { subscribePublishedOfficeProjects } from '../lib/projectOfficeService';
import type { OfficeProject } from '../types/officeProjects';
import { SEOHead } from '../components/SEOHead';
import { Card } from '../components/ui/Card';
import { SearchBar } from '../components/ui/SearchBar';
import { CategoryFilter } from '../components/ui/CategoryFilter';
import { SearchX } from 'lucide-react';
import PageIntro from '../components/layout/PageIntro';
import PageMascotFeature from '../components/layout/PageMascotFeature';
import { ProjectModal } from '../components/projects/ProjectModal';
import { projectSlug } from '../lib/projectSlug';

const discoveredProjectPresentation: Record<string, Pick<Project, 'tagline' | 'description' | 'image' | 'imageType' | 'badge'>> = {
  'https://github.com/lorapok/lorapok.github.io': {
    tagline: 'The living home of the Lorapok ecosystem',
    description: 'The public Lorapok Labs experience: a curated bridge between open engineering, sensory computing, biological interfaces, releases, people, and the repositories that support them.',
    image: '/assets/projects/generated/lorapok-labs-website-product-v2.webp',
    imageType: 'cover',
    badge: 'Live website',
  },
  'https://github.com/lorapok/lorapok-instar': {
    tagline: 'Isolated multi-account workspace for Linux',
    description: 'A systems-grade workspace for Ubuntu and Linux that keeps multiple accounts separated in low-memory sandboxes, giving each working identity a focused and controlled desktop environment.',
    image: '/assets/projects/generated/lorapok-instar-product-v2.webp',
    imageType: 'cover',
    badge: 'Public repository',
  },
  'https://github.com/lorapok/nocatch': {
    tagline: 'One-click NotebookLM media harvester',
    description: 'A focused collection tool for exporting NotebookLM podcasts, videos, and study guides in practical formats so research artifacts can be archived and reused outside the notebook.',
    image: '/assets/projects/generated/nocatch-product-v2.webp',
    imageType: 'cover',
    badge: 'Public repository',
  },
  'https://github.com/maijied/bnp': {
    tagline: 'Focused bike number-plate utility',
    description: 'A compact public utility repository for bike number-plate workflows. The repository currently presents the project as “Bike Number Plate”; source history remains the authoritative implementation record.',
    image: '/assets/projects/generated/bnp-product-v2.webp',
    imageType: 'cover',
    badge: 'Public repository',
  },
  'https://github.com/lorapok/loragi': {
    tagline: 'Bio-digital precision video slicer',
    description: 'A precision media tool for cutting video into multiple intentional segments, designed around a fast bio-digital workflow for selecting, reviewing, and exporting useful clips.',
    image: '/assets/projects/generated/loragi-product-v2.webp',
    imageType: 'cover',
    badge: 'Public repository',
  },
  'https://github.com/maijied/cursor-curse-monitor-by-lorapok': {
    tagline: 'Live Cursor usage and billing monitor',
    description: 'A developer utility for tracking Cursor usage limits, budgets, billing cycles, and fallback options from a single operational dashboard.',
    image: '/assets/projects/generated/cursor-curse-monitor-product-v2.webp',
    imageType: 'cover',
    badge: 'Released',
  },
};

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [officeProjects, setOfficeProjects] = useState<OfficeProject[]>([]);

  useEffect(() => subscribePublishedOfficeProjects(setOfficeProjects), []);

  const publicProjects = useMemo(() => {
    const normalize = (value: string) => value.replace(/\/$/, '').toLowerCase();
    const byRepository = new Map(
      officeProjects
        .filter((project) => project.visibility === 'published')
        .map((project) => [normalize(project.url), project]),
    );
    const matched = new Set<string>();

    const curated = projects.map((project) => {
      const githubLink = project.links.find((link) => link.icon === 'github' && /github\.com/i.test(link.url));
      const office = githubLink ? byRepository.get(normalize(githubLink.url)) : undefined;
      if (!office) return project;
      matched.add(normalize(office.url));
      return {
        ...project,
        name: office.displayName || project.name,
        tagline: office.summary || project.tagline,
        description: office.summary || office.description || project.description,
        category: office.category,
        language: office.language || project.language,
        featured: office.featured || project.featured,
        badge: office.badge || project.badge,
      } satisfies Project;
    });

    const discovered: Project[] = officeProjects
      .filter((project) => project.visibility === 'published' && !matched.has(normalize(project.url)))
      .map((project) => {
        const presentation = discoveredProjectPresentation[normalize(project.url)];
        return {
          name: project.displayName || project.name,
          tagline: presentation?.tagline || project.summary || project.description || 'Public Lorapok repository',
          description: presentation?.description || project.description || project.summary || 'Open-source project maintained in the Lorapok ecosystem.',
          category: project.category,
          language: project.language || 'Other',
          featured: project.featured,
          isNew: !project.archived,
          badge: project.badge || presentation?.badge || (project.fork ? 'Community fork' : 'GitHub'),
          image: project.image || presentation?.image,
          imageType: project.imageType || presentation?.imageType,
          links: [
            ...(project.homepage ? [{ label: 'Live', url: project.homepage, icon: 'web' as const }] : []),
            { label: 'GitHub', url: project.url, icon: 'github' as const },
          ],
        } satisfies Project;
      });

    return [...curated, ...discovered];
  }, [officeProjects]);

  useEffect(() => {
    const catSlug = searchParams.get('category');
    if (!catSlug) return;
    if (catSlug === categoryToSlug(CREATOR_WORKS_CATEGORY)) {
      // The active filter intentionally mirrors the route query.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveCategory(CREATOR_WORKS_CATEGORY);
      return;
    }
    const match = categories.find(
      (c) => c !== 'All' && categoryToSlug(c) === catSlug
    );
    if (match) {
      setActiveCategory(match);
    }
  }, [searchParams]);

  const filteredProjects = useMemo(() => {
    return publicProjects
      .filter(project => {
        const matchesSearch =
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = activeCategory.toLowerCase() === 'all' || project.category.toLowerCase() === activeCategory.toLowerCase();

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
  }, [searchQuery, activeCategory, publicProjects]);

  const selectedProject = useMemo(() => {
    const slug = searchParams.get('project');
    if (!slug) return null;
    return publicProjects.find((project) => projectSlug(project) === slug) || null;
  }, [publicProjects, searchParams]);

  const openProject = useCallback((project: Project) => {
    const next = new URLSearchParams(searchParams);
    next.set('project', projectSlug(project));
    setSearchParams(next, { replace: false });
  }, [searchParams, setSearchParams]);

  const closeProject = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete('project');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: publicProjects.length,
      all: publicProjects.length,
    };
    for (const p of publicProjects) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [publicProjects]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="v4-inner-page py-12 px-4 max-w-7xl mx-auto w-full min-h-screen"
    >
      <SEOHead
        title="Projects & Products"
        description="Browse Lorapok Labs open-source repositories, Engineering Craft, browser extensions, AI tools, media apps, and Creator Works in 3D art and design — with GitHub links and live demos."
        path="/projects/"
        keywords="Lorapok projects, open source products, Engineering Craft, ReportKit, developer tools, 3D art and design, browser extensions, AI, GitHub"
      />
      <PageIntro
        eyebrow="THE PRODUCT UNIVERSE"
        title={<>Tools made to <em>feel alive.</em></>}
        description={<>Browse {publicProjects.length} curated products and live public repositories across the Lorapok ecosystem.</>}
      />

      <PageMascotFeature
        image="/assets/ribo/inner-pages/ecosystem-cartographer.webp"
        alt="Ecosystem Cartographer, Lorapok's 3D project navigator"
        eyebrow="ECOSYSTEM SIGNAL / CURATED CONNECTIONS"
        title="Meet the Ecosystem Cartographer"
        body="A guide for moving between open-source tools, creative experiments, business products and the public repositories that support them."
        referenceImage="/assets/brand-library/ecosystem/co-branded-strip.webp"
        referenceAlt="Approved Lorapok Labs and LoraHost ecosystem strip"
        referenceLabel="CURATED PRODUCT ROUTE"
      />

      <div className="v4-filter-dock mb-12">
        <div className="flex flex-col gap-6">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search products by name, tagline, or description..."
          />
          <CategoryFilter 
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
            counts={categoryCounts}
          />
        </div>
      </div>

      <div className="mb-6 text-gray-400 text-sm font-medium">
        Showing {filteredProjects.length} of {publicProjects.length} products
      </div>

      {filteredProjects.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map(project => (
              <motion.div
                key={`${project.name}-${project.links[0]?.url || project.category}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card project={project} onClick={() => openProject(project)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-white/5 p-4 rounded-full mb-4 border border-white/10">
            <SearchX size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
          <p className="text-gray-400">Try adjusting your search query or category filter.</p>
        </div>
      )}
      <ProjectModal project={selectedProject} onClose={closeProject} />
    </motion.div>
  );
}
