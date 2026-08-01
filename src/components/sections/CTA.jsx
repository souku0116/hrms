import { cn } from "@/utils/cn";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import SectionLayout from "@/components/layout/SectionLayout";

/** High-emphasis conversion band with supplied actions and no route-specific behavior. */
export default function CTA({ actions, className, description, title }) {
  return (
    <SectionLayout className={cn("text-center", className)} spacing="lg" tone="primary">
      <div className="mx-auto max-w-[var(--ws-breakpoints-content-md)]">
        <Heading as="h2" className="text-[var(--ws-colors-background)]" level="h2">
          {title}
        </Heading>
        {description ? (
          <Paragraph
            className="mt-[var(--ws-spacing-16)] text-[var(--ws-colors-surface-secondary)]"
            size="large"
          >
            {description}
          </Paragraph>
        ) : null}
        {actions ? (
          <div className="mt-[var(--ws-spacing-24)] flex flex-wrap justify-center gap-[var(--ws-spacing-8)]">
            {actions}
          </div>
        ) : null}
      </div>
    </SectionLayout>
  );
}
