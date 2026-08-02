import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

const aspectRatios = {
  card: "aspect-[4/3]",
  dashboard: "aspect-[16/10]",
  hero: "aspect-[5/4]",
  portrait: "aspect-square",
  standard: "aspect-[3/2]",
  wide: "aspect-[16/9]",
};

/**
 * Media wrapper with stable tokenized placeholders until a local, CDN, or storage URL is available.
 * Pass `src` once an approved asset exists; an unavailable source automatically returns to the placeholder.
 * Supports responsive `srcSet`/`sizes` delivery and a reduced-motion-safe fade-in on load.
 */
export default function ResponsiveImage({
  alt,
  aspect = "wide",
  className,
  containerClassName,
  fallbackLabel = "Image placeholder",
  loading = "lazy",
  priority = false,
  sizes = "100vw",
  src,
  srcSet,
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const showImage = Boolean(src) && !hasError;

  useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--ws-radius-lg)] bg-[var(--ws-colors-surface-secondary)]",
        aspectRatios[aspect],
        containerClassName,
      )}
    >
      {showImage ? (
        <img
          alt={alt}
          className={cn(
            "ws-image-fade size-full object-cover",
            isLoaded && "ws-image-loaded",
            className,
          )}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          loading={priority ? "eager" : loading}
          onError={() => setHasError(true)}
          onLoad={() => setIsLoaded(true)}
          sizes={sizes}
          src={src}
          srcSet={srcSet}
        />
      ) : (
        <div
          aria-label={`${alt || fallbackLabel} placeholder`}
          className="flex size-full items-center justify-center bg-[var(--ws-colors-surface-secondary)] px-[var(--ws-spacing-24)] text-center"
          role="img"
        >
          <span className="rounded-[var(--ws-radius-full)] border border-[var(--ws-colors-border)] bg-[var(--ws-colors-background)] px-[var(--ws-spacing-16)] py-[var(--ws-spacing-8)] text-[length:var(--ws-typography-small-font-size)] text-[var(--ws-colors-muted)]">
            {fallbackLabel}
          </span>
        </div>
      )}
    </div>
  );
}
