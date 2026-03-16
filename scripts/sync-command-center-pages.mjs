import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, "..");
const sourceDir = process.env.COMMAND_CENTER_SOURCE_DIR
  ? path.resolve(process.env.COMMAND_CENTER_SOURCE_DIR)
  : path.resolve(repoRoot, "..", "command-center");
const targetDir = process.env.COMMAND_CENTER_TARGET_DIR
  ? path.resolve(process.env.COMMAND_CENTER_TARGET_DIR)
  : path.resolve(repoRoot, "docs", "command-center");

const files = [
  "index.html",
  "ops-wall.html",
  "trends.html",
  "line-cards.html",
  "security.js",
];

function ensureReadable(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing source file: ${filePath}`);
  }
}

function syncFile(fileName) {
  const from = path.join(sourceDir, fileName);
  const to = path.join(targetDir, fileName);

  ensureReadable(from);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);

  return { fileName, from, to };
}

function main() {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source command-center directory not found: ${sourceDir}`);
  }

  const copied = files.map(syncFile);

  console.log(`Synced ${copied.length} files.`);
  console.log(`Source: ${sourceDir}`);
  console.log(`Target: ${targetDir}`);
  copied.forEach(({ fileName }) => console.log(` - ${fileName}`));
}

try {
  main();
} catch (error) {
  console.error(String(error));
  process.exit(1);
}
