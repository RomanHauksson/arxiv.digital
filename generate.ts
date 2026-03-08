import { Sandbox } from "@e2b/code-interpreter";

declare module "bun" {
  interface Env {
    ANTHROPIC_API_KEY: string;
  }
}

const sandbox = await Sandbox.create("template-tag-dev", {
  envs: { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY },
});

const id = "1706.03762";
await sandbox.commands.run(
  `curl -L -o /tmp/latex.tar.gz https://arxiv.org/src/${id} && mkdir -p /home/user/latex && tar xzf /tmp/latex.tar.gz -C /home/user/latex`,
);

const THREE_MINUTES_MS = 3 * 60 * 1000;

const result = await sandbox.commands.run(
  `opencode --model anthropic/claude-haiku-4-5 run "Starting from the ~/template/ repository, create a website for the paper whose LaTeX source is in ~/latex/." Just try making a first draft, do not spend more than 1 minute on this.`,
  { timeoutMs: THREE_MINUTES_MS, requestTimeoutMs: THREE_MINUTES_MS },
);

console.log(result);

await sandbox.kill();
