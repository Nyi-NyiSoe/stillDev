import { getTodayKey } from "@/lib/date";
import type {
  DailyQuiz,
  DailyResultSummary,
  Profile,
  QuizAnswers,
  QuizResult,
  ReviewQueueItem,
} from "@/types/quiz";

const STORAGE_KEYS = {
  profile: "stilldev.profile.v1",
  dailyQuiz: "stilldev.dailyQuiz.v1",
  answers: "stilldev.answers.v1",
  dailyResult: "stilldev.dailyResult.v1",
  history: "stilldev.history.v1",
  reviewQueue: "stilldev.reviewQueue.v1",
} as const;

const EMPTY_ANSWERS: QuizAnswers = {};
const EMPTY_HISTORY: DailyResultSummary[] = [];
const EMPTY_REVIEW_QUEUE: ReviewQueueItem[] = [];
const jsonCache = new Map<string, { raw: string; value: unknown }>();

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      jsonCache.delete(key);
      return null;
    }

    const cached = jsonCache.get(key);
    if (cached?.raw === raw) {
      return cached.value as T;
    }

    const value = JSON.parse(raw) as T;
    jsonCache.set(key, { raw, value });
    return value;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
  notifyStorageSubscribers();
}

function removeValue(key: string) {
  window.localStorage.removeItem(key);
  notifyStorageSubscribers();
}

export function getProfile() {
  return readJson<Profile>(STORAGE_KEYS.profile);
}

export function saveProfile(profile: Profile) {
  writeJson(STORAGE_KEYS.profile, profile);
}

export function getDailyQuiz() {
  return readJson<DailyQuiz>(STORAGE_KEYS.dailyQuiz);
}

export function saveDailyQuiz(quiz: DailyQuiz) {
  writeJson(STORAGE_KEYS.dailyQuiz, quiz);
  writeJson(STORAGE_KEYS.answers, {});
  removeValue(STORAGE_KEYS.dailyResult);
}

export function getQuizAnswers() {
  return readJson<QuizAnswers>(STORAGE_KEYS.answers) ?? EMPTY_ANSWERS;
}

export function saveQuizAnswer(questionId: string, answerId: string) {
  const answers = getQuizAnswers();
  writeJson(STORAGE_KEYS.answers, {
    ...answers,
    [questionId]: answerId,
  });
}

export function saveQuizAnswers(answers: QuizAnswers) {
  writeJson(STORAGE_KEYS.answers, answers);
}

export function getDailyResult(date = getTodayKey()) {
  const result = readJson<QuizResult>(STORAGE_KEYS.dailyResult);
  return result?.date === date ? result : null;
}

export function saveDailyResult(result: QuizResult) {
  writeJson(STORAGE_KEYS.dailyResult, result);
  saveHistoryEntry(toHistoryEntry(result));
}

export function getHistory() {
  return readJson<DailyResultSummary[]>(STORAGE_KEYS.history) ?? EMPTY_HISTORY;
}

export function getReviewQueue() {
  return readJson<ReviewQueueItem[]>(STORAGE_KEYS.reviewQueue) ?? EMPTY_REVIEW_QUEUE;
}

export function isQuestionSavedForReview(questionId: string) {
  return getReviewQueue().some((item) => item.questionId === questionId);
}

export function saveQuestionForReview(questionId: string) {
  const reviewQueue = getReviewQueue();

  if (reviewQueue.some((item) => item.questionId === questionId)) {
    return;
  }

  writeJson(STORAGE_KEYS.reviewQueue, [
    {
      questionId,
      savedAt: new Date().toISOString(),
    },
    ...reviewQueue,
  ]);
}

export function removeQuestionFromReview(questionId: string) {
  writeJson(
    STORAGE_KEYS.reviewQueue,
    getReviewQueue().filter((item) => item.questionId !== questionId),
  );
}

export function markQuestionReviewed(questionId: string) {
  writeJson(
    STORAGE_KEYS.reviewQueue,
    getReviewQueue().map((item) =>
      item.questionId === questionId
        ? {
            ...item,
            reviewedAt: item.reviewedAt ?? new Date().toISOString(),
          }
        : item,
    ),
  );
}

export function restoreReviewQueueItems(items: ReviewQueueItem[]) {
  const reviewQueue = getReviewQueue();
  const existingQuestionIds = new Set(reviewQueue.map((item) => item.questionId));
  const restoredItems = items.filter(
    (item) => !existingQuestionIds.has(item.questionId),
  );

  if (restoredItems.length === 0) {
    return;
  }

  writeJson(STORAGE_KEYS.reviewQueue, [...restoredItems, ...reviewQueue]);
}

export function removeReviewedQuestionsFromReview() {
  const reviewQueue = getReviewQueue();
  const reviewedItems = reviewQueue.filter((item) => item.reviewedAt);

  if (reviewedItems.length === 0) {
    return [];
  }

  writeJson(
    STORAGE_KEYS.reviewQueue,
    reviewQueue.filter((item) => !item.reviewedAt),
  );

  return reviewedItems;
}

function saveHistoryEntry(entry: DailyResultSummary) {
  const history = getHistory();
  const nextHistory = [
    entry,
    ...history.filter((item) => item.date !== entry.date),
  ].sort((first, second) => second.date.localeCompare(first.date));

  writeJson(STORAGE_KEYS.history, nextHistory);
}

function toHistoryEntry(result: QuizResult): DailyResultSummary {
  return {
    date: result.date,
    stack: result.profile.stack,
    level: result.profile.level,
    score: result.score,
    total: result.total,
    rank: result.rank,
  };
}

export function subscribeToStorage(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", listener);
  window.addEventListener("stilldev-storage", listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener("stilldev-storage", listener);
  };
}

function notifyStorageSubscribers() {
  window.dispatchEvent(new Event("stilldev-storage"));
}
