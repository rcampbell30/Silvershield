import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, statSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");
const distDir = join(root, "dist");

const iconPngBase64 = {
  16: "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAvUlEQVR4nGN89/X3fwYKAAs+yWM3XsPZVhqixBmArCl70mY4e2qeL1aDGGFegGlE1sTAwMCwpzuVwaV0Nm6D3n39/f/d19//t5x99l8+fub/26/+4cXy8TP/bzn77D9MHxO+MCAGkGzA1DxflHCAG2ClIcowNc8Xxb/oAJsc/b2ADhjRU+KxG6/hUbmnOxUu7lI6G8P/WF0ACwuYJnyacXoBmyG4AM4wQDYEl+0MDFjCAB0cu/Eap2aiDCAEAIM6fQBpRlFZAAAAAElFTkSuQmCC",
  32: "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABCklEQVR4nNWWvQ2DMBCFH1FWYAdmoE7LGFSR6DIFXSSqjJGWmhnYASldqhRJBSLId747B4hfZQmb992Pf5LH8/XGjjrsaf4XAMeQxV0/TOM8S7cBmJuer/dp3FSFCSSRNuFoPDd1aQSRwrAAVLRSSbLiBJBGCwBtXeJ0uZlBSADOvK1L8hsF01SFE0DUhJwhN9eXGWCjc4CKngTIs/Srm9fU7idhHACSZrKuiSMDIeJ2AAuw1U6IpwSaRtTMZQGWZZD8eD7HV39A+B5wXU6u+0FrDghL4GrIZTYs5mIAH4TVXAXgg7BKvQ2580EbvQmAgrCYmwGWEFZzQPEsp9T1g9n8JwChiucuWEsfqnWDpkuxrd0AAAAASUVORK5CYII=",
  48: "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABfklEQVR4nO2ZMU7DQBBFXxBXyB1yhtS0OQYVUjpOQYeUimPQUucMuUMkOioKqBwZax3P7PzBtpxfWdFq89/O7M9YWX1+ff8wY92NbSCqG8DYmj3Afebmx9P58rzdrFO+Qw7QNv30+n55Pux3gB5kpYrRxnjbdEkNCGhgQgB9p22VoipugKjpkiJVMQNYW6Srj5dHHp7fzOu9VRkEiBjvKgPEBGA1XzJdkhXksN8NAkhi1Gq8tN5TlZKqAbymh/bpglhOHwyjxHaz/pMSU9PsZ6HlAkQvn2qv5VYgU9YEAiPAlJNokhXwaNkAiiSK7rHsCmTIk0DgAJhqEoUrEOlhxR2StFCNEdUo4gK41kYeQ31rvf0PFRWIQijNQ2ULqSrRqNY8BO5ADUTp84h5CF5iD0SGeRCkkAUiyzyIYlR9JzySjRKeX2rV6YN4FrJAKM1DwjB3DUJtHpKm0RJEhnlIHKfbEFnmQfgXU5+Op3OaefgHgGxN7o3MqxvA2Jo9wC9rgLOYo/eoXQAAAABJRU5ErkJggg==",
  128: "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADz0lEQVR4nO3dMU4cQRCF4R/LV+AOnIHYKccgskTmU5BZIuIYTok5A3dAcubIgR2gQYB6YZaZ7q6q9/4IEcCw9W33NFrYk99//v7DyfZl9gW4uRmAeAYgngGIZwDiGYB4BiCeAYhnAOIZgHgGIJ4BiGcA4hmAeF9nX8DM7h8enz8+PzudeCXzkgPwcujff/56/vjm6gLQg3Ci8oKQZfAvh95qgQAaGEoDOPRsX5sChnIAtg79UFW3iBIAeg29VbVVITWAtft6rypgSAdg5LP9mLJuESkARB16q2yrQmgAs5f4rWXAEA5Apmf7MUXdIkIAqDr0VtFWhWkAlIZ+qAgYhgOItq/fXV/y7cft7MuYtkUMARDt2X53fdn8fCQIMAZDVwARn+1ri4ShJ4TuAGYP/5iht5oN4ebqoiuAsq8H2Dr41teZjaFHpQDsNfSPvn4lCN1vAntvA72H/lE9MfRe/iHxCjB78EvZV4VUAKIMvVXWe4UUACIPvlWmVSEsgGxDb5VhVfAfhohnAOJ1B3B+dvrq99tuXSOOgBB4BYi6Z36myD9LWABuTAYgngGIZwDiGYB4QwD4KHhco46AEHwFiHx8Wlv0nyE0ANc/AxDPAMQzAPEMQLxhAHwUXNfIIyAkWAGiH6PeK8O1hwfg+mYA4hmAeAYgngGINxSAj4LvN/oICF4B5EsBIMN5+m1ZrjkFANcvAxDPAMQzAPGGA/BRsN2MIyB4BZAvDYAsxyrIda1pALg+GYB4BiBeKgAZ9tYM1/iyKQC2HAUjP8CfvbZZR0BItgIsRUQQ8ZrWlBIAxHrAI13LsaUFAE8P/OwHf/b339o0AHv+SnjWEPb4vjP3f5i8AmRGUGH4EGALyIigyvAhAADIhaDS8CHIO4cu7fnuInv/t/G9YEUaPgRZAZairgRVhw/BAEA8BJWHDwEBQBwE1YcPQQHAfAQKw4dgN4Gt9n7buTU3hyrDh8ArwNLeLyL9aLhKw4cEAGAcArXhQxIA0B+B4vAhEQDoh0B1+JDgJrBVhLelf1vG4UNSAPCEAAgBIevwITGApdmrQebhQ7J7gFYz/9Yw+/ChAACYg6DC8KEIABiLoMrwoRAAGIOg0vChGADoi6Da8KEgAOiDoOLwoSgA2BdB1eFDYQCwD4LKw4fiAGAbgurDBwEA8DkECsMHEQBwHAKV4YMQAFiHQGn4IAYA3kegNnwQBABtBIrDB1EA8BqB6vChwOsBtnb/8Cg7fDAA+WS3APeUAYhnAOIZgHgGIJ4BiGcA4hmAeAYgngGIZwDiGYB4BiCeAYj3H/Vsydro0Le2AAAAAElFTkSuQmCC",
};

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

await cp(join(root, "manifest.json"), join(distDir, "manifest.json"));
await cp(join(root, "public"), distDir, { recursive: true });
await copySourceFiles(srcDir, distDir);
await writeGeneratedIcons();
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

async function writeGeneratedIcons() {
  const iconDir = join(distDir, "icons");
  await mkdir(iconDir, { recursive: true });
  for (const [size, data] of Object.entries(iconPngBase64)) {
    await writeFile(join(iconDir, `icon-${size}.png`), Buffer.from(data, "base64"));
  }
}

async function writeBundledContentScript() {
  const files = [
    "src/shared/constants.ts",
    "src/shared/scamRules.ts",
    "src/shared/riskScoring.ts",
    "src/shared/storage.ts",
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
