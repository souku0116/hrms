import Card from "@/components/ui/Card";
import Heading from "@/components/ui/Heading";
import IconWrapper from "@/components/ui/IconWrapper";
import Paragraph from "@/components/ui/Paragraph";
import SectionLayout from "@/components/layout/SectionLayout";

/** Flexible industry grid that lets consuming products define their own vertical taxonomy. */
export default function Industries({ description, items = [], title }) {
  return (
    <SectionLayout spacing="lg">
      <div className="max-w-[var(--ws-breakpoints-content-md)]">
        <Heading>{title}</Heading>
        {description ? (
          <Paragraph className="mt-[var(--ws-spacing-16)]" muted>
            {description}
          </Paragraph>
        ) : null}
      </div>
      <div className="mt-[var(--ws-spacing-32)] grid gap-[var(--ws-spacing-16)] sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ description: itemDescription, icon, title: itemTitle }) => (
          <Card
            className="flex h-full flex-col space-y-[var(--ws-spacing-16)]"
            interactive
            key={itemTitle}
          >
            {icon ? <IconWrapper icon={icon} /> : null}
            <Heading as="h3" level="h4">
              {itemTitle}
            </Heading>
            {itemDescription ? (
              <Paragraph muted size="small">
                {itemDescription}
              </Paragraph>
            ) : null}
          </Card>
        ))}
      </div>
    </SectionLayout>
  );
}
