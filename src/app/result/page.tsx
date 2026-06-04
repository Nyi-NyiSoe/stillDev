"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { ResultSummary } from "@/components/ResultSummary";
import { getQuestionsByIds } from "@/lib/quiz";
import { getDailyResult, subscribeToStorage } from "@/lib/storage";

export default function ResultPage() {
  const router = useRouter();
  const result = useSyncExternalStore(subscribeToStorage, getDailyResult, () => null);
  const questions = useMemo(
    () => getQuestionsByIds(result?.answers.map((answer) => answer.questionId) ?? []),
    [result],
  );

  useEffect(() => {
    if (!result) {
      router.replace("/");
    }
  }, [result, router]);

  if (!result) {
    return (
      <AppShell eyebrow="Result">
        <div className="flex flex-1 items-center justify-center py-12">
          <p className="text-sm font-medium text-zinc-600">Loading result...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell eyebrow="Result">
      <div className="mx-auto w-full max-w-4xl space-y-6 py-8">
        <ResultSummary result={result} />
        <Card>
          <div className="space-y-5">
            {result.answers.map((answer, index) => {
              const question = questions.find((item) => item.id === answer.questionId);
              const selected = question?.options.find(
                (option) => option.id === answer.selectedAnswerId,
              );
              const correct = question?.options.find(
                (option) => option.id === answer.correctAnswerId,
              );

              return (
                <div className="border-b border-zinc-200 pb-5 last:border-0 last:pb-0" key={answer.questionId}>
                  <p className="text-sm font-semibold text-zinc-500">Question {index + 1}</p>
                  <h2 className="mt-2 text-base font-semibold text-zinc-950">
                    {question?.prompt}
                  </h2>
                  <div className="mt-3 space-y-1 text-sm text-zinc-700">
                    <p>Selected: {selected?.text ?? "No answer"}</p>
                    <p>Correct: {correct?.text}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    {question?.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" variant="secondary">
            Back Home
          </ButtonLink>
          <ButtonLink href="/history">View History</ButtonLink>
        </div>
      </div>
    </AppShell>
  );
}
