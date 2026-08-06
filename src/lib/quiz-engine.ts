import {
  quizQuestions,
  quizResults,
  quizFallbackStack,
  quizTiebreak,
  type QuizOption,
  type QuizResult,
} from '../config/quiz';
import type { QuizStack } from '../config/types';

export type QuizAnswers = Partial<Record<string, string>>;

export type QuizScores = Record<QuizStack, number>;

const EMPTY_SCORES: QuizScores = { diagnostic: 0, repair: 0, detail: 0, seasonal: 0 };

function findOption(questionId: string, optionId: string): QuizOption | undefined {
  return quizQuestions.find((q) => q.id === questionId)?.options.find((o) => o.id === optionId);
}

/** Считает 4 score-стека по весам из конфига. */
export function scoreAnswers(answers: QuizAnswers): QuizScores {
  const scores: QuizScores = { ...EMPTY_SCORES };

  for (const [questionId, optionId] of Object.entries(answers)) {
    if (!optionId) continue;
    const option = findOption(questionId, optionId);
    if (!option) continue;
    for (const [stack, weight] of Object.entries(option.weights)) {
      scores[stack as QuizStack] += weight ?? 0;
    }
  }

  return scores;
}

/**
 * Максимальный стек. При равенстве — приоритет diagnostic > repair > detail > seasonal:
 * человеку проще согласовать точку входа через диагностику.
 */
export function pickStack(scores: QuizScores): QuizStack {
  const max = Math.max(...quizTiebreak.map((s) => scores[s]));
  if (max <= 0) return quizFallbackStack;
  return quizTiebreak.find((s) => scores[s] === max) ?? quizFallbackStack;
}

export type QuizOutcome = {
  stack: QuizStack;
  result: QuizResult;
  carType: string;
  dateHint: string;
  scores: QuizScores;
};

export function resolveQuiz(answers: QuizAnswers): QuizOutcome {
  const scores = scoreAnswers(answers);
  const stack = pickStack(scores);

  const carOption = answers.car ? findOption('car', answers.car) : undefined;
  const whenOption = answers.when ? findOption('when', answers.when) : undefined;

  return {
    stack,
    result: quizResults[stack],
    carType: carOption?.echo ?? 'уточним при записи',
    dateHint: whenOption?.echo ?? 'удобную дату',
    scores,
  };
}

export const totalQuestions = quizQuestions.length;

export function isComplete(answers: QuizAnswers): boolean {
  return quizQuestions.every((q) => Boolean(answers[q.id]));
}

export function answeredCount(answers: QuizAnswers): number {
  return quizQuestions.filter((q) => Boolean(answers[q.id])).length;
}
