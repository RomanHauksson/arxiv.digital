import type { MDXComponents } from "mdx/types";
import { SmallCaps } from "@/components/small-caps";

const components: MDXComponents = {
  SmallCaps,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
