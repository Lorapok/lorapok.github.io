import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'cyan' | 'purple' | 'amber';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md' 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full';
  
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };
  
  const variantClasses = {
    default: 'bg-white/10 text-gray-300 border border-white/10',
    accent: 'bg-[#67ff8f]/10 text-[#67ff8f] border border-[#67ff8f]/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  };

  const className = `lp-badge lp-badge-${variant} ${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;

  return (
    <span className={className}>
      {children}
    </span>
  );
};
