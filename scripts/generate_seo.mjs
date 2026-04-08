import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const docsDir = path.join(repoRoot, "docs");
const catalogPath = path.join(docsDir, "assets", "catalog", "catalog.json");
const cnamePath = path.join(docsDir, "CNAME");
const dataPath = path.join(docsDir, "data.js");
const robotsPath = path.join(docsDir, "robots.txt");
const sitemapPath = path.join(docsDir, "sitemap.xml");

function normalizeSiteUrl(value = "") {
  const normalized = String(value).trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");
  return normalized ? `https://${normalized}` : "";
}

function xmlEscape(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function readSiteUrl() {
  try {
    const cname = (await fs.readFile(cnamePath, "utf8")).trim();
    if (cname) {
      return normalizeSiteUrl(cname);
    }
  } catch (error) {
    // Fallback to data.js when CNAME is unavailable.
  }

  const dataContent = await fs.readFile(dataPath, "utf8");
  const match = dataContent.match(/siteUrl:\s*"([^"]+)"/);

  if (!match) {
    throw new Error("Не удалось определить siteUrl. Добавь docs/CNAME или siteUrl в docs/data.js.");
  }

  return normalizeSiteUrl(match[1]);
}

function buildUrlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    "  <url>",
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod ? `    <lastmod>${xmlEscape(lastmod)}</lastmod>` : "",
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : "",
    priority ? `    <priority>${priority}</priority>` : "",
    "  </url>"
  ]
    .filter(Boolean)
    .join("\n");
}

async function main() {
  const siteUrl = await readSiteUrl();
  const rawCatalog = JSON.parse(await fs.readFile(catalogPath, "utf8"));
  const generatedAt = String(rawCatalog.generatedAt || new Date().toISOString()).slice(0, 10);
  const products = Array.isArray(rawCatalog.products) ? rawCatalog.products : [];
  const uniqueSlugs = [...new Set(products.map((product) => product.slug).filter(Boolean))];

  const entries = [
    buildUrlEntry({
      loc: `${siteUrl}/`,
      lastmod: generatedAt,
      changefreq: "daily",
      priority: "1.0"
    }),
    ...uniqueSlugs.map((slug) =>
      buildUrlEntry({
        loc: `${siteUrl}/product.html?slug=${encodeURIComponent(slug)}`,
        lastmod: generatedAt,
        changefreq: "weekly",
        priority: "0.8"
      })
    )
  ];

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    ""
  ].join("\n");

  const robots = [`User-agent: *`, `Allow: /`, ``, `Sitemap: ${siteUrl}/sitemap.xml`, ``].join("\n");

  await fs.writeFile(sitemapPath, sitemap, "utf8");
  await fs.writeFile(robotsPath, robots, "utf8");

  console.log(`SEO files generated for ${siteUrl}. URLs: ${entries.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
