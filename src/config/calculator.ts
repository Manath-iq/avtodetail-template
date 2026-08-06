import { pricing } from './pricing';

/**
 * Секция 5.2. Цены, коэффициенты, допы и базовые сроки.
 * Формула и округление — src/lib/calc.ts.
 */

export type CalcOption = {
  id: string;
  label: string;
  note?: string;
};

export type CalcService = CalcOption & {
  basePrice: number;
  /** Базовый срок услуги в минутах. */
  baseMinutes: number;
};

export const calcServices: CalcService[] = [
  {
    id: 'diagnostic',
    label: 'Диагностика',
    note: 'Поиск причины и заключение',
    basePrice: pricing.diagnosticFrom,
    baseMinutes: 60,
  },
  {
    id: 'maintenance',
    label: 'ТО',
    note: 'Регламент по пробегу',
    basePrice: pricing.toFrom,
    baseMinutes: 120,
  },
  {
    id: 'repair',
    label: 'Ремонт',
    note: 'Подвеска, тормоза, электрика',
    basePrice: 4900,
    baseMinutes: 240,
  },
  {
    id: 'detailing',
    label: 'Детейлинг',
    note: 'Кузов, салон, защита',
    basePrice: pricing.detailingFrom,
    baseMinutes: 480,
  },
];

export const calcBodies: (CalcOption & { coef: number })[] = [
  { id: 'sedan', label: 'Седан', coef: pricing.bodyCoefficients.sedan },
  { id: 'crossover', label: 'Кроссовер', coef: pricing.bodyCoefficients.crossover },
  { id: 'suv', label: 'SUV', coef: pricing.bodyCoefficients.suv },
  { id: 'van', label: 'Минивэн', coef: pricing.bodyCoefficients.van },
];

export const calcConditions: (CalcOption & { coef: number })[] = [
  { id: 'light', label: 'Лёгкое', note: 'Плановый визит, без запущенных проблем', coef: pricing.conditionCoefficients.light },
  { id: 'medium', label: 'Среднее', note: 'Есть износ, нужен разбор узла', coef: pricing.conditionCoefficients.medium },
  { id: 'hard', label: 'Сложное', note: 'Запущенное состояние, нужен полный объём', coef: pricing.conditionCoefficients.hard },
];

export const calcAddons: (CalcOption & { price: number })[] = [
  { id: 'urgent', label: 'Срочный приём', note: 'Вне очереди, минус 20% к ожиданию', price: pricing.urgentAddon },
  { id: 'pickup', label: 'Выездная подача или забор', note: 'В пределах города', price: pricing.pickupAddon },
  { id: 'materials', label: 'Дополнительная химия и материалы', note: 'Расширенный набор составов', price: pricing.materialsAddon },
];

/** Надбавка к сроку при «Сложном» состоянии. */
export const HARD_CONDITION_TIME_FACTOR = 1.3;
/** Сокращение ожидания при срочном приёме. */
export const URGENT_TIME_FACTOR = 0.8;
/** Шаг округления итоговой суммы, ₽. */
export const PRICE_ROUNDING_STEP = 50;
