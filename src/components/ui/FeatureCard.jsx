import { cn } from "@/utils/cn";
import Card from "./Card";
import Heading from "./Heading";
import IconWrapper from "./IconWrapper";
import Paragraph from "./Paragraph";

/** Reusable feature presentation card driven entirely by passed content. */
export default function FeatureCard({ action, className, description, icon, title }) {
  return (
    <Card className={cn("flex h-full flex-col gap-[var(--ws-spacing-16)]", className)} interactive>
      {icon ? <IconWrapper icon={icon} variant="primary" /> : null}
      <div className="space-y-[var(--ws-spacing-8)]">
        <Heading as="h3" level="h4">
          {title}
        </Heading>
        {description ? <Paragraph muted>{description}</Paragraph> : null}
      </div>
      {action ? <div className="mt-auto">{action}</div> : null}
    </Card>
  );
}
