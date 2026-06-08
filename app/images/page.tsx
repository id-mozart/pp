import fs from "fs";
import path from "path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Усі зображення джерела",
  description: "Галерея всіх зображень проєкту з їх назвами.",
  robots: { index: false },
};

const EXTS = [".webp", ".jpg", ".jpeg", ".png", ".svg", ".avif", ".gif"];

type Img = { name: string; url: string; kb: number };

function listImages(rel: string, urlBase: string): Img[] {
  const abs = path.join(process.cwd(), "public", rel);
  let files: string[] = [];
  try {
    files = fs.readdirSync(abs);
  } catch {
    return [];
  }
  return files
    .filter((f) => EXTS.includes(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map((f) => {
      let kb = 0;
      try {
        kb = Math.round(fs.statSync(path.join(abs, f)).size / 1024);
      } catch {
        /* ignore */
      }
      return { name: f, url: `${urlBase}/${f}`, kb };
    });
}

const tileBg =
  "repeating-conic-gradient(rgb(0 0 0 / 0.06) 0% 25%, transparent 0% 50%) 50% / 18px 18px";

function Gallery({ images }: { images: Img[] }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((img) => (
        <figure key={img.url} className="surface overflow-hidden">
          <div
            className="grid aspect-[4/3] place-items-center p-3"
            style={{ background: tileBg, backgroundColor: "#f3f1ec" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.name}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
            />
          </div>
          <figcaption className="flex items-center justify-between gap-2 border-t border-line/50 px-3 py-2.5">
            <code className="truncate font-mono text-xs text-ink" title={img.name}>
              {img.name}
            </code>
            <span className="shrink-0 font-mono text-[0.65rem] text-faint">
              {img.kb} КБ
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function ImagesPage() {
  const brand = listImages("brand", "/brand");
  const placeholders = listImages("brand/ph", "/brand/ph");

  return (
    <section className="container-shell pb-24 pt-32 sm:pt-40">
      <header className="mb-12 max-w-2xl">
        <span className="eyebrow">Ассети проєкту</span>
        <h1 className="mt-4 text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-ink">
          Усі зображення джерела
        </h1>
        <p className="mt-3 text-lg text-muted">
          {brand.length} реальних зображень із джерела (tetianapansales.com) у{" "}
          <code className="font-mono text-sm text-gold">/public/brand</code>, та{" "}
          {placeholders.length} тимчасових плейсхолдерів. Назва файлу — під кожним
          зображенням.
        </p>
      </header>

      <div className="mb-6 flex items-baseline gap-3">
        <h2 className="text-xl text-ink">Із джерела</h2>
        <span className="font-mono text-xs text-faint">/brand · {brand.length}</span>
      </div>
      <Gallery images={brand} />

      {placeholders.length > 0 && (
        <>
          <div className="mb-6 mt-16 flex items-baseline gap-3">
            <h2 className="text-xl text-ink">Плейсхолдери (під заміну)</h2>
            <span className="font-mono text-xs text-faint">
              /brand/ph · {placeholders.length}
            </span>
          </div>
          <Gallery images={placeholders} />
        </>
      )}
    </section>
  );
}
