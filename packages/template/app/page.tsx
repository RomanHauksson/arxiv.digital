import fs from "node:fs";
import path from "node:path";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import type { MDXRemoteOptions } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/mdx-components";

const mdxOptions: MDXRemoteOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
};

export default async function Page() {
  const source = fs.readFileSync(
    path.join(process.cwd(), "app", "content.mdx"),
    "utf-8",
  );

  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={mdxOptions}
    />
  );
}
