import type { TeamDepartment } from "../../data/team";

interface DepartmentFilterProps {
  departments: TeamDepartment[];
  activeDepartment: TeamDepartment;
  onChange: (dept: TeamDepartment) => void;
}

export function DepartmentFilter({
  departments,
  activeDepartment,
  onChange,
}: DepartmentFilterProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-2 pb-2 px-1 min-w-max">
        {departments.map((dept) => {
          const isActive = activeDepartment === dept;
          return (
            <button
              key={dept}
              onClick={() => onChange(dept)}
              className={`
                px-4 py-2 rounded-full text-xs font-mono font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-[#67ff8f] text-[#0a0a0f] shadow-[0_0_15px_rgba(103,255,143,0.3)] font-bold"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5"
                }
              `}
            >
              {dept}
            </button>
          );
        })}
      </div>
    </div>
  );
}
