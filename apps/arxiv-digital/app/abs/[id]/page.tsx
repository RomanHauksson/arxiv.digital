import { MDXRemote } from "next-mdx-remote-client/rsc";
import type { MDXRemoteOptions, MDXComponents } from "next-mdx-remote-client/rsc";
import { SmallCaps } from "@template/components/small-caps";
import { PaperSwitcher } from "./paper-switcher";
import { getMdx } from "./storage";

const ARXIV_HTML_BASE = "https://arxiv.org/html";

const components: MDXComponents = {
  SmallCaps,
  wrapper: function ({ children }: React.ComponentPropsWithoutRef<"div">) {
    return <div className="mdx-wrapper">{children}</div>;
  },
};

const mdxOptions: MDXRemoteOptions = {
  mdxOptions: {},
  parseFrontmatter: true,
  scope: {
    readingTime: 0,
  },
};

const ErrorComponent = () => {
  return <div>Error rendering paper</div>;
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Check if a generated version already exists in storage
  const cachedMdx = await getMdx(id);

  if (cachedMdx) {
    // Cache hit — render MDX server-side and pass to the switcher
    return (
      <PaperSwitcher
        id={id}
        arxivHtmlBase={ARXIV_HTML_BASE}
        customSlot={
          <MDXRemote
            source={cachedMdx}
            options={mdxOptions}
            components={components}
            onError={ErrorComponent}
          />
        }
      />
    );
  }

  // Cache miss — PaperSwitcher will connect to SSE for progress,
  // then router.refresh() will re-render this page once generation
  // is complete (at which point cachedMdx will be available).
  return <PaperSwitcher id={id} arxivHtmlBase={ARXIV_HTML_BASE} />;
}
