import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import ServiceCard from "@/components/ui/ServiceCard";
import SectionLayout from "@/components/layout/SectionLayout";

/** Service-card collection without route, query, or product-specific behavior. */
export default function Services({ description, items = [], title }) {
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
      <div className="mt-[var(--ws-spacing-32)] grid gap-[var(--ws-spacing-24)] md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ServiceCard {...item} key={item.title} />
        ))}
      </div>
    </SectionLayout>
  );
}
