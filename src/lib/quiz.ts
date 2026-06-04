import { questions } from "@/data/questions";
import { getTodayKey } from "@/lib/date";
import {
  getDailyQuiz,
  saveDailyQuiz,
} from "@/lib/storage";
import type { AnswerOption, DailyQuiz, Profile, Question } from "@/types/quiz";

const QUIZ_SIZE = 10;

export function getProfileKey(profile: Profile) {
  return `${profile.role}|${profile.stack}|${profile.level}|${profile.goal}`;
}

export function getQuestionsByIds(questionIds: string[]) {
  const byId = new Map(questions.map((question) => [question.id, question]));
  return questionIds
    .map((questionId) => byId.get(questionId))
    .filter((question): question is Question => Boolean(question));
}

export function getQuestionsForQuiz(quiz: DailyQuiz) {
  return getQuestionsByIds(quiz.questionIds).map((question) => ({
    ...question,
    options: shuffleAnswerOptions(
      question.options,
      `${quiz.date}|${quiz.profileKey}|${question.id}|options`,
    ),
  }));
}

export function generateDailyQuiz(profile: Profile, date = getTodayKey()): DailyQuiz {
  const profileKey = getProfileKey(profile);
  const seed = `${date}|${profileKey}`;
  const candidates = getCandidateQuestions(profile);
  const questionIds = seededShuffle(candidates, seed)
    .slice(0, QUIZ_SIZE)
    .map((question) => question.id);

  return {
    date,
    profileKey,
    questionIds,
  };
}

export function getOrCreateDailyQuiz(profile: Profile, date = getTodayKey()) {
  const existingQuiz = getDailyQuiz();
  const profileKey = getProfileKey(profile);

  if (
    existingQuiz &&
    existingQuiz.date === date &&
    existingQuiz.profileKey === profileKey &&
    existingQuiz.questionIds.length === QUIZ_SIZE
  ) {
    return existingQuiz;
  }

  const quiz = generateDailyQuiz(profile, date);
  saveDailyQuiz(quiz);
  return quiz;
}

function getCandidateQuestions(profile: Profile) {
  const stackQuestions = questions.filter((question) => question.stack === profile.stack);

  if (stackQuestions.length >= QUIZ_SIZE) {
    return stackQuestions;
  }

  return [
    ...stackQuestions,
    ...questions.filter((question) => question.stack !== profile.stack),
  ];
}

function shuffleAnswerOptions(options: AnswerOption[], seed: string) {
  return seededShuffle(options, seed);
}

function seededShuffle<T>(items: T[], seed: string) {
  const shuffled = [...items];
  const random = mulberry32(hashString(seed));

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
