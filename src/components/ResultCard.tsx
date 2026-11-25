"use client";

import { useEffect, useId, useState, type CSSProperties } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Heart,
  Link2,
  RefreshCw,
} from "lucide-react";
import type { CalculationResult, ScoreTier } from "@/lib/algorithms";
import type { CopyDictionary, Locale } from "@/lib/i18n";

interface ResultCardProps {
  result: CalculationResult;
  locale: Locale;
  copy: CopyDictionary;
  onTryAnother: () => void;
}

const TIER_STYLES: Record<
  ScoreTier,
  {
    gradStart: string;
    gradEnd: string;
    waveBack: string;
    strokeColor: string;
    badgeBg: string;
    badgeText: string;
    cardGlow: string;
  }
> = {
  low: {
    gradStart: "#fb923c",
    gradEnd: "#ea580c",
    waveBack: "#fdba74",
    strokeColor: "#ea580c",
    badgeBg: "bg-orange-100 border-orange-200",
    badgeText: "text-orange-800",
    cardGlow: "border-rose-200/90",
  },
  spark: {
    gradStart: "#f472b6",
    gradEnd: "#db2777",
    waveBack: "#f9a8d4",
    strokeColor: "#db2777",
    badgeBg: "bg-pink-100 border-pink-200",
    badgeText: "text-pink-800",
    cardGlow: "border-pink-200/90",
  },
  promising: {
    gradStart: "#fb7185",
    gradEnd: "#e11d48",
    waveBack: "#fda4af",
    strokeColor: "#e11d48",
    badgeBg: "bg-rose-100 border-rose-200",
    badgeText: "text-rose-800",
    cardGlow: "border-rose-300/90",
  },
  soulmate: {
    gradStart: "#f43f5e",
    gradEnd: "#be123c",
    waveBack: "#fda4af",
    strokeColor: "#be123c",
    badgeBg: "bg-rose-600 border-rose-700",
    badgeText: "text-white",
    cardGlow: "border-rose-400/80 ring-2 ring-rose-400/15",
  },
};

const CELEBRATION_PARTICLES: { tx: string; ty: string; delay: string }[] = [
  { tx: "-48px", ty: "-38px", delay: "0.05s" },
  { tx: "50px", ty: "-34px", delay: "0.12s" },
  { tx: "-56px", ty: "16px", delay: "0.18s" },
  { tx: "56px", ty: "22px", delay: "0.22s" },
  { tx: "0px", ty: "-58px", delay: "0.08s" },
];

export function ResultCard({
  result,
  locale,
  copy,
  onTryAnother,
}: ResultCardProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const clipId = `result-heart-clip-${rawId}`;
  const gradId = `result-heart-grad-${rawId}`;

  const [showBreakdown, setShowBreakdown] = useState(false);
  const [copiedState, setCopiedState] = useState<"link" | "text" | null>(null);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let rafId = 0;
    const duration = 850;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - ratio, 3);
      setDisplayScore(Math.round(eased * result.score));
      if (ratio < 1) {
        rafId = window.requestAnimationFrame(animate);
      }
    };

    rafId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(rafId);
  }, [result.score]);

  const tierStyle = TIER_STYLES[result.tier];
  const tierCopy = copy.tiers[result.tier];

  // Heart fills from bottom (104) to top (4) proportional to displayScore
  const liquidTopY = 104 - (displayScore / 100) * 100;

  const buildShareUrl = () => {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("a", result.nameA);
    url.searchParams.set("b", result.nameB);
    url.searchParams.set("lang", locale);
    return url.toString();
  };

  const copyToClipboard = async (kind: "link" | "text") => {
    const shareUrl = buildShareUrl();
    const textToCopy =
      kind === "link"
        ? shareUrl
        : copy.result.shareTemplate({
            nameA: result.nameA,
            nameB: result.nameB,
            score: result.score,
            badge: tierCopy.badge,
            url: shareUrl,
          });

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedState(kind);
      window.setTimeout(() => {
        setCopiedState((prev) => (prev === kind ? null : prev));
      }, 2000);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <section
      aria-live="polite"
      className={`animate-card-enter relative overflow-hidden rounded-3xl border bg-white/92 p-5 shadow-xl shadow-rose-900/10 backdrop-blur-md sm:p-7 ${tierStyle.cardGlow}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-100 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-rose-600 uppercase">
          <Heart className="h-4 w-4 fill-rose-500 text-rose-500 animate-heartbeat" />
          <span>{copy.result.heading}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative flex h-40 w-40 shrink-0 items-center justify-center">
          {result.score >= 70 &&
            CELEBRATION_PARTICLES.map((p, idx) => (
              <span
                key={idx}
                aria-hidden="true"
                className="animate-burst-pop pointer-events-none absolute text-sm text-rose-500"
                style={
                  {
                    "--tx": p.tx,
                    "--ty": p.ty,
                    animationDelay: p.delay,
                  } as CSSProperties
                }
              >
                {idx % 2 === 0 ? "♥" : "✦"}
              </span>
            ))}

          <svg
            viewBox="0 0 120 110"
            className="h-36 w-36 drop-shadow-[0_10px_20px_rgba(225,29,72,0.18)]"
            role="img"
            aria-label={`${copy.result.scoreLabel}: ${result.score}%`}
          >
            <defs>
              <clipPath id={clipId}>
                <path d="M60 102 C60 102 10 71 10 35 C10 17 24 6 39 6 C49 6 56 12 60 19 C64 12 71 6 81 6 C96 6 110 17 110 35 C110 71 60 102 60 102 Z" />
              </clipPath>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={tierStyle.gradStart} />
                <stop offset="100%" stopColor={tierStyle.gradEnd} />
              </linearGradient>
            </defs>

            <path
              d="M60 102 C60 102 10 71 10 35 C10 17 24 6 39 6 C49 6 56 12 60 19 C64 12 71 6 81 6 C96 6 110 17 110 35 C110 71 60 102 60 102 Z"
              fill="#fff1f2"
            />

            <g clipPath={`url(#${clipId})`}>
              <g transform={`translate(0, ${liquidTopY})`}>
                <g className="animate-wave-slide-reverse" opacity="0.55">
                  <path
                    d="M0 5 Q 15 0, 30 5 T 60 5 T 90 5 T 120 5 T 150 5 T 180 5 T 210 5 T 240 5 L 240 130 L 0 130 Z"
                    fill={tierStyle.waveBack}
                  />
                </g>
                <g className="animate-wave-slide">
                  <path
                    d="M0 4 Q 15 10, 30 4 T 60 4 T 90 4 T 120 4 T 150 4 T 180 4 T 210 4 T 240 4 L 240 130 L 0 130 Z"
                    fill={`url(#${gradId})`}
                  />
                </g>
              </g>
            </g>

            <path
              d="M60 102 C60 102 10 71 10 35 C10 17 24 6 39 6 C49 6 56 12 60 19 C64 12 71 6 81 6 C96 6 110 17 110 35 C110 71 60 102 60 102 Z"
              fill="none"
              stroke={tierStyle.strokeColor}
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

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-white/90 px-3 py-1 font-serif text-2xl font-bold tracking-tight text-rose-950 shadow-sm backdrop-blur-xs">
              {displayScore}%
            </span>
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <p className="text-lg font-bold text-rose-950 sm:text-xl">
            <span>{result.nameA}</span>
            <span
              className="mx-2 inline-block text-rose-500 animate-heartbeat"
              aria-hidden="true"
            >
              ♥
            </span>
            <span>{result.nameB}</span>
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${tierStyle.badgeBg} ${tierStyle.badgeText}`}
            >
              {tierCopy.badge}
            </span>
          </div>

          <h3 className="mt-3 font-serif text-xl font-bold text-rose-950">
            {tierCopy.headline}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-rose-900/75">
            {tierCopy.message}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-rose-100 pt-4">
        <button
          type="button"
          onClick={() => setShowBreakdown((prev) => !prev)}
          aria-expanded={showBreakdown}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 transition hover:text-rose-900 cursor-pointer"
        >
          {showBreakdown ? (
            <>
              <ChevronUp className="h-4 w-4" />
              <span>{copy.result.breakdownToggleHide}</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              <span>{copy.result.breakdownToggleShow}</span>
            </>
          )}
        </button>

        {showBreakdown && (
          <div className="animate-card-enter mt-3 rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-xs text-rose-950/85">
            <div className="space-y-2">
              <div>
                <span className="font-semibold">
                  {copy.result.classicPhraseLabel}:{" "}
                </span>
                <code className="rounded bg-white px-1.5 py-0.5 font-mono text-rose-700">
                  {result.breakdown.phrase}
                </code>
              </div>
              <div>
                <span className="mb-1 block font-semibold">
                  {copy.result.classicStepsLabel}:
                </span>
                <div className="flex flex-col gap-1 font-mono text-[11px] text-rose-900/80">
                  {result.breakdown.reductionSteps.map((step, idx) => (
                    <div key={idx} className="rounded bg-white/80 px-2 py-1">
                      #{idx + 1}: {step.join(" ")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => copyToClipboard("link")}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-2.5 text-sm font-semibold text-rose-900 transition hover:-translate-y-0.5 hover:bg-rose-100 active:translate-y-0 cursor-pointer"
        >
          {copiedState === "link" ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" />
              <span>{copy.result.copiedLink}</span>
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4" />
              <span>{copy.result.copyLink}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => copyToClipboard("text")}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-2.5 text-sm font-semibold text-rose-900 transition hover:-translate-y-0.5 hover:bg-rose-100 active:translate-y-0 cursor-pointer"
        >
          {copiedState === "text" ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" />
              <span>{copy.result.copiedText}</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>{copy.result.copyText}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onTryAnother}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-50 active:translate-y-0 sm:w-auto cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>{copy.result.tryAnother}</span>
        </button>
      </div>
    </section>
  );
}
