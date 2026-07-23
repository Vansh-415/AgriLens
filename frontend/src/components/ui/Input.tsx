import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1.5 w-full">
        {label && <label className="text-sm font-medium text-earth-800">{label}</label>}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-earth-300 bg-white px-3 py-2 text-sm placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
        {helperText && !error && <span className="text-xs text-earth-500">{helperText}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
