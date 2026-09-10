import { useMemo, useRef, useState } from 'preact/hooks';
import { quizQuestions, quizIntro } from '../config/quiz';
import { resolveQuiz, isComplete, answeredCount, totalQuestions, type QuizAnswers } from '../lib/quiz-engine';
import { waLink, quizMessage } from '../lib/wa';
import { reachGoal } from '../lib/metrika';
import { withBase } from '../lib/url';

/**
 * Секция 5.1. Тап-only: варианта «Далее» нет, ответ подсвечивается немедленно,
 * результат — конкретный план, срок и вилка цены, а не «спасибо».
 */
export default function Quiz() {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const done = isComplete(answers);
  const filled = answeredCount(answers);
  const outcome = useMemo(() => resolveQuiz(answers), [answers]);

  function pick(questionId: string, optionId: string) {
    if (!startedRef.current) {
      startedRef.current = true;
      reachGoal('quiz_start');
    }

    setAnswers((prev) => {
      const next = { ...prev, [questionId]: optionId };
      if (isComplete(next) && !completedRef.current) {
        completedRef.current = true;
        reachGoal('quiz_complete');
        requestAnimationFrame(() => {
          resultRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
      }
      return next;
    });
  }

  function reset() {
    setAnswers({});
    startedRef.current = false;
    completedRef.current = false;
  }

  const wa = waLink(
    quizMessage({
      resultName: outcome.result.name,
      resultTime: outcome.result.time,
      resultPrice: outcome.result.price,
      carType: outcome.carType,
      dateHint: outcome.dateHint,
    }),
  );

  return (
    <div class="grid gap-6 lg:grid-cols-[1fr_22.5rem] lg:gap-8">
      {/* Вопросы */}
      <div class="flex flex-col gap-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <p class="max-w-[46ch] text-[1.0625rem] leading-relaxed text-white/70">{quizIntro}</p>
          <span class="chip shrink-0">
            <span class="data">
              {filled} / {totalQuestions}
            </span>
          </span>
        </div>

        {quizQuestions.map((q) => (
          <fieldset key={q.id} class="card-dark p-4 sm:p-5">
            <legend class="sr-only">{q.title}</legend>
            <div class="mb-3 flex items-baseline gap-2.5">
              <span class="stamp">{q.no}</span>
              <span class="font-[var(--font-display)] text-[1.0625rem] font-semibold tracking-tight text-white">
                {q.title}
              </span>
            </div>

            <div class="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={q.title}>
              {q.options.map((o) => {
                const active = answers[q.id] === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => pick(q.id, o.id)}
                    class={[
                      'tap flex flex-col items-start gap-1 rounded-[var(--radius-chip)] border px-3.5 py-3 text-left transition-all duration-200',
                      active
                        ? 'border-[var(--color-service)] bg-[color-mix(in_srgb,var(--color-service)_16%,transparent)]'
                        : 'border-white/12 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]',
                    ].join(' ')}
                  >
                    <span class="flex w-full items-center gap-2">
                      <span
                        class={[
                          'grid h-4 w-4 shrink-0 place-items-center rounded-full border transition-colors',
                          active ? 'border-[var(--color-service)]' : 'border-white/35',
                        ].join(' ')}
                        aria-hidden="true"
                      >
                        {active && <span class="h-2 w-2 rounded-full bg-[var(--color-service)]" />}
                      </span>
                      <span class="text-[0.9375rem] font-medium leading-snug text-white">
                        {o.label}
                      </span>
                    </span>
                    {o.hint && (
                      <span class="pl-6 text-[0.8125rem] leading-snug text-white/45">{o.hint}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {/* Результат */}
      <div class="lg:sticky lg:top-28 lg:self-start">
        <div
          ref={resultRef}
          class="card-dark relative overflow-hidden p-5"
          aria-live="polite"
          aria-atomic="true"
        >
          <div class="paper-grid-dark absolute inset-0 opacity-70" aria-hidden="true" />

          <div class="relative">
            <div class="flex items-center justify-between gap-3">
              <p class="stamp">Ваш результат</p>
              {done && (
                <button
                  type="button"
                  onClick={reset}
                  class="tap text-[0.75rem] text-white/45 underline decoration-dotted underline-offset-4 transition-colors hover:text-white/80"
                >
                  Сбросить
                </button>
              )}
            </div>

            {!done ? (
              <div class="mt-4">
                <p class="text-[0.9375rem] leading-relaxed text-white/55">
                  Отметьте ответы слева — план работ, срок и вилка цены соберутся здесь
                  автоматически.
                </p>
                <div class="mt-5 flex gap-1.5" aria-hidden="true">
                  {quizQuestions.map((q, i) => (
                    <span
                      key={q.id}
                      class={[
                        'h-1 flex-1 rounded-full transition-colors duration-300',
                        i < filled ? 'bg-[var(--color-service)]' : 'bg-white/12',
                      ].join(' ')}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div class="mt-4 flex flex-col gap-4">
                <div>
                  <p class="stamp !text-white/40">План</p>
                  <p class="mt-1 font-[var(--font-display)] text-[1.125rem] font-semibold leading-tight tracking-tight text-white">
                    {outcome.result.name}
                  </p>
                </div>

                <hr class="rule-dashed" />

                <dl class="grid grid-cols-2 gap-3">
                  <div>
                    <dt class="stamp !text-white/40">Срок</dt>
                    <dd class="data mt-1 text-[0.95rem] font-semibold text-white">
                      {outcome.result.time}
                    </dd>
                  </div>
                  <div>
                    <dt class="stamp !text-white/40">Ориентир цены</dt>
                    <dd class="data mt-1 text-[0.95rem] font-semibold text-[var(--color-service)]">
                      {outcome.result.price}
                    </dd>
                  </div>
                </dl>

                <hr class="rule-dashed" />

                <div>
                  <p class="stamp !text-white/40">Что входит</p>
                  <ul class="mt-2 flex flex-col gap-1.5">
                    {outcome.result.includes.map((item) => (
                      <li key={item} class="flex gap-2 text-[0.875rem] leading-snug text-white/72">
                        <span class="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[var(--color-tech)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={wa}
                  target="_blank"
                  rel="noopener"
                  data-goal="quiz_whatsapp_click"
                  class="btn btn-primary w-full"
                >
                  Открыть WhatsApp
                </a>

                <p class="legal-note !text-white/38">
                  Нажимая кнопку, вы соглашаетесь с{' '}
                  <a href={withBase('privacy')} class="legal-link">
                    Политикой обработки персональных данных
                  </a>{' '}
                  и{' '}
                  <a href={withBase('consent')} class="legal-link">
                    Согласием на обработку персональных данных
                  </a>
                  . Ориентир цены не является офертой и уточняется после осмотра.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
