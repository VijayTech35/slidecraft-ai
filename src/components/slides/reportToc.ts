import type { SlideContent } from '@/types';

export interface ReportTocEntry {
  id: string;
  index: string;
  label: string;
}

export function buildReportToc(content: SlideContent): ReportTocEntry[] {
  const swot = content.swot;
  const hasSwot = swot
    ? swot.strengths.length > 0 ||
      swot.weaknesses.length > 0 ||
      swot.opportunities.length > 0 ||
      swot.threats.length > 0
    : false;

  const present: Array<{ id: string; label: string }> = [];
  if (content.kpis?.length) present.push({ id: 'report-kpis', label: 'Key numbers' });
  if (content.sections?.length) present.push({ id: 'report-topics', label: 'Topics covered' });
  if (content.charts?.length) present.push({ id: 'report-charts', label: 'Data & trends' });
  if (content.table?.rows.length) present.push({ id: 'report-data', label: 'Breakdown' });
  if (content.comparison?.length) present.push({ id: 'report-benchmark', label: 'Benchmark' });
  if (hasSwot) present.push({ id: 'report-swot', label: 'SWOT' });
  if (content.recommendations?.length) present.push({ id: 'report-actions', label: 'Actions' });
  if (content.timeline?.length) present.push({ id: 'report-timeline', label: 'Timeline' });
  if (content.team?.length) present.push({ id: 'report-team', label: 'Team' });
  if (content.items?.length) present.push({ id: 'report-closing', label: 'Bottom line' });

  return present.map((entry, i) => ({ ...entry, index: String(i + 1).padStart(2, '0') }));
}