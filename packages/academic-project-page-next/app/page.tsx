import fs from "node:fs";
import path from "node:path";
import type { MDXRemoteOptions } from "next-mdx-remote-client/rsc";
import { evaluate, type EvaluateOptions } from "next-mdx-remote-client/rsc";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/mdx-components";

const mdxOptions: MDXRemoteOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
};
// TODO: export a metadata object for this page that includes the title and description

export default async function Page() {
  const source = fs.readFileSync(
    path.join(process.cwd(), "app", "content.mdx"),
    "utf-8",
  );

  const options: EvaluateOptions = {
    mdxOptions: {
      remarkPlugins: [remarkGfm
      ],
    },
    parseFrontmatter: true,
  };

  const { content, frontmatter, scope, error } = await evaluate({
    source,
    options,
    // components,
  });

  return (
    <article>
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={mdxOptions}
      />
    </article>
  );
}
