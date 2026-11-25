"use client";

import { Clock, Trash2, X } from "lucide-react";
import type { HistoryEntry } from "@/lib/historyStore";
import type { CopyDictionary } from "@/lib/i18n";

interface HistoryListProps {
  entries: HistoryEntry[];
  copy: CopyDictionary;
  onSelect: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function HistoryList({
  entries,
  copy,
  onSelect,
  onRemove,
  onClear,
}: HistoryListProps) {
  return (
    <section className="rounded-3xl border border-rose-200/70 bg-white/75 p-5 shadow-sm backdrop-blur-md sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-rose-500" />
            <h2 className="text-base font-bold text-rose-950">
              {copy.history.title}
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-rose-900/60">
            {copy.history.subtitle}
          </p>
        </div>

        {entries.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{copy.history.clearAll}</span>
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-rose-200 bg-rose-50/40 px-4 py-5 text-center text-xs text-rose-900/65">
          {copy.history.empty}
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="group flex items-center justify-between gap-2 rounded-2xl border border-rose-100 bg-white/85 px-3.5 py-2.5 transition hover:border-rose-300"
            >
              <button
                type="button"
                onClick={() => onSelect(entry)}
                aria-label={`${copy.history.loadAria}: ${entry.nameA} & ${entry.nameB}`}
                className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left cursor-pointer"
              >
                <p className="truncate text-sm font-semibold text-rose-950">
                  {entry.nameA}{" "}
                  <span className="text-rose-500" aria-hidden="true">
                    ♥
                  </span>{" "}
                  {entry.nameB}
                </p>
                <span className="shrink-0 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                  {entry.score}%
                </span>
              </button>

              <button
                type="button"
                onClick={() => onRemove(entry.id)}
                aria-label={`${copy.history.removeAria}: ${entry.nameA} & ${entry.nameB}`}
                className="rounded-lg p-1.5 text-rose-400 transition hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
