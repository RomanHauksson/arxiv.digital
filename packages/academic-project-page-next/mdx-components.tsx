import type { MDXComponents } from "mdx/types";

import {
	Header,
	Title,
	Authors,
	Author,
	Conference,
	Notes,
	Links,
	Link,
} from "@/components/header";
import { Carousel } from "@/components/carousel";
import { Comparison } from "@/components/comparison";
import { Figure } from "@/components/figure";
import { HighlightedSection } from "@/components/highlighted-section";
import { Picture } from "@/components/picture";
import { SmallCaps } from "@/components/small-caps";
import { TableWrapper } from "@/components/table-wrapper";
import { TwoColumns } from "@/components/two-columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video } from "@/components/video";
import { Wide } from "@/components/wide";
import { YouTubeVideo } from "@/components/youtube-video";

export const components = {
	Header,
	Title,
	Authors,
	Author,
	Conference,
	Notes,
	Links,
	Link,
	SmallCaps,
	Picture,
	Video,
	YouTubeVideo,
	Figure,
	HighlightedSection,
	Wide,
	TwoColumns,
	Carousel,
	Comparison,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	table: TableWrapper,
} satisfies MDXComponents;

declare global {
	type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXComponents {
	return components;
}
