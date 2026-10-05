import { getImageProps } from "next/image";

/**
 * Gambar `fill` dengan art direction: sumber mobile (<640px) dan desktop dipilih browser lewat
 * <picture>, tanpa state JS. getImageProps memberi srcSet/sizes hasil optimizer Next yang sama
 * dengan <Image>. Untuk LCP (`priority`) dipasang fetchpriority=high + loading=eager.
 */
export function ArtDirectedImage({
  desktop,
  mobile,
  alt,
  className,
  priority = false,
  sizes = "100vw",
}: {
  desktop: string;
  mobile?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const common = { alt, fill: true as const, sizes, priority, className };
  const d = getImageProps({ ...common, src: desktop });
  const m =
    mobile && mobile !== desktop
      ? getImageProps({ ...common, src: mobile })
      : null;
  const MOBILE = "(max-width: 639px)";
  // getImageProps TIDAK menyetel fetchpriority/loading dan tidak membuat <link rel=preload>
  // seperti <Image priority>; keduanya dipasang manual. React 19 menghoist <link> ke <head>,
  // dan atribut `media` membuat browser hanya memuat varian yang sesuai viewport.
  return (
    <picture>
      {priority && m && (
        <link
          rel="preload"
          as="image"
          href={m.props.src}
          imageSrcSet={m.props.srcSet}
          imageSizes={m.props.sizes}
          media={MOBILE}
          fetchPriority="high"
        />
      )}
      {priority && (
        <link
          rel="preload"
          as="image"
          href={d.props.src}
          imageSrcSet={d.props.srcSet}
          imageSizes={d.props.sizes}
          media={m ? "(min-width: 640px)" : undefined}
          fetchPriority="high"
        />
      )}
      {m && (
        <source media={MOBILE} srcSet={m.props.srcSet} sizes={m.props.sizes} />
      )}
      <img
        {...d.props}
        alt={alt}
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? "eager" : "lazy"}
      />
    </picture>
  );
}
