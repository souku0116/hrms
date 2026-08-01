import { cn } from "@/utils/cn";
import Container from "@/components/ui/Container";
import Paragraph from "@/components/ui/Paragraph";
import { focusRing } from "@/components/ui/styles";

/** Multi-column product footer driven by supplied navigation groups and legal content. */
export default function Footer({ brand = "WorkSync", className, legal, linkGroups = [], tagline }) {
  return (
    <footer
      className={cn(
        "bg-[var(--ws-colors-primary)] py-[var(--ws-spacing-64)] text-[var(--ws-colors-background)]",
        className,
      )}
    >
      <Container>
        <div className="grid gap-[var(--ws-spacing-48)] md:grid-cols-2 lg:grid-cols-[2fr_repeat(3,1fr)]">
          <div className="space-y-[var(--ws-spacing-16)]">
            <p className="font-[var(--ws-typography-font-weight-semibold)] text-[length:var(--ws-typography-h4-font-size)]">
              {brand}
            </p>
            {tagline ? (
              <Paragraph className="text-[var(--ws-colors-surface-secondary)]">{tagline}</Paragraph>
            ) : null}
          </div>
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h2 className="font-[var(--ws-typography-font-weight-semibold)]">{group.title}</h2>
              <ul className="mt-[var(--ws-spacing-16)] space-y-[var(--ws-spacing-8)]">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      className={cn(
                        "text-[var(--ws-colors-surface-secondary)] hover:text-[var(--ws-colors-background)]",
                        focusRing,
                      )}
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {legal ? (
          <div className="mt-[var(--ws-spacing-64)] border-t border-[var(--ws-colors-text-secondary)] pt-[var(--ws-spacing-24)]">
            <Paragraph className="text-[var(--ws-colors-surface-secondary)]" size="small">
              {legal}
            </Paragraph>
          </div>
        ) : null}
      </Container>
    </footer>
  );
}
