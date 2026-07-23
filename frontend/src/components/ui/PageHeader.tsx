import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-earth-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-earth-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
