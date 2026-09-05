export interface CategoryFilterProps {
  categories: string[];
  active?: string;
  activeCategory?: string;
  onChange: (cat: string) => void;
  counts?: Record<string, number>;
}

export const CategoryFilter = ({
  categories,
  active,
  activeCategory,
  onChange,
  counts,
}: CategoryFilterProps) => {
  const currentActive = active || activeCategory || 'All';
  const allCategories = ['All', ...categories.filter(c => c !== 'All')];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-2 pb-2 px-1 min-w-max">
        {allCategories.map((category) => {
          const isActive = currentActive.toLowerCase() === category.toLowerCase();
          const count = counts ? (category.toLowerCase() === 'all' ? (counts['All'] ?? counts['all']) : counts[category]) : undefined;
          return (
            <button
              key={category}
              onClick={() => onChange(category)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                ${isActive 
                  ? 'bg-[#67ff8f] text-[#0a0a0f] shadow-[0_0_15px_rgba(103,255,143,0.3)] font-semibold' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                }
              `}
            >
              <span>{category}</span>
              {count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono font-bold ${
                  isActive ? 'bg-black/20 text-[#0a0a0f]' : 'bg-white/10 text-gray-400'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
