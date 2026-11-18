// Builds the site with the fictional sample data from tests/fixtures (CONTENT_FIXTURES=1), runs the
// filled-in layout tests, then ALWAYS rebuilds the real site so out/ never keeps sample data.
//   npm run test:fixtures
import { spawnSync } from "node:child_process";

const run = (cmd, args, env = {}) =>
  spawnSync(cmd, args, { stdio: "inherit", env: { ...process.env, ...env }, shell: process.platform === "win32" }).status ?? 1;

const fixtures = { CONTENT_FIXTURES: "1" };
let status = run("npx", ["next", "build"], fixtures);
if (status === 0) status = run("npx", ["playwright", "test", "tests/fixtures.spec.ts", "tests/features.spec.ts", "tests/a11y.spec.ts"], fixtures);

console.log("\nRebuilding the real site (without sample data)...");
const rebuild = run("npx", ["next", "build"]);
process.exit(status || rebuild);
