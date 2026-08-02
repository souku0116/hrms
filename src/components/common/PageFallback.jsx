import Loader from "@/components/ui/Loader";

export default function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader label="Loading page" size="md" />
    </div>
  );
}
