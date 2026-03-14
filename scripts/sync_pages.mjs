import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const docsDir = path.join(repoRoot, "docs");

const htmlTargets = ["index.html", "product.html"];
const assetTargets = [
  "./styles.css",
  "./data.js",
  "./shared.js",
  "./script.js",
  "./product.js",
  "./assets/logo-white.png",
  "./assets/logo-dark.png"
];

function versionStamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Bishkek",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(date);

  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return `${values.year}${values.month}${values.day}-${values.hour}${values.minute}${values.second}`;
}

function replaceAssetVersion(markup, version) {
  return assetTargets.reduce((content, target) => {
    const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(${escaped})(\\?v=[^"'\\s>]+)?`, "g");
    return content.replace(pattern, `$1?v=${version}`);
  }, markup);
}

function updateHtmlFiles(directory, version) {
  htmlTargets.forEach((fileName) => {
    const filePath = path.join(directory, fileName);
    if (!fs.existsSync(filePath)) {
      return;
    }

    const original = fs.readFileSync(filePath, "utf8");
    const updated = replaceAssetVersion(original, version);
    fs.writeFileSync(filePath, updated);
  });
}

function updateDataFile(directory, version) {
  const dataPath = path.join(directory, "data.js");
  if (!fs.existsSync(dataPath)) {
    return;
  }

  const original = fs.readFileSync(dataPath, "utf8");
  const updated = original.match(/assetVersion:\s*"[^"]*"/)
    ? original.replace(/assetVersion:\s*"[^"]*"/, `assetVersion: "${version}"`)
    : original.replace('brandTagline: "Магазин спортивных товаров",', `brandTagline: "Магазин спортивных товаров",\n  assetVersion: "${version}",`);

  fs.writeFileSync(dataPath, updated);
}

function ensureDocsDir() {
  if (!fs.existsSync(docsDir)) {
    throw new Error("Папка docs не найдена. Сейчас сайт должен жить в docs.");
  }
}

const version = versionStamp();

ensureDocsDir();
updateDataFile(docsDir, version);
updateHtmlFiles(docsDir, version);

console.log(`Pages version updated in docs. Asset version: ${version}`);
