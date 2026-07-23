import React from 'react';
import { cn } from '../../utils/cn';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-earth-200/50", className)}
      {...props}
    />
  );
}
