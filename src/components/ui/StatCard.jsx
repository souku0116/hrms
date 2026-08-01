import { cn } from "@/utils/cn";
import Card from "./Card";
import Paragraph from "./Paragraph";

/** Compact statistic surface for dashboards and marketing metrics. */
export default function StatCard({ className, label, trend, value }) {
  return (
    <Card className={cn("space-y-[var(--ws-spacing-8)]", className)}>
      <p className="font-[var(--ws-typography-h2-font-weight)] text-[length:var(--ws-typography-h2-font-size)] leading-[var(--ws-typography-h2-line-height)] text-[var(--ws-colors-text-primary)]">
        {value}
      </p>
      <Paragraph muted size="small">
        {label}
      </Paragraph>
      {trend ? <div className="text-[var(--ws-colors-success)]">{trend}</div> : null}
    </Card>
  );
}
