import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false }) => {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm border border-gray-200",
      hover && "hover:shadow-lg hover:border-primary-200 transition-all duration-300",
      className
    )}>
      {children}
    </div>
  );
};