import * as React from "react";
import { Card, CardContent } from "../ui/Card";
import { cn } from "../../lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, title, value, icon, trend, description, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn("overflow-hidden premium-shadow", className)} {...props}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
              {title}
            </h3>
            {icon && (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {icon}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold">{value}</div>
            <div className="flex items-center gap-2 text-sm">
              {trend && (
                <span
                  className={cn("flex items-center font-medium", {
                    "text-success": trend.isPositive,
                    "text-danger": !trend.isPositive,
                  })}
                >
                  {trend.isPositive ? (
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-4 w-4" />
                  )}
                  {trend.value}%
                </span>
              )}
              {description && (
                <span className="text-muted-foreground">{description}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);
StatCard.displayName = "StatCard";

export { StatCard };
