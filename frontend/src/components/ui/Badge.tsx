import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'destructive' | 'outline' | 'warning' | 'info' | 'danger' | 'neutral';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'border-transparent bg-earth-100 text-earth-900 hover:bg-earth-200',
    success: 'border-transparent bg-green-100 text-green-800 hover:bg-green-200',
    destructive: 'border-transparent bg-red-100 text-red-800 hover:bg-red-200',
    danger: 'border-transparent bg-red-100 text-red-800 hover:bg-red-200',
    warning: 'border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200',
    info: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200',
    neutral: 'border-transparent bg-earth-100 text-earth-800 hover:bg-earth-200',
    outline: 'text-earth-900 border-earth-200',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
