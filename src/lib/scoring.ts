import { getQuestionsByIds } from "@/lib/quiz";
import type {
  AnswerReview,
  Profile,
  QuestionCategory,
  QuizAnswers,
  QuizResult,
  Rank,
} from "@/types/quiz";

export function scoreQuiz({
  answers,
  date,
  profile,
  questionIds,
}: {
  answers: QuizAnswers;
  date: string;
  profile: Profile;
  questionIds: string[];
}): QuizResult {
  const questions = getQuestionsByIds(questionIds);
  const answerReviews: AnswerReview[] = questions.map((question) => {
    const selectedAnswerId = answers[question.id] ?? null;

    return {
      questionId: question.id,
      selectedAnswerId,
      correctAnswerId: question.correctAnswerId,
      isCorrect: selectedAnswerId === question.correctAnswerId,
      category: question.category,
    };
  });

  const score = answerReviews.filter((answer) => answer.isCorrect).length;
  const total = answerReviews.length;
  const rank = getRank(score);
  const weakAreas = getWeakAreas(answerReviews);

  return {
    date,
    profile,
    score,
    total,
    rank,
    weakAreas,
    recommendation: getRecommendation(score, total, weakAreas),
    answers: answerReviews,
  };
}

export function getRank(score: number): Rank {
  if (score <= 3) {
    return "Needs Refreshing";
  }

  if (score <= 6) {
    return "Building Momentum";
  }

  if (score <= 8) {
    return "Solid Today";
  }

  return "Feeling Sharp";
}

function getWeakAreas(answerReviews: AnswerReview[]) {
  const missedCounts = new Map<QuestionCategory, number>();

  for (const answer of answerReviews) {
    if (!answer.isCorrect) {
      missedCounts.set(answer.category, (missedCounts.get(answer.category) ?? 0) + 1);
    }
  }

  return [...missedCounts.entries()]
    .sort((first, second) => second[1] - first[1])
    .map(([category]) => category)
    .slice(0, 3);
}

function getRecommendation(
  score: number,
  total: number,
  weakAreas: QuestionCategory[],
) {
  if (weakAreas.length > 0) {
    return `Review ${weakAreas.join(", ")} before tomorrow's check.`;
  }

  if (score === total) {
    return "You cleared today's check. Come back tomorrow for a fresh warm-up.";
  }

  return "Review the explanations, then come back tomorrow for a fresh warm-up.";
}
