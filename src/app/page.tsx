import { Suspense } from "react";
import { LoveCalculator } from "@/components/LoveCalculator";
import type { Locale } from "@/lib/i18n";

interface HomePageProps {
  searchParams: Promise<{
    a?: string | string[];
    b?: string | string[];
    lang?: string | string[];
  }>;
}

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function parseLocale(raw: string): Locale {
  return raw === "en" ? "en" : "id";
}

async function CalculatorEntry({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const initialNameA = firstParam(params.a).slice(0, 50);
  const initialNameB = firstParam(params.b).slice(0, 50);
  const initialLocale = parseLocale(firstParam(params.lang));

  return (
    <LoveCalculator
      initialNameA={initialNameA}
      initialNameB={initialNameB}
      initialLocale={initialLocale}
    />
  );
}

function CalculatorSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
      <div className="h-7 w-48 animate-pulse rounded-full bg-rose-200/60" />
      <div className="mt-5 h-11 w-72 animate-pulse rounded-2xl bg-rose-200/70" />
      <div className="mt-3 h-5 w-full max-w-md animate-pulse rounded-xl bg-rose-100" />
      <div className="mt-8 h-64 w-full animate-pulse rounded-3xl border border-rose-200/60 bg-white/75" />
    </div>
  );
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <CalculatorEntry searchParams={searchParams} />
    </Suspense>
  );
}
