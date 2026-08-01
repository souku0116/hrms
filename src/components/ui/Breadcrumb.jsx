import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

/** Accessible location trail that works with route links or ordinary anchors. */
export default function Breadcrumb({ className, items }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-[var(--ws-spacing-8)]">
        {items.map(({ href, label }, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li className="flex items-center gap-[var(--ws-spacing-8)]" key={`${label}-${index}`}>
              {isCurrent ? (
                <span aria-current="page" className="text-[var(--ws-colors-text-primary)]">
                  {label}
                </span>
              ) : (
                <a
                  className={cn(
                    "text-[var(--ws-colors-text-secondary)] hover:text-[var(--ws-colors-primary-blue)]",
                    "focus-visible:outline-none focus-visible:underline",
                  )}
                  href={href}
                >
                  {label}
                </a>
              )}
              {!isCurrent ? (
                <ChevronRight
                  aria-hidden="true"
                  className="size-[var(--ws-spacing-16)] text-[var(--ws-colors-muted)]"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
