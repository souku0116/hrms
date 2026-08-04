import { useState, type FormEvent } from "react";
import { Github, Linkedin, Twitter, Send, Mail } from "lucide-react";
import { footerLinkGroups } from "./data";

const socials = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:hello@worksync.com" },
];

/** Dark enterprise footer with newsletter and social links. */
export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[var(--ws-colors-primary)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)_1.2fr]">
          {/* Brand + newsletter */}
          <div>
            <a href="#top" className="flex items-center gap-2 font-heading text-xl font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[var(--ws-colors-primary-blue)]">
                W
              </span>
              WorkSync <span className="text-white/60">HR</span>
            </a>
            <p className="mt-4 text-sm text-white/60">
              The AI-powered HR platform for modern businesses. One connected system for
              recruitment, payroll, attendance and performance.
            </p>

            <form className="mt-6" onSubmit={handleSubscribe}>
              <label
                htmlFor="newsletter"
                className="block text-sm font-medium text-white/80"
              >
                Subscribe to our newsletter
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="min-h-10 flex-1 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-[var(--ws-colors-primary-blue)] transition-opacity hover:opacity-90"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              {subscribed && (
                <p className="mt-2 text-sm text-[var(--ws-colors-success)]">
                  Thanks for subscribing!
                </p>
              )}
            </form>
          </div>

          {/* Link groups */}
          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-heading font-bold text-white">{group.title}</h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} WorkSync HR. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white/70 transition-colors hover:bg-white hover:text-[var(--ws-colors-primary-blue)]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
