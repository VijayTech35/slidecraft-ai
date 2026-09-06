import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import type { SlideLayout } from '@/types';

/** Human-friendly explanation for each slide layout, shown in the editor. */
const DESCRIPTIONS: Record<SlideLayout, { title: string; body: string }> = {
  cover: {
    title: 'Title / Cover',
    body: 'Opens the deck with the main title, subtitle, and a brand icon. Use it to set the topic and tone before diving into detail.',
  },
  'executive-summary': {
    title: 'Executive Summary',
    body: 'A high-level snapshot of the report. Each card highlights one key theme (growth, focus, innovation, excellence) so readers grasp the story in five seconds.',
  },
  'kpi-dashboard': {
    title: 'KPI Dashboard',
    body: 'Six headline metrics at a glance. Value + change % show what is trending up or down. This is the "scoreboard" of the deck.',
  },
  workflow: {
    title: 'Workflow',
    body: 'A linear flow of steps left-to-right. Shows how work moves from one stage to the next (discovery → strategy → execution → analysis).',
  },
  process: {
    title: 'Process',
    body: 'A vertical, alternating timeline of process stages. Good for showing an end-to-end operational sequence with numbered steps.',
  },
  comparison: {
    title: 'Comparison',
    body: 'Side-by-side pros/cons and a score bar. Use it to contrast two options (e.g. "Our Company vs Industry Average") and justify a decision.',
  },
  swot: {
    title: 'SWOT Analysis',
    body: 'A 2×2 grid of Strengths, Weaknesses, Opportunities, and Threats. Balances internal capabilities against external risks.',
  },
  recommendation: {
    title: 'Recommendations',
    body: 'Actionable next steps, each tagged with a priority (High / Medium / Low). Checked items are already completed actions.',
  },
  strengths: {
    title: 'Key Strengths',
    body: 'The strongest internal advantages of the subject. Each card pairs an icon with a headline metric to prove the claim.',
  },
  weaknesses: {
    title: 'Areas for Improvement',
    body: 'The most important gaps and risks to address. Red/amber accents signal urgency and where attention is needed.',
  },
  'chart-bar': {
    title: 'Bar Chart',
    body: 'Compares values across categories with vertical bars. The highlighted bar is the highest value; stat cards summarize total, average, highest and lowest.',
  },
  'chart-line': {
    title: 'Line / Trend Chart',
    body: 'Shows change over time with one or more series. Read the direction and slope to infer growth, seasonality, or decline.',
  },
  'chart-area': {
    title: 'Area Chart',
    body: 'Like a line chart but with filled area, emphasizing volume and magnitude of change over time.',
  },
  'chart-pie': {
    title: 'Pie Chart',
    body: 'Shows how a whole breaks into parts (percent share). Stat cards summarize the top segment and its share.',
  },
  'chart-donut': {
    title: 'Donut Chart',
    body: 'A pie variant with a hole in the middle, showing the total prominently. The right column lists each segment with its share.',
  },
  timeline: {
    title: 'Timeline',
    body: 'Milestones laid out along a horizontal line. Useful for project roadmaps and key achievements over time.',
  },
  table: {
    title: 'Data Table',
    body: 'Renders structured rows and columns for detailed numeric comparison. The colored header groups the data; first column labels each row.',
  },
  conclusion: {
    title: 'Conclusion',
    body: 'Wraps up the deck with a bold takeaway, a summary of key points, and a call to discussion or next steps.',
  },
  content: {
    title: 'Content',
    body: 'A flexible text + highlight layout. Use it for descriptions and supporting details that don\u2019t need a chart.',
  },
  'two-column': {
    title: 'Two Column',
    body: 'A content layout that splits information into two side-by-side columns for balanced reading.',
  },
  'icon-grid': {
    title: 'Icon Grid',
    body: 'A grid of icon-led highlights for listing features, benefits, or key points compactly.',
  },
  metrics: {
    title: 'Metrics Summary',
    body: 'A compact set of metrics with trend changes and progress bars, emphasizing movement toward targets.',
  },
  team: {
    title: 'Team',
    body: 'Introduces the leadership/stakeholders with initials avatars, name, and role.',
  },
  image: {
    title: 'Image / Hero',
    body: 'A full-bleed image with an overlay for the headline. Great for grabbing attention at the start of a section or as a divider between chapters.',
  },
  article: {
    title: 'Article / Explainer',
    body: 'A text-first layout for long-form explanation. It renders an optional lead paragraph plus labeled sections, which is ideal for explaining concepts, reasoning, and detail in depth.',
  },
  divider: {
    title: 'Section Divider',
    body: 'A full-bleed photo with a short, big headline to introduce a chapter or section of the deck. Keeps the deck feeling clean and cinematic, like modern AI-generated presentations.',
  },
  photo: {
    title: 'Photo Statement',
    body: 'A full-bleed photographic slide with a single short takeaway line. Stops the deck from feeling like a dense dashboard and adds breathing room between content-rich slides.',
  },
  report: {
    title: 'Single-Page Report',
    body: 'A NotebookLM-style single document. All content — summary, KPIs, analysis, charts, SWOT, recommendations, timeline, and conclusion — is combined into one scrollable dashboard page instead of multiple slides.',
  },
};

interface SlideInfoProps {
  layout: SlideLayout;
}

export default function SlideInfo({ layout }: SlideInfoProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const desc = DESCRIPTIONS[layout] || DESCRIPTIONS.content;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="absolute top-3 right-3 z-30">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-label="About this slide"
        title="About this slide"
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-gray-500 shadow-md ring-1 ring-black/5 backdrop-blur-sm transition-all hover:bg-white hover:text-gray-700 hover:scale-105 cursor-pointer"
      >
        <Info className="h-4 w-4" />
      </button>
      {open && (
        <div
          className="absolute right-0 top-9 w-64 rounded-xl p-4 shadow-2xl ring-1 ring-black/10"
          style={{ background: '#ffffff' }}
          role="tooltip"
        >
          <p className="mb-1 text-[13px] font-bold text-gray-900">{desc.title}</p>
          <p className="text-[12px] leading-relaxed text-gray-600">{desc.body}</p>
        </div>
      )}
    </div>
  );
}
