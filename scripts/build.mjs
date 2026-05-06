import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, readdirSync, statSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");
const distDir = join(root, "dist");
const brandDir = join(root, "assets", "brand");

const fallbackIconPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABCklEQVR4nNWWvQ2DMBCFH1FWYAdmoE7LGFSR6DIFXSSqjJGWmhnYASldqhRJBSLId747B4hfZQmb992Pf5LH8/XGjjrsaf4XAMeQxV0/TOM8S7cBmJuer/dp3FSFCSSRNuFoPDd1aQSRwrAAVLRSSbLiBJBGCwBtXeJ0uZlBSADOvK1L8hsF01SFE0DUhJwhN9eXGWCjc4CKngTIs/Srm9fU7idhHACSZrKuiSMDIeJ2AAuw1U6IpwSaRtTMZQGWZZD8eD7HV39A+B5wXU6u+0FrDghL4GrIZTYs5mIAH4TVXAXgg7BKvQ2580EbvQmAgrCYmwGWEFZzQPEsp9T1g9n8JwChiucuWEsfqnWDpkuxrd0AAAAASUVORK5CYII=";

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

await cp(join(root, "manifest.json"), join(distDir, "manifest.json"));
await cp(join(root, "public"), distDir, { recursive: true });
await copySourceFiles(srcDir, distDir);
await copyBrandAssets();
await writeExtensionIcons();
await writeBundledContentScript();

console.log("Built Silver Shield extension into dist/");

async function copySourceFiles(fromDir, toDir) {
  for (const entry of readdirSync(fromDir)) {
    const from = join(fromDir, entry);
    const stat = statSync(from);
    if (stat.isDirectory()) {
      await copySourceFiles(from, join(toDir, entry));
      continue;
    }

    const ext = extname(entry);
    const targetName = ext === ".ts" ? entry.replace(/\.ts$/, ".js") : entry;
    const target = join(toDir, targetName);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, await readFile(from, "utf8"));
  }
}

async function copyBrandAssets() {
  if (!existsSync(brandDir)) return;
  await mkdir(join(distDir, "assets"), { recursive: true });
  await cp(brandDir, join(distDir, "assets", "brand"), { recursive: true });
}

async function writeExtensionIcons() {
  const iconDir = join(distDir, "icons");
  await mkdir(iconDir, { recursive: true });

  const sizes = [16, 32, 48, 128];
  for (const size of sizes) {
    const target = join(iconDir, `icon-${size}.png`);
    const explicitBrandIcon = join(brandDir, "icons", `icon-${size}.png`);
    const sharedBrandIcon = join(brandDir, "silver-shield-icon.png");
    const publicIcon = join(root, "public", "icons", `icon-${size}.png`);

    if (existsSync(explicitBrandIcon)) {
      await cp(explicitBrandIcon, target);
    } else if (existsSync(sharedBrandIcon)) {
      await cp(sharedBrandIcon, target);
    } else if (existsSync(publicIcon)) {
      await cp(publicIcon, target);
    } else {
      await writeFile(target, Buffer.from(fallbackIconPngBase64, "base64"));
    }
  }
}

async function writeBundledContentScript() {
  const files = [
    "src/shared/constants.ts",
    "src/shared/scamRules.ts",
    "src/shared/storage.ts",
    "src/shared/riskScoring.ts",
    "src/content/warningBanner.ts",
    "src/content/contentScript.ts",
  ];

  const parts = [];
  for (const file of files) {
    const source = await readFile(join(root, file), "utf8");
    parts.push(`\n// ${relative(root, join(root, file))}\n${toClassicScript(source)}`);
  }

  const wrapped = `(() => {\n\"use strict\";\n${parts.join("\n")}\n})();\n`;
  await writeFile(join(distDir, "content", "contentScript.js"), wrapped);
}

function toClassicScript(source) {
  return source
    .replace(/^import .*?;\n/gm, "")
    .replace(/^export \{\};\n/gm, "")
    .replace(/export\s+(async\s+function|const|let|var|function|class)\s/g, "$1 ");
}
