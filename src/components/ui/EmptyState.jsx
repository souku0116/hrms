import { cn } from "@/utils/cn";
import Heading from "./Heading";
import Paragraph from "./Paragraph";

/** Reusable no-data state with caller-owned messaging, icon, and recovery action. */
export default function EmptyState({ action, className, description, icon: Icon, title }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-[var(--ws-radius-lg)] border border-dashed border-[var(--ws-colors-border)]",
        "bg-[var(--ws-colors-surface)] px-[var(--ws-spacing-24)] py-[var(--ws-spacing-48)] text-center",
        className,
      )}
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          className="mb-[var(--ws-spacing-16)] size-[var(--ws-spacing-32)] text-[var(--ws-colors-muted)]"
        />
      ) : null}
      <Heading as="h2" level="h4">
        {title}
      </Heading>
      {description ? (
        <Paragraph className="mt-[var(--ws-spacing-8)]" muted>
          {description}
        </Paragraph>
      ) : null}
      {action ? <div className="mt-[var(--ws-spacing-24)]">{action}</div> : null}
    </div>
  );
}
