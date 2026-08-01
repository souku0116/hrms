import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { focusRing, transition } from "./styles";

/** Controlled page navigator for list-based product modules. */
export default function Pagination({ className, currentPage, onPageChange, totalPages }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const buttonClass =
    "inline-flex size-[var(--ws-spacing-40)] items-center justify-center rounded-[var(--ws-radius-sm)] text-[var(--ws-colors-text-secondary)] hover:bg-[var(--ws-colors-surface-secondary)] disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-[var(--ws-spacing-4)]", className)}
    >
      <button
        aria-label="Go to previous page"
        className={cn(buttonClass, transition, focusRing)}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        <ChevronLeft aria-hidden="true" className="size-[var(--ws-spacing-24)]" />
      </button>
      {pages.map((page) => (
        <button
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={`Go to page ${page}`}
          className={cn(
            buttonClass,
            transition,
            focusRing,
            page === currentPage &&
              "bg-[var(--ws-colors-primary-blue)] text-[var(--ws-colors-background)]",
          )}
          key={page}
          onClick={() => onPageChange(page)}
          type="button"
        >
          {page}
        </button>
      ))}
      <button
        aria-label="Go to next page"
        className={cn(buttonClass, transition, focusRing)}
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        <ChevronRight aria-hidden="true" className="size-[var(--ws-spacing-24)]" />
      </button>
    </nav>
  );
}
