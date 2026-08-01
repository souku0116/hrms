import { LoaderCircle } from "lucide-react";
import { cn } from "@/utils/cn";

const sizes = {
  sm: "size-[var(--ws-spacing-16)]",
  md: "size-[var(--ws-spacing-24)]",
  lg: "size-[var(--ws-spacing-32)]",
};

/** Lightweight loading indicator with screen-reader status text. */
export default function Spinner({ className, label = "Loading", size = "md" }) {
  return (
    <span className="inline-flex items-center" role="status">
      <LoaderCircle
        aria-hidden="true"
        className={cn("animate-spin text-[var(--ws-colors-primary-blue)]", sizes[size], className)}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
