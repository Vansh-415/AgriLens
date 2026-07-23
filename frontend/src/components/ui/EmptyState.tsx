import type { LucideIcon } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center bg-white border border-dashed rounded-lg border-earth-300", className)}>
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-earth-50">
        <Icon className="w-6 h-6 text-earth-500" />
      </div>
      <h3 className="text-lg font-semibold text-earth-900">{title}</h3>
      <p className="max-w-sm mt-2 text-sm text-earth-500">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
