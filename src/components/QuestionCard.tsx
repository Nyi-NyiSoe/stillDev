import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import type { Question } from "@/types/quiz";

type QuestionCardProps = {
  question: Question;
  selectedAnswerId: string | null;
  isAnswerChecked: boolean;
  isFinalQuestion: boolean;
  isSavedForReview: boolean;
  onCheck: () => void;
  onSelect: (answerId: string) => void;
  onNext: () => void;
  onSaveForReview: () => void;
};

export function QuestionCard({
  question,
  selectedAnswerId,
  isAnswerChecked,
  isFinalQuestion,
  isSavedForReview,
  onCheck,
  onSelect,
  onNext,
  onSaveForReview,
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
            const isSelected = selectedAnswerId === option.id;
            const isCorrect = question.correctAnswerId === option.id;
            const feedback =
              isAnswerChecked && isCorrect
                ? "border-emerald-400 bg-emerald-400/15 text-emerald-100"
                : isAnswerChecked && isSelected
                  ? "border-rose-400 bg-rose-400/15 text-rose-100"
                  : isSelected
                    ? "border-emerald-300 bg-emerald-400/10 text-emerald-100"
                    : "border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-600";

            return (
              <button
                className={`flex min-h-14 items-center justify-between gap-3 rounded-md border p-4 text-left text-sm font-medium transition disabled:cursor-default ${feedback}`}
                disabled={isAnswerChecked}
                key={option.id}
                onClick={() => {
                  if (!isAnswerChecked) {
                    onSelect(option.id);
                  }
                }}
                type="button"
              >
                <span>{option.text}</span>
                {isAnswerChecked && isCorrect ? (
                  <span className="shrink-0 rounded-full bg-emerald-400 px-2 py-1 text-xs font-bold text-zinc-950">
                    Right
                  </span>
                ) : null}
                {isAnswerChecked && isSelected && !isCorrect ? (
                  <span className="shrink-0 rounded-full bg-rose-400 px-2 py-1 text-xs font-bold text-zinc-950">
                    Wrong
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {isAnswerChecked ? (
          <div className="rounded-md border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-sm font-semibold text-zinc-50">
              {selectedAnswerId === question.correctAnswerId
                ? "Correct"
                : "Needs a quick refresh"}
            </p>
            <div className="mt-3 border-t border-zinc-800 pt-3">
              <p className="text-xs font-semibold text-emerald-300">
                Remember this
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {question.explanation}
              </p>
              <p className="mt-4 text-xs font-semibold text-emerald-300">
                Why developers miss this
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {question.whyDevelopersMissThis}
              </p>
            </div>
          </div>
        ) : null}

        {isAnswerChecked ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={onNext} type="button">
              {isFinalQuestion ? "Finish Warm-up" : "Next Question"}
            </Button>
            <Button
              disabled={isSavedForReview}
              onClick={onSaveForReview}
              type="button"
              variant="secondary"
            >
              {isSavedForReview ? "Saved for Review" : "Review Later"}
            </Button>
          </div>
        ) : (
          <Button disabled={!selectedAnswerId} onClick={onCheck} type="button">
            Check Answer
          </Button>
        )}
      </div>
    </Card>
  );
}
