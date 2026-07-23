import { Card, CardContent } from '../ui/Card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-earth-500 truncate">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-semibold text-earth-900">{value}</p>
              {trend && (
                <span className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                </span>
              )}
            </div>
          </div>
          <div className="p-3 bg-primary-50 rounded-lg">
            <Icon className="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
