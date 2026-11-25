import type { ScoreTier } from "./algorithms";

export interface HistoryEntry {
  id: string;
  nameA: string;
  nameB: string;
  score: number;
  tier: ScoreTier;
  createdAt: number;
}

const STORAGE_KEY = "lovematch_history_v1";
const MAX_HISTORY_ITEMS = 10;
const EMPTY_HISTORY: HistoryEntry[] = [];

let cachedRaw: string | null = null;
let cachedSnapshot: HistoryEntry[] = EMPTY_HISTORY;
const listeners = new Set<() => void>();

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeHistory(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cachedRaw = null;
      listener();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export function getHistorySnapshot(): HistoryEntry[] {
  if (typeof window === "undefined") return EMPTY_HISTORY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedSnapshot;
    cachedRaw = raw;
    if (!raw) {
      cachedSnapshot = EMPTY_HISTORY;
      return cachedSnapshot;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      cachedSnapshot = EMPTY_HISTORY;
      return cachedSnapshot;
    }
    cachedSnapshot = parsed.slice(0, MAX_HISTORY_ITEMS);
    return cachedSnapshot;
  } catch {
    return EMPTY_HISTORY;
  }
}

export function getHistoryServerSnapshot(): HistoryEntry[] {
  return EMPTY_HISTORY;
}

function writeHistory(entries: HistoryEntry[]) {
  if (typeof window === "undefined") return;
  try {
    const trimmed = entries.slice(0, MAX_HISTORY_ITEMS);
    const raw = JSON.stringify(trimmed);
    window.localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedSnapshot = trimmed;
    notifyListeners();
  } catch {
    // Ignore storage quota or private-mode errors
  }
}

export function addHistoryEntry(
  entry: Omit<HistoryEntry, "id" | "createdAt">,
): void {
  const current = getHistorySnapshot();
  const normalizedKey = [entry.nameA.toLowerCase(), entry.nameB.toLowerCase()]
    .sort()
    .join("|");
  const filtered = current.filter((item) => {
    const itemKey = [item.nameA.toLowerCase(), item.nameB.toLowerCase()]
      .sort()
      .join("|");
    return itemKey !== normalizedKey;
  });

  const nextEntry: HistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
  };

  writeHistory([nextEntry, ...filtered]);
}

export function removeHistoryEntry(id: string): void {
  const current = getHistorySnapshot();
  writeHistory(current.filter((item) => item.id !== id));
}

export function clearHistoryEntries(): void {
  writeHistory([]);
}
