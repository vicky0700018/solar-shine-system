"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Leaf, ShieldCheck, Zap } from "lucide-react";
import type { Settings } from "@/data/defaults";

export function Hero({ settings }: { settings: Settings }) {
  const banners = settings.banners.length ? settings.banners : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [banners.length]);

  const go = (dir: number) =>
    setIndex((i) => (i + dir + banners.length) % banners.length);

  const current = banners[index];

  return (
    <section id="home" className="relative isolate min-h-[92vh] overflow-hidden bg-ink pt-20">
      {banners.map((banner, i) => (
        <img
          key={banner.id}
          src={banner.image}
          alt={banner.title}
          width={1600}
          height={912}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/40" />

      <div className="section-shell relative flex min-h-[calc(92vh-5rem)] flex-col justify-center py-16">
        <div className="max-w-3xl">
          <span className="eyebrow">{current?.title ?? "Solar Water Heating"}</span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-ink-foreground sm:text-5xl lg:text-6xl">
            {settings.heroHeading}
          </h1>
          <p className="mt-4 text-lg font-semibold text-primary">{settings.heroTagline}</p>
          <p className="mt-4 max-w-2xl text-base text-ink-foreground/80 sm:text-lg">
            {current?.subtitle ?? settings.heroDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="rounded-lg bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5"
            >
              Get a Quote
            </a>
            <a
              href="#services"
              className="rounded-lg border border-ink-foreground/30 bg-ink-foreground/10 px-6 py-3.5 text-sm font-bold text-ink-foreground backdrop-blur transition-colors hover:bg-ink-foreground/20"
            >
              Explore Services
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-ink-foreground/85">
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" aria-hidden="true" /> Lower energy bills
            </li>
            <li className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-primary" aria-hidden="true" /> Clean, renewable heat
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" /> Service &amp; support
            </li>
          </ul>
        </div>

        {banners.length > 1 && (
          <div className="mt-12 flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous banner"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-foreground/30 text-ink-foreground transition-colors hover:bg-ink-foreground/15"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next banner"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-foreground/30 text-ink-foreground transition-colors hover:bg-ink-foreground/15"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {banners.map((banner, i) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show banner ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-10 bg-primary" : "w-5 bg-ink-foreground/35"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
