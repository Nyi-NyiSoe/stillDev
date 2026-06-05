"use client";

import { useMemo, useSyncExternalStore } from "react";
import { AppShell } from "@/components/AppShell";
import { Button, ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { ResultSummary } from "@/components/ResultSummary";
import { getQuestionsByIds } from "@/lib/quiz";
import {
  getDailyResult,
  getReviewQueue,
  saveQuestionForReview,
  subscribeToStorage,
} from "@/lib/storage";
import type { AnswerReview, QuestionCategory } from "@/types/quiz";

export default function ResultPage() {
  const result = useSyncExternalStore(subscribeToStorage, getDailyResult, () => null);
  const reviewQueue = useSyncExternalStore(subscribeToStorage, getReviewQueue, () => []);
  const savedQuestionIds = useMemo(
    () => new Set(reviewQueue.map((item) => item.questionId)),
    [reviewQueue],
  );
  const questions = useMemo(
    () => getQuestionsByIds(result?.answers.map((answer) => answer.questionId) ?? []),
    [result],
  );
  const missedByCategory = useMemo(() => {
    const groups = new Map<QuestionCategory, AnswerReview[]>();

    if (!result) {
      return [];
    }

    for (const answer of result.answers) {
      if (answer.isCorrect) {
        continue;
      }

      groups.set(answer.category, [
        ...(groups.get(answer.category) ?? []),
        answer,
      ]);
    }

    return [...groups.entries()];
  }, [result]);

  if (!result) {
    return (
      <AppShell eyebrow="Result">
        <div className="mx-auto flex w-full max-w-xl flex-1 items-center py-12">
          <Card>
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-semibold text-zinc-50">
                  No result saved for today
                </h1>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  StillDev keeps results in this browser. If site data was
                  cleared or today&apos;s check has not been finished yet, there is
                  nothing to review here.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/" variant="secondary">
                  Back Home
                </ButtonLink>
                <ButtonLink href="/setup">Start Warm-up</ButtonLink>
              </div>
            </div>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell eyebrow="Result">
      <div className="mx-auto w-full max-w-4xl space-y-6 py-8">
        <ResultSummary result={result} />

        <Card>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-emerald-300">
                Suggested next rep
              </p>
              <h2 className="mt-2 text-xl font-semibold text-zinc-50">
                {result.weakAreas.length > 0
                  ? `Review ${result.weakAreas[0]} before tomorrow's warm-up.`
                  : "Keep the same rhythm tomorrow."}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {result.weakAreas.length > 0
                  ? "Start with the missed questions below, then revisit the explanation in your own code or notes."
                  : "No missed areas showed up today. The next check will stay fresh for the same profile tomorrow."}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-zinc-50">Missed areas</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {missedByCategory.length > 0
                ? "The main review for today, grouped by topic."
                : "No missed questions today. Keep the full review folded unless you want to scan details."}
            </p>
          </div>
          {missedByCategory.length > 0 ? (
            <div className="space-y-5">
              {missedByCategory.map(([category, answers]) => (
                <div
                  className="rounded-md border border-zinc-800 bg-zinc-900/60 p-4"
                  key={category}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-base font-semibold text-zinc-50">
                      {category}
                    </h3>
                    <span className="text-sm font-medium text-zinc-400">
                      {answers.length} missed
                    </span>
                  </div>
                  <div className="mt-4 space-y-4">
                    {answers.map((answer) => {
                      const question = questions.find((item) => item.id === answer.questionId);
                      const selected = question?.options.find(
                        (option) => option.id === answer.selectedAnswerId,
                      );
                      const correct = question?.options.find(
                        (option) => option.id === answer.correctAnswerId,
                      );

                      return (
                        <div className="border-t border-zinc-800 pt-4" key={answer.questionId}>
                          <h4 className="text-sm font-semibold leading-6 text-zinc-50">
                            {question?.prompt}
                          </h4>
                          <div className="mt-2 space-y-1 text-sm text-zinc-300">
                            <p>Your answer: {selected?.text ?? "No answer"}</p>
                            <p>Warm-up note: {correct?.text}</p>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-zinc-400">
                            {question?.explanation}
                          </p>
                          {question ? (
                            <Button
                              className="mt-3"
                              disabled={savedQuestionIds.has(question.id)}
                              onClick={() => saveQuestionForReview(question.id)}
                              type="button"
                              variant="secondary"
                            >
                              {savedQuestionIds.has(question.id)
                                ? "Saved for Review"
                                : "Review Later"}
                            </Button>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </Card>

        <details className="rounded-lg border border-zinc-800 bg-zinc-950 p-5 sm:p-6">
          <summary className="cursor-pointer text-xl font-semibold text-zinc-50">
            Full review
          </summary>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            A compact scan of all 10 questions from today&apos;s check.
          </p>
          <div className="mt-5 space-y-3">
            {result.answers.map((answer, index) => {
              const question = questions.find((item) => item.id === answer.questionId);
              const selected = question?.options.find(
                (option) => option.id === answer.selectedAnswerId,
              );
              const correct = question?.options.find(
                (option) => option.id === answer.correctAnswerId,
              );

              return (
                <div
                  className="rounded-md border border-zinc-800 bg-zinc-900/60 p-4"
                  key={answer.questionId}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-zinc-400">
                        Question {index + 1}
                      </p>
                      <h2 className="mt-1 text-sm font-semibold leading-6 text-zinc-50">
                        {question?.prompt}
                      </h2>
                    </div>
                    <span
                      className={`w-fit rounded-full px-2 py-1 text-xs font-bold ${
                        answer.isCorrect
                          ? "bg-emerald-400 text-zinc-950"
                          : "bg-rose-400 text-zinc-950"
                      }`}
                    >
                      {answer.isCorrect ? "Solid" : "Review"}
                    </span>
                  </div>
                  {answer.isCorrect ? (
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      Your answer matched the warm-up note.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2 text-sm text-zinc-300">
                      <p>Your answer: {selected?.text ?? "No answer"}</p>
                      <p>Warm-up note: {correct?.text}</p>
                      <p className="leading-6 text-zinc-400">
                        {question?.explanation}
                      </p>
                    </div>
                  )}
                  {question ? (
                    <Button
                      className="mt-3"
                      disabled={savedQuestionIds.has(question.id)}
                      onClick={() => saveQuestionForReview(question.id)}
                      type="button"
                      variant="secondary"
                    >
                      {savedQuestionIds.has(question.id)
                        ? "Saved for Review"
                        : "Review Later"}
                    </Button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </details>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" variant="secondary">
            Back Home
          </ButtonLink>
          <ButtonLink href="/review" variant="secondary">
            Review Later
          </ButtonLink>
          <ButtonLink href="/history">View History</ButtonLink>
        </div>
      </div>
    </AppShell>
  );
}
