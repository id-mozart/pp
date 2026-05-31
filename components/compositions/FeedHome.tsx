"use client";

import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

const STORIES = [
  { t: "Метод", img: "/brand/ph/p5.jpg" },
  { t: "Кейси", img: "/brand/ph/p8.jpg" },
  { t: "Відгуки", img: "/brand/ph/p9.jpg" },
  { t: "B2B", img: "/brand/ph/p1.jpg" },
  { t: "Курси", img: "/brand/ph/p10.jpg" },
];

const POSTS = [
  { img: "/brand/ph/p3.jpg", cap: "Як писати повідомлення, на які відповідають 7 з 10", likes: "1.2k" },
  { img: "/brand/ph/p6.jpg", cap: "Без тиску. Без маніпуляцій.", likes: "980" },
  { img: "/brand/ph/p4.jpg", cap: "×5 продажів — реальний кейс", likes: "2.1k" },
  { img: "/brand/ph/p7.jpg", cap: "Переговори: як захистити ціну", likes: "760" },
  { img: "/brand/ph/p10.jpg", cap: "6 галузей, 15 000+ учнів", likes: "3.4k" },
  { img: "/brand/ph/p2.jpg", cap: "Структура продажів за 4 фази", likes: "1.5k" },
];

export function FeedHome() {
  return (
    <section className="container-shell max-w-3xl pb-20 pt-28">
      <Reveal className="flex flex-wrap items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/tania-portrait.jpg"
          alt="Тетяна Пан"
          className="h-20 w-20 rounded-full object-cover object-top ring-2 ring-gold ring-offset-2 ring-offset-canvas"
        />
        <div className="min-w-0">
          <p className="text-xl text-ink">
            @pan_partners <span className="text-gold">✦</span>
          </p>
          <p className="text-sm text-muted">Тетяна Пан · B2B продажі та переговори</p>
          <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted">
            <span>
              <b className="text-ink">15 000+</b> учнів
            </span>
            <span>
              <b className="text-ink">25+</b> років
            </span>
            <span>
              <b className="text-ink">90%</b> повертаються
            </span>
          </div>
        </div>
        <Link href="/consultation#book" className="btn btn-primary ml-auto !py-2 text-sm">
          Підписатися
        </Link>
      </Reveal>

      <div className="mt-7 flex gap-4 overflow-x-auto pb-2">
        {STORIES.map((s) => (
          <div key={s.t} className="flex shrink-0 flex-col items-center gap-1.5">
            <span className="grid h-16 w-16 place-items-center rounded-full p-[3px] ring-2 ring-gold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.img} alt="" className="h-full w-full rounded-full object-cover" />
            </span>
            <span className="text-xs text-muted">{s.t}</span>
          </div>
        ))}
      </div>

      <RevealGroup className="mt-6 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {POSTS.map((p, i) => (
          <RevealItem key={i}>
            <div className="group relative aspect-square overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.img}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-xs leading-snug text-white">{p.cap}</p>
                <p className="mt-1 text-[0.65rem] text-gold">♥ {p.likes}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
