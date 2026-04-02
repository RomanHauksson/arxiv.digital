import type { MDXComponents } from "mdx/types";

// UI Components
import { Authors } from "@/components/authors";
// Carousel (custom from-scratch implementation)
import { Carousel } from "@/components/carousel";
import { Comparison } from "@/components/comparison";
import { Figure } from "@/components/figure";
import { HighlightedSection } from "@/components/highlighted-section";
import { Links } from "@/components/links";
import { Notes } from "@/components/notes";
import { Picture } from "@/components/picture";
import { SmallCaps } from "@/components/small-caps";
import { TableWrapper } from "@/components/table-wrapper";
import { TwoColumns } from "@/components/two-columns";
// Shadcn components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video } from "@/components/video";
import { Wide } from "@/components/wide";
import { YouTubeVideo } from "@/components/youtube-video";

export const mdxComponents: MDXComponents = {
  // Typography
  SmallCaps,

  // Authors & Links
  Authors,
  Links,
  Notes,

  // Media
  Picture,
  Video,
  YouTubeVideo,
  Figure,

  // Layout
  HighlightedSection,
  Wide,
  TwoColumns,

  // Carousel
  Carousel,

  // Comparison
  Comparison,

  // Table override
  table: TableWrapper,

  // Tabs (Shadcn)
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
};
