import Accordion from "@/components/ui/Accordion";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import SectionLayout from "@/components/layout/SectionLayout";

/** FAQ composition that delegates accessible disclosure behavior to the shared Accordion. */
export default function FAQ({ description, items = [], title }) {
  return (
    <SectionLayout spacing="lg">
      <div className="grid gap-[var(--ws-spacing-32)] lg:grid-cols-2">
        <div className="max-w-[var(--ws-breakpoints-content-md)]">
          <Heading>{title}</Heading>
          {description ? (
            <Paragraph className="mt-[var(--ws-spacing-16)]" muted>
              {description}
            </Paragraph>
          ) : null}
        </div>
        <Accordion items={items} />
      </div>
    </SectionLayout>
  );
}
