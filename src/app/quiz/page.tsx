"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ButtonLink } from "@/components/Button";
import { QuestionCard } from "@/components/QuestionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { getOrCreateDailyQuiz, getQuestionsByIds } from "@/lib/quiz";
import { scoreQuiz } from "@/lib/scoring";
import {
  getDailyQuiz,
  getProfile,
  getQuizAnswers,
  saveDailyResult,
  saveQuizAnswer,
  subscribeToStorage,
} from "@/lib/storage";

export default function QuizPage() {
  const router = useRouter();
  const profile = useSyncExternalStore(subscribeToStorage, getProfile, () => null);
  const quiz = useSyncExternalStore(subscribeToStorage, getDailyQuiz, () => null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const quizQuestions = useMemo(
    () => (quiz ? getQuestionsByIds(quiz.questionIds) : []),
    [quiz],
  );
  const currentQuestion = quizQuestions[questionIndex] ?? null;

  useEffect(() => {
    if (!profile) {
      router.replace("/setup");
      return;
    }

    if (!quiz) {
      getOrCreateDailyQuiz(profile);
    }
  }, [profile, quiz, router]);

  function handleNext() {
    if (!profile || !quiz || !currentQuestion || !selectedAnswerId) {
      return;
    }

    saveQuizAnswer(currentQuestion.id, selectedAnswerId);

    if (questionIndex < quizQuestions.length - 1) {
      const nextQuestion = quizQuestions[questionIndex + 1];
      setQuestionIndex((current) => current + 1);
      setSelectedAnswerId(
        nextQuestion ? getQuizAnswers()[nextQuestion.id] ?? null : null,
      );
      return;
    }

    const result = scoreQuiz({
      answers: {
        ...getQuizAnswers(),
        [currentQuestion.id]: selectedAnswerId,
      },
      date: quiz.date,
      profile,
      questionIds: quiz.questionIds,
    });

    saveDailyResult(result);
    router.push("/result");
  }

  if (!profile || !quiz || !currentQuestion) {
    return (
      <AppShell eyebrow="Quiz">
        <div className="flex flex-1 items-center justify-center py-12">
          <p className="text-sm font-medium text-zinc-600">Preparing today&apos;s check...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell eyebrow={profile.stack}>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 py-8">
        <ProgressBar current={questionIndex + 1} total={quizQuestions.length} />
        <QuestionCard
          isFinalQuestion={questionIndex === quizQuestions.length - 1}
          onNext={handleNext}
          onSelect={(answerId) => {
            saveQuizAnswer(currentQuestion.id, answerId);
            setSelectedAnswerId(answerId);
          }}
          question={currentQuestion}
          selectedAnswerId={
            selectedAnswerId ?? getQuizAnswers()[currentQuestion.id] ?? null
          }
        />
        <div className="flex justify-center">
          <ButtonLink href="/" variant="ghost">
            Back Home
          </ButtonLink>
        </div>
      </div>
    </AppShell>
  );
}
