const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "public", "blog");

const COVERS = [
  { slug: "buying-guide-anime-figures", tag: "راهنما", title: "راهنمای خرید فیگور انیمه؛ از کجا شروع کنیم؟" },
  { slug: "top-10-marvel-figures-collectors", tag: "معرفی", title: "معرفی ۱۰ فیگور برتر مارول برای کلکسیونرها" },
  { slug: "receive-figures-safely", tag: "راهنما", title: "چگونه فیگورها را سالم تحویل بگیریم؟" },
  { slug: "movie-figures-that-make-a-collection", tag: "معرفی", title: "فیگورهای سینمایی که کلکسیون را خاص می‌کنند" },
  { slug: "trusted-figure-brands", tag: "دانستنی‌ها", title: "برندهای معتبر سازنده فیگور را بشناسید" },
  { slug: "shelving-and-display-ideas", tag: "ایده", title: "قفسه‌بندی و نمایش کلکسیون؛ ایده‌هایی برای دیوراما" },
  { slug: "top-10-figures-2026", tag: "ترند", title: "۱۰ فیگور برتر ۲۰۲۶ که باید همین حالا بخرید" },
  { slug: "new-anime-figures-preorder", tag: "اخبار", title: "فیگورهای جدید انیمه در راه‌اند؛ پیش‌سفارش چطور کار می‌کند؟" },
  { slug: "original-vs-knockoff", tag: "راهنما", title: "تفاوت فیگور اورجینال و کپی (نک) را چگونه تشخیص دهیم؟" },
  { slug: "figure-care-guide", tag: "راهنما", title: "راهنمای نگهداری فیگور؛ گردگیری، نور و رطوبت" },
  { slug: "theme-collections-ideas", tag: "ایده", title: "کلکسیون‌های تم؛ ایده‌های جذاب برای شروع" },
];

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function wrapTitle(title, maxLen) {
  const words = title.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > maxLen) {
      if (line) lines.push(line.trim());
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
  }
  if (line) lines.push(line.trim());
  return lines.slice(0, 4);
}

function buildSvg(cover) {
  const lines = wrapTitle(cover.title, 26);
  const fontSize = lines.length > 2 ? 44 : 54;
  const titleY = lines.length > 2 ? 350 : 360;
  const gap = fontSize + 18;
  const titleBlocks = lines
    .map(
      (l, i) =>
        `<text x="600" y="${titleY + i * gap}" text-anchor="middle" font-size="${fontSize}" font-weight="900" fill="#ffffff" font-family="Tahoma, 'Segoe UI', sans-serif" style="direction:rtl">${esc(l)}</text>`,
    )
    .join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3454d1"/>
      <stop offset="1" stop-color="#169ed9"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1040" cy="110" r="300" fill="url(#glow)"/>
  <circle cx="120" cy="560" r="260" fill="url(#glow)"/>
  <circle cx="1080" cy="540" r="90" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="3"/>
  <circle cx="90" cy="120" r="46" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="3"/>
  <circle cx="600" cy="52" r="8" fill="#ffffff" fill-opacity="0.35"/>
  <circle cx="540" cy="80" r="5" fill="#ffffff" fill-opacity="0.25"/>
  <circle cx="680" cy="66" r="4" fill="#ffffff" fill-opacity="0.3"/>
  <g transform="translate(600,150)">
    <rect x="-112" y="-26" width="224" height="46" rx="23" fill="#ffffff" fill-opacity="0.14"/>
    <text x="0" y="8" text-anchor="middle" font-size="24" font-weight="800" fill="#ffffff" font-family="Tahoma, 'Segoe UI', sans-serif" style="direction:rtl">${esc(cover.tag)}</text>
  </g>
  <text x="600" y="112" text-anchor="middle" font-size="20" font-weight="700" letter-spacing="4" fill="#ffffff" fill-opacity="0.85" font-family="Tahoma, 'Segoe UI', sans-serif">FIGURFORGE BLOG</text>
  ${titleBlocks}
  <text x="600" y="572" text-anchor="middle" font-size="17" font-weight="700" fill="#ffffff" fill-opacity="0.75" font-family="Tahoma, 'Segoe UI', sans-serif" style="direction:rtl">فیگرفورج؛ دنیای فیگورها</text>
</svg>
`;
}

fs.mkdirSync(OUT, { recursive: true });
for (const cover of COVERS) {
  fs.writeFileSync(path.join(OUT, `${cover.slug}.svg`), buildSvg(cover));
  console.log(`generated ${cover.slug}.svg`);
}
console.log(`Done: ${COVERS.length} covers -> public/blog/`);
