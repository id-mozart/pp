"use client";

import { useState } from "react";
import { Play } from "@/components/ui/icons";
import { CARD_BG } from "@/lib/ember";

/**
 * Плеєр уроку. Відео лежать на окремому хостингу (NEXT_PUBLIC_COURSE_VIDEO_BASE);
 * поки адресу немає — плейсхолдер з розмитим постером уроку, щоб розділ виглядав
 * завершеним і його можна було показувати. Завантаження і PiP вимкнено, контекстне
 * меню заблоковано — за побажанням авторки («зберегти як» прибрано; від запису
 * екрана веб не захищає).
 */
export function CourseVideo({ src, poster, caption }: { src: string; poster?: string; caption?: string }) {
  const [err, setErr] = useState(false);
  const ready = !!src && !err;
  return (
    <figure className="overflow-hidden rounded-[14px] border border-line/70" style={{ background: CARD_BG }}>
      {ready ? (
        <video
          className="aspect-video w-full bg-black"
          controls
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          playsInline
          preload="metadata"
          poster={poster}
          onContextMenu={(e) => e.preventDefault()}
          onError={() => setErr(true)}
          src={src}
        />
      ) : (
        <div
          className="relative grid aspect-video w-full place-items-center overflow-hidden bg-[#0B0805] text-center"
          style={poster ? { backgroundImage: `url(${poster})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
        >
          <div className="relative flex flex-col items-center gap-3 px-6">
            <span className="grid h-16 w-16 place-items-center rounded-full border border-gold/60 bg-[rgba(23,16,9,.6)] text-gold backdrop-blur-sm">
              <Play className="ml-0.5 h-7 w-7" />
            </span>
            <span className="rounded-full bg-[rgba(23,16,9,.7)] px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-ink/80 backdrop-blur-sm">
              Відео зʼявиться тут найближчим часом
            </span>
          </div>
        </div>
      )}
      {caption && <figcaption className="px-5 py-3 text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}
