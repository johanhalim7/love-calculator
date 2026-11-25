"use client";

import { useEffect, useId, useState } from "react";
import { Sparkles } from "lucide-react";
import type { CopyDictionary } from "@/lib/i18n";

interface HeartFillLoaderProps {
  nameA: string;
  nameB: string;
  targetScore: number;
  durationMs: number;
  copy: CopyDictionary;
}

export function HeartFillLoader({
  nameA,
  nameB,
  targetScore,
  durationMs,
  copy,
}: HeartFillLoaderProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const clipId = `heart-loader-clip-${rawId}`;
  const gradId = `heart-loader-grad-${rawId}`;
  const [progress, setProgress] = useState(0);
  const [elapsedRatio, setElapsedRatio] = useState(0);

  useEffect(() => {
    let rafId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - ratio, 2.4);
      setElapsedRatio(ratio);
      setProgress(Math.round(eased * targetScore));
      if (ratio < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [durationMs, targetScore]);

  const stepIndex = elapsedRatio < 0.35 ? 0 : elapsedRatio < 0.75 ? 1 : 2;
  const statusText = copy.form.calculatingSteps[stepIndex];

  // Heart fills from bottom (104) to top (4) proportional to current progress (0..100)
  const liquidTopY = 104 - (progress / 100) * 100;

  return (
    <section
      aria-live="polite"
      className="animate-card-enter relative overflow-hidden rounded-3xl border border-rose-200/90 bg-white/90 p-7 text-center shadow-xl shadow-rose-900/10 backdrop-blur-md sm:p-9"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,113,133,0.14),transparent_68%)]" />

      <div className="relative mx-auto flex flex-col items-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-rose-50/90 px-4 py-1.5 text-sm font-semibold text-rose-900">
          <span className="max-w-[120px] truncate">{nameA}</span>
          <span className="text-rose-500 animate-heartbeat">♥</span>
          <span className="max-w-[120px] truncate">{nameB}</span>
        </div>

        <div className="relative flex h-44 w-44 items-center justify-center">
          {/* Soft ambient halo */}
          <div
            className="absolute inset-4 rounded-full bg-rose-400/20 blur-2xl transition-transform duration-300"
            style={{ transform: `scale(${0.85 + (progress / 100) * 0.35})` }}
          />

          {/* Floating mini sparkles */}
          <Sparkles
            className="animate-float-sparkle absolute left-5 top-6 h-4 w-4 text-rose-400"
            style={{ animationDelay: "0s" }}
          />
          <Sparkles
            className="animate-float-sparkle absolute right-5 top-8 h-3.5 w-3.5 text-pink-400"
            style={{ animationDelay: "0.6s" }}
          />
          <span
            className="animate-float-sparkle absolute right-7 bottom-7 text-xs text-rose-500"
            style={{ animationDelay: "0.3s" }}
          >
            ♥
          </span>

          <svg
            viewBox="0 0 120 110"
            className="relative h-36 w-36 drop-shadow-[0_10px_24px_rgba(225,29,72,0.22)]"
            role="img"
            aria-label={`${copy.form.calculating} ${progress}%`}
          >
            <defs>
              <clipPath id={clipId}>
                <path d="M60 102 C60 102 10 71 10 35 C10 17 24 6 39 6 C49 6 56 12 60 19 C64 12 71 6 81 6 C96 6 110 17 110 35 C110 71 60 102 60 102 Z" />
              </clipPath>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="55%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
            </defs>

            {/* Unfilled glass heart interior */}
            <path
              d="M60 102 C60 102 10 71 10 35 C10 17 24 6 39 6 C49 6 56 12 60 19 C64 12 71 6 81 6 C96 6 110 17 110 35 C110 71 60 102 60 102 Z"
              fill="#fff1f2"
            />

            {/* Clipped rising liquid wave */}
            <g clipPath={`url(#${clipId})`}>
              <g transform={`translate(0, ${liquidTopY})`}>
                {/* Back wave */}
                <g className="animate-wave-slide-reverse" opacity="0.55">
                  <path
                    d="M0 6 Q 15 0, 30 6 T 60 6 T 90 6 T 120 6 T 150 6 T 180 6 T 210 6 T 240 6 L 240 130 L 0 130 Z"
                    fill="#fda4af"
                  />
                </g>
                {/* Front wave */}
                <g className="animate-wave-slide">
                  <path
                    d="M0 4 Q 15 11, 30 4 T 60 4 T 90 4 T 120 4 T 150 4 T 180 4 T 210 4 T 240 4 L 240 130 L 0 130 Z"
                    fill={`url(#${gradId})`}
                  />
                </g>
              </g>
            </g>

            {/* Crisp heart outline + glossy highlight */}
            <path
              d="M60 102 C60 102 10 71 10 35 C10 17 24 6 39 6 C49 6 56 12 60 19 C64 12 71 6 81 6 C96 6 110 17 110 35 C110 71 60 102 60 102 Z"
              fill="none"
              stroke="#e11d48"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            <path
              d="M25 25 C22 30 22 38 25 45"
              fill="none"
              stroke="rgba(255,255,255,0.65)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <span className="pointer-events-none absolute rounded-full bg-white/85 px-2.5 py-0.5 font-serif text-lg font-bold text-rose-900 shadow-sm backdrop-blur-xs">
            {progress}%
          </span>
        </div>

        <p className="mt-2 font-serif text-lg font-semibold text-rose-950">
          {copy.form.calculating}
        </p>
        <p className="mt-1 text-xs font-medium text-rose-700/80 transition-opacity duration-200">
          {statusText}
        </p>

        {/* Sleek bottom progress bar */}
        <div className="mt-4 h-1.5 w-52 overflow-hidden rounded-full bg-rose-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-400 via-rose-500 to-pink-600 transition-[width] duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}
