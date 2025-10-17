import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentPath = path.resolve(
  __dirname,
  "../src/components/intro/SlideZeroIntro.tsx"
);
const stylesPath = path.resolve(
  __dirname,
  "../src/components/intro/SlideZeroIntro.module.css"
);

const componentSource = fs.readFileSync(componentPath, "utf8");
const stylesSource = fs.readFileSync(stylesPath, "utf8");

const assertions = [];

const assert = (condition, message) => {
  if (!condition) {
    assertions.push({ message, status: "failed" });
  } else {
    assertions.push({ message, status: "passed" });
  }
};

assert(
  /PREFERRED_TIMELINE\s*=\s*\[2000,\s*3200,\s*4800\]/.test(componentSource),
  "Preferred timeline matches the cinematic sequence"
);

[
  "Hydration",
  "Barrier",
  "Redness",
  "Even Tone"
].forEach((label) => {
  assert(
    componentSource.includes(label),
    `Component renders the ${label} metric`
  );
});

assert(
  componentSource.includes("Analyzing photo…"),
  "Progress ring label is present"
);

assert(
  stylesSource.includes(".phaseFinal .brandLayer"),
  "Final phase styles reveal brand layer"
);

assert(
  stylesSource.includes(".phaseDashboard .screenTrack"),
  "Dashboard phase slides the track"
);

const failures = assertions.filter((item) => item.status === "failed");

assertions.forEach(({ status, message }) => {
  console.log(`${status === "passed" ? "✓" : "✗"} ${message}`);
});

if (failures.length > 0) {
  console.error(`\n${failures.length} assertion(s) failed.`);
  process.exitCode = 1;
} else {
  console.log("\nAll Slide 0 intro assertions passed.");
}
