import gsap from 'gsap';
import Lenis from 'lenis';
import { reachGoal, type MetrikaGoal } from '../lib/metrika';

/**
 * Motion-слой.
 *
 * Триггеры сделаны на IntersectionObserver, а не на ScrollTrigger: переход по
 * якорю или восстановление позиции скролла проносит страницу мимо секции, и
 * ScrollTrigger в этом случае не выдаёт onEnter — блоки остаются с opacity: 0.
 * IO отрабатывает любое попадание в вьюпорт, чем бы оно ни было вызвано.
 * Сами анимации по-прежнему на GSAP + CSS transforms, плавный скролл — Lenis.
 */

const reduced = matchMedia('(prefers-reduced-motion: reduce)');

/** Одноразовый вход в вьюпорт. */
function onEnter(
  el: Element,
  cb: () => void,
  opts: { rootMargin?: string; threshold?: number } = {},
) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.disconnect();
        cb();
      }
    },
    { rootMargin: opts.rootMargin ?? '0px 0px -10% 0px', threshold: opts.threshold ?? 0 },
  );
  io.observe(el);
}

/* ─────────────────────────────────────────────────────────────
   Цели Метрики — делегированием, без слушателя на каждой ссылке
   ───────────────────────────────────────────────────────────── */
document.addEventListener(
  'click',
  (e) => {
    const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-goal]');
    const goal = el?.dataset.goal;
    if (goal) reachGoal(goal as MetrikaGoal);
  },
  { passive: true },
);

/* ─────────────────────────────────────────────────────────────
   Плавный скролл
   ───────────────────────────────────────────────────────────── */
function initLenis() {
  // iOS Safari: sticky-секции + программный скролл — самое вероятное место
  // поломки (секция 8), поэтому там остаётся нативный скролл.
  const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent);
  if (reduced.matches || isIOS) return;

  const lenis = new Lenis({
    duration: 1.05,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  if (import.meta.env.DEV) {
    (window as unknown as { __lenis?: unknown }).__lenis = lenis;
  }

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -88 });
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   Общее появление блоков
   ───────────────────────────────────────────────────────────── */
function initReveal() {
  document.querySelectorAll<HTMLElement>('[data-anim]').forEach((el) => {
    onEnter(el, () => el.classList.add('is-in'), { rootMargin: '0px 0px -8% 0px' });
  });
}

/* ─────────────────────────────────────────────────────────────
   Сигнатурный момент: заказ-наряд собирается на глазах
   ───────────────────────────────────────────────────────────── */
function initOrderSheet() {
  document.querySelectorAll<HTMLElement>('[data-order-sheet]').forEach((sheet) => {
    const rows = sheet.querySelectorAll<HTMLElement>('[data-sheet-row]');
    const scan = sheet.querySelector<HTMLElement>('[data-scanline]');
    const cta = sheet.querySelector<HTMLElement>('[data-sheet-cta]');

    if (reduced.matches) {
      gsap.set(rows, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(sheet, { opacity: 0, x: 26, rotate: 1.2 });
    gsap.set(rows, { opacity: 0, y: 12 });
    if (scan) gsap.set(scan, { top: 0, opacity: 0 });

    onEnter(
      sheet,
      () => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

        // Лист выдвигается из-за кромки
        tl.to(sheet, { opacity: 1, x: 0, rotate: 0, duration: 0.7 });

        // По листу проходит линия-сканер
        if (scan) {
          tl.to(scan, { opacity: 1, duration: 0.15 }, 0.35)
            .to(scan, { top: '100%', duration: 1.05, ease: 'power1.inOut' }, 0.4)
            .to(scan, { opacity: 0, duration: 0.25 }, 1.25);
        }

        // Строки проявляются вслед за сканером
        tl.to(rows, { opacity: 1, y: 0, duration: 0.4, stagger: 0.075 }, 0.5);

        // Кнопка «закрепляет» лист
        if (cta) {
          tl.fromTo(cta, { scale: 0.96 }, { scale: 1, duration: 0.35, ease: 'back.out(2.2)' }, '>-0.15');
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
  });
}

/* ─────────────────────────────────────────────────────────────
   Счётчики полосы доверия
   ───────────────────────────────────────────────────────────── */
function initCounters() {
  if (reduced.matches) return;

  document.querySelectorAll<HTMLElement>('[data-count-to]').forEach((node) => {
    const to = Number(node.dataset.countTo);
    if (!Number.isFinite(to) || to <= 0) return;

    onEnter(node, () => {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: to,
        duration: Math.min(1.6, 0.6 + to / 400),
        ease: 'power2.out',
        onUpdate: () => {
          node.textContent = String(Math.round(obj.v));
        },
        onComplete: () => {
          node.textContent = String(to);
        },
      });
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   Шаги процесса подсвечиваются по очереди
   ───────────────────────────────────────────────────────────── */
function initProcess() {
  document.querySelectorAll<HTMLElement>('[data-process-step]').forEach((step, i) => {
    onEnter(step, () => {
      gsap.delayedCall(reduced.matches ? 0 : i * 0.12, () => step.setAttribute('data-active', ''));
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   Штамп «наряд закрыт» на финальной фазе скролла блока гарантии
   ───────────────────────────────────────────────────────────── */
function initStamp() {
  const stamp = document.querySelector<HTMLElement>('[data-stamp]');
  if (!stamp) return;

  onEnter(
    stamp,
    () => {
      gsap.delayedCall(reduced.matches ? 0 : 0.45, () => stamp.setAttribute('data-stamped', ''));
    },
    { rootMargin: '0px 0px -20% 0px' },
  );
}

/* ─────────────────────────────────────────────────────────────
   Пин на схеме проезда появляется из-под линии
   ───────────────────────────────────────────────────────────── */
function initMapPin() {
  const pin = document.querySelector<SVGGElement>('[data-map-pin]');
  const route = document.querySelector<SVGPathElement>('[data-route]');
  if (!pin || reduced.matches) return;

  gsap.set(pin, { opacity: 0, y: 18 });

  onEnter(pin.ownerSVGElement ?? pin, () => {
    const tl = gsap.timeline();

    if (route) {
      const len = route.getTotalLength();
      gsap.set(route, { strokeDasharray: String(len), strokeDashoffset: len });
      tl.to(route, { strokeDashoffset: 0, duration: 0.9, ease: 'power1.inOut' });
      tl.set(route, { strokeDasharray: '9 7', strokeDashoffset: 0 });
    }

    tl.to(pin, { opacity: 1, y: 0, duration: 0.45, ease: 'back.out(2)' }, '-=0.1');
  });
}

/* ─────────────────────────────────────────────────────────────
   Старт
   ───────────────────────────────────────────────────────────── */
function boot() {
  initLenis();
  initReveal();
  initOrderSheet();
  initCounters();
  initProcess();
  initStamp();
  initMapPin();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
