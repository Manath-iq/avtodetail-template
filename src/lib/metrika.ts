/**
 * Цели Яндекс.Метрики (секция 8).
 * Если client.metrikaId пуст — счётчик не подключается, вызовы просто no-op.
 */
export type MetrikaGoal =
  /* Первый экран: шапка, hero, бланк заказ-наряда */
  | 'hero_whatsapp_click'
  | 'service_whatsapp_click'
  | 'quiz_start'
  | 'quiz_complete'
  | 'quiz_whatsapp_click'
  /* calc_start — первое касание калькулятора, calc_complete — отправка расчёта.
     Раньше обе ситуации слались одной целью, и цифра ничего не значила. */
  | 'calc_start'
  | 'calc_complete'
  | 'process_whatsapp_click'
  | 'pricing_whatsapp_click'
  | 'guarantee_whatsapp_click'
  | 'faq_whatsapp_click'
  | 'final_whatsapp_click'
  | 'footer_whatsapp_click'
  | 'mobile_whatsapp_click'
  | 'map_open'
  /* Звонок — для сервиса канал не менее важный, чем переписка */
  | 'phone_click';

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
    __METRIKA_ID__?: string;
  }
}

export function reachGoal(goal: MetrikaGoal): void {
  if (typeof window === 'undefined') return;
  const id = window.__METRIKA_ID__;
  if (!id || !window.ym) return;
  try {
    window.ym(Number(id), 'reachGoal', goal);
  } catch {
    /* счётчик не должен ронять страницу */
  }
}
