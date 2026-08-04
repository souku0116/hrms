import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface NavbarProps {
  links: { href: string; label: string }[];
}

/** Sticky landing navigation with blur-on-scroll and active-state highlighting. */
export default function Navbar({ links }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = links.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [links]);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-[var(--ws-colors-border)] bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(15,23,42,0.06)]"
          : "border-b border-transparent bg-transparent",
      )}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav
        aria-label="Primary navigation"
        className={cn(
          "mx-auto flex w-full max-w-7xl items-center justify-between px-6 transition-all duration-300",
          scrolled ? "h-16" : "h-20",
        )}
      >
        <a
          href="#top"
          className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight text-[var(--ws-colors-text-primary)]"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--ws-colors-primary-blue)] text-[var(--ws-colors-background)]">
            W
          </span>
          <span>
            WorkSync <span className="text-[var(--ws-colors-primary-blue)]">HR</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNav(link.href);
              }}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active === link.href.replace("#", "")
                  ? "text-[var(--ws-colors-primary-blue)]"
                  : "text-[var(--ws-colors-text-secondary)] hover:text-[var(--ws-colors-text-primary)]",
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" href="/login">
            Log in
          </Button>
          <Button href="#contact">Book Demo</Button>
        </div>

        <button
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[var(--ws-colors-text-primary)] lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="border-t border-[var(--ws-colors-border)] bg-white/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-6 py-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(link.href);
                  }}
                  className="rounded-md px-3 py-2 text-sm font-medium text-[var(--ws-colors-text-secondary)] hover:bg-[var(--ws-colors-surface)] hover:text-[var(--ws-colors-text-primary)]"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-[var(--ws-colors-border)] pt-4">
                <Button variant="outline" href="/login">
                  Log in
                </Button>
                <Button href="#contact">Book Demo</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
