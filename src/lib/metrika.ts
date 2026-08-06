/**
 * Цели Яндекс.Метрики (секция 8).
 * Если client.metrikaId пуст — счётчик не подключается, вызовы просто no-op.
 */
export type MetrikaGoal =
  | 'hero_whatsapp_click'
  | 'quiz_start'
  | 'quiz_complete'
  | 'calc_complete'
  | 'map_open'
  | 'footer_whatsapp_click';

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
