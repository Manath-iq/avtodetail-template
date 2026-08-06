/**
 * Типы конфига клиента.
 *
 * Core-слой (компоненты, анимация, механики) не содержит ни города, ни телефона,
 * ни цен — всё приходит отсюда. См. чек-лист приёмки, п. «Никаких hardcoded
 * city/phone/price вне config нет».
 */

export type ServiceId =
  | 'diagnostic'
  | 'maintenance'
  | 'suspension'
  | 'electrics'
  | 'tires'
  | 'detailing'
  | 'interior'
  | 'ceramics';

/** Ключ score-стека квиза. Порядок в массиве = приоритет при равенстве. */
export type QuizStack = 'diagnostic' | 'repair' | 'detail' | 'seasonal';

export type ServiceCard = {
  id: ServiceId;
  title: string;
  description: string;
  /** «от N ₽». Отсутствие цены = «по осмотру». */
  fromPrice?: number;
  durationHint?: string;
  /** Ключ визуального мотива карточки: lift | scanner | polisher | extractor */
  visual: 'lift' | 'scanner' | 'polisher' | 'extractor';
};

export type PricingConfig = {
  /** Строки прайс-блока (секция 11). */
  diagnosticFrom: number;
  toFrom: number;
  detailingFrom: number;

  /** Допы калькулятора, ₽ (секция 5.2). */
  urgentAddon: number;
  pickupAddon: number;
  materialsAddon: number;

  bodyCoefficients: Record<string, number>;
  conditionCoefficients: Record<string, number>;
};

export type ProofStat = {
  value: string;
  label: string;
  /** Числовая часть для счётчика на скролле. undefined = без анимации. */
  countTo?: number;
  suffix?: string;
};

export type Review = {
  source: '2GIS' | 'Yandex';
  text: string;
  author: string;
  rating?: string;
  date?: string;
  /**
   * true → цитата помечается как демонстрационная.
   * Для реального клиента ставим false и кладём скрин в `screenshot`.
   */
  isDemo: boolean;
  screenshot?: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type ProcessStep = {
  no: string;
  title: string;
  text: string;
};

export type EquipmentItem = {
  title: string;
  note: string;
};

export type ClientConfig = {
  brandName: string;
  brandNameShort: string;
  tagline: string;
  city: string;
  cityIn: string;
  region: string;
  address: string;
  addressNote: string;
  mapUrl: string;
  mapEmbedUrl: string;
  geo: { lat: number; lon: number };
  phone: string;
  phoneHref: string;
  /** Только цифры, для wa.me */
  waPhone: string;
  email: string;
  workHours: string;
  workHoursSchema: string;
  ogrn: string;
  inn: string;
  legalName: string;

  /** Индекс выбранного H1 из heroH1Options. Ровно один вариант на сборку. */
  heroH1Index: 0 | 1 | 2;
  heroH1Options: [string, string, string];
  heroSubhead: string;
  heroCtas: { primary: string; secondary: string };

  proof: {
    years: string;
    posts: string;
    masters: string;
    guaranteeDays: string;
    reviewCount: string;
  };

  /** Яндекс.Метрика. Пусто → счётчик не подключается. */
  metrikaId: string;

  seo: {
    title: string;
    description: string;
    ogImageAlt: string;
  };
};
