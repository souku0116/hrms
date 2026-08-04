import * as React from "react";
import { cn } from "../../lib/utils";

export interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
}

const SectionTitle = React.forwardRef<HTMLDivElement, SectionTitleProps>(
  ({ className, title, description, align = "left", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col space-y-2",
          {
            "items-start text-left": align === "left",
            "items-center text-center": align === "center",
            "items-end text-right": align === "right",
          },
          className
        )}
        {...props}
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="text-lg text-muted-foreground max-w-[85%] text-balance">
            {description}
          </p>
        )}
      </div>
    );
  }
);
SectionTitle.displayName = "SectionTitle";

export { SectionTitle };
