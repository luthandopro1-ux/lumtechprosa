#!/usr/bin/env node
// Post-install hook: clears Vite's optimized-deps cache to prevent stale
// 504 errors (e.g. GET /node_modules/.vite/deps/<pkg>.js?v=... → 504) that
// occur when new packages are added but Vite is still serving pre-existing
// dependency bundles from a prior dev session.
import { rmSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const targets = [
  resolve(root, "node_modules/.vite"),
  resolve(root, "node_modules/.vite-temp"),
];

let cleared = false;
for (const dir of targets) {
  if (existsSync(dir)) {
    try {
      rmSync(dir, { recursive: true, force: true });
      console.log(`[postinstall] cleared ${dir}`);
      cleared = true;
    } catch (err) {
      console.warn(`[postinstall] could not clear ${dir}:`, err?.message ?? err);
    }
  }
}

if (cleared) {
  console.log(
    "[postinstall] Vite optimized-deps cache cleared. If the preview shows a 504 for /node_modules/.vite/deps/*, restart the dev server.",
  );
}
