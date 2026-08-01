import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import SectionLayout from "@/components/layout/SectionLayout";

/** Social-proof collection supplied by the consuming product; no testimonial copy is embedded. */
export default function Testimonials({ description, items = [], title }) {
  return (
    <SectionLayout spacing="lg" tone="surface">
      <div className="max-w-[var(--ws-breakpoints-content-md)]">
        <Heading>{title}</Heading>
        {description ? (
          <Paragraph className="mt-[var(--ws-spacing-16)]" muted>
            {description}
          </Paragraph>
        ) : null}
      </div>
      <div className="mt-[var(--ws-spacing-32)] grid gap-[var(--ws-spacing-24)] md:grid-cols-2 lg:grid-cols-3">
        {items.map(({ avatar, initials, name, quote, role }) => (
          <Card className="flex h-full flex-col gap-[var(--ws-spacing-24)]" key={`${name}-${role}`}>
            <Paragraph className="flex-1" size="large">
              {quote}
            </Paragraph>
            <div className="flex items-center gap-[var(--ws-spacing-16)]">
              <Avatar alt={name} initials={initials} src={avatar} />
              <div>
                <p className="font-[var(--ws-typography-font-weight-semibold)] text-[var(--ws-colors-text-primary)]">
                  {name}
                </p>
                {role ? (
                  <Paragraph muted size="small">
                    {role}
                  </Paragraph>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SectionLayout>
  );
}
