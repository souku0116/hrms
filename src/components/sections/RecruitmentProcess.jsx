import Card from "@/components/ui/Card";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import SectionLayout from "@/components/layout/SectionLayout";

/** Ordered process narrative suitable for recruitment, onboarding, and other workflow explanations. */
export default function RecruitmentProcess({ description, steps = [], title }) {
  return (
    <SectionLayout animate spacing="lg" tone="surface">
      <div className="max-w-[var(--ws-breakpoints-content-md)]">
        <Heading>{title}</Heading>
        {description ? (
          <Paragraph className="mt-[var(--ws-spacing-16)]" muted>
            {description}
          </Paragraph>
        ) : null}
      </div>
      <ol className="mt-[var(--ws-spacing-32)] grid gap-[var(--ws-spacing-16)] md:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ description: stepDescription, title: stepTitle }, index) => (
          <li key={stepTitle}>
            <Card className="h-full space-y-[var(--ws-spacing-16)]">
              <span className="inline-flex size-[var(--ws-spacing-32)] items-center justify-center rounded-[var(--ws-radius-full)] bg-[var(--ws-colors-primary-blue)] text-[var(--ws-colors-background)]">
                {index + 1}
              </span>
              <Heading as="h3" level="h4">
                {stepTitle}
              </Heading>
              {stepDescription ? (
                <Paragraph muted size="small">
                  {stepDescription}
                </Paragraph>
              ) : null}
            </Card>
          </li>
        ))}
      </ol>
    </SectionLayout>
  );
}
