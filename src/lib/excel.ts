import type { ChartDataPoint, KPI, Presentation, TableData } from '@/types';
import type { ChartConfig } from './engine';
import { formatNumber } from '@/lib/utils';

export interface ExcelColumn {
  name: string;
  key: string;
  numeric: boolean;
  dateLike: boolean;
  sampleCount: number;
}

export interface ExcelSheet {
  name: string;
  rows: Array<Record<string, string | number>>;
  columns: ExcelColumn[];
  rowCount: number;
}

export interface DataWorkbook {
  name: string;
  sheets: ExcelSheet[];
}

export type PivotAgg = 'sum' | 'avg' | 'count' | 'min' | 'max';
export type PivotGranularity = 'month' | 'quarter' | 'year';

export interface PivotBucket {
  label: string;
  value: number;
  share?: number;
}

export interface PivotResult {
  dimension: string;
  measure: string;
  agg: PivotAgg;
  granularity?: PivotGranularity;
  buckets: PivotBucket[];
  total: number;
  avg: number;
  min: number;
  max: number;
  count: number;
  topLabel: string;
}

const DATE_RE = /^\d{4}[-/]\d{1,2}(?:[-/]\d{1,2})?/;

function buildColumns(rows: Array<Record<string, string | number>>): ExcelColumn[] {
  if (rows.length === 0) return [];
  const keys = Object.keys(rows[0]);
  return keys
    .map((key) => {
      const values = rows.map((r) => r[key]).filter((v) => v !== '' && v != null);
      const numbers = values.map(Number).filter((n) => Number.isFinite(n));
      const dateStrings = values.filter(
        (v) => typeof v === 'string' && DATE_RE.test(v.trim())
      );
      const dateObjects = values.filter(
        (v) => v instanceof Date && !Number.isNaN(v.getTime())
      );
      const serials = numbers.filter((n) => n >= 1 && n <= 2958465);
      const hasTime = serials.filter((n) => Math.abs(n - Math.floor(n)) > 1e-6).length;
      const plausibleDate = serials.filter((n) => n >= 14400 && n <= 60000).length;
      const dateLike =
        dateObjects.length > 0 ||
        (dateStrings.length > 0 && dateStrings.length / Math.max(values.length, 1) >= 0.6) ||
        (serials.length / Math.max(values.length, 1) >= 0.8 &&
          hasTime / Math.max(serials.length, 1) >= 0.4 &&
          plausibleDate / Math.max(serials.length, 1) >= 0.6);
      const numeric =
        values.length > 0 &&
        numbers.length / values.length >= 0.5 &&
        !dateLike;
      return { name: key, key, numeric, dateLike, sampleCount: values.length };
    })
    .filter((c) => c.sampleCount > 0);
}

export async function parseSpreadsheet(file: File): Promise<DataWorkbook> {
  const XLSX = await import('xlsx');
  const isCsv = file.name.toLowerCase().endsWith('.csv');
  const workbook = isCsv
    ? XLSX.read(await file.text(), { type: 'string' })
    : XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const sheets: ExcelSheet[] = workbook.SheetNames.map((name) => {
    const worksheet = workbook.Sheets[name];
    const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(worksheet, {
      defval: '',
      cellDates: !isCsv,
    });
    return {
      name,
      rows: rows.slice(0, 2000),
      columns: buildColumns(rows),
      rowCount: rows.length,
    };
  }).filter((s) => s.rowCount > 0 && s.columns.length > 0);

  return { name: file.name, sheets };
}

function aggValue(agg: PivotAgg, nums: number[]): number {
  switch (agg) {
    case 'count':
      return nums.length;
    case 'avg':
      return nums.reduce((a, b) => a + b, 0) / Math.max(nums.length, 1);
    case 'min':
      return Math.min(...nums);
    case 'max':
      return Math.max(...nums);
    default:
      return nums.reduce((a, b) => a + b, 0);
  }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function toDateParts(v: string | number | Date): { y: number; m: number } | null {
  if (v instanceof Date) {
    if (Number.isNaN(v.getTime())) return null;
    return { y: v.getFullYear(), m: v.getMonth() + 1 };
  }
  if (typeof v === 'number' && Number.isFinite(v)) {
    if (v < 20000 || v > 80000) return null;
    const d = new Date(Math.round((v - 25569) * 86400000));
    if (Number.isNaN(d.getTime())) return null;
    return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1 };
  }
  const m = v.trim().match(DATE_RE);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    if (y >= 1900 && y <= 2100 && mo >= 1 && mo <= 12) return { y, m: mo };
  }
  const t = Date.parse(v);
  if (!Number.isNaN(t)) {
    const d = new Date(t);
    return { y: d.getFullYear(), m: d.getMonth() + 1 };
  }
  return null;
}

function bucketParts(d: { y: number; m: number }, granularity: PivotGranularity): { key: string; label: string } {
  const y = d.y;
  if (granularity === 'year') return { key: `${y}`, label: `${y}` };
  if (granularity === 'quarter') {
    const q = Math.floor((d.m - 1) / 3) + 1;
    return { key: `${y}-Q${q}`, label: `Q${q} ${y}` };
  }
  return {
    key: `${y}-${String(d.m).padStart(2, '0')}`,
    label: `${MONTHS[d.m - 1]} ${y}`,
  };
}

function groupKey(rawDim: unknown, dim: string, granularity?: PivotGranularity): { key: string; label: string } {
  if (!granularity) return { key: dim, label: dim };
  const parts = toDateParts(rawDim as string | number | Date);
  return parts ? bucketParts(parts, granularity) : { key: dim, label: dim };
}

export interface PivotOptions {
  granularity?: PivotGranularity;
  limit?: number;
  includeRest?: boolean;
}

export function computePivot(
  rows: Array<Record<string, string | number>>,
  dimensionKey: string,
  valueKey: string,
  agg: PivotAgg,
  opts?: PivotOptions
): PivotResult {
  const granularity = opts?.granularity;
  const limit = opts?.limit && opts.limit > 0 ? opts.limit : undefined;

  const groups = new Map<string, { key: string; label: string; nums: number[] }>();
  let validRecords = 0;
  let sumRaw = 0;
  const allVals: number[] = [];

  for (const row of rows) {
    const rawDim = row[dimensionKey];
    const dim = String(rawDim ?? '').trim();
    if (!dim) continue;
    const raw = row[valueKey];
    if (raw === '' || raw == null) continue;

    if (agg === 'count') {
      const g = groupKey(rawDim, dim, granularity);
      validRecords += 1;
      let group = groups.get(g.key);
      if (!group) {
        group = { key: g.key, label: g.label, nums: [] };
        groups.set(g.key, group);
      }
      group.nums.push(1);
      continue;
    }

    const num = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(num)) continue;
    validRecords += 1;
    sumRaw += num;
    allVals.push(num);
    const g = groupKey(rawDim, dim, granularity);
    let group = groups.get(g.key);
    if (!group) {
      group = { key: g.key, label: g.label, nums: [] };
      groups.set(g.key, group);
    }
    group.nums.push(num);
  }

  let list = Array.from(groups.values()).map((g) => ({
    key: g.key,
    label: g.label,
    value: aggValue(agg, g.nums),
  }));

  const ranked = [...list].sort((a, b) => b.value - a.value);
  const topLabel = ranked[0]?.label ?? '';

  if (granularity) {
    list.sort((a, b) => a.key.localeCompare(b.key));
  } else {
    list.sort((a, b) => b.value - a.value);
  }

  if (limit && list.length > limit) {
    const kept = list.slice(0, limit);
    if (opts?.includeRest) {
      const rest = list.slice(limit).reduce((s, b) => s + b.value, 0);
      kept.push({ key: '__other__', label: 'Other', value: Math.round(rest * 100) / 100 });
    }
    list = kept;
  }

  const shareBase = agg === 'sum' ? sumRaw : agg === 'count' ? validRecords : undefined;
  const buckets: PivotBucket[] = list.map((b) =>
    shareBase !== undefined
      ? { label: b.label, value: b.value, share: b.value / Math.max(shareBase, Number.EPSILON) }
      : { label: b.label, value: b.value }
  );

  const bucketValues = list.map((b) => b.value);
  const total = agg === 'count' ? validRecords : sumRaw;
  const avg = agg === 'count' ? validRecords / Math.max(list.length, 1) : validRecords > 0 ? sumRaw / validRecords : 0;
  const min = agg === 'count' || agg === 'avg' ? (bucketValues.length > 0 ? Math.min(...bucketValues) : 0) : allVals.length > 0 ? Math.min(...allVals) : 0;
  const max = agg === 'count' || agg === 'avg' ? (bucketValues.length > 0 ? Math.max(...bucketValues) : 0) : allVals.length > 0 ? Math.max(...allVals) : 0;

  return {
    dimension: dimensionKey,
    measure: valueKey,
    agg,
    granularity,
    buckets,
    total,
    avg,
    min,
    max,
    count: validRecords,
    topLabel,
  };
}

export function defaultPivot(sheet: ExcelSheet): {
  dimension: string;
  measure: string;
  agg: PivotAgg;
  granularity?: PivotGranularity;
} {
  const dims = sheet.columns.filter((c) => !c.numeric).map((c) => c.key);
  const vals = sheet.columns.filter((c) => c.numeric).map((c) => c.key);
  const dimension = dims[0] ?? sheet.columns[0]?.key ?? '';
  const dimCol = sheet.columns.find((c) => c.key === dimension);
  return {
    dimension,
    measure: vals[0] ?? sheet.columns[0]?.key ?? '',
    agg: vals.length > 0 ? 'sum' : 'count',
    granularity: dimCol?.dateLike ? 'month' : undefined,
  };
}

const fmt = (n: number): string =>
  Math.abs(n) >= 1000 ? formatNumber(Math.round(n * 10) / 10) : Number.isInteger(n) ? String(n) : n.toFixed(2);

export interface PivotSource {
  pivot: PivotResult;
  source: string;
}

function pivotKpis(pivot: PivotResult): KPI[] {
  const isCount = pivot.agg === 'count';
  const trend = () => pivot.buckets.slice(0, 8).map((b) => b.value);
  return [
    { label: isCount ? 'Records' : 'Total', value: isCount ? fmt(pivot.count) : fmt(pivot.total), change: isCount ? 'non-empty rows' : pivot.agg.toUpperCase(), changeType: 'positive', icon: 'DollarSign', color: '#a78bfa', trend: trend() },
    { label: isCount ? 'Avg / group' : 'Average', value: fmt(pivot.avg), change: isCount ? 'per bucket' : 'per row', changeType: 'neutral', icon: 'TrendingUp', color: '#f472b6', trend: trend() },
    { label: isCount ? 'Largest group' : 'Maximum', value: fmt(pivot.max), change: 'top value', changeType: 'positive', icon: 'Target', color: '#22d3ee', trend: trend() },
    { label: 'Groups', value: fmt(pivot.buckets.length), change: 'buckets', changeType: 'neutral', icon: 'PieChart', color: '#10b981', trend: trend() },
    { label: 'Top bucket', value: pivot.topLabel.slice(0, 16) || '—', change: pivot.buckets[0] ? fmt(pivot.buckets[0].value) : '', changeType: 'neutral', icon: 'Award', color: '#f59e0b', trend: trend() },
    { label: 'Range', value: `${fmt(pivot.min)}–${fmt(pivot.max)}`, change: isCount ? 'group sizes' : 'min–max', changeType: 'neutral', icon: 'Activity', color: '#8b5cf6', trend: trend() },
  ];
}

function pivotCharts(pivot: PivotResult): ChartConfig[] {
  const buckets = pivot.buckets.slice(0, 12);
  const type = buckets.length > 1 ? 'bar' : 'pie';
  const base: ChartConfig = {
    title: `${pivot.agg.toUpperCase()} of ${pivot.measure} by ${pivot.dimension}${pivot.granularity ? ` (${pivot.granularity})` : ''}`,
    subtitle: `${buckets.length} group${buckets.length === 1 ? '' : 's'} from ${pivot.count} data rows`,
    type,
    data: buckets.map(
      (b): ChartDataPoint => ({ name: b.label, value: Math.round(b.value * 100) / 100 })
    ),
  };
  const charts: ChartConfig[] = [base];
  if (buckets.length > 1) {
    charts.push({
      title: `${pivot.dimension} share of ${pivot.measure}`,
      subtitle: 'Distribution across groups',
      type: 'donut',
      data: buckets.map(
        (b): ChartDataPoint => ({ name: b.label, value: Math.round(b.value * 100) / 100 })
      ),
    });
  }
  return charts;
}

function pivotTable(pivot: PivotResult): TableData {
  const buckets = pivot.buckets.slice(0, 12);
  return {
    headers: ['Group', `${pivot.agg.toUpperCase()} ${pivot.measure}`, 'Share'],
    rows: buckets.map((b) => [
      b.label,
      fmt(b.value),
      b.share !== undefined ? `${Math.round(b.share * 100)}%` : '—',
    ]),
  };
}

function pivotBottomLine(pivot: PivotResult): string[] {
  return [
    `${pivot.agg === 'count' ? 'Largest group' : 'Top value'}: ${pivot.topLabel || '—'} at ${pivot.buckets[0] ? fmt(pivot.buckets[0].value) : 0} for ${pivot.measure}.`,
    `Average ${pivot.measure} is ${fmt(pivot.avg)} across ${pivot.buckets.length} group${pivot.buckets.length === 1 ? '' : 's'}.`,
    `Based on ${fmt(pivot.count)} records, values range from ${fmt(pivot.min)} to ${fmt(pivot.max)}.`,
  ];
}

export function applyPivotsToDeck(deck: Presentation, sources: PivotSource[]): Presentation {
  const slide = deck.slides[0];
  const primary = sources[0]?.pivot;
  if (!slide || !primary) return deck;

  const charts = sources
    .flatMap(({ pivot, source }) =>
      pivotCharts(pivot).map((ch) =>
        sources.length > 1 ? { ...ch, title: `${ch.title} · ${source}` } : ch
      )
    )
    .slice(0, 6);

  const sourceList = sources.map((s) => s.source);
  const intro =
    sources.length === 1
      ? `This dashboard was generated from your ${sourceList[0]} — a pivot of ${primary.measure} by ${primary.dimension} across ${primary.count} records.`
      : `This dashboard was generated from ${sourceList.length} data sources (${sourceList.join(', ')}) — each one pivoted and visualized.`;

  const content = {
    ...slide.content,
    kpis: pivotKpis(primary),
    charts,
    table: pivotTable(primary),
    intro,
    analysis:
      slide.content.analysis ||
      `${primary.topLabel || 'No'} leads with ${
        primary.buckets[0] ? fmt(primary.buckets[0].value) : 0
      } for ${primary.measure}.`,
    items: pivotBottomLine(primary),
  };

  delete content.sections;
  delete content.comparison;
  delete content.swot;
  delete content.recommendations;
  delete content.timeline;
  delete content.team;

  return { ...deck, dataPivot: primary, slides: [{ ...slide, content }] };
}

export function applyPivotToDeck(deck: Presentation, pivot: PivotResult, source: string): Presentation {
  return applyPivotsToDeck(deck, [{ pivot, source }]);
}