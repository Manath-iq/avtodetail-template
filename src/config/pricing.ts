import type { PricingConfig } from './types';

/**
 * Секция 11 «Цены / условия» + коэффициенты калькулятора (5.2).
 * Все числа правятся здесь, формулы — в src/lib/calc.ts.
 */
export const pricing: PricingConfig = {
  diagnosticFrom: 1500,
  toFrom: 3200,
  detailingFrom: 9500,

  urgentAddon: 1800,
  pickupAddon: 1500,
  materialsAddon: 2600,

  bodyCoefficients: {
    sedan: 1.0,
    crossover: 1.15,
    suv: 1.25,
    van: 1.35,
  },

  conditionCoefficients: {
    light: 1.0,
    medium: 1.2,
    hard: 1.45,
  },
};

/** Строки прайс-блока на странице. */
export const priceRows = [
  {
    title: 'Диагностика',
    note: 'Считывание ошибок, проверка узла, письменное заключение',
    from: pricing.diagnosticFrom,
    unit: 'за обращение',
  },
  {
    title: 'ТО и расходники',
    note: 'Работа без стоимости расходников, подбор по VIN',
    from: pricing.toFrom,
    unit: 'за регламент',
  },
  {
    title: 'Ремонт подвески и тормозов',
    note: 'Стоимость нормо-часа, точный объём — после подъёмника',
    from: 2400,
    unit: 'за нормо-час',
  },
  {
    title: 'Шиномонтаж',
    note: 'Комплект R16, балансировка включена',
    from: 2200,
    unit: 'за комплект',
  },
  {
    title: 'Детейлинг кузова',
    note: 'Мойка, дезинфекция ЛКП, полировка в одну стадию',
    from: pricing.detailingFrom,
    unit: 'за кузов',
  },
  {
    title: 'Химчистка салона',
    note: 'Экстрактор, пар, пластик и потолок',
    from: 7000,
    unit: 'за салон',
  },
  {
    title: 'Керамика и защита',
    note: 'Подготовка ЛКП и нанесение состава',
    from: 21000,
    unit: 'за кузов',
  },
] as const;
