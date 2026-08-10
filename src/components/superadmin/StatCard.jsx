import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";

/** KPI stat card component for dashboard. */
export function StatCard({ title, value, trend, trendLabel, icon: Icon, className }) {
  const isPositive = trend >= 0;

  return (
    <Card className={cn("", className)}>
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-textSecondary">{title}</p>
          {Icon && <Icon className="h-4 w-4 text-muted" />}
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="text-2xl font-bold text-textPrimary">{value}</div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-error" />
            )}
            <span className={cn("text-xs font-medium", isPositive ? "text-success" : "text-error")}>
              {Math.abs(trend)}%
            </span>
            {trendLabel && <span className="text-xs text-muted">{trendLabel}</span>}
          </div>
        )}
      </div>
    </Card>
  );
}

export default StatCard;
