import { Card } from "@/components/Card";
import type { QuizResult } from "@/types/quiz";

type ResultSummaryProps = {
  result: QuizResult;
};

export function ResultSummary({ result }: ResultSummaryProps) {
  return (
    <Card>
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_12rem]">
        <div>
          <p className="text-sm font-medium text-zinc-400">Today&apos;s focus</p>
          <h1 className="mt-2 text-2xl font-semibold leading-snug text-zinc-50">
            {result.weakAreas.length > 0
              ? result.weakAreas.join(", ")
              : "No missed areas today"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {result.recommendation}
          </p>
        </div>
        <div className="rounded-md bg-zinc-900 p-4">
          <p className="text-sm font-medium text-zinc-400">Score</p>
          <p className="mt-1 text-3xl font-semibold text-zinc-50">
            {result.score} / {result.total}
          </p>
          <p className="mt-3 text-sm font-semibold text-emerald-300">
            {result.rank}
          </p>
        </div>
      </div>
    </Card>
  );
}
