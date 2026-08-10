import * as React from "react";
import { Building2, UserPlus, AlertCircle, Ban, CheckCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";

/** Recent activity list component. */
export function RecentActivity({ activities, className }) {
  const iconMap = {
    Building2: Building2,
    UserPlus: UserPlus,
    AlertCircle: AlertCircle,
    Ban: Ban,
    CheckCircle: CheckCircle,
  };

  return (
    <Card className={cn("", className)}>
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = iconMap[activity.icon] || Building2;
            return (
              <div key={activity.id} className="flex gap-4 pb-4 border-b last:pb-0 last:border-0">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-textPrimary">{activity.title}</p>
                  <p className="text-xs text-textSecondary truncate">{activity.description}</p>
                  <p className="text-xs text-muted mt-1">{activity.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default RecentActivity;
