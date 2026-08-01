import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

/** Standard section composition pairing semantic bands with the shared container. */
export default function SectionLayout({
  animate = false,
  children,
  className,
  containerClassName,
  containerSize,
  spacing,
  tone,
}) {
  return (
    <Section animate={animate} className={className} spacing={spacing} tone={tone}>
      <Container className={containerClassName} size={containerSize}>
        {children}
      </Container>
    </Section>
  );
}
