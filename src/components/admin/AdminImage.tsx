import Image from "next/image";

type AdminImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
};

function isLocalImage(src: string) {
  return src.startsWith("/");
}

export function AdminImage({ src, alt, className, fill, sizes, width = 1200, height = 800 }: AdminImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      unoptimized={!isLocalImage(src)}
    />
  );
}
