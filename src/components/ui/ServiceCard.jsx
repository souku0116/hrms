import { cn } from "@/utils/cn";
import Card from "./Card";
import Heading from "./Heading";
import IconWrapper from "./IconWrapper";
import Paragraph from "./Paragraph";

/** Service offering card that stays neutral to product-specific content and routes. */
export default function ServiceCard({ action, className, description, icon, meta, title }) {
  return (
    <Card className={cn("flex h-full flex-col gap-[var(--ws-spacing-16)]", className)} interactive>
      <div className="flex items-start justify-between gap-[var(--ws-spacing-16)]">
        {icon ? <IconWrapper icon={icon} variant="neutral" /> : null}
        {meta ? <div>{meta}</div> : null}
      </div>
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
