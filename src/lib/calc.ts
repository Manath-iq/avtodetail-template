import {
  calcServices,
  calcBodies,
  calcConditions,
  calcAddons,
  HARD_CONDITION_TIME_FACTOR,
  URGENT_TIME_FACTOR,
  PRICE_ROUNDING_STEP,
} from '../config/calculator';

/**
 * Секция 5.2.
 *
 *   final_price = base_service_price × body_coef × condition_coef + addon_sum
 *
 * Срок: base_minutes, «Сложное» → ×1.3, «Срочный приём» → ×0.8 к ожиданию.
 */

export type CalcState = {
  serviceId: string;
  bodyId: string;
  conditionId: string;
  addonIds: string[];
};

export type CalcOutcome = {
  price: number;
  priceFormatted: string;
  minutes: number;
  timeFormatted: string;
  /** Строки «что влияет» для карточки результата. */
  factors: string[];
  serviceName: string;
  bodyName: string;
  conditionName: string;
  addonsName: string;
};

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
    .format(value)
    .replace(/ /g, ' ');
}

export function formatDuration(minutes: number): string {
  const total = Math.max(15, Math.round(minutes / 5) * 5);

  if (total >= 8 * 60) {
    const days = total / (8 * 60);
    if (days >= 2) return `от ${Math.round(days)} рабочих дней`;
    return 'от 1 рабочего дня';
  }

  const h = Math.floor(total / 60);
  const m = total % 60;

  const hoursWord = (n: number) => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 'час';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'часа';
    return 'часов';
  };

  if (h === 0) return `${m} минут`;
  if (m === 0) return `${h} ${hoursWord(h)}`;
  return `${h} ${hoursWord(h)} ${m} минут`;
}

export function calculate(state: CalcState): CalcOutcome {
  const service = calcServices.find((s) => s.id === state.serviceId) ?? calcServices[0];
  const body = calcBodies.find((b) => b.id === state.bodyId) ?? calcBodies[0];
  const condition =
    calcConditions.find((c) => c.id === state.conditionId) ?? calcConditions[0];
  const addons = calcAddons.filter((a) => state.addonIds.includes(a.id));

  const addonSum = addons.reduce((sum, a) => sum + a.price, 0);
  const rawPrice = service.basePrice * body.coef * condition.coef + addonSum;
  const price = roundTo(rawPrice, PRICE_ROUNDING_STEP);

  let minutes = service.baseMinutes;
  if (condition.id === 'hard') minutes *= HARD_CONDITION_TIME_FACTOR;
  if (state.addonIds.includes('urgent')) minutes *= URGENT_TIME_FACTOR;

  // Аббревиатуры вроде SUV не переводим в нижний регистр.
  const factors: string[] = [body.label, `${condition.label.toLowerCase()} состояние`];
  for (const a of addons) factors.push(a.label.toLowerCase());

  return {
    price,
    priceFormatted: formatPrice(price),
    minutes,
    timeFormatted: formatDuration(minutes),
    factors,
    serviceName: service.label,
    bodyName: body.label,
    conditionName: condition.label,
    addonsName: addons.length ? addons.map((a) => a.label).join(', ') : 'без дополнений',
  };
}

export const calcDefaults: CalcState = {
  serviceId: calcServices[0].id,
  bodyId: calcBodies[0].id,
  conditionId: calcConditions[0].id,
  addonIds: [],
};
