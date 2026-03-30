import { SitemapPage } from "./project-types";

export interface PageCompletion {
  brief: boolean;
  wireframe: boolean;
  content: boolean;
  seo: boolean;
  notes: boolean;
  score: number; // 0-100
}

export function getPageCompletion(page: SitemapPage): PageCompletion {
  const brief = !!(page.pageGoal || page.audiences.length > 0);
  const wireframe = page.sections.length > 0;
  const content = page.sections.some(
    (s) => s.content.heading || s.content.body || s.content.items.length > 0
  );
  const seo = !!(page.seoTitle && page.seoDescription);
  const notes = page.sections.some((s) => s.directionNotes);

  const checks = [brief, wireframe, content, seo, notes];
  const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  return { brief, wireframe, content, seo, notes, score };
}

export function getProjectCompletion(pages: SitemapPage[]): {
  totalScore: number;
  pageScores: { pageId: string; pageName: string; score: number; completion: PageCompletion }[];
} {
  if (pages.length === 0) return { totalScore: 0, pageScores: [] };

  const pageScores = pages.map((p) => ({
    pageId: p.id,
    pageName: p.name,
    score: getPageCompletion(p).score,
    completion: getPageCompletion(p),
  }));

  const totalScore = Math.round(
    pageScores.reduce((sum, p) => sum + p.score, 0) / pageScores.length
  );

  return { totalScore, pageScores };
}
