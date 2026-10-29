import { CourseVideo } from "@/components/course/CourseVideo";
import { ArrowUpRight, Download, Check } from "@/components/ui/icons";
import { GRAD_ACC, GRAD_GOLD, CARD_BG, gradText } from "@/lib/ember";
import { QUIZZES, QUIZ_HTML, VIDEO_BASE, type Block } from "@/lib/courses/messages";

const prose = "prose-course text-[1.02rem] leading-relaxed text-ink/90";

function Card({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div className="relative rounded-[14px] border border-line/70 p-6 sm:p-7" style={{ background: CARD_BG }}>
      {accent && <span aria-hidden className="absolute left-6 top-0 h-[3px] w-12 -translate-y-1/2 rounded-full" style={{ background: GRAD_GOLD }} />}
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em]" style={gradText(GRAD_ACC)}>{children}</div>;
}

export function CourseBlock({ b }: { b: Block }) {
  switch (b.kind) {
    case "text":
      return <div className={prose} dangerouslySetInnerHTML={{ __html: b.html }} />;
    case "video":
      return <CourseVideo src={VIDEO_BASE ? `${VIDEO_BASE.replace(/\/$/, "")}/${b.file}` : ""} poster={`/courses/messages/posters/${b.file.replace(/\.mp4$/, "")}.jpg`} caption={b.caption} />;
    case "images":
      return (
        <figure>
          <div className={b.items.length > 1 ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : ""}>
            {b.items.map((im) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={im.src}
                src={im.src}
                alt={im.alt}
                loading="lazy"
                draggable={false}
                className={`w-full rounded-[12px] border border-line/60 select-none ${im.tall ? "mx-auto max-w-[420px]" : ""}`}
              />
            ))}
          </div>
          {b.caption && <figcaption className="mt-3 text-sm leading-relaxed text-muted">{b.caption}</figcaption>}
        </figure>
      );
    case "homework":
      return (
        <Card accent>
          <Label>Домашка</Label>
          <div className={prose} dangerouslySetInnerHTML={{ __html: b.html }} />
        </Card>
      );
    case "quiz":
      return (
        <Card accent>
          <Label>Перевір себе · до 7 балів</Label>
          <div className={prose} dangerouslySetInnerHTML={{ __html: QUIZ_HTML }} />
          <a href={QUIZZES[b.n - 1]} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-4">
            {b.label} <ArrowUpRight className="h-4 w-4" />
          </a>
        </Card>
      );
    case "link":
      return (
        <Card>
          {b.note && <p className={`${prose} mb-4`}>{b.note}</p>}
          <a href={b.href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            {b.label} <ArrowUpRight className="h-4 w-4" />
          </a>
        </Card>
      );
    case "pdf":
      return (
        <Card accent>
          <Label>Бонус · PDF</Label>
          <h3 className="font-display text-xl leading-tight text-ink">{b.title}</h3>
          <div className={`${prose} mt-3`} dangerouslySetInnerHTML={{ __html: b.html }} />
          <a href={b.file} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-4">
            Відкрити PDF <Download className="h-4 w-4" />
          </a>
        </Card>
      );
    case "note":
      return (
        <div className="flex gap-3 rounded-[14px] border border-gold/30 bg-gold/[0.06] p-5 sm:p-6">
          <Check className="mt-1 h-5 w-5 shrink-0 text-gold" />
          <div className={prose} dangerouslySetInnerHTML={{ __html: b.html }} />
        </div>
      );
  }
}
