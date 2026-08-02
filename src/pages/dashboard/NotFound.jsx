import PageTitle from "@/components/common/PageTitle";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-[var(--ws-spacing-16)]">
      <PageTitle
        description="The page you are looking for does not exist."
        title="Page Not Found"
      />
    </div>
  );
}
