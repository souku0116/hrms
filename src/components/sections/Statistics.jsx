import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import StatCard from "@/components/ui/StatCard";
import SectionLayout from "@/components/layout/SectionLayout";

/** Independent metrics section for marketing and product dashboard contexts. */
export default function Statistics({ description, items = [], title }) {
  return (
    <SectionLayout spacing="lg">
      {title ? (
        <div className="max-w-[var(--ws-breakpoints-content-md)]">
          <Heading>{title}</Heading>
          {description ? (
            <Paragraph className="mt-[var(--ws-spacing-16)]" muted>
              {description}
            </Paragraph>
          ) : null}
        </div>
      ) : null}
      <div className="mt-[var(--ws-spacing-32)] grid gap-[var(--ws-spacing-16)] sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <StatCard {...item} key={item.label} />
        ))}
      </div>
    </SectionLayout>
  );
}
