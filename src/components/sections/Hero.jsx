import { cn } from "@/utils/cn";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import SectionLayout from "@/components/layout/SectionLayout";

/** Standalone marketing hero with caller-owned imagery, actions, and message hierarchy. */
export default function Hero({ actions, className, description, eyebrow, media, title }) {
  return (
    <SectionLayout className={className} spacing="xl" tone="surface">
      <div
        className={cn("grid items-center gap-[var(--ws-spacing-48)]", media && "lg:grid-cols-2")}
      >
        <div className="max-w-[var(--ws-breakpoints-content-md)]">
          {eyebrow ? (
            <p className="mb-[var(--ws-spacing-16)] text-[length:var(--ws-typography-small-font-size)] font-[var(--ws-typography-font-weight-semibold)] text-[var(--ws-colors-primary-blue)]">
              {eyebrow}
            </p>
          ) : null}
          <Heading as="h1" level="display">
            {title}
          </Heading>
          {description ? (
            <Paragraph className="mt-[var(--ws-spacing-24)]" muted size="large">
              {description}
            </Paragraph>
          ) : null}
          {actions ? (
            <div className="mt-[var(--ws-spacing-32)] flex flex-wrap gap-[var(--ws-spacing-8)]">
              {actions}
            </div>
          ) : null}
        </div>
        {media ? <div>{media}</div> : null}
      </div>
    </SectionLayout>
  );
}
