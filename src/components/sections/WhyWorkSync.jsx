import FeatureCard from "@/components/ui/FeatureCard";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import SectionLayout from "@/components/layout/SectionLayout";

/** Benefits grid for communicating differentiated platform or service value. */
export default function WhyWorkSync({ description, features = [], title }) {
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
      <div className="mt-[var(--ws-spacing-32)] grid gap-[var(--ws-spacing-24)] md:grid-cols-2">
        {features.map((feature) => (
          <FeatureCard {...feature} key={feature.title} />
        ))}
      </div>
    </SectionLayout>
  );
}
