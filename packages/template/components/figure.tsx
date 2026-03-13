import type { ReactNode } from "react";

interface FigureProps {
  figure: ReactNode;
  caption?: ReactNode;
}

export function Figure({ figure, caption }: FigureProps) {
  return (
    <figure>
      <div className="flex w-full justify-center *:my-0">{figure}</div>
      {caption && <figcaption className="text-center">{caption}</figcaption>}
    </figure>
  );
}
