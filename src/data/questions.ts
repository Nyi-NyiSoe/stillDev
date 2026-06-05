import flutterQuestions from "@/content/questions/flutter.json";
import javascriptQuestions from "@/content/questions/javascript.json";
import reactQuestions from "@/content/questions/react.json";
import type { Question } from "@/types/quiz";

export const questions: Question[] = [
  ...reactQuestions,
  ...javascriptQuestions,
  ...flutterQuestions,
] as Question[];
