import { cn } from "@/utils/cn";
import Spinner from "./Spinner";

/** Centered loading state for data regions while preserving page layout ownership. */
export default function Loader({ className, label = "Loading", size = "md" }) {
  return (
    <div
      className={cn("flex items-center justify-center gap-[var(--ws-spacing-8)]", className)}
      role="status"
    >
      <Spinner label={label} size={size} />
      <span className="text-[length:var(--ws-typography-small-font-size)] text-[var(--ws-colors-text-secondary)]">
        {label}
      </span>
    </div>
  );
}
