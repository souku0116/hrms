import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";

export default function PageTitle({ description, title }) {
  return (
    <div className="text-center">
      <Heading as="h1" level="h1">
        {title}
      </Heading>
      {description ? (
        <Paragraph className="mt-[var(--ws-spacing-8)]" muted>
          {description}
        </Paragraph>
      ) : null}
    </div>
  );
}
