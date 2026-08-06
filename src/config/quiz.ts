import type { QuizStack } from './types';

/**
 * Секция 5.1. Вопросы, варианты, веса и тексты результатов.
 * Движок расчёта — src/lib/quiz-engine.ts. Здесь только данные.
 */

export type QuizWeights = Partial<Record<QuizStack, number>>;

export type QuizOption = {
  id: string;
  label: string;
  /** Подпись под вариантом, помогает выбрать без «Далее». */
  hint?: string;
  weights: QuizWeights;
  /** Значение, которое уходит в текст WhatsApp. */
  echo?: string;
};

export type QuizQuestion = {
  id: 'need' | 'car' | 'when' | 'priority';
  no: string;
  title: string;
  options: QuizOption[];
};

export const quizIntro =
  'Ответьте на 4 вопроса — и получите готовый план работ, срок и вилку цены.';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'need',
    no: '01',
    title: 'Что нужно?',
    options: [
      {
        id: 'diagnostic',
        label: 'Диагностика / поиск причины',
        hint: 'Горит ошибка, стучит, ведёт, не понимаю что',
        weights: { diagnostic: 4 },
      },
      {
        id: 'repair',
        label: 'Ремонт',
        hint: 'Уже знаю, что менять или чинить',
        weights: { repair: 4 },
      },
      {
        id: 'seasonal',
        label: 'Шиномонтаж / сезонка',
        hint: 'Переобувка, балансировка, хранение',
        weights: { seasonal: 4 },
      },
      {
        id: 'detail',
        label: 'Детейлинг / уход',
        hint: 'Полировка, химчистка, керамика, предпродажа',
        weights: { detail: 4 },
      },
    ],
  },
  {
    id: 'car',
    no: '02',
    title: 'Что по авто?',
    options: [
      { id: 'sedan', label: 'Легковой седан', weights: {}, echo: 'седан' },
      { id: 'crossover', label: 'Кроссовер / SUV', weights: {}, echo: 'кроссовер / SUV' },
      {
        id: 'van',
        label: 'Минивэн / большой кузов',
        weights: { detail: 1, seasonal: 1 },
        echo: 'минивэн / большой кузов',
      },
      {
        id: 'unknown',
        label: 'Не знаю',
        hint: 'Подберём по госномеру или VIN при записи',
        weights: { diagnostic: 3 },
        echo: 'уточним при записи',
      },
    ],
  },
  {
    id: 'when',
    no: '03',
    title: 'Когда нужно?',
    options: [
      {
        id: 'today',
        label: 'Сегодня',
        weights: { repair: 2, seasonal: 2 },
        echo: 'сегодня',
      },
      { id: 'soon', label: 'В ближайшие 2–3 дня', weights: {}, echo: 'ближайшие 2–3 дня' },
      { id: 'week', label: 'На этой неделе', weights: {}, echo: 'эту неделю' },
      { id: 'later', label: 'Пока изучаю', weights: {}, echo: 'удобную дату' },
    ],
  },
  {
    id: 'priority',
    no: '04',
    title: 'Что важнее?',
    options: [
      { id: 'price', label: 'Цена', weights: { repair: 1, seasonal: 1 } },
      { id: 'time', label: 'Срок', weights: {} },
      { id: 'quality', label: 'Качество / гарантия', weights: { detail: 2, repair: 1 } },
      { id: 'max', label: 'Хочу максимум результата', weights: { detail: 3 } },
    ],
  },
];

export type QuizResult = {
  name: string;
  time: string;
  price: string;
  includes: string[];
};

/** Тексты результатов по стекам. Правятся под прайс конкретного клиента. */
export const quizResults: Record<QuizStack, QuizResult> = {
  diagnostic: {
    name: 'Диагностика с письменным заключением',
    time: '40–90 минут',
    price: '1 500–3 400 ₽',
    includes: [
      'считывание ошибок по всем блокам',
      'проверка узла, который их вызвал',
      'лист с причиной и перечнем работ',
      'расчёт ремонта до начала работ',
    ],
  },
  repair: {
    name: 'Диагностика + ремонт по заказ-наряду',
    time: '2–6 часов',
    price: '4 900–14 800 ₽',
    includes: [
      'первичная диагностика и проверка ходовой',
      'перечень позиций с ценой по каждой строке',
      'согласование допработ до выполнения',
      'сход-развал после ремонта подвески',
    ],
  },
  detail: {
    name: 'Детейлинг: подготовка кузова и салона',
    time: 'от 1 рабочего дня',
    price: '9 500–34 000 ₽',
    includes: [
      'двухфазная мойка и дезинфекция ЛКП',
      'замер толщиномером и подбор стадии полировки',
      'химчистка салона экстрактором и паром',
      'защитный состав с указанием срока обслуживания',
    ],
  },
  seasonal: {
    name: 'Сезонный визит: шины и проверка перед сезоном',
    time: '40–90 минут',
    price: '2 200–5 600 ₽',
    includes: [
      'переобувка комплекта и балансировка',
      'проверка тормозов и уровня жидкостей',
      'осмотр подвески на подъёмнике',
      'хранение второго комплекта по договору',
    ],
  },
};

/** Fallback, если пользователь как-то дошёл до результата без ответов. */
export const quizFallbackStack: QuizStack = 'diagnostic';

/** Приоритет при равенстве стеков (секция 5.1). */
export const quizTiebreak: QuizStack[] = ['diagnostic', 'repair', 'detail', 'seasonal'];
