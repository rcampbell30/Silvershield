import { mkdir, rm, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, statSync, readFileSync } from "node:fs";
import { deflateRawSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const packageDir = join(root, "packages");
const outputPath = join(packageDir, "silver-shield-extension-v0.1.0.zip");

await mkdir(packageDir, { recursive: true });
await rm(outputPath, { force: true });

const files = listFiles(distDir);
await createZip(outputPath, files.map((absolutePath) => ({
  absolutePath,
  zipPath: relative(distDir, absolutePath).replace(/\\/g, "/"),
})));

console.log(`Packaged ${files.length} files into ${relative(root, outputPath)}`);

function listFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const absolutePath = join(dir, entry);
    const stat = statSync(absolutePath);
    if (stat.isDirectory()) {
      results.push(...listFiles(absolutePath));
    } else {
      results.push(absolutePath);
    }
  }
  return results;
}

async function createZip(output, entries) {
  const chunks = [];
  const centralDirectory = [];
  let offset = 0;

  for (const entry of entries) {
    const data = readFileSync(entry.absolutePath);
    const compressed = deflateRawSync(data);
    const fileName = Buffer.from(entry.zipPath);
    const crc = crc32(data);
    const localHeader = createLocalHeader(fileName, crc, compressed.length, data.length);
    const centralHeader = createCentralHeader(fileName, crc, compressed.length, data.length, offset);

    chunks.push(localHeader, fileName, compressed);
    centralDirectory.push(centralHeader, fileName);
    offset += localHeader.length + fileName.length + compressed.length;
  }

  const centralStart = offset;
  const centralBuffers = centralDirectory.flat();
  const centralSize = centralBuffers.reduce((sum, buffer) => sum + buffer.length, 0);
  const end = createEndRecord(entries.length, centralSize, centralStart);

  const stream = createWriteStream(output);
  for (const chunk of [...chunks, ...centralBuffers, end]) {
    stream.write(chunk);
  }
  stream.end();

  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

function createLocalHeader(fileName, crc, compressedSize, uncompressedSize) {
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(0, 6);
  header.writeUInt16LE(8, 8);
  header.writeUInt16LE(0, 10);
  header.writeUInt16LE(0, 12);
  header.writeUInt32LE(crc, 14);
  header.writeUInt32LE(compressedSize, 18);
  header.writeUInt32LE(uncompressedSize, 22);
  header.writeUInt16LE(fileName.length, 26);
  header.writeUInt16LE(0, 28);
  return header;
}

function createCentralHeader(fileName, crc, compressedSize, uncompressedSize, offset) {
  const header = Buffer.alloc(46);
  header.writeUInt32LE(0x02014b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(20, 6);
  header.writeUInt16LE(0, 8);
  header.writeUInt16LE(8, 10);
  header.writeUInt16LE(0, 12);
  header.writeUInt16LE(0, 14);
  header.writeUInt32LE(crc, 16);
  header.writeUInt32LE(compressedSize, 20);
  header.writeUInt32LE(uncompressedSize, 24);
  header.writeUInt16LE(fileName.length, 28);
  header.writeUInt16LE(0, 30);
  header.writeUInt16LE(0, 32);
  header.writeUInt16LE(0, 34);
  header.writeUInt16LE(0, 36);
  header.writeUInt32LE(0, 38);
  header.writeUInt32LE(offset, 42);
  return header;
}

function createEndRecord(fileCount, centralSize, centralStart) {
  const record = Buffer.alloc(22);
  record.writeUInt32LE(0x06054b50, 0);
  record.writeUInt16LE(0, 4);
  record.writeUInt16LE(0, 6);
  record.writeUInt16LE(fileCount, 8);
  record.writeUInt16LE(fileCount, 10);
  record.writeUInt32LE(centralSize, 12);
  record.writeUInt32LE(centralStart, 16);
  record.writeUInt16LE(0, 20);
  return record;
}

function crc32(buffer) {
  let crc = -1;
  for (const byte of buffer) {
    crc = (crc >>> 8) ^ table[(crc ^ byte) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const table = Array.from({ length: 256 }, (_, index) => {
  let c = index;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return c >>> 0;
});
