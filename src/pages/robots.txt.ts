import type { APIRoute } from 'astro';
import { withBase } from '../lib/url';

/**
 * robots.txt отдаётся эндпоинтом, а не статикой: хост берётся из Astro.site,
 * который в CI приходит из настроек Pages. Раньше адрес карты сайта был вшит
 * строкой, и при переезде на домен клиента он бы тихо указывал на github.io.
 */
export const GET: APIRoute = ({ site }) => {
  // withBase обязателен: на Pages проект отдаётся по подпути, и без него
  // ссылка указывала бы в корень домена, где карты сайта нет.
  const sitemap = new URL(withBase('sitemap-index.xml'), site ?? 'https://example.com').href;

  return new Response(
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemap}`, ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
