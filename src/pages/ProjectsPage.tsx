import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, categories, brand } from '../data/lorapok';
import { Card } from '../components/ui/Card';
import { SearchBar } from '../components/ui/SearchBar';
import { CategoryFilter } from '../components/ui/CategoryFilter';
import { SearchX } from 'lucide-react';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    document.title = `Products | ${brand.name}`;
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-12 px-4 max-w-7xl mx-auto w-full min-h-screen"
    >
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
