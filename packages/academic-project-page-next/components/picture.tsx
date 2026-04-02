import Image from "next/image";
import { cn } from "@/lib/utils";

interface PictureProps {
  src: string;
  alt: string;
  priority?: boolean;
  invertInDarkMode?: boolean;
}

export function Picture({
  src,
  alt,
  priority = false,
  invertInDarkMode = false,
}: PictureProps) {
  return (
    <Image
      className={cn(
        "rounded-lg max-h-[calc(100svh-3rem)] max-w-full w-auto mx-auto h-auto",
        invertInDarkMode && "dark:invert",
      )}
      src={src}
      alt={alt}
      width={1200}
      height={800}
      priority={priority}
    />
  );
}
