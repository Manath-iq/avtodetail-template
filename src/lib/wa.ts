import { client } from '../config/client';

/**
 * Генерация ссылки wa.me. Форм с POST на странице нет — submit всегда
 * открывает WhatsApp с уже собранным текстом (секция 8, «Формы без backend»).
 */
export function waLink(message: string): string {
  return `https://wa.me/${client.waPhone}?text=${encodeURIComponent(message.trim())}`;
}

export type QuizMessagePayload = {
  resultName: string;
  resultTime: string;
  resultPrice: string;
  carType: string;
  dateHint: string;
};

/** Формат сообщения из секции 5.1. */
export function quizMessage(p: QuizMessagePayload): string {
  return [
    'Здравствуйте! На сайте выбрал:',
    `— ${p.resultName}`,
    `— Срок: ${p.resultTime}`,
    `— Ориентир: ${p.resultPrice}`,
    `— Авто: ${p.carType}`,
    `— Готов записаться на ${p.dateHint}`,
  ].join('\n');
}

export type CalcMessagePayload = {
  serviceName: string;
  bodyType: string;
  condition: string;
  addons: string;
  finalPrice: string;
  finalTime: string;
};

/** Формат сообщения из секции 5.2. */
export function calcMessage(p: CalcMessagePayload): string {
  return [
    'Здравствуйте! Сайт посчитал ориентир:',
    `— Услуга: ${p.serviceName}`,
    `— Кузов: ${p.bodyType}`,
    `— Состояние: ${p.condition}`,
    `— Дополнения: ${p.addons}`,
    `— Ориентир цены: ${p.finalPrice} ₽`,
    `— Ориентир срока: ${p.finalTime}`,
  ].join('\n');
}

/** Короткие сообщения для кнопок вне механик. */
export const genericMessages = {
  hero: `Здравствуйте! Пишу с сайта ${client.brandName}. Нужен план работ и ориентир по цене.`,
  header: `Здравствуйте! Хочу записаться в ${client.brandName}.`,
  service: (title: string) =>
    `Здравствуйте! Интересует услуга «${title}». Подскажите срок и ориентир стоимости.`,
  price: 'Здравствуйте! Хочу уточнить стоимость и записаться на осмотр.',
  guarantee: 'Здравствуйте! Пришлите, пожалуйста, условия гарантии и порядок оформления заказ-наряда.',
  final: 'Здравствуйте! Опишу проблему — соберите, пожалуйста, план работ, срок и ориентир цены.',
  footer: 'Здравствуйте! Пишу с сайта, нужна консультация по услугам.',
} as const;
