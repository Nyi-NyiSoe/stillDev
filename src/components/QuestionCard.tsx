import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import type { Question } from "@/types/quiz";

type QuestionCardProps = {
  question: Question;
  selectedAnswerId: string | null;
  isFinalQuestion: boolean;
  onSelect: (answerId: string) => void;
  onNext: () => void;
};

export function QuestionCard({
  question,
  selectedAnswerId,
  isFinalQuestion,
  onSelect,
  onNext,
}: QuestionCardProps) {
  return (
    <Card>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-emerald-300">{question.category}</p>
          <h1 className="mt-2 text-2xl font-semibold leading-snug text-zinc-50">
            {question.prompt}
          </h1>
        </div>

        <div className="grid gap-3">
          {question.options.map((option) => {
            const hasSelection = Boolean(selectedAnswerId);
            const isSelected = selectedAnswerId === option.id;
            const isCorrect = question.correctAnswerId === option.id;
            const feedback =
              hasSelection && isCorrect
                ? "border-emerald-400 bg-emerald-400/15 text-emerald-100"
                : hasSelection && isSelected
                  ? "border-rose-400 bg-rose-400/15 text-rose-100"
                  : "border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-600";

            return (
              <button
                className={`flex min-h-14 items-center justify-between gap-3 rounded-md border p-4 text-left text-sm font-medium transition ${feedback}`}
                key={option.id}
                onClick={() => onSelect(option.id)}
                type="button"
              >
                <span>{option.text}</span>
                {hasSelection && isCorrect ? (
                  <span className="shrink-0 rounded-full bg-emerald-400 px-2 py-1 text-xs font-bold text-zinc-950">
                    Right
                  </span>
                ) : null}
                {hasSelection && isSelected && !isCorrect ? (
                  <span className="shrink-0 rounded-full bg-rose-400 px-2 py-1 text-xs font-bold text-zinc-950">
                    Wrong
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <Button disabled={!selectedAnswerId} onClick={onNext} type="button">
          {isFinalQuestion ? "Finish" : "Next Question"}
        </Button>
      </div>
    </Card>
  );
}
