import fs from "fs";
import path from "path";

const OUT_DIR = "public/uploads/article-covers";
const UA = "FigureForgeBot/1.0 (https://figureforge.ir; info@figureforge.ir)";

// slug -> Commons search query
const QUERIES = {
  "buying-guide-anime-figures": "anime figures collection",
  "top-10-marvel-figures-collectors": "Marvel action figures toys",
  "receive-figures-safely": "cardboard boxes shipping package",
  "movie-figures-that-make-a-collection": "action figure toys collection",
  "trusted-figure-brands": "Nendoroid figure",
  "shelving-and-display-ideas": "display shelf collectibles room",
  "top-10-figures-2026": "figurine collectible toy",
  "new-anime-figures-preorder": "toy store action figures",
  "original-vs-knockoff": "plastic model kit parts assembly",
  "figure-care-guide": "figurine glass display case",
  "theme-collections-ideas": "LEGO minifigures collection",
  "preorder-tips-2026-08-19": "online shopping parcel delivery",
};

async function searchCommons(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      format: "json",
      generator: "search",
      gsrsearch: `${query} filemime:image/jpeg`,
      gsrnamespace: "6",
      gsrlimit: "12",
      prop: "imageinfo",
      iiprop: "url|size|mime|extmetadata",
      iiurlwidth: "1400",
    }).toString();
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return [];
  const json = await res.json();
  const pages = Object.values(json?.query?.pages ?? {});
  return pages
    .map((p) => p.imageinfo?.[0])
    .filter(Boolean)
    .filter((ii) => ii.mime === "image/jpeg")
    .filter((ii) => ii.width >= 1000 && ii.height >= 650)
    .filter((ii) => {
      const ar = ii.width / ii.height;
      return ar >= 1.15 && ar <= 2.4;
    })
    .sort((a, b) => b.width - a.width);
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 40_000) throw new Error(`too small (${buf.length}b)`);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const used = new Set();
  const report = [];

  for (const [slug, query] of Object.entries(QUERIES)) {
    const dest = path.join(OUT_DIR, `${slug}.jpg`);
    if (fs.existsSync(dest)) {
      console.log(`skip ${slug} (exists)`);
      continue;
    }
    let done = false;
    try {
      const candidates = await searchCommons(query);
      for (const ii of candidates.slice(0, 5)) {
        if (used.has(ii.thumburl)) continue;
        try {
          const size = await download(ii.thumburl, dest);
          used.add(ii.thumburl);
          const license = ii.extmetadata?.LicenseShortName?.value ?? "?";
          const artist = (ii.extmetadata?.Artist?.value ?? "?").replace(/<[^>]+>/g, "").slice(0, 60);
          console.log(`OK   ${slug}.jpg (${Math.round(size / 1024)}kb) ← ${ii.descriptionshorturl ?? ""} [${license}] by ${artist}`);
          report.push({ slug, file: path.basename(ii.thumburl), license, artist });
          done = true;
          break;
        } catch (e) {
          console.log(`  retry ${slug}: ${e.message}`);
        }
      }
    } catch (e) {
      console.log(`search failed ${slug}: ${e.message}`);
    }
    if (!done) console.log(`MISS ${slug} — no suitable image`);
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "CREDITS.json"),
    JSON.stringify(report, null, 2),
  );
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
