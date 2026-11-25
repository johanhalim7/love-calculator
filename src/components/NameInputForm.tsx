"use client";

import { useState } from "react";
import { ArrowLeftRight, Heart, RotateCcw, Sparkles } from "lucide-react";
import { MAX_NAME_LENGTH } from "@/lib/algorithms";
import type { CopyDictionary } from "@/lib/i18n";

interface NameInputFormProps {
  nameA: string;
  nameB: string;
  errorMsg: string | null;
  isCalculating: boolean;
  hasResult: boolean;
  copy: CopyDictionary;
  onNameAChange: (value: string) => void;
  onNameBChange: (value: string) => void;
  onSwap: () => void;
  onReset: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function NameInputForm({
  nameA,
  nameB,
  errorMsg,
  isCalculating,
  hasResult,
  copy,
  onNameAChange,
  onNameBChange,
  onSwap,
  onReset,
  onSubmit,
}: NameInputFormProps) {
  const [swapCount, setSwapCount] = useState(0);

  const handleSwapClick = () => {
    setSwapCount((c) => c + 1);
    onSwap();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-rose-200/80 bg-white/88 p-5 shadow-lg shadow-rose-900/5 backdrop-blur-md transition-shadow duration-300 hover:shadow-xl hover:shadow-rose-900/10 sm:p-7"
      noValidate
    >
      <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div>
          <label
            htmlFor="name-a"
            className="mb-1.5 block text-sm font-semibold text-rose-950"
          >
            {copy.form.nameALabel}
          </label>
          <input
            id="name-a"
            type="text"
            value={nameA}
            maxLength={MAX_NAME_LENGTH}
            onChange={(e) => onNameAChange(e.target.value)}
            placeholder={copy.form.nameAPlaceholder}
            autoComplete="off"
            className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-base text-rose-950 placeholder:text-rose-300 transition-all duration-200 focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/15"
          />
        </div>

        <div className="flex justify-center sm:pb-1">
          <button
            type="button"
            onClick={handleSwapClick}
            aria-label={copy.form.swapAria}
            title={copy.form.swapAria}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rose-200 bg-rose-50/90 text-rose-600 shadow-xs transition-all duration-300 hover:scale-105 hover:border-rose-300 hover:bg-rose-100 active:scale-95 cursor-pointer"
            style={{ transform: `rotate(${swapCount * 180}deg)` }}
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>

        <div>
          <label
            htmlFor="name-b"
            className="mb-1.5 block text-sm font-semibold text-rose-950"
          >
            {copy.form.nameBLabel}
          </label>
          <input
            id="name-b"
            type="text"
            value={nameB}
            maxLength={MAX_NAME_LENGTH}
            onChange={(e) => onNameBChange(e.target.value)}
            placeholder={copy.form.nameBPlaceholder}
            autoComplete="off"
            className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-base text-rose-950 placeholder:text-rose-300 transition-all duration-200 focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/15"
          />
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="animate-card-enter mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700"
        >
          {errorMsg}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <button
          type="submit"
          disabled={isCalculating}
          className="group relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-rose-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-600/30 active:translate-y-0 active:scale-[0.99] disabled:translate-y-0 disabled:cursor-wait disabled:opacity-85 cursor-pointer"
        >
          {isCalculating ? (
            <>
              <Heart className="h-5 w-5 fill-white animate-heartbeat" />
              <span>{copy.form.calculating}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              <span>{copy.form.submit}</span>
            </>
          )}
        </button>

        {(nameA || nameB || hasResult) && (
          <button
            type="button"
            onClick={onReset}
            disabled={isCalculating}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-rose-200 bg-white px-4 py-3.5 text-sm font-semibold text-rose-800 transition hover:bg-rose-50 disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{copy.form.reset}</span>
          </button>
        )}
      </div>
    </form>
  );
}
