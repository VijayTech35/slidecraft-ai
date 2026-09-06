import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Layout,
  BarChart3,
  PieChart,
  Palette,
  Pencil,
  Download,
  FileText,
  Clock,
  Layers,
  TrendingUp,
  Target,
  Heart,
  Zap,
  Rocket,
  GraduationCap,
  ShoppingBag,
  Settings,
  UserCheck,
  ArrowRight,
  Check,
  Upload,
  X,
  Presentation as PresentationIcon,
  TextCursorInput,
  LayoutDashboard,
  FileSpreadsheet,
  Sigma,
  Table2,
  Calendar,
  ListFilter,
} from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);
import { useStore } from '@/store';
import { generatePresentation } from '@/lib/engine';
import { generatePresentationWithAI, isAIEnabled } from '@/lib/ai';
import type { Presentation } from '@/types';
import { templates } from '@/data/templates';
import { cn, generateId, formatNumber } from '@/lib/utils';
import { extractFileContent, type UploadedDocument } from '@/lib/upload';
import { computePivot, defaultPivot, applyPivotsToDeck } from '@/lib/excel';
import type { DataWorkbook, PivotAgg, PivotGranularity, PivotResult } from '@/lib/excel';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  TrendingUp,
  DollarSign: TrendingUp,
  BarChart3,
  Megaphone: Target,
  Heart,
  Users: UserCheck,
  Rocket,
  Zap,
  GraduationCap,
  ShoppingBag,
  Settings,
  UserCheck,
};

const features = [
  { icon: Layout, title: 'Professional Layouts', description: 'Expertly designed dashboard layouts that make your data shine.' },
  { icon: BarChart3, title: 'Smart Analytics', description: 'Automatically generate insightful KPI dashboards and visualizations.' },
  { icon: PieChart, title: 'Beautiful Charts', description: 'Bar, pie, line, area, donut, combo, and funnel charts powered by your data.' },
  { icon: Palette, title: 'Custom Themes', description: 'Ten premium color themes — one click to restyle everything.' },
  { icon: Pencil, title: 'Easy Editing', description: 'Edit content, swap layouts, or rearrange the flow in real time.' },
  { icon: Download, title: 'Instant Export', description: 'Download polished dashboards ready for any audience.' },
];

const generationSteps = [
  'Analyzing your prompt...',
  'Structuring dashboard sections...',
  'Designing infographic layouts...',
  'Populating charts and data...',
  'Applying visual theme...',
  'Finalizing dashboard...',
];

const formatBytes = (bytes: number) => {
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return `${bytes} B`;
};

const dashboardLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dashboardBars = [42, 60, 48, 76, 55, 88, 66, 47, 71, 58, 82, 64];
const previewTags = ['AI', 'Analytics', 'Growth', 'Sales', 'OKRs'];

const previewKpis = [
  { icon: TrendingUp, label: 'Revenue', value: '$2.4M', change: '+12.4%' },
  { icon: UserCheck, label: 'Customers', value: '18.2K', change: '+8.1%' },
  { icon: Target, label: 'Conversion', value: '6.8%', change: '+1.2%' },
  { icon: Layers, label: 'NPS Score', value: '72', change: '+4 pts' },
];

const previewLegend = [
  { color: '#6366f1', label: 'Direct', value: '42%' },
  { color: '#06b6d4', label: 'SEO', value: '26%' },
  { color: '#10b981', label: 'Ads', value: '16%' },
  { color: '#f59e0b', label: 'Referral', value: '16%' },
];

function DashboardPreview() {
  return (
    <div className="relative w-full">
      <div
        className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-indigo-300/40 via-sky-200/30 to-cyan-200/40 blur-2xl opacity-70"
        aria-hidden="true"
      />
      <div className="relative rounded-[1.5rem] border border-gray-200 bg-white shadow-2xl shadow-indigo-200/50 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/80">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
          </div>
          <div className="flex-1 max-w-[380px] mx-auto flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-gray-200 text-[11px] text-gray-500">
            <Layout className="w-3 h-3 text-indigo-500" />
            dashcraft.ai/dashboards/revenue
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
            <div>
              <p className="text-[11px] font-medium text-indigo-500 uppercase tracking-wider mb-1">
                Single-page report
              </p>
              <h3 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-gray-900">
                Revenue Performance Dashboard
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {previewTags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-[10px] font-medium text-indigo-600"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            {previewKpis.map((kpi) => (
              <div key={kpi.label} className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-[10px] font-semibold text-emerald-600">{kpi.change}</span>
                </div>
                <p className="text-[16px] sm:text-[18px] font-bold text-gray-900 leading-none mb-1">
                  {kpi.value}
                </p>
                <p className="text-[10px] text-gray-500">{kpi.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="md:col-span-3 rounded-xl bg-gray-50 border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[12px] font-semibold text-gray-800">Monthly revenue</p>
                <span className="text-[10px] text-gray-400">12 months</span>
              </div>
              <div className="flex items-end gap-2 h-28">
                {dashboardBars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-indigo-500 to-sky-400"
                    style={{ height: `${h}%`, opacity: 0.55 + (h / 100) * 0.45 }}
                  />
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                {dashboardLabels.map((l) => (
                  <span key={l} className="flex-1 text-center text-[8px] text-gray-400">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 rounded-xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-[12px] font-semibold text-gray-800 mb-4">Channel mix</p>
              <div className="flex items-center gap-4">
                <div
                  className="w-24 h-24 rounded-full shrink-0"
                  style={{
                    background:
                      'conic-gradient(#6366f1 0 42%, #06b6d4 42% 68%, #10b981 68% 84%, #f59e0b 84% 100%)',
                  }}
                >
                  <div
                    className="w-full h-full rounded-full bg-gray-50"
                    style={{ transform: 'scale(0.62)' }}
                  />
                </div>
                <div className="space-y-2">
                  {previewLegend.map((l) => (
                    <div key={l.label} className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                      {l.label}
                      <span className="ml-auto font-semibold text-gray-700">{l.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type PreviewKind = 'kpi' | 'donut' | 'bars' | 'line' | 'timeline' | 'people' | 'gauge' | 'rows';

const previewKindFor: Record<string, PreviewKind> = {
  sip: 'kpi',
  financial: 'bars',
  sales: 'bars',
  marketing: 'donut',
  healthcare: 'line',
  hr: 'people',
  product: 'timeline',
  startup: 'gauge',
  education: 'rows',
  retail: 'donut',
  operations: 'gauge',
  customer: 'donut',
};

function TemplatePreview({ color, kind }: { color: string; kind: PreviewKind }) {
  if (kind === 'kpi') {
    return (
      <div className="absolute inset-0 p-2.5">
        <div className="h-1.5 w-2/5 rounded-full mb-2" style={{ background: color }} />
        <div className="grid grid-cols-2 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-md bg-white border border-gray-100 shadow-sm p-1.5">
              <div className="h-1 w-full rounded-full bg-gray-200 mb-1" />
              <div className="h-1 w-1/2 rounded-full" style={{ background: color }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === 'donut') {
    return (
      <div className="absolute inset-0 flex items-center gap-3 p-3">
        <div
          className="relative w-14 h-14 rounded-full shrink-0"
          style={{
            background: `conic-gradient(${color} 0 40%, ${color}80 40% 70%, ${color}50 70% 88%, ${color}25 88% 100%)`,
          }}
        >
          <div className="absolute inset-[30%] rounded-full bg-white" />
        </div>
        <div className="flex-1 space-y-1.5">
          {[72, 55, 38].map((w, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: i === 0 ? color : color + (i === 1 ? '80' : '50') }}
              />
              <div className="flex-1 h-1 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${w}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === 'bars') {
    return (
      <div className="absolute inset-0 flex items-end gap-1 p-3 pb-2">
        {[45, 70, 55, 85, 62, 92, 50].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm"
            style={{ height: `${h}%`, background: i % 2 === 0 ? color : color + '55' }}
          />
        ))}
      </div>
    );
  }

  if (kind === 'line') {
    return (
      <div className="absolute inset-0 p-3">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
          <polyline
            points="0,42 14,32 28,36 42,20 56,26 72,12 100,18"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="0,46 22,43 46,44 72,41 100,42"
            fill="none"
            stroke={color + '55'}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (kind === 'timeline') {
    return (
      <div className="absolute inset-0 flex flex-col justify-center gap-2 px-3">
        <div className="relative h-4">
          <div className="absolute left-0 right-0 top-1/2 h-px" style={{ background: color + '55' }} />
          {[
            { left: '6%', filled: true },
            { left: '35%', filled: true },
            { left: '64%', filled: false },
            { left: '88%', filled: true },
          ].map((d, i) => (
            <span
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border"
              style={{ left: d.left, background: d.filled ? color : 'transparent', borderColor: color }}
            />
          ))}
        </div>
        <div className="flex justify-between px-0.5 text-[7px] text-gray-500">
          {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
            <span key={q}>{q}</span>
          ))}
        </div>
      </div>
    );
  }

  if (kind === 'people') {
    return (
      <div className="absolute inset-0 flex items-center gap-3 p-3">
        <div className="flex -space-x-2">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white"
              style={{ background: [color, color + '77', color + 'AA', color + '55'][i] }}
            >
              {['A', 'S', 'R', 'J'][i]}
            </span>
          ))}
        </div>
        <div className="flex-1 space-y-1.5">
          {[90, 70, 45].map((w, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="flex-1 h-1 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${w}%`, background: color }} />
              </div>
              <span className="text-[7px] text-gray-500 w-5 text-right">{w}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === 'gauge') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-3">
        <div className="relative w-24 h-12 overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 h-full rounded-t-full"
            style={{ background: `conic-gradient(${color} 0 260deg, #e2e8f0 260deg 360deg)` }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold leading-none" style={{ color }}>
            72%
          </span>
          <span className="text-[7px] text-gray-500">target</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2 p-3">
      {[
        { label: 'Reading', w: 92 },
        { label: 'Math', w: 74 },
        { label: 'Science', w: 58 },
      ].map((r) => (
        <div key={r.label} className="flex items-center gap-2">
          <span className="text-[8px] text-gray-500 w-12">{r.label}</span>
          <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${r.w}%`, background: color }} />
          </div>
          <span className="text-[8px] font-semibold w-7 text-right" style={{ color }}>
            {r.w}%
          </span>
        </div>
      ))}
    </div>
  );
}

function DatasetPivot({
  workbook,
  sheetIdx,
  onSheetIdx,
  pivotRows,
  onPivotRows,
  pivotValues,
  onPivotValues,
  pivotAgg,
  onPivotAgg,
  pivotGran,
  onPivotGran,
  pivotLimit,
  onPivotLimit,
  pivotRest,
  onPivotRest,
  pivot,
  onRemove,
}: {
  workbook: DataWorkbook;
  sheetIdx: number;
  onSheetIdx: (i: number) => void;
  pivotRows: string;
  onPivotRows: (v: string) => void;
  pivotValues: string;
  onPivotValues: (v: string) => void;
  pivotAgg: PivotAgg;
  onPivotAgg: (a: PivotAgg) => void;
  pivotGran: PivotGranularity;
  onPivotGran: (g: PivotGranularity) => void;
  pivotLimit: number;
  onPivotLimit: (n: number) => void;
  pivotRest: boolean;
  onPivotRest: (b: boolean) => void;
  pivot: PivotResult | null;
  onRemove: () => void;
}) {
  const activeSheet = workbook.sheets[sheetIdx] ?? null;
  const rowOptions = useMemo(() => {
    if (!activeSheet) return [];
    const nonNumeric = activeSheet.columns.filter((c) => !c.numeric);
    return nonNumeric.length > 0 ? nonNumeric : activeSheet.columns;
  }, [activeSheet]);
  const valOptions = useMemo(
    () => (activeSheet ? activeSheet.columns : []),
    [activeSheet]
  );
  const effectiveVal = valOptions.some((c) => c.key === pivotValues)
    ? pivotValues
    : valOptions[0]?.key ?? '';
  const measureNumeric = !!valOptions.find((c) => c.key === effectiveVal)?.numeric;
  const dimIsDate = !!activeSheet?.columns.find((c) => c.key === pivotRows)?.dateLike;
  const aggOptions: PivotAgg[] = measureNumeric
    ? ['sum', 'avg', 'count', 'min', 'max']
    : ['count'];
  const fmtVal = (n: number) =>
    Math.abs(n) >= 100000
      ? formatNumber(n)
      : n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  const selectCls =
    'w-full bg-white border border-gray-200 rounded-lg text-[13px] text-gray-800 px-2.5 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 appearance-none cursor-pointer';
  const inlineSel = selectCls.replace('w-full', 'w-auto');
  const showShare = pivot !== null && (pivot.agg === 'sum' || pivot.agg === 'count');

  if (!activeSheet) return null;

  return (
    <div className="mt-2.5 rounded-xl border border-indigo-200 bg-indigo-50/60 p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-[12px] text-gray-700 min-w-0">
          <FileSpreadsheet className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="truncate max-w-[160px] font-medium">{workbook.name}</span>
          <span className="text-gray-400 shrink-0">
            {activeSheet.name} · {activeSheet.rowCount} rows
          </span>
        </div>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-800 transition-colors shrink-0"
          aria-label="Remove data file"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2.5">
        <label className="block">
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
            <Table2 className="w-3 h-3" /> Sheet
          </span>
          <select
            value={sheetIdx}
            onChange={(e) => onSheetIdx(Number(e.target.value))}
            className={selectCls}
          >
            {workbook.sheets.map((s, i) => (
              <option key={s.name} value={i}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1 block">
            Rows
          </span>
          <select
            value={pivotRows}
            onChange={(e) => onPivotRows(e.target.value)}
            className={selectCls}
          >
            {rowOptions.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1 block">
            Values
          </span>
          <select
            value={effectiveVal}
            onChange={(e) => {
              const v = e.target.value;
              onPivotValues(v);
              if (
                !activeSheet.columns.some((c) => c.key === v && c.numeric) &&
                pivotAgg !== 'count'
              ) {
                onPivotAgg('count');
              }
            }}
            className={selectCls}
            disabled={valOptions.length === 0}
          >
            {valOptions.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
            <Sigma className="w-3 h-3" /> Aggregate
          </span>
          <select
            value={pivotAgg}
            onChange={(e) => onPivotAgg(e.target.value as PivotAgg)}
            className={selectCls}
            disabled={valOptions.length === 0}
          >
            {aggOptions.map((a) => (
              <option key={a} value={a}>
                {a.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-2.5">
        {dimIsDate && (
          <label className="flex items-center gap-1.5 text-[11px] text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            Group by
            <select
              value={pivotGran}
              onChange={(e) => onPivotGran(e.target.value as PivotGranularity)}
              className={inlineSel}
            >
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
              <option value="year">Year</option>
            </select>
          </label>
        )}
        <label className="flex items-center gap-1.5 text-[11px] text-gray-600">
          <ListFilter className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          Top
          <select
            value={pivotLimit}
            onChange={(e) => onPivotLimit(Number(e.target.value))}
            className={inlineSel}
          >
            <option value={0}>All</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
          {pivotLimit !== 0 && (
            <button
              type="button"
              onClick={() => onPivotRest(!pivotRest)}
              className={cn(
                'px-2 py-1 rounded-lg text-[11px] border transition-colors',
                pivotRest
                  ? 'bg-indigo-600/10 border-indigo-300 text-indigo-700'
                  : 'bg-white border-gray-200 text-gray-500'
              )}
            >
              + Other
            </button>
          )}
        </label>
      </div>

      {pivot ? (
        <div className="rounded-lg bg-white border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-left text-[10px] text-gray-500 border-b border-gray-100">
                <th className="px-2.5 py-1.5 font-medium">{pivot.dimension}</th>
                <th className="px-2.5 py-1.5 font-medium text-right">
                  {pivot.agg} of {pivot.measure}
                </th>
                {showShare && (
                  <th className="px-2.5 py-1.5 font-medium text-right">%</th>
                )}
              </tr>
            </thead>
            <tbody>
              {pivot.buckets.slice(0, 5).map((b) => (
                <tr key={b.label} className="border-b border-gray-100 last:border-0">
                  <td className="px-2.5 py-1.5 text-gray-700 truncate max-w-[220px]">
                    {b.label}
                  </td>
                  <td className="px-2.5 py-1.5 text-right text-gray-800">
                    {fmtVal(b.value)}
                  </td>
                  {showShare && (
                    <td className="px-2.5 py-1.5 text-right text-gray-500">
                      {b.share !== undefined ? `${Math.round(b.share * 100)}%` : '—'}
                    </td>
                  )}
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="px-2.5 py-1.5 font-semibold text-gray-600">Total</td>
                <td className="px-2.5 py-1.5 text-right font-semibold text-indigo-600">
                  {pivot.agg === 'count'
                    ? `${pivot.count} records`
                    : pivot.agg === 'avg'
                      ? `${fmtVal(pivot.total)} total`
                      : fmtVal(pivot.total)}
                </td>
                {showShare && (
                  <td className="px-2.5 py-1.5 text-right text-gray-500">100%</td>
                )}
              </tr>
            </tbody>
          </table>
          <div className="px-2.5 py-1.5 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between bg-gray-50/60">
            <span>
              Chart: {pivot.agg.toUpperCase()} of {pivot.measure} by {pivot.dimension}
              {pivot.granularity ? ` (${pivot.granularity})` : ''} · {pivot.count} records
            </span>
            {pivot.buckets.length > 5 && (
              <span className="text-gray-400">+{pivot.buckets.length - 5} more</span>
            )}
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-amber-600">
          Nothing to aggregate — the sheet has no usable columns.
        </p>
      )}
    </div>
  );
}

interface DataSource {
  id: string;
  workbook: DataWorkbook;
  sheetIdx: number;
  pivotRows: string;
  pivotValues: string;
  pivotAgg: PivotAgg;
  pivotGran: PivotGranularity;
  pivotLimit: number;
  pivotRest: boolean;
}

export default function LandingPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationMode, setGenerationMode] = useState<string | null>(null);
  const [docs, setDocs] = useState<Array<UploadedDocument & { id: string }>>([]);
  const [sources, setSources] = useState<DataSource[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { addPresentation, presentations } = useStore();
  const aiAvailable = isAIEnabled();

  const sourcePivots = useMemo(
    () =>
      sources.map((src) => {
        const sheet = src.workbook.sheets[src.sheetIdx] ?? null;
        if (!sheet || !src.pivotRows) {
          return { id: src.id, name: src.workbook.name, pivot: null as PivotResult | null };
        }
        const valKey = sheet.columns.some((c) => c.key === src.pivotValues)
          ? src.pivotValues
          : sheet.columns[0]?.key;
        if (!valKey) {
          return { id: src.id, name: src.workbook.name, pivot: null as PivotResult | null };
        }
        const dimIsDate = sheet.columns.find((c) => c.key === src.pivotRows)?.dateLike ?? false;
        return {
          id: src.id,
          name: src.workbook.name,
          pivot: computePivot(sheet.rows, src.pivotRows, valKey, src.pivotAgg, {
            granularity: dimIsDate ? src.pivotGran : undefined,
            limit: src.pivotLimit || undefined,
            includeRest: src.pivotRest,
          }),
        };
      }),
    [sources]
  );

  const pivots = sourcePivots.filter(
    (sp): sp is { id: string; name: string; pivot: PivotResult } => sp.pivot !== null
  );
  const activePivot = pivots[0]?.pivot ?? null;

  const updateSource = (srcId: string, patch: Partial<Omit<DataSource, 'id' | 'workbook'>>) =>
    setSources((prev) => prev.map((s) => (s.id === srcId ? { ...s, ...patch } : s)));

  const removeSource = (srcId: string) =>
    setSources((prev) => prev.filter((s) => s.id !== srcId));

  const handleSheetIdx = (srcId: string, i: number) => {
    const sheet = sources.find((s) => s.id === srcId)?.workbook.sheets[i];
    if (sheet) {
      const fresh = defaultPivot(sheet);
      updateSource(srcId, {
        sheetIdx: i,
        pivotRows: fresh.dimension,
        pivotValues: fresh.measure,
        pivotAgg: fresh.agg,
        pivotGran: fresh.granularity ?? 'month',
      });
    }
  };

  const canGenerate =
    Boolean(prompt.trim()) ||
    docs.some((d) => d.text.trim().length > 0) ||
    activePivot !== null;

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev >= generationSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 450);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleFiles = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    setUploadError(null);
    for (const file of Array.from(list)) {
      try {
        const result = await extractFileContent(file);
        if (result.kind === 'deck') {
          addPresentation(result.deck);
          navigate(`/present/${result.deck.id}`);
          return;
        }
        if (result.kind === 'data') {
          const first = result.workbook.sheets[0];
          let source: DataSource = {
            id: generateId(),
            workbook: result.workbook,
            sheetIdx: 0,
            pivotRows: '',
            pivotValues: '',
            pivotAgg: 'sum',
            pivotGran: 'month',
            pivotLimit: 0,
            pivotRest: true,
          };
          if (first) {
            const fresh = defaultPivot(first);
            source = {
              ...source,
              pivotRows: fresh.dimension,
              pivotValues: fresh.measure,
              pivotAgg: fresh.agg,
              pivotGran: fresh.granularity ?? 'month',
            };
          }
          setSources((prev) => [...prev, source]);
          continue;
        }
        setDocs((prev) => [...prev, { id: generateId(), ...result }]);
      } catch {
        setUploadError(`Couldn't read "${file.name}". Try a TXT, MD, CSV, JSON, PDF, or Excel file.`);
      }
    }
  };

  const handleGenerate = async () => {
    const docText = docs
      .map((d) => d.text)
      .filter(Boolean)
      .join('\n\n')
      .slice(0, 8000);
    const effectivePrompt = [
      prompt.trim(),
      docText ? `Attached document:\n${docText}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    if ((!effectivePrompt.trim() && pivots.length === 0) || isGenerating) return;
    setIsGenerating(true);
    setGenerationStep(0);
    setGenerationMode(null);

    const started = Date.now();
    let presentation: Presentation | null = null;
    let usedAI = false;

    const aiPrompt = (() => {
      const stat = (n: number, digits = 2) =>
        Math.abs(n) >= 100000 ? formatNumber(n) : n.toLocaleString('en-US', { maximumFractionDigits: digits });
      const parts: string[] = [
        prompt.trim() ||
          (pivots.length > 0
            ? 'Create a dashboard from the data pivots below. Every KPI and chart must use exactly these numbers.'
            : 'Create a presentation about the attached documents:'),
      ];
      if (pivots.length > 0) {
        const blocks = pivots.map(({ name, pivot }) =>
          [
            `DATA PIVOT (from ${name}):`,
            `Analysis: ${pivot.agg.toUpperCase()} of ${pivot.measure} by ${pivot.dimension}${pivot.granularity ? ` (${pivot.granularity})` : ''}`,
            `Stats: ${pivot.count} records · ${pivot.buckets.length} groups · avg ${stat(pivot.avg)} · min ${stat(pivot.min)} · max ${stat(pivot.max)}`,
            `Leading group: ${pivot.topLabel || 'none'}`,
            ...pivot.buckets.slice(0, 8).map((b) => `- ${b.label}: ${stat(b.value, 0)}${b.share !== undefined ? ` (${Math.round(b.share * 100)}%)` : ''}`),
          ].join('\n')
        );
        parts.push(blocks.join('\n\n'));
      }
      if (docs.length > 0) {
        parts.push(`Attached document${docs.length > 1 ? 's' : ''}:\n${docText}`);
      }
      return parts.join('\n\n');
    })();

    try {
      if (aiAvailable) {
        presentation = await generatePresentationWithAI(aiPrompt);
        usedAI = true;
      }
    } catch {
      setGenerationMode('AI request failed — building with the built-in engine instead.');
    }

    if (!presentation) {
      presentation = generatePresentation(effectivePrompt);
      if (activePivot) presentation.title = `${activePivot.agg}-${activePivot.measure} by ${activePivot.dimension}`;
    }

    if (pivots.length > 0 && presentation) {
      presentation = applyPivotsToDeck(
        presentation,
        pivots.map((p) => ({ pivot: p.pivot, source: p.name }))
      );
    }

    if (!usedAI && aiAvailable && !generationMode) {
      setGenerationMode('Built-in engine used.');
    }

    const elapsed = Date.now() - started;
    if (elapsed < 2800) {
      await new Promise((resolve) => setTimeout(resolve, 2800 - elapsed));
    }

    addPresentation(presentation);
    setIsGenerating(false);
    setGenerationStep(0);
    setGenerationMode(`${usedAI ? 'AI' : 'Built-in'} engine generated ${presentation.slides.length} slides.`);
    navigate(`/present/${presentation.id}`);
  };

  const handleTemplateClick = (templatePrompt: string) => {
    setPrompt(templatePrompt);
    promptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => promptRef.current?.focus(), 400);
  };

  return (
    <div id="top" className="min-h-screen bg-white text-gray-900 selection:bg-indigo-500/20">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="max-w-[1280px] mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-[15px] font-bold tracking-tight">DashCraft AI</span>
            </a>
            <div className="hidden md:flex items-center gap-1">
              {['Templates', 'Features', 'Docs'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="px-3 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
                >
                  {link}
                </a>
              ))}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100 flex items-center gap-1.5"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                GitHub
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                promptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => promptRef.current?.focus(), 400);
              }}
              aria-label="Log in (coming soon, start creating)"
              className="px-4 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
            >
              Log in
            </button>
            <button
              onClick={() => {
                promptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => promptRef.current?.focus(), 400);
              }}
              className="px-4 py-2 text-[13px] font-semibold text-white bg-gradient-to-r from-indigo-600 to-sky-600 rounded-lg hover:from-indigo-500 hover:to-sky-500 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-28">
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] rounded-full bg-gradient-to-br from-indigo-200/40 via-sky-200/30 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-[50px] right-[-150px] w-[500px] h-[500px] rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />
        <div className="absolute top-[200px] left-[-100px] w-[400px] h-[400px] rounded-full bg-cyan-200/40 blur-3xl pointer-events-none" />

        <div className="max-w-[720px] mx-auto text-center relative z-10 px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm text-[13px] text-gray-600 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              AI-powered dashboard generator
            </div>
          </motion.div>

          <motion.h1
            className="text-[56px] sm:text-[64px] font-bold tracking-[-0.03em] leading-[1.08] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Create Stunning{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-sky-500 bg-clip-text text-transparent">
              Dashboards
            </span>
          </motion.h1>

          <motion.p
            className="text-[18px] text-gray-500 max-w-[520px] mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Turn your ideas and documents into professional infographic dashboards in seconds.
          </motion.p>

          <motion.div
            id="generator"
            className="max-w-[640px] mx-auto scroll-mt-24"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-blue-400 to-sky-400 rounded-2xl opacity-20 group-hover:opacity-40 blur-lg transition duration-500" />
              <div className="relative bg-white border border-gray-200 shadow-xl shadow-gray-200/60 rounded-2xl p-5">
                <textarea
                  ref={promptRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                  placeholder="Describe your dashboard..."
                  rows={2}
                  className="w-full bg-transparent text-gray-900 placeholder-gray-400 resize-none outline-none text-[16px] leading-relaxed"
                />
                <div className="mt-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".txt,.md,.csv,.json,.pdf,.xlsx,.xls,.ods"
                    className="hidden"
                    onChange={(e) => {
                      handleFiles(e.target.files);
                      e.target.value = '';
                    }}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      handleFiles(e.dataTransfer.files);
                    }}
                    className={cn(
                      'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-dashed text-[13px] transition-colors cursor-pointer',
                      dragging
                        ? 'border-indigo-400 bg-indigo-50 text-indigo-600'
                        : 'border-gray-300 bg-gray-50 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                    )}
                  >
                    <Upload className="w-4 h-4" />
                    <span>
                      Add documents <span className="text-gray-400">(TXT, MD, JSON, PDF) or Excel/CSV data — drop or browse</span>
                    </span>
                  </div>

                  {uploadError && (
                    <p className="mt-2 text-[12px] text-rose-500">{uploadError}</p>
                  )}

                  {docs.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {docs.map((doc) => (
                        <span
                          key={doc.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-[12px] text-gray-700 shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="max-w-[220px] truncate">{doc.name}</span>
                          <span className="text-gray-400 text-[11px]">{formatBytes(doc.size)}</span>
                          <button
                            onClick={() => setDocs((prev) => prev.filter((d) => d.id !== doc.id))}
                            className="text-gray-400 hover:text-gray-900 transition-colors"
                            aria-label={`Remove ${doc.name}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {sources.length > 0 && (
                    <div className="mt-2.5 space-y-2.5">
                      {sources.map((src) => {
                        const sp = sourcePivots.find((x) => x.id === src.id);
                        return (
                          <DatasetPivot
                            key={src.id}
                            workbook={src.workbook}
                            sheetIdx={src.sheetIdx}
                            onSheetIdx={(i) => handleSheetIdx(src.id, i)}
                            pivotRows={src.pivotRows}
                            onPivotRows={(v) => updateSource(src.id, { pivotRows: v })}
                            pivotValues={src.pivotValues}
                            onPivotValues={(v) => updateSource(src.id, { pivotValues: v })}
                            pivotAgg={src.pivotAgg}
                            onPivotAgg={(a) => updateSource(src.id, { pivotAgg: a })}
                            pivotGran={src.pivotGran}
                            onPivotGran={(g) => updateSource(src.id, { pivotGran: g })}
                            pivotLimit={src.pivotLimit}
                            onPivotLimit={(n) => updateSource(src.id, { pivotLimit: n })}
                            pivotRest={src.pivotRest}
                            onPivotRest={(b) => updateSource(src.id, { pivotRest: b })}
                            pivot={sp?.pivot ?? null}
                            onRemove={() => removeSource(src.id)}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <p className="text-[12px] text-gray-500 flex items-center gap-2 flex-wrap">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-300 text-gray-500 text-[11px] font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-300 text-gray-500 text-[11px] font-mono">Enter</kbd> to generate
                    {aiAvailable ? (
                      <span className="inline-flex items-center gap-1 text-indigo-600">
                        <Sparkles className="w-3 h-3" /> AI generates topic-specific charts &amp; KPIs
                      </span>
                    ) : (
                      <span className="text-gray-400">· AI off — add <code className="text-[11px] font-mono text-gray-500">VITE_GROQ_API_KEY</code> to <code className="text-[11px] font-mono text-gray-500">.env</code></span>
                    )}
                  </p>
                  <button
                    onClick={handleGenerate}
                    disabled={!canGenerate || isGenerating}
                    className={cn(
                      'relative inline-flex items-center gap-2.5 px-8 py-3 rounded-xl font-semibold text-[15px] transition-all duration-300',
                      canGenerate && !isGenerating
                        ? 'bg-gradient-to-r from-indigo-600 via-blue-500 to-sky-500 hover:from-indigo-500 hover:via-blue-400 hover:to-sky-400 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    )}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4.5 h-4.5" />
                        Generate Dashboard
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Generation Progress */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="max-w-[640px] mx-auto overflow-hidden"
              >
                <div className="bg-white border border-gray-200 shadow-xl shadow-gray-200/60 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-5 h-5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                    <span className="text-[13px] font-medium text-gray-800">
                      {generationSteps[generationStep]}
                    </span>
                    <span className="ml-auto text-[12px] text-gray-500">
                      {Math.round(((generationStep + 1) / generationSteps.length) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${((generationStep + 1) / generationSteps.length) * 100}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                  {generationMode && (
                    <p className="mt-3 text-[12px] text-amber-600">
                      {generationMode}
                    </p>
                  )}
                  <div className="mt-4 space-y-2">
                    {generationSteps.map((step, i) => (
                      <div key={step} className="flex items-center gap-2.5">
                        <div className={cn(
                          'w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-300',
                          i <= generationStep ? 'bg-indigo-50' : 'bg-gray-100'
                        )}>
                          {i < generationStep ? (
                            <Check className="w-2.5 h-2.5 text-indigo-500" />
                          ) : i === generationStep ? (
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                          )}
                        </div>
                        <span className={cn(
                          'text-[13px] transition-colors duration-300',
                          i <= generationStep ? 'text-gray-700' : 'text-gray-400'
                        )}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hero dashboard preview */}
        <motion.div
          className="relative w-full mt-16 px-4 sm:px-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="max-w-[1280px] mx-auto">
            <DashboardPreview />
          </div>
        </motion.div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/80 to-white pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[40px] font-bold tracking-tight mb-4">Start with a Template</h2>
            <p className="text-[16px] text-gray-500 mb-6">Pick a starting point and customize it to your needs</p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-[12px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              {templates.length} ready-made dashboard layouts
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {templates.map((template, i) => {
              const TemplateIcon = iconMap[template.icon] || Rocket;
              return (
                <motion.button
                  key={template.id}
                  onClick={() => handleTemplateClick(template.prompt)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group text-left p-5 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col"
                >
                  <div
                    className="relative h-[86px] rounded-xl overflow-hidden mb-4 border border-gray-100"
                    style={{ background: `linear-gradient(135deg, ${template.color}21, ${template.color}0d)` }}
                  >
                    <TemplatePreview color={template.color} kind={previewKindFor[template.id] ?? 'bars'} />
                    <span
                      className="absolute top-2.5 right-2.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                      style={{ background: template.color }}
                    >
                      {template.category}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/60">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white shadow-lg"
                        style={{ background: template.color }}
                      >
                        Use template <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5 mb-3">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ backgroundColor: template.color + '15' }}
                    >
                      <TemplateIcon className="w-5 h-5" style={{ color: template.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[14px] text-gray-900 truncate">{template.name}</h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-[13px] text-gray-500 leading-relaxed flex-1">{template.description}</p>
                  <div className="flex items-center gap-1.5 mt-4 text-[12px] font-medium text-gray-500 group-hover:text-indigo-600 transition-colors duration-300">
                    Use template <ArrowRight className="w-3 h-3" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 relative bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[40px] font-bold tracking-tight mb-4">Why DashCraft AI?</h2>
            <p className="text-[16px] text-gray-500">Everything you need to create world-class dashboards</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="p-6 rounded-xl bg-white border border-gray-200 hover:border-indigo-200 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col"
                  style={{ minHeight: 180 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-[16px] mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed flex-1">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Docs / How it works */}
      <section id="docs" className="py-28 relative">
        <div className="max-w-[1280px] mx-auto px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[40px] font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-[16px] text-gray-500">Three steps from idea to dashboard</p>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
            <div
              className="hidden md:block absolute left-[16%] right-[16%] top-[52px] h-px bg-gradient-to-r from-indigo-400/0 via-indigo-400/30 to-indigo-400/0 pointer-events-none"
              aria-hidden="true"
            />
            {[
              { step: '01', icon: TextCursorInput, title: 'Describe your idea', desc: 'Type a prompt like "Q3 sales dashboard" or upload a document we analyze.' },
              { step: '02', icon: LayoutDashboard, title: 'Review the generated report', desc: 'A polished single-page dashboard with KPIs, charts, and infographics.' },
              { step: '03', icon: PresentationIcon, title: 'Customize & share', desc: 'Edit content, switch themes, then export as PNG or share a link.' },
            ].map((doc, i) => (
              <motion.div
                key={doc.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="relative z-10 p-6 rounded-xl bg-white border border-gray-200 hover:border-indigo-200 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <doc.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="text-[28px] font-bold bg-gradient-to-r from-indigo-500 to-sky-500 bg-clip-text text-transparent leading-none">
                    {doc.step}
                  </div>
                </div>
                <h3 className="font-semibold text-[16px] mb-2 text-gray-900">{doc.title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{doc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 relative border-y border-gray-200 bg-gradient-to-r from-indigo-50/70 via-sky-50/70 to-cyan-50/70">
        <div className="max-w-[1280px] mx-auto px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10+', label: 'Dashboard Layouts' },
              { value: '10', label: 'Color Themes' },
              { value: '12', label: 'Templates' },
              { value: '6', label: 'Chart Types' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="text-center"
              >
                <div className="text-[32px] font-bold bg-gradient-to-r from-indigo-600 to-sky-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-[13px] text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Dashboards */}
      <section id="recent" className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/60 to-white pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[40px] font-bold tracking-tight mb-4">Recent Dashboards</h2>
            <p className="text-[16px] text-gray-500">
              {presentations.length > 0 ? 'Pick up where you left off' : 'Your generated dashboards will appear here'}
            </p>
          </motion.div>

          {presentations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4 }}
              className="max-w-[560px] mx-auto text-center py-12 px-8 rounded-2xl bg-white border border-dashed border-gray-300"
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <FileText className="w-7 h-7 text-indigo-500" />
              </div>
              <h3 className="font-semibold text-[17px] mb-2">No dashboards yet</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
                Describe what you want above and your first dashboard will show up here instantly.
              </p>
              <button
                onClick={() => {
                  promptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setTimeout(() => promptRef.current?.focus(), 400);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white bg-gradient-to-r from-indigo-600 to-sky-600 rounded-lg hover:from-indigo-500 hover:to-sky-500 transition-all shadow-lg shadow-indigo-500/20"
              >
                <Sparkles className="w-4 h-4" />
                Create your first dashboard
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {presentations.slice(-6).reverse().map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  onClick={() => navigate(`/present/${p.id}`)}
                  className="group text-left p-5 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-[14px] truncate mb-1 group-hover:text-indigo-600 text-gray-900 transition-colors">
                        {p.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[12px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(p.createdAt).toLocaleDateString()}
                        </span>
                        <span>{p.slides.length === 1 ? '1 dashboard page' : `${p.slides.length} pages`}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-indigo-50/40 to-white pointer-events-none" />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-gradient-to-r from-indigo-200/50 via-sky-200/40 to-cyan-200/50 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <motion.div
          className="max-w-[720px] mx-auto text-center px-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-[36px] sm:text-[44px] font-bold tracking-tight mb-4">
            Ready to build your next{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-sky-500 bg-clip-text text-transparent">
              dashboard?
            </span>
          </h2>
          <p className="text-[16px] text-gray-500 max-w-[520px] mx-auto mb-8">
            Describe your idea or drop a document — get a polished, notebook-style dashboard in seconds.
          </p>
          <button
            onClick={() => {
              promptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setTimeout(() => promptRef.current?.focus(), 400);
            }}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-[15px] text-white bg-gradient-to-r from-indigo-600 via-blue-500 to-sky-500 hover:from-indigo-500 hover:via-blue-400 hover:to-sky-400 transition-all shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-4.5 h-4.5" />
            Create your first dashboard
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-[1280px] mx-auto px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
            <div className="col-span-2 md:col-span-2">
              <a href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-[15px] font-bold tracking-tight">DashCraft AI</span>
              </a>
              <p className="text-[14px] text-gray-500 leading-relaxed max-w-[300px]">
                Turn prompts, documents, and spreadsheets into professional infographic
                dashboards in seconds. Drop an Excel or CSV file and let the data do the talking.
              </p>
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Templates', href: '#templates' },
                  { label: 'Features', href: '#features' },
                  { label: 'Data & Excel Pivots', href: '#generator' },
                  { label: 'Recent Dashboards', href: '#recent' },
                  { label: 'Docs', href: '#docs' },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2.5">
                {['About', 'Blog', 'Careers', 'Press'].map((item) => (
                  <li key={item}>
                    <a href="#top" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2.5">
                {['FAQ', 'Contact', 'Privacy', 'Terms'].map((item) => (
                  <li key={item}>
                    <a href="#top" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-14 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-gray-400">&copy; {new Date().getFullYear()} DashCraft AI. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="GitHub">
                <GithubIcon className="w-4 h-4" />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="X (Twitter)">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}