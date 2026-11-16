import { useState, useEffect, useMemo } from 'react';
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

export default function ProjectsPage() {
  const [searchParams] = useSearchParams();
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
      .map((project) => ({
        name: project.displayName || project.name,
        tagline: project.summary || project.description || 'Public Lorapok repository',
        description: project.description || project.summary || 'Open-source project maintained in the Lorapok ecosystem.',
        category: project.category,
        language: project.language || 'Other',
        featured: project.featured,
        isNew: !project.archived,
        badge: project.badge || (project.fork ? 'Community fork' : 'GitHub'),
        links: [
          ...(project.homepage ? [{ label: 'Live', url: project.homepage, icon: 'web' as const }] : []),
          { label: 'GitHub', url: project.url, icon: 'github' as const },
        ],
      }));

    return [...curated, ...discovered];
  }, [officeProjects]);

  useEffect(() => {
    const catSlug = searchParams.get('category');
    if (!catSlug) return;
    if (catSlug === categoryToSlug(CREATOR_WORKS_CATEGORY)) {
      setActiveCategory(CREATOR_WORKS_CATEGORY);
      return;
    }
    const match = categories.find(
      (c) => c !== 'All' && categoryToSlug(c) === catSlug
    );
    if (match) setActiveCategory(match);
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
        description="Browse Lorapok Labs open-source repositories, browser extensions, AI tools, media apps, and Creator Works in 3D art and design — with GitHub links and live demos."
        path="/projects/"
        keywords="Lorapok projects, open source products, developer tools, 3D art and design, browser extensions, AI, GitHub"
      />
      <PageIntro
        eyebrow="THE PRODUCT UNIVERSE"
        title={<>Tools made to <em>feel alive.</em></>}
        description={<>Browse {publicProjects.length} curated products and live public repositories across the Lorapok ecosystem.</>}
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
                <Card project={project} />
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
    </motion.div>
  );
}
