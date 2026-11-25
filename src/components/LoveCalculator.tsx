"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Globe, Heart } from "lucide-react";
import {
  calculateClassic,
  validateNames,
  type CalculationResult,
  type ValidationErrorKey,
} from "@/lib/algorithms";
import {
  addHistoryEntry,
  clearHistoryEntries,
  getHistoryServerSnapshot,
  getHistorySnapshot,
  removeHistoryEntry,
  subscribeHistory,
  type HistoryEntry,
} from "@/lib/historyStore";
import { DICTIONARIES, type Locale } from "@/lib/i18n";
import { HeartFillLoader } from "./HeartFillLoader";
import { HistoryList } from "./HistoryList";
import { NameInputForm } from "./NameInputForm";
import { ResultCard } from "./ResultCard";

interface LoveCalculatorProps {
  initialNameA?: string;
  initialNameB?: string;
  initialLocale?: Locale;
}

export function LoveCalculator({
  initialNameA = "",
  initialNameB = "",
  initialLocale = "id",
}: LoveCalculatorProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [nameA, setNameA] = useState<string>(initialNameA);
  const [nameB, setNameB] = useState<string>(initialNameB);
  const [errorKey, setErrorKey] = useState<ValidationErrorKey | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [pendingResult, setPendingResult] = useState<{
    computed: CalculationResult;
    durationMs: number;
  } | null>(null);
  const [animateResultFromZero, setAnimateResultFromZero] =
    useState<boolean>(true);
  const [result, setResult] = useState<CalculationResult | null>(() => {
    if (!initialNameA || !initialNameB) return null;
    const check = validateNames(initialNameA, initialNameB);
    if (!check.valid) return null;
    return calculateClassic(check.nameA, check.nameB);
  });

  const history = useSyncExternalStore(
    subscribeHistory,
    getHistorySnapshot,
    getHistoryServerSnapshot,
  );

  const timerRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const copy = DICTIONARIES[locale];

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const validation = validateNames(nameA, nameB);
    if (!validation.valid) {
      setErrorKey(validation.errorKey);
      return;
    }

    setErrorKey(null);
    setNameA(validation.nameA);
    setNameB(validation.nameB);

    const computed = calculateClassic(validation.nameA, validation.nameB);
    const durationMs = 900 + computed.score * 8;

    setPendingResult({ computed, durationMs });
    setIsCalculating(true);

    window.requestAnimationFrame(() => {
      stageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });

    timerRef.current = window.setTimeout(() => {
      setAnimateResultFromZero(false);
      setResult(computed);
      setIsCalculating(false);
      setPendingResult(null);
      addHistoryEntry({
        nameA: computed.nameA,
        nameB: computed.nameB,
        score: computed.score,
        tier: computed.tier,
      });
    }, durationMs + 220);
  };

  const handleSwap = () => {
    setNameA(nameB);
    setNameB(nameA);
    setErrorKey(null);
  };

  const handleReset = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsCalculating(false);
    setPendingResult(null);
    setNameA("");
    setNameB("");
    setErrorKey(null);
    setResult(null);
  };

  const handleTryAnother = () => {
    setNameA("");
    setNameB("");
    setErrorKey(null);
    setResult(null);
    const input = document.getElementById("name-a");
    input?.focus();
  };

  const handleSelectHistory = (entry: HistoryEntry) => {
    setNameA(entry.nameA);
    setNameB(entry.nameB);
    setErrorKey(null);
    setAnimateResultFromZero(true);
    setResult(calculateClassic(entry.nameA, entry.nameB));
    window.requestAnimationFrame(() => {
      stageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  };

  return (
    <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
      {/* Subtle ambient decorative hearts */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <span className="animate-ambient-drift absolute left-[8%] top-[18%] text-2xl text-rose-300/35">
          ♥
        </span>
        <span
          className="animate-ambient-drift absolute right-[10%] top-[28%] text-xl text-pink-300/35"
          style={{ animationDelay: "1.8s" }}
        >
          ♥
        </span>
        <span
          className="animate-ambient-drift absolute left-[14%] bottom-[16%] text-lg text-rose-300/30"
          style={{ animationDelay: "3.2s" }}
        >
          ✦
        </span>
      </div>

      <header className="relative mb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white/85 px-3 py-1 text-xs font-semibold text-rose-700 shadow-xs backdrop-blur-xs">
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            <span>{copy.brandBadge}</span>
          </span>

          <div
            role="group"
            aria-label={copy.langLabel}
            className="inline-flex items-center rounded-full border border-rose-200 bg-white/85 p-0.5 shadow-xs backdrop-blur-xs"
          >
            <Globe className="ml-2 mr-1 h-3.5 w-3.5 text-rose-500" />
            {(["id", "en"] as const).map((lang) => {
              const active = locale === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLocale(lang)}
                  aria-pressed={active}
                  className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase transition cursor-pointer ${
                    active
                      ? "bg-rose-600 text-white shadow-xs"
                      : "text-rose-800 hover:bg-rose-50"
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        <h1 className="mt-5 font-serif text-4xl font-bold tracking-tight text-rose-950 sm:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-rose-900/75 sm:text-base">
          {copy.subtitle}
        </p>
      </header>

      <main className="relative flex flex-col gap-6">
        <NameInputForm
          nameA={nameA}
          nameB={nameB}
          errorMsg={errorKey ? copy.errors[errorKey] : null}
          isCalculating={isCalculating}
          hasResult={result !== null}
          copy={copy}
          onNameAChange={(val) => {
            setNameA(val);
            if (errorKey) setErrorKey(null);
          }}
          onNameBChange={(val) => {
            setNameB(val);
            if (errorKey) setErrorKey(null);
          }}
          onSwap={handleSwap}
          onReset={handleReset}
          onSubmit={handleSubmit}
        />

        <div ref={stageRef}>
          {isCalculating && pendingResult ? (
            <HeartFillLoader
              key={`${pendingResult.computed.nameA}-${pendingResult.computed.nameB}-${pendingResult.computed.score}`}
              nameA={pendingResult.computed.nameA}
              nameB={pendingResult.computed.nameB}
              targetScore={pendingResult.computed.score}
              durationMs={pendingResult.durationMs}
              copy={copy}
            />
          ) : (
            result && (
              <ResultCard
                key={`${result.nameA}-${result.nameB}-${result.score}-${animateResultFromZero}`}
                result={result}
                locale={locale}
                copy={copy}
                animateFromZero={animateResultFromZero}
                onTryAnother={handleTryAnother}
              />
            )
          )}
        </div>

        <HistoryList
          entries={history}
          copy={copy}
          onSelect={handleSelectHistory}
          onRemove={removeHistoryEntry}
          onClear={clearHistoryEntries}
        />
      </main>

      <footer className="relative mt-8 border-t border-rose-200/60 pt-5 text-center text-xs text-rose-900/60">
        {copy.disclaimer}
      </footer>
    </div>
  );
}
