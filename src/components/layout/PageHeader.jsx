import Breadcrumb from "@/components/ui/Breadcrumb";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import Section from "@/components/ui/Section";

/** Reusable page-introduction band with optional breadcrumb, actions, and supporting copy. */
export default function PageHeader({
  actions,
  breadcrumb,
  className,
  description,
  eyebrow,
  title,
}) {
  return (
    <Section className={className} spacing="lg" tone="surface">
      <Container>
        <div className="max-w-[var(--ws-breakpoints-content-md)]">
          {breadcrumb ? (
            <Breadcrumb className="mb-[var(--ws-spacing-24)]" items={breadcrumb} />
          ) : null}
          {eyebrow ? (
            <p className="mb-[var(--ws-spacing-8)] text-[length:var(--ws-typography-small-font-size)] font-[var(--ws-typography-font-weight-semibold)] text-[var(--ws-colors-primary-blue)]">
              {eyebrow}
            </p>
          ) : null}
          <Heading as="h1" level="h1">
            {title}
          </Heading>
          {description ? (
            <Paragraph className="mt-[var(--ws-spacing-16)]" muted size="large">
              {description}
            </Paragraph>
          ) : null}
          {actions ? (
            <div className="mt-[var(--ws-spacing-24)] flex flex-wrap gap-[var(--ws-spacing-8)]">
              {actions}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
