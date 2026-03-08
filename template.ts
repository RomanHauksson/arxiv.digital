import { Template, waitForTimeout, defaultBuildLogger } from "e2b";

const template = Template()
  .fromTemplate("opencode")
  .copy("packages/template", "/home/user/template")
  .setStartCmd(
    "curl -fsSL https://bun.sh/install | bash && export BUN_INSTALL=\"$HOME/.bun\" && export PATH=\"$BUN_INSTALL/bin:$PATH\" && cd /home/user/template && bun install",
    waitForTimeout(60_000)
  );

async function main() {
  await Template.build(template, "template-tag-dev", {
    cpuCount: 1,
    memoryMB: 1024,
    onBuildLogs: defaultBuildLogger(),
  });
}

main().catch(console.error);
