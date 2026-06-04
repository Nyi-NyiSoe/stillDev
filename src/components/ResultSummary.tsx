import { Card } from "@/components/Card";
import type { QuizResult } from "@/types/quiz";

type ResultSummaryProps = {
  result: QuizResult;
};

export function ResultSummary({ result }: ResultSummaryProps) {
  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm font-medium text-zinc-400">Score</p>
          <p className="mt-1 text-3xl font-semibold text-zinc-50">
            {result.score} / {result.total}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-400">Rank</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-50">{result.rank}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-400">Weak Areas</p>
          <p className="mt-1 text-base font-semibold text-zinc-50">
            {result.weakAreas.length > 0 ? result.weakAreas.join(", ") : "None"}
          </p>
        </div>
      </div>
      <p className="mt-5 border-t border-zinc-800 pt-5 text-sm leading-6 text-zinc-400">
        {result.recommendation}
      </p>
    </Card>
  );
}
