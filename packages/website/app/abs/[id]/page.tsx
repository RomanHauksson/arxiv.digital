import { Suspense } from "react";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import type { MDXRemoteOptions, MDXComponents } from "next-mdx-remote-client/rsc";
import { Sandbox } from "@e2b/code-interpreter";

const getSourceSomeHow = async (id: string) => {
const sandbox = await Sandbox.create("template-tag-dev", {
  envs: { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY },
});

await sandbox.commands.run(
  `curl -L -o /tmp/latex.tar.gz https://arxiv.org/src/${id} && mkdir -p /home/user/latex && tar xzf /tmp/latex.tar.gz -C /home/user/latex`,
);

const THREE_MINUTES_MS = 3 * 60 * 1000;

const result = await sandbox.commands.run(
  `opencode --model anthropic/claude-haiku-4-5 run "Starting from the ~/template/ repository, create a website for the paper whose LaTeX source is in ~/latex/." Just try making a first draft, do not spend more than 1 minute on this.`,
  { timeoutMs: THREE_MINUTES_MS, requestTimeoutMs: THREE_MINUTES_MS },
);

// download the file in page.mdx in the e2b sandbox and return its content as text
const file = await sandbox.commands.run(
  `cat /home/user/page.mdx`,
);

console.log(file.stdout);
await sandbox.kill();
return file.stdout;
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (<Suspense fallback={<div>Loading...</div>}>
    <PageContent id={id} />;
  </Suspense>)
}

async function PageContent({ id }: { id: string }) {
  const source = await getSourceSomeHow(id);
  
  const options: MDXRemoteOptions = {
    mdxOptions: {
      // ...
    },
    parseFrontmatter: true,
    scope: {
      readingTime: 0,
    },
  };

  return (
    <MDXRemote
      source={source}
      options={options}
      components={components}
      onError={ErrorComponent}
    />);
}

const ErrorComponent = () => {
  return <div>Error</div>;
}

const Test = () => {
  return <div>Test</div>;
}

const components: MDXComponents = { 
  Test,
  wrapper: function ({ children }: React.ComponentPropsWithoutRef<"div">) {
    return <div className="mdx-wrapper">{children}</div>;
  },
}


declare module "bun" {
  interface Env {
    ANTHROPIC_API_KEY: string;
  }
}
