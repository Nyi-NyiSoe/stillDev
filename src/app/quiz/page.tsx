"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ButtonLink } from "@/components/Button";
import { QuestionCard } from "@/components/QuestionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { getOrCreateDailyQuiz, getQuestionsForQuiz } from "@/lib/quiz";
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
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const quizQuestions = useMemo(
    () => (quiz ? getQuestionsForQuiz(quiz) : []),
    [quiz],
  );
  const currentQuestion = quizQuestions[questionIndex] ?? null;
  const savedAnswerId = currentQuestion
    ? getQuizAnswers()[currentQuestion.id] ?? null
    : null;
  const activeAnswerId = selectedAnswerId ?? savedAnswerId;
  const activeAnswerChecked = isAnswerChecked || Boolean(savedAnswerId);

  useEffect(() => {
    if (!profile) {
      router.replace("/setup");
      return;
    }

    if (!quiz) {
      getOrCreateDailyQuiz(profile);
    }
  }, [profile, quiz, router]);

  function handleCheckAnswer() {
    if (!currentQuestion || !activeAnswerId) {
      return;
    }

    saveQuizAnswer(currentQuestion.id, activeAnswerId);
    setIsAnswerChecked(true);
  }

  function handleNext() {
    if (!profile || !quiz || !currentQuestion || !activeAnswerId || !activeAnswerChecked) {
      return;
    }

    if (questionIndex < quizQuestions.length - 1) {
      setQuestionIndex((current) => current + 1);
      setSelectedAnswerId(null);
      setIsAnswerChecked(false);
      return;
    }

    const result = scoreQuiz({
      answers: {
        ...getQuizAnswers(),
        [currentQuestion.id]: activeAnswerId,
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
          <p className="text-sm font-medium text-zinc-400">
            Preparing today&apos;s warm-up from your saved profile...
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell eyebrow={profile.stack}>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 py-8">
        <ProgressBar current={questionIndex + 1} total={quizQuestions.length} />
        <QuestionCard
          isAnswerChecked={activeAnswerChecked}
          isFinalQuestion={questionIndex === quizQuestions.length - 1}
          onCheck={handleCheckAnswer}
          onNext={handleNext}
          onSelect={setSelectedAnswerId}
          question={currentQuestion}
          selectedAnswerId={activeAnswerId}
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
