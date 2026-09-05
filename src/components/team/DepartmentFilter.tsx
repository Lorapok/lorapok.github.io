import type { TeamDepartment } from "../../data/team";

interface DepartmentFilterProps {
  departments: TeamDepartment[];
  activeDepartment: TeamDepartment;
  onChange: (dept: TeamDepartment) => void;
  counts?: Record<string, number>;
}

export function DepartmentFilter({
  departments,
  activeDepartment,
  onChange,
  counts,
}: DepartmentFilterProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-2 pb-2 px-1 min-w-max">
        {departments.map((dept) => {
          const isActive = activeDepartment === dept;
          const count = counts ? counts[dept] : undefined;
          return (
            <button
              key={dept}
              onClick={() => onChange(dept)}
              className={`
                px-4 py-2 rounded-full text-xs font-mono font-medium transition-all duration-200 flex items-center gap-2
                ${
                  isActive
                    ? "bg-[#67ff8f] text-[#0a0a0f] shadow-[0_0_15px_rgba(103,255,143,0.3)] font-bold"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5"
                }
              `}
            >
              <span>{dept}</span>
              {count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? "bg-black/20 text-[#0a0a0f]" : "bg-white/10 text-gray-400"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
