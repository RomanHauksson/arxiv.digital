import { Template, waitForTimeout, defaultBuildLogger } from "e2b";

const template = Template()
  .fromTemplate("opencode")
  .copy("packages/template", "/home/user/template")
  .setStartCmd("echo $HELLO", waitForTimeout(5_000));

async function main() {
  await Template.build(template, "template-tag-dev", {
    cpuCount: 1,
    memoryMB: 1024,
    onBuildLogs: defaultBuildLogger(),
  });
}

main().catch(console.error);
