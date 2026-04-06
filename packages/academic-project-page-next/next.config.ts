import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
	options: {
		remarkPlugins: ["remark-gfm"],
		rehypePlugins: [],
	},
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
