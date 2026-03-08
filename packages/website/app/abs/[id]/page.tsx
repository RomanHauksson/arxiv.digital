import { Suspense } from "react";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import type { MDXRemoteOptions, MDXComponents } from "next-mdx-remote-client/rsc";
import { getSourceSomeHow } from "@/app/abs/[id]/generate"

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
