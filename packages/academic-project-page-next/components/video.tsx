import type { VideoHTMLAttributes } from "react";

interface VideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

export function Video({
  src,
  controls = true,
  loop = true,
  playsInline = true,
  muted = true,
  autoPlay = true,
  ...props
}: VideoProps) {
  return (
    <video
      className="aspect-video h-auto w-full rounded-lg"
      src={src}
      controls={controls}
      loop={loop}
      playsInline={playsInline}
      muted={muted}
      autoPlay={autoPlay}
      {...props}
    />
  );
}
