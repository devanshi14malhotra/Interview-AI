import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-surface border border-border rounded-xl shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
};
