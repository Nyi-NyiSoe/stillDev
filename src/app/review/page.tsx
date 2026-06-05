"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { AppShell } from "@/components/AppShell";
import { Button, ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { getQuestionsByIds } from "@/lib/quiz";
import {
  getReviewQueue,
  markQuestionReviewed,
  removeQuestionFromReview,
  removeReviewedQuestionsFromReview,
  restoreReviewQueueItems,
  subscribeToStorage,
} from "@/lib/storage";
import type { Question, QuestionCategory, ReviewQueueItem } from "@/types/quiz";

type ReviewItem = {
  question: Question;
  reviewItem: ReviewQueueItem;
};

type UndoState = {
  items: ReviewQueueItem[];
  message: string;
} | null;

export default function ReviewPage() {
  const reviewQueue = useSyncExternalStore(subscribeToStorage, getReviewQueue, () => []);
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [undoState, setUndoState] = useState<UndoState>(null);
  const questions = useMemo(
    () => getQuestionsByIds(reviewQueue.map((item) => item.questionId)),
    [reviewQueue],
  );
  const groupedQuestions = useMemo(() => {
    const byId = new Map(questions.map((question) => [question.id, question]));
    const groups = new Map<QuestionCategory, ReviewItem[]>();

    for (const reviewItem of reviewQueue) {
      const question = byId.get(reviewItem.questionId);

      if (!question) {
        continue;
      }

      groups.set(question.category, [
        ...(groups.get(question.category) ?? []),
        {
          question,
          reviewItem,
        },
      ]);
    }

    return [...groups.entries()];
  }, [questions, reviewQueue]);
  const reviewedCount = reviewQueue.filter((item) => item.reviewedAt).length;

  function toggleQuestion(questionId: string) {
    setExpandedQuestionIds((current) => {
      const next = new Set(current);

      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }

      return next;
    });
  }

  function removeSavedQuestion(item: ReviewQueueItem, prompt: string) {
    removeQuestionFromReview(item.questionId);
    setExpandedQuestionIds((current) => {
      const next = new Set(current);
      next.delete(item.questionId);
      return next;
    });
    setUndoState({
      items: [item],
      message: `Removed "${getPromptPreview(prompt, 64)}" from Review Later.`,
    });
  }

  function removeReviewedQuestions() {
    const removedItems = removeReviewedQuestionsFromReview();

    if (removedItems.length === 0) {
      return;
    }

    setExpandedQuestionIds((current) => {
      const next = new Set(current);

      for (const item of removedItems) {
        next.delete(item.questionId);
      }

      return next;
    });
    setUndoState({
      items: removedItems,
      message: `Removed ${removedItems.length} reviewed ${removedItems.length === 1 ? "question" : "questions"}.`,
    });
  }

  function undoRemoval() {
    if (!undoState) {
      return;
    }

    restoreReviewQueueItems(undoState.items);
    setUndoState(null);
  }

  return (
    <AppShell eyebrow="Review">
      <div className="mx-auto w-full max-w-4xl space-y-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-50">Review Later</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              A small queue for questions worth seeing again. Review one when it
              is useful, then mark it done.
            </p>
          </div>
          {reviewedCount > 0 ? (
            <Button onClick={removeReviewedQuestions} type="button" variant="ghost">
              Remove reviewed
            </Button>
          ) : null}
        </div>

        {undoState ? (
          <div
            aria-live="polite"
            className="flex flex-col gap-3 rounded-md border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300 sm:flex-row sm:items-center sm:justify-between"
            role="status"
          >
            <span>{undoState.message}</span>
            <Button onClick={undoRemoval} type="button" variant="secondary">
              Undo removal
            </Button>
          </div>
        ) : (
          <div aria-live="polite" className="sr-only" role="status">
            Review queue ready.
          </div>
        )}

        {groupedQuestions.length === 0 ? (
          <Card>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-50">
                  Nothing saved yet
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Save a question after checking an answer or from today&apos;s
                  result review. Keep the queue small enough to revisit without
                  pressure.
                </p>
              </div>
              <ButtonLink href="/">Start today&apos;s check</ButtonLink>
            </div>
          </Card>
        ) : (
          <div className="space-y-5">
            {groupedQuestions.map(([category, items]) => (
              <Card key={category}>
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-semibold text-zinc-50">
                    {category}
                  </h2>
                  <span className="text-sm font-medium text-zinc-400">
                    {items.length} saved
                  </span>
                </div>

                <div className="space-y-3">
                  {items.map(({ question, reviewItem }) => {
                    const isExpanded = expandedQuestionIds.has(question.id);
                    const isReviewed = Boolean(reviewItem.reviewedAt);
                    const correctAnswer = question.options.find(
                      (option) => option.id === question.correctAnswerId,
                    );

                    return (
                      <article
                        className={`rounded-md border p-4 transition ${
                          isReviewed
                            ? "border-zinc-900 bg-zinc-950/70"
                            : "border-zinc-800 bg-zinc-900/60"
                        }`}
                        key={question.id}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                              <span className="text-emerald-300">
                                {question.category}
                              </span>
                              <span className="text-zinc-500" aria-hidden="true">
                                /
                              </span>
                              <span className="text-zinc-300">
                                {question.stack}
                              </span>
                              <span className="text-zinc-500" aria-hidden="true">
                                /
                              </span>
                              <span className="text-zinc-300">
                                Saved {formatSavedAt(reviewItem.savedAt)}
                              </span>
                              {isReviewed ? (
                                <span
                                  className="rounded-full border border-zinc-700 px-2 py-0.5 text-zinc-300"
                                  aria-label="This question has been marked reviewed"
                                >
                                  Reviewed
                                </span>
                              ) : null}
                            </div>
                            <h3
                              className={`mt-2 text-base font-semibold leading-6 ${
                                isReviewed ? "text-zinc-300" : "text-zinc-50"
                              }`}
                            >
                              {getPromptPreview(question.prompt)}
                            </h3>
                          </div>

                          <div className="flex flex-col gap-2 sm:items-end">
                            <Button
                              aria-controls={`review-details-${question.id}`}
                              aria-expanded={isExpanded}
                              onClick={() => toggleQuestion(question.id)}
                              type="button"
                              variant="secondary"
                            >
                              {isExpanded ? "Hide details" : "Show details"}
                            </Button>
                            <Button
                              disabled={isReviewed}
                              onClick={() => markQuestionReviewed(question.id)}
                              type="button"
                              variant="ghost"
                            >
                              {isReviewed ? "Reviewed" : "Mark reviewed"}
                            </Button>
                          </div>
                        </div>

                        {isExpanded ? (
                          <div
                            className="mt-4 border-t border-zinc-800 pt-4"
                            id={`review-details-${question.id}`}
                          >
                            <div className="rounded-md border border-zinc-800 bg-zinc-950 p-4">
                              <p className="text-sm font-semibold text-zinc-50">
                                Correct answer
                              </p>
                              <p className="mt-2 text-sm leading-6 text-zinc-300">
                                {correctAnswer?.text}
                              </p>
                            </div>

                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                              <div>
                                <p className="text-sm font-semibold text-zinc-50">
                                  Explanation
                                </p>
                                <p className="mt-2 text-sm leading-6 text-zinc-400">
                                  {question.explanation}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-zinc-50">
                                  Why developers miss this
                                </p>
                                <p className="mt-2 text-sm leading-6 text-zinc-400">
                                  {question.whyDevelopersMissThis}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 flex justify-start">
                              <Button
                                onClick={() =>
                                  removeSavedQuestion(reviewItem, question.prompt)
                                }
                                type="button"
                                variant="ghost"
                              >
                                Remove from review
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        )}

        {groupedQuestions.length > 0 ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" variant="secondary">
              Back Home
            </ButtonLink>
            <ButtonLink href="/history" variant="ghost">
              View History
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}

function formatSavedAt(savedAt: string) {
  const date = new Date(savedAt);

  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getPromptPreview(prompt: string, maxLength = 140) {
  if (prompt.length <= maxLength) {
    return prompt;
  }

  return `${prompt.slice(0, maxLength - 1).trim()}...`;
}
