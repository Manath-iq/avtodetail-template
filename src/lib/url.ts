/**
 * Пути с учётом base (GitHub Pages отдаёт проект по подпути).
 * Никогда не собирай URL строкой руками — только через withBase().
 */
const BASE = import.meta.env.BASE_URL;

export function withBase(path: string): string {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  const base = BASE.endsWith('/') ? BASE : `${BASE}/`;
  return `${base}${clean}`;
}
