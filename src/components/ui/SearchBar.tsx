import React, { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search projects...'
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-md group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400 group-focus-within:text-[#67ff8f] transition-colors" />
      </div>
      
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-12 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#67ff8f] focus:border-[#67ff8f] transition-all duration-200 backdrop-blur-sm"
      />
      
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        {value ? (
          <button
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={14} />
          </button>
        ) : (
          <div className="flex items-center justify-center px-1.5 py-0.5 rounded border border-gray-600 bg-gray-800/50 text-[10px] font-medium text-gray-400">
            {isMac ? '⌘K' : 'Ctrl+K'}
          </div>
        )}
      </div>
    </div>
  );
};
