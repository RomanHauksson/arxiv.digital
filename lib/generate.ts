import { Sandbox } from "@e2b/code-interpreter";

declare module "bun" {
  interface Env {
    ANTHROPIC_API_KEY: string;
  }
}

const sandbox = await Sandbox.create("opencode", {
  envs: { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY },
});

const check = await sandbox.commands.run('echo "KEY=$ANTHROPIC_API_KEY"');
console.log(check.stdout);

const result = await sandbox.commands.run(
  `opencode run "Create a hello world HTTP server in Go"`,
);

console.log(result);
await sandbox.kill();

// const id = "1706.03762";

// await sandbox.commands.run(
//   `curl -L -o /tmp/source.tar.gz https://arxiv.org/src/${id} && mkdir -p /home/user/source && tar xzf /tmp/source.tar.gz -C /home/user/source`,
// );

// const files = await sandbox.files.list("/");
// console.log(files);
