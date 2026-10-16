import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, categories, CREATOR_WORKS_CATEGORY, categoryToSlug } from '../data/lorapok';
import { SEOHead } from '../components/SEOHead';
import { Card } from '../components/ui/Card';
import { SearchBar } from '../components/ui/SearchBar';
import { CategoryFilter } from '../components/ui/CategoryFilter';
import { SearchX } from 'lucide-react';

export default function ProjectsPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

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
    return projects
      .filter(project => {
        const matchesSearch =
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = activeCategory.toLowerCase() === 'all' || project.category.toLowerCase() === activeCategory.toLowerCase();

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
  }, [searchQuery, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: projects.length,
      all: projects.length,
    };
    for (const p of projects) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-12 px-4 max-w-7xl mx-auto w-full min-h-screen"
    >
      <SEOHead
        title="Projects & Products"
        description="Browse Lorapok Labs open-source repositories, browser extensions, AI tools, media apps, and Creator Works in 3D art and design — with GitHub links and live demos."
        path="/projects"
        keywords="Lorapok projects, open source products, developer tools, 3D art and design, browser extensions, AI, GitHub"
      />
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">All Products</h1>
        
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
        Showing {filteredProjects.length} of {projects.length} products
      </div>

      {filteredProjects.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map(project => (
              <motion.div
                key={project.name}
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
