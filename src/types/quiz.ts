export type Role =
  | "Frontend Developer"
  | "Mobile Developer"
  | "Full-stack Developer"
  | "Student / Beginner";

export type Stack = "React" | "JavaScript" | "Flutter";

export type ExperienceLevel = "Beginner" | "Junior" | "Mid-level" | "Senior";

export type Goal =
  | "Interview prep"
  | "Stay sharp"
  | "Find weak areas"
  | "Daily warm-up";

export type Profile = {
  role: Role;
  stack: Stack;
  level: ExperienceLevel;
  goal: Goal;
};

export type QuestionCategory =
  | "Components"
  | "State"
  | "Effects"
  | "JavaScript"
  | "Async"
  | "Debugging"
  | "Performance"
  | "Flutter Widgets"
  | "Dart"
  | "Architecture";

export type QuestionDifficulty = "Beginner" | "Junior" | "Mid-level" | "Senior";

export type AnswerOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  stack: Stack;
  level: QuestionDifficulty;
  category: QuestionCategory;
  prompt: string;
  options: AnswerOption[];
  correctAnswerId: string;
  explanation: string;
};

export type DailyQuiz = {
  date: string;
  profileKey: string;
  questionIds: string[];
};

export type QuizAnswers = Record<string, string>;

export type AnswerReview = {
  questionId: string;
  selectedAnswerId: string | null;
  correctAnswerId: string;
  isCorrect: boolean;
  category: QuestionCategory;
};

export type Rank =
  | "Needs Refreshing"
  | "Building Momentum"
  | "Solid Today"
  | "Feeling Sharp";

export type QuizResult = {
  date: string;
  profile: Profile;
  score: number;
  total: number;
  rank: Rank;
  weakAreas: QuestionCategory[];
  recommendation: string;
  answers: AnswerReview[];
};

export type DailyResultSummary = {
  date: string;
  stack: Stack;
  level: ExperienceLevel;
  score: number;
  total: number;
  rank: Rank;
};
