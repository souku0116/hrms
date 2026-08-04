import { lazy, Suspense } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import TrustedCompanies from "./TrustedCompanies";
import DashboardShowcase from "./DashboardShowcase";
import SolutionsSection from "./SolutionsSection";
import PlatformFeatures from "./PlatformFeatures";
import IndustrySection from "./IndustrySection";
import AIRecruitmentSection from "./AIRecruitmentSection";
import GrowthSection from "./GrowthSection";
import StatsSection from "./StatsSection";
import TestimonialsSection from "./TestimonialsSection";
import CTASection from "./CTASection";
import Footer from "./Footer";
import { navLinks } from "./data";

// Heavy sections are lazy-loaded for performance.
const LazyTestimonials = lazy(() =>
  import("./TestimonialsSection").then((m) => ({ default: m.default })),
);

/** Composes the full WorkSync HR landing page from isolated, reusable sections. */
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--ws-colors-background)]">
      <Navbar links={navLinks} />
      <main className="flex-1">
        <HeroSection />
        <TrustedCompanies />
        <SolutionsSection />
        <PlatformFeatures />
        <DashboardShowcase />
        <IndustrySection />
        <AIRecruitmentSection />
        <GrowthSection />
        <StatsSection />
        <Suspense fallback={null}>
          <LazyTestimonials />
        </Suspense>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
