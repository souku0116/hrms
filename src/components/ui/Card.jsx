import { cn } from "@/utils/cn";
import { componentStyles } from "./styles";

/** Neutral surface container with an optional token-based hover treatment. */
export default function Card({
  as: Component = "div",
  children,
  className,
  interactive = false,
  ...props
}) {
  return (
    <Component
      className={cn(componentStyles.card.base, interactive && "ws-card-interactive", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
