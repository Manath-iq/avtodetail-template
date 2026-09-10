import type { ServiceCard } from './types';

/**
 * Секция 4 «Категории услуг».
 * Ассеты: свой визуальный мотив на каждую карточку — одинаковые кадры
 * в соседних ячейках сетки выдавали шаблон.
 */
export const services: ServiceCard[] = [
  {
    id: 'diagnostic',
    title: 'Диагностика',
    description:
      'Сканируем блоки, снимаем ошибки и проверяем узел, который реально их вызвал. На выходе — лист с причиной и перечнем работ.',
    fromPrice: 1500,
    durationHint: '40–90 мин',
    visual: 'scanner',
  },
  {
    id: 'maintenance',
    title: 'ТО и расходники',
    description:
      'Масло, фильтры, свечи, жидкости по регламенту вашего пробега. Показываем снятые расходники после работы.',
    fromPrice: 3200,
    durationHint: '1,5–3 ч',
    visual: 'service',
  },
  {
    id: 'suspension',
    title: 'Подвеска и тормоза',
    description:
      'Диагностика стуков, замена стоек, рычагов, сайлентблоков, колодок и дисков. Со сход-развалом после ремонта.',
    fromPrice: 2400,
    durationHint: '2–6 ч',
    visual: 'lift',
  },
  {
    id: 'electrics',
    title: 'Электрика и ошибки',
    description:
      'Ищем обрыв, замыкание и просадку питания по схеме. Чиним причину, а не сбрасываем ошибку на приборке.',
    fromPrice: 1800,
    durationHint: '1–4 ч',
    visual: 'electrics',
  },
  {
    id: 'tires',
    title: 'Шиномонтаж',
    description:
      'Сезонная переобувка, балансировка, ремонт проколов и боковых порезов. Хранение комплекта по договору.',
    fromPrice: 2200,
    durationHint: '40–60 мин',
    visual: 'tires',
  },
  {
    id: 'detailing',
    title: 'Детейлинг кузова',
    description:
      'Мойка в два этапа, дезинфекция ЛКП, полировка в 1–3 стадии под контрольной лампой с замером толщиномером.',
    fromPrice: 9500,
    durationHint: 'от 1 дня',
    visual: 'polisher',
  },
  {
    id: 'interior',
    title: 'Химчистка салона',
    description:
      'Экстрактор и сухой пар по ткани, потолку и пластику. Кожа — отдельным составом с последующим питанием.',
    fromPrice: 7000,
    durationHint: '4–8 ч',
    visual: 'extractor',
  },
  {
    id: 'ceramics',
    title: 'Керамика и защита',
    description:
      'Керамический состав или полиуретан на подготовленный кузов. Пишем в заказ-наряд срок обслуживания покрытия.',
    fromPrice: 21000,
    durationHint: 'от 2 дней',
    visual: 'ceramic',
  },
];
