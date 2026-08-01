import { cn } from "@/utils/cn";

/** Top-level application frame accepting independently composed navigation and footer slots. */
export default function PageLayout({ children, className, footer, header }) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-[var(--ws-colors-background)]", className)}>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </div>
  );
}
