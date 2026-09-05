export interface CategoryFilterProps {
  categories: string[];
  active?: string;
  activeCategory?: string;
  onChange: (cat: string) => void;
}

export const CategoryFilter = ({
  categories,
  active,
  activeCategory,
  onChange,
}: CategoryFilterProps) => {
  const currentActive = active || activeCategory || 'All';
  const allCategories = ['All', ...categories.filter(c => c !== 'All')];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-2 pb-2 px-1 min-w-max">
        {allCategories.map((category) => {
          const isActive = currentActive.toLowerCase() === category.toLowerCase();
          return (
            <button
              key={category}
              onClick={() => onChange(category)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-[#67ff8f] text-[#0a0a0f] shadow-[0_0_15px_rgba(103,255,143,0.3)]' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};
