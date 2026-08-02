import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";
import Container from "@/components/ui/Container";
import { focusRing, transition } from "@/components/ui/styles";

/** Responsive navigation shell with optional transparent-hero and dropdown support. */
export default function Navbar({
  actions,
  brand = "WorkSync",
  brandHref = "/",
  className,
  links = [],
  transparent = false,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const isSolid = !transparent || hasScrolled;

  useEffect(() => {
    if (!transparent) {
      return undefined;
    }

    const updateScrolledState = () => setHasScrolled(window.scrollY > 0);
    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolledState);
  }, [transparent]);

  const textClass = isSolid
    ? "text-[var(--ws-colors-text-primary)]"
    : "text-[var(--ws-colors-background)]";
  const navClass = isSolid
    ? "border-[var(--ws-colors-border)] bg-[var(--ws-colors-background)] shadow-[var(--ws-shadow-card)]"
    : "border-transparent bg-transparent";

  return (
    <header className={cn("sticky top-0 z-40 border-b", transition, navClass, className)}>
      <Container>
        <nav
          aria-label="Primary navigation"
          className="flex min-h-[var(--ws-spacing-64)] items-center justify-between gap-[var(--ws-spacing-24)]"
        >
          <a
            className={cn(
              "font-[var(--ws-typography-font-weight-semibold)] text-[length:var(--ws-typography-h4-font-size)]",
              "transition-colors duration-[var(--ws-animation-duration-fast)] ease-[var(--ws-animation-easing-standard)]",
              "hover:text-[var(--ws-colors-primary-blue)]",
              focusRing,
              textClass,
            )}
            href={brandHref}
          >
            {brand}
          </a>

          <div className="hidden items-center gap-[var(--ws-spacing-24)] lg:flex">
            {links.map(({ href, items, label }) =>
              items?.length ? (
                <details className="group relative" key={label}>
                  <summary
                    className={cn(
                      "flex cursor-pointer list-none items-center gap-[var(--ws-spacing-4)]",
                      "text-[length:var(--ws-typography-small-font-size)]",
                      "transition-colors duration-[var(--ws-animation-duration-fast)] ease-[var(--ws-animation-easing-standard)]",
                      "hover:text-[var(--ws-colors-primary-blue)]",
                      textClass,
                      focusRing,
                    )}
                  >
                    {label}
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "size-[var(--ws-spacing-16)] transition-transform duration-[var(--ws-animation-duration-base)] ease-[var(--ws-animation-easing-standard)] group-open:rotate-180",
                      )}
                    />
                  </summary>
                  <div
                    className="absolute left-0 mt-[var(--ws-spacing-16)] min-w-[var(--ws-breakpoints-content-sm)] rounded-[var(--ws-radius-md)] border border-[var(--ws-colors-border)] bg-[var(--ws-colors-background)] p-[var(--ws-spacing-8)] shadow-[var(--ws-shadow-floating)]"
                    role="menu"
                  >
                    {items.map((item) => (
                      <a
                        className={cn(
                          "block rounded-[var(--ws-radius-sm)] px-[var(--ws-spacing-16)] py-[var(--ws-spacing-8)]",
                          "text-[var(--ws-colors-text-secondary)]",
                          "transition-colors duration-[var(--ws-animation-duration-fast)] ease-[var(--ws-animation-easing-standard)]",
                          "hover:bg-[var(--ws-colors-surface-secondary)] hover:text-[var(--ws-colors-text-primary)]",
                          focusRing,
                        )}
                        href={item.href}
                        key={item.label}
                        role="menuitem"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </details>
              ) : (
                <a
                  className={cn(
                    "text-[length:var(--ws-typography-small-font-size)]",
                    "transition-colors duration-[var(--ws-animation-duration-fast)] ease-[var(--ws-animation-easing-standard)]",
                    "hover:text-[var(--ws-colors-primary-blue)]",
                    focusRing,
                    textClass,
                  )}
                  href={href}
                  key={label}
                >
                  {label}
                </a>
              ),
            )}
          </div>

          <div className="hidden items-center gap-[var(--ws-spacing-8)] lg:flex">{actions}</div>

          <button
            aria-expanded={isMobileOpen}
            aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
            className={cn("inline-flex p-[var(--ws-spacing-8)] lg:hidden", textClass, focusRing)}
            onClick={() => setIsMobileOpen((isOpen) => !isOpen)}
            type="button"
          >
            {isMobileOpen ? (
              <X aria-hidden="true" className="size-[var(--ws-spacing-24)]" />
            ) : (
              <Menu aria-hidden="true" className="size-[var(--ws-spacing-24)]" />
            )}
          </button>
        </nav>

        {isMobileOpen ? (
          <div className="border-t border-[var(--ws-colors-border)] bg-[var(--ws-colors-background)] py-[var(--ws-spacing-16)] lg:hidden">
            <div className="flex flex-col gap-[var(--ws-spacing-8)]">
              {links.map(({ href, items, label }) => (
                <div key={label}>
                  <a
                    className={cn(
                      "block rounded-[var(--ws-radius-sm)] px-[var(--ws-spacing-16)] py-[var(--ws-spacing-8)]",
                      "text-[var(--ws-colors-text-primary)] hover:bg-[var(--ws-colors-surface-secondary)]",
                      focusRing,
                    )}
                    href={href}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {label}
                  </a>
                  {items?.length ? (
                    <div className="ml-[var(--ws-spacing-16)] border-l border-[var(--ws-colors-border)] pl-[var(--ws-spacing-16)]">
                      {items.map((item) => (
                        <a
                          className={cn(
                            "block rounded-[var(--ws-radius-sm)] px-[var(--ws-spacing-16)] py-[var(--ws-spacing-8)]",
                            "text-[var(--ws-colors-text-secondary)] hover:bg-[var(--ws-colors-surface-secondary)]",
                            focusRing,
                          )}
                          href={item.href}
                          key={item.label}
                          onClick={() => setIsMobileOpen(false)}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              {actions ? (
                <div className="mt-[var(--ws-spacing-8)] flex flex-wrap gap-[var(--ws-spacing-8)]">
                  {actions}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </Container>
    </header>
  );
}
