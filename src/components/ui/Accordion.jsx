import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { focusRing, transition } from "./styles";

/** Data-driven disclosure group supporting single or multiple expanded items. */
export default function Accordion({
  allowMultiple = false,
  className,
  defaultOpenIds = [],
  items,
  onValueChange,
}) {
  const [openIds, setOpenIds] = useState(defaultOpenIds);
  const groupId = useId();

  function toggleItem(itemId) {
    setOpenIds((currentIds) => {
      const isOpen = currentIds.includes(itemId);
      const nextIds = isOpen
        ? currentIds.filter((id) => id !== itemId)
        : allowMultiple
          ? [...currentIds, itemId]
          : [itemId];

      onValueChange?.(nextIds);
      return nextIds;
    });
  }

  return (
    <div className={cn("divide-y divide-[var(--ws-colors-border)]", className)}>
      {items.map(({ content, disabled = false, id, title }) => {
        const isOpen = openIds.includes(id);
        const panelId = `${groupId}-${id}-panel`;
        const buttonId = `${groupId}-${id}-button`;

        return (
          <div key={id}>
            <h3>
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className={cn(
                  "flex w-full items-center justify-between gap-[var(--ws-spacing-16)] py-[var(--ws-spacing-16)]",
                  "text-left text-[var(--ws-colors-text-primary)]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  transition,
                  focusRing,
                )}
                disabled={disabled}
                id={buttonId}
                onClick={() => toggleItem(id)}
                type="button"
              >
                <span className="font-[var(--ws-typography-font-weight-semibold)]">{title}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn("size-[var(--ws-spacing-24)]", transition, isOpen && "rotate-180")}
                />
              </button>
            </h3>
            <div
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-[var(--ws-animation-duration-base)] ease-[var(--ws-animation-easing-standard)]",
                isOpen
                  ? "grid-rows-[1fr] pb-[var(--ws-spacing-16)] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
              hidden={!isOpen}
              id={panelId}
              role="region"
            >
              <div className="overflow-hidden text-[var(--ws-colors-text-secondary)]">
                {content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
