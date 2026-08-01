import {
  ClipboardCheck,
  Code2,
  Factory,
  FolderKanban,
  Gauge,
  GitBranch,
  Handshake,
  HeartPulse,
  MapPinned,
  MonitorCog,
  SearchCheck,
  Store,
  UsersRound,
  Workflow,
} from "lucide-react";
import ResponsiveImage from "@/components/common/ResponsiveImage";
import { Footer, Navbar, PageLayout, SectionLayout } from "@/components/layout";
import {
  CTA,
  FAQ,
  Hero,
  Industries,
  RecruitmentProcess,
  Services,
  Statistics,
  Testimonials,
  WhyWorkSync,
} from "@/components/sections";
import { Button, Card, FeatureCard, Heading, IconWrapper, Paragraph } from "@/components/ui";
import { homepageContent } from "@/constants/homepageContent";

const iconByName = {
  ClipboardCheck,
  Code2,
  Factory,
  FolderKanban,
  Gauge,
  GitBranch,
  Handshake,
  HeartPulse,
  MapPinned,
  MonitorCog,
  SearchCheck,
  Store,
  UsersRound,
  Workflow,
};

function withIcons(items) {
  return items.map(({ icon, ...item }) => ({
    ...item,
    icon: iconByName[icon],
  }));
}

const services = withIcons(homepageContent.services.items);
const industries = withIcons(homepageContent.industries.items);
const trustItems = withIcons(homepageContent.trust.items);
const technologyItems = withIcons(homepageContent.technology.items);
const whyWorkSync = withIcons(homepageContent.whyWorkSync.items);

const eyebrowClassName =
  "mb-[var(--ws-spacing-8)] text-[length:var(--ws-typography-small-font-size)] font-[var(--ws-typography-font-weight-semibold)] text-[var(--ws-colors-primary-blue)]";

/** WorkSync marketing homepage assembled exclusively from the shared design system. */
export default function Home() {
  const {
    faq,
    finalCta,
    footer,
    hero,
    industries: industriesContent,
    navigation,
    process,
    services: servicesContent,
    statistics,
    technology,
    testimonials,
    trust,
    whyWorkSync: whyWorkSyncContent,
  } = homepageContent;

  return (
    <PageLayout
      footer={<Footer {...footer} />}
      header={
        <Navbar
          actions={<Button href={navigation.primaryCta.href}>{navigation.primaryCta.label}</Button>}
          brand={navigation.brand}
          brandHref={navigation.brandHref}
          links={navigation.links}
        />
      }
    >
      <Hero
        actions={
          <>
            <Button href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} size="lg" variant="outline">
              {hero.secondaryCta.label}
            </Button>
          </>
        }
        description={hero.description}
        eyebrow={hero.eyebrow}
        media={<ResponsiveImage {...hero.media} priority sizes="(min-width: 1024px) 50vw, 100vw" />}
        title={hero.headline}
      />

      <div id="trust">
        <SectionLayout spacing="md">
          <div className="grid items-start gap-[var(--ws-spacing-32)] lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div className="max-w-[var(--ws-breakpoints-content-md)]">
              <p className={eyebrowClassName}>{trust.eyebrow}</p>
              <Heading as="h2" level="h2">
                {trust.headline}
              </Heading>
              <Paragraph className="mt-[var(--ws-spacing-16)]" muted>
                {trust.description}
              </Paragraph>
            </div>
            <div className="grid gap-[var(--ws-spacing-16)] sm:grid-cols-3">
              {trustItems.map((item) => (
                <Card className="space-y-[var(--ws-spacing-16)]" key={item.title}>
                  <IconWrapper icon={item.icon} size="sm" />
                  <div className="space-y-[var(--ws-spacing-8)]">
                    <Heading as="h3" level="h4">
                      {item.title}
                    </Heading>
                    <Paragraph muted size="small">
                      {item.description}
                    </Paragraph>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </SectionLayout>
      </div>

      <div id="services">
        <Services
          description={servicesContent.description}
          items={services}
          title={servicesContent.headline}
        />
        <SectionLayout className="pt-[var(--ws-spacing-0)]" spacing="sm" tone="surface">
          <Button href={servicesContent.primaryCta.href} variant="outline">
            {servicesContent.primaryCta.label}
          </Button>
        </SectionLayout>
      </div>

      <div id="industries">
        <Industries
          description={industriesContent.description}
          items={industries}
          title={industriesContent.headline}
        />
        <SectionLayout className="pt-[var(--ws-spacing-0)]" spacing="sm">
          <Button href={industriesContent.primaryCta.href} variant="outline">
            {industriesContent.primaryCta.label}
          </Button>
        </SectionLayout>
      </div>

      <div id="why-worksync">
        <WhyWorkSync
          description={whyWorkSyncContent.description}
          features={whyWorkSync}
          title={whyWorkSyncContent.headline}
        />
        <SectionLayout className="pt-[var(--ws-spacing-0)]" spacing="sm">
          <Button href={whyWorkSyncContent.primaryCta.href} variant="outline">
            {whyWorkSyncContent.primaryCta.label}
          </Button>
        </SectionLayout>
      </div>

      <div id="process">
        <RecruitmentProcess
          description={process.description}
          steps={process.steps}
          title={process.headline}
        />
        <SectionLayout className="pt-[var(--ws-spacing-0)]" spacing="sm" tone="surface">
          <Button href={process.primaryCta.href} variant="outline">
            {process.primaryCta.label}
          </Button>
        </SectionLayout>
      </div>

      <div id="technology">
        <SectionLayout animate spacing="lg" tone="secondary">
          <div className="grid items-center gap-[var(--ws-spacing-48)] lg:grid-cols-2">
            <div className="max-w-[var(--ws-breakpoints-content-md)]">
              <p className={eyebrowClassName}>{technology.eyebrow}</p>
              <Heading as="h2" level="h2">
                {technology.headline}
              </Heading>
              <Paragraph className="mt-[var(--ws-spacing-16)]" muted size="large">
                {technology.description}
              </Paragraph>
              <div className="mt-[var(--ws-spacing-24)] flex flex-wrap gap-[var(--ws-spacing-8)]">
                <Button href={technology.primaryCta.href}>{technology.primaryCta.label}</Button>
                <Button href={technology.secondaryCta.href} variant="outline">
                  {technology.secondaryCta.label}
                </Button>
              </div>
              <div className="mt-[var(--ws-spacing-32)] grid gap-[var(--ws-spacing-16)] sm:grid-cols-3">
                {technologyItems.map((item) => (
                  <FeatureCard {...item} className="p-[var(--ws-spacing-16)]" key={item.title} />
                ))}
              </div>
            </div>
            <ResponsiveImage {...technology.media} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </SectionLayout>
      </div>

      <div id="statistics">
        <Statistics
          description={statistics.description}
          items={statistics.items}
          title={statistics.headline}
        />
      </div>

      <div id="testimonials">
        <Testimonials
          description={testimonials.description}
          items={testimonials.items}
          title={testimonials.headline}
        />
        <SectionLayout className="pt-[var(--ws-spacing-0)]" spacing="sm" tone="surface">
          <Button href={testimonials.primaryCta.href} variant="outline">
            {testimonials.primaryCta.label}
          </Button>
        </SectionLayout>
      </div>

      <div id="faq">
        <FAQ description={faq.description} items={faq.items} title={faq.headline} />
        <SectionLayout className="pt-[var(--ws-spacing-0)]" spacing="sm">
          <Button href={faq.primaryCta.href} variant="outline">
            {faq.primaryCta.label}
          </Button>
        </SectionLayout>
      </div>

      <div id="contact">
        <CTA
          actions={
            <>
              <Button href={finalCta.primaryCta.href} variant="outline">
                {finalCta.primaryCta.label}
              </Button>
              <Button href={finalCta.secondaryCta.href} variant="secondary">
                {finalCta.secondaryCta.label}
              </Button>
            </>
          }
          description={finalCta.description}
          title={finalCta.headline}
        />
      </div>
    </PageLayout>
  );
}
