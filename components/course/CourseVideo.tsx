"use client";

import { useState } from "react";
import { Play } from "@/components/ui/icons";
import { CARD_BG } from "@/lib/ember";

/**
 * Плеєр уроку. Відео лежать на окремому хостингу (NEXT_PUBLIC_COURSE_VIDEO_BASE);
 * без нього — акуратна заглушка, щоб розділ можна було показати до викладання відео.
 * Завантаження і PiP вимкнено, контекстне меню заблоковано — за побажанням авторки
 * (повний захист від запису екрана веб не дає, але «зберегти як» прибрано).
 */
export function CourseVideo({ src, caption }: { src: string; caption?: string }) {
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
          onContextMenu={(e) => e.preventDefault()}
          onError={() => setErr(true)}
          src={src}
        />
      ) : (
        <div className="grid aspect-video w-full place-items-center bg-[#0B0805] text-center">
          <div className="flex flex-col items-center gap-3 px-6">
            <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/50 text-gold">
              <Play className="h-6 w-6" />
            </span>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-faint">
              Відео буде доступне найближчим часом
            </span>
          </div>
        </div>
      )}
      {caption && <figcaption className="px-5 py-3 text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}
