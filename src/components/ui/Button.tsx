import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2',
  };
  
  const variantClasses = {
    primary: 'bg-[#67ff8f] text-[#0a0a0f] hover:bg-[#67ff8f]/90 focus:ring-[#67ff8f]',
    secondary: 'bg-white/10 text-white hover:bg-white/20 focus:ring-white/50 border border-white/10',
    ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/5 focus:ring-white/20',
  };
  
  const classes = `lp-btn lp-btn-${variant} ${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <a 
        href={href} 
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        {...(props as any)}
      >
        {children}
      </a>
    );
  }

  return (
    <button 
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
