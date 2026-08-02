import Container from "@/components/ui/Container";

export default function AuthLayout({ children }) {
  return (
    <Container className="flex min-h-screen items-center justify-center py-[var(--ws-spacing-48)]">
      {children}
    </Container>
  );
}
