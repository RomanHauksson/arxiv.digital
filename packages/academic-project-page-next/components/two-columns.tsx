import type { ReactNode } from "react";

interface TwoColumnsProps {
  left: ReactNode;
  right: ReactNode;
}

export function TwoColumns({ left, right }: TwoColumnsProps) {
  return (
    <div className="flex w-full flex-wrap items-stretch gap-4">
      <div className="min-w-[16rem] flex-1 *:first:mt-0 *:last:mb-0">
        {left}
      </div>
      <div className="min-w-[16rem] flex-1 *:first:mt-0 *:last:mb-0">
        {right}
      </div>
    </div>
  );
}
