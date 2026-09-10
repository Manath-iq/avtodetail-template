import { useMemo, useRef, useState } from 'preact/hooks';
import { calcServices, calcBodies, calcConditions, calcAddons } from '../config/calculator';
import { calculate, calcDefaults, type CalcState } from '../lib/calc';
import { waLink, calcMessage } from '../lib/wa';
import { reachGoal } from '../lib/metrika';
import { withBase } from '../lib/url';

/**
 * Секция 5.2. Пересчёт мгновенный, без submit и без перезагрузки.
 * Все цены и коэффициенты — из src/config/calculator.ts.
 */
export default function Calculator() {
  const [state, setState] = useState<CalcState>(calcDefaults);
  const touchedRef = useRef(false);
  const out = useMemo(() => calculate(state), [state]);

  function markTouched() {
    if (!touchedRef.current) {
      touchedRef.current = true;
      // Первое касание — это старт, а не готовый расчёт: calc_complete
      // остаётся за кнопкой отправки, иначе цель считает две разные вещи.
      reachGoal('calc_start');
    }
  }

  function set<K extends keyof CalcState>(key: K, value: CalcState[K]) {
    markTouched();
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAddon(id: string) {
    markTouched();
    setState((prev) => ({
      ...prev,
      addonIds: prev.addonIds.includes(id)
        ? prev.addonIds.filter((a) => a !== id)
        : [...prev.addonIds, id],
    }));
  }

  const wa = waLink(
    calcMessage({
      serviceName: out.serviceName,
      bodyType: out.bodyName,
      condition: out.conditionName,
      addons: out.addonsName,
      finalPrice: out.priceFormatted,
      finalTime: out.timeFormatted,
    }),
  );

  const groupClass = 'flex flex-col gap-2.5';
  const legendClass = 'flex items-baseline gap-2.5';

  return (
    <div class="grid gap-6 lg:grid-cols-[1fr_21rem] lg:gap-8">
      {/* Параметры */}
      <div class="flex flex-col gap-6">
        <fieldset class={groupClass}>
          <legend class={legendClass}>
            <span class="stamp">01</span>
            <span class="font-[var(--font-display)] text-[1rem] font-semibold tracking-tight">
              Услуга
            </span>
          </legend>
          <div class="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Услуга">
            {calcServices.map((s) => (
              <Option
                key={s.id}
                active={state.serviceId === s.id}
                label={s.label}
                sub={s.note}
                onPick={() => set('serviceId', s.id)}
                role="radio"
              />
            ))}
          </div>
        </fieldset>

        <fieldset class={groupClass}>
          <legend class={legendClass}>
            <span class="stamp">02</span>
            <span class="font-[var(--font-display)] text-[1rem] font-semibold tracking-tight">
              Тип кузова
            </span>
          </legend>
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Тип кузова">
            {calcBodies.map((b) => (
              <Option
                key={b.id}
                active={state.bodyId === b.id}
                label={b.label}
                note={`×${b.coef.toFixed(2)}`}
                mono
                onPick={() => set('bodyId', b.id)}
                role="radio"
              />
            ))}
          </div>
        </fieldset>

        <fieldset class={groupClass}>
          <legend class={legendClass}>
            <span class="stamp">03</span>
            <span class="font-[var(--font-display)] text-[1rem] font-semibold tracking-tight">
              Состояние
            </span>
          </legend>
          <div class="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Состояние">
            {calcConditions.map((c) => (
              <Option
                key={c.id}
                active={state.conditionId === c.id}
                label={c.label}
                sub={c.note}
                onPick={() => set('conditionId', c.id)}
                role="radio"
              />
            ))}
          </div>
        </fieldset>

        <fieldset class={groupClass}>
          <legend class={legendClass}>
            <span class="stamp">04</span>
            <span class="font-[var(--font-display)] text-[1rem] font-semibold tracking-tight">
              Дополнения
            </span>
          </legend>
          <div class="grid gap-2 sm:grid-cols-3" role="group" aria-label="Дополнения">
            {calcAddons.map((a) => (
              <Option
                key={a.id}
                active={state.addonIds.includes(a.id)}
                label={a.label}
                note={`+${a.price.toLocaleString('ru-RU')} ₽`}
                sub={a.note}
                onPick={() => toggleAddon(a.id)}
                role="checkbox"
              />
            ))}
          </div>
        </fieldset>
      </div>

      {/* Итог */}
      <div class="lg:sticky lg:top-28 lg:self-start">
        <div
          class="card perf-top relative overflow-hidden p-5"
          aria-live="polite"
          aria-atomic="true"
        >
          <div class="paper-grid absolute inset-0 opacity-50" aria-hidden="true" />

          <div class="relative">
            <p class="stamp">Ваш ориентир</p>

            <p class="data mt-3 text-[clamp(2.25rem,5vw,2.9rem)] font-semibold leading-none tracking-tight">
              {out.priceFormatted}
              <span class="ml-1 text-[0.5em] text-[var(--color-ink-faint)]">₽</span>
            </p>

            <hr class="rule-dashed my-4" />

            <dl class="flex flex-col gap-3">
              <div class="flex items-baseline justify-between gap-3">
                <dt class="stamp">Срок</dt>
                <dd class="data text-[0.95rem] font-semibold">{out.timeFormatted}</dd>
              </div>
              <div class="flex items-baseline justify-between gap-3">
                <dt class="stamp">Услуга</dt>
                <dd class="text-[0.9rem]">{out.serviceName}</dd>
              </div>
            </dl>

            <hr class="rule-dashed my-4" />

            <p class="stamp">Что влияет</p>
            <ul class="mt-2 flex flex-wrap gap-1.5">
              {out.factors.map((f) => (
                <li key={f} class="chip !py-1 !text-[0.7rem]">
                  {f}
                </li>
              ))}
            </ul>

            <a
              href={wa}
              target="_blank"
              rel="noopener"
              class="btn btn-primary mt-5 w-full"
              onClick={() => reachGoal('calc_complete')}
            >
              Отправить расчёт в WhatsApp
            </a>

            <p class="legal-note mt-3">
              Информация о стоимости носит информационный характер и может быть уточнена после
              осмотра автомобиля. Нажимая кнопку, вы соглашаетесь с{' '}
              <a href={withBase('privacy/')} class="legal-link">
                Политикой обработки персональных данных
              </a>{' '}
              и{' '}
              <a href={withBase('consent/')} class="legal-link">
                Согласием на обработку персональных данных
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Option(props: {
  active: boolean;
  label: string;
  note?: string;
  sub?: string;
  mono?: boolean;
  role: 'radio' | 'checkbox';
  onPick: () => void;
}) {
  const { active, label, note, sub, mono, role, onPick } = props;
  return (
    <button
      type="button"
      role={role}
      aria-checked={active}
      onClick={onPick}
      class={[
        'tap flex flex-col items-start gap-0.5 rounded-[var(--radius-chip)] border px-3.5 py-2.5 text-left transition-all duration-200',
        active
          ? 'border-[var(--color-brake)] bg-[color-mix(in_srgb,var(--color-brake)_8%,transparent)]'
          : 'border-[var(--color-line)] bg-white hover:border-[var(--color-coal)]',
      ].join(' ')}
    >
      <span class="flex w-full items-baseline justify-between gap-2">
        <span class="min-w-0 text-[0.9375rem] font-medium leading-snug">{label}</span>
        {note && (
          <span
            class={[
              'shrink-0 text-[0.75rem]',
              mono ? 'data' : '',
              active ? 'text-[var(--color-brake)]' : 'text-[var(--color-ink-faint)]',
            ].join(' ')}
          >
            {note}
          </span>
        )}
      </span>
      {sub && <span class="text-[0.75rem] leading-snug text-[var(--color-ink-faint)]">{sub}</span>}
    </button>
  );
}
