"use client";

import { ReactCompareSlider } from "react-compare-slider";

interface ComparisonProps {
  itemOne: React.ReactNode;
  itemTwo: React.ReactNode;
}

export function Comparison({ itemOne, itemTwo }: ComparisonProps) {
  return (
    <ReactCompareSlider
      className="not-prose w-full rounded-lg"
      itemOne={itemOne}
      itemTwo={itemTwo}
    />
  );
}
