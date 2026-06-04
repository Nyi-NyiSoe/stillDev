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
          <p className="text-sm font-semibold text-zinc-500">{question.category}</p>
          <h1 className="mt-2 text-2xl font-semibold leading-snug text-zinc-950">
            {question.prompt}
          </h1>
        </div>

        <div className="grid gap-3">
          {question.options.map((option) => (
            <button
              className={`rounded-md border p-4 text-left text-sm font-medium transition ${
                selectedAnswerId === option.id
                  ? "border-zinc-950 bg-zinc-950 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
              }`}
              key={option.id}
              onClick={() => onSelect(option.id)}
              type="button"
            >
              {option.text}
            </button>
          ))}
        </div>

        <Button disabled={!selectedAnswerId} onClick={onNext} type="button">
          {isFinalQuestion ? "Finish" : "Next Question"}
        </Button>
      </div>
    </Card>
  );
}
