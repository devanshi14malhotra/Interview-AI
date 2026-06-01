import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-accent to-purple-600 text-white shadow-[0_0_15px_var(--color-accent-glow)] hover:shadow-[0_0_25px_var(--color-accent-glow)] hover:scale-105 border border-white/20 transition-all duration-300 font-bold',
    secondary: 'bg-surface text-text-primary hover:bg-surface/80 border border-white/10 hover:border-white/30 shadow-sm transition-all duration-300',
    outline: 'bg-transparent text-text-primary border border-white/10 hover:border-accent hover:text-accent hover:shadow-[0_0_15px_var(--color-accent-glow)] transition-all duration-300',
    danger: 'bg-danger/10 text-danger hover:bg-danger/20 focus:ring-danger transition-all'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
