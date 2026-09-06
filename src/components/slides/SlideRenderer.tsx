import type { Slide, Theme, SlideLayout } from '@/types';
import { motion, useReducedMotion } from 'framer-motion';
import CoverSlide from './CoverSlide';
import ExecutiveSummarySlide from './ExecutiveSummarySlide';
import KPIDashboardSlide from './KPIDashboardSlide';
import WorkflowSlide from './WorkflowSlide';
import ProcessSlide from './ProcessSlide';
import ComparisonSlide from './ComparisonSlide';
import SWOTSlide from './SWOTSlide';
import RecommendationSlide from './RecommendationSlide';
import StrengthsSlide from './StrengthsSlide';
import WeaknessesSlide from './WeaknessesSlide';
import ChartBarSlide from './ChartBarSlide';
import ChartPieSlide from './ChartPieSlide';
import ChartLineSlide from './ChartLineSlide';
import ChartAreaSlide from './ChartAreaSlide';
import ChartDonutSlide from './ChartDonutSlide';
import ChartComboSlide from './ChartComboSlide';
import ChartFunnelSlide from './ChartFunnelSlide';
import TimelineSlide from './TimelineSlide';
import TableSlide from './TableSlide';
import ConclusionSlide from './ConclusionSlide';
import ContentSlide from './ContentSlide';
import MetricsSlide from './MetricsSlide';
import TeamSlide from './TeamSlide';
import ImageSlide from './ImageSlide';
import ArticleSlide from './ArticleSlide';
import DividerSlide from './DividerSlide';
import PhotoSlide from './PhotoSlide';
import ReportSlide from './ReportSlide';
import SlideInfo from './SlideInfo';

interface SlideRendererProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

const layoutMap: Record<SlideLayout, React.ComponentType<{ slide: Slide; theme: Theme; isThumbnail?: boolean }>> = {
  cover: CoverSlide,
  'executive-summary': ExecutiveSummarySlide,
  'kpi-dashboard': KPIDashboardSlide,
  workflow: WorkflowSlide,
  process: ProcessSlide,
  comparison: ComparisonSlide,
  swot: SWOTSlide,
  recommendation: RecommendationSlide,
  strengths: StrengthsSlide,
  weaknesses: WeaknessesSlide,
  'chart-bar': ChartBarSlide,
  'chart-pie': ChartPieSlide,
  'chart-line': ChartLineSlide,
  'chart-area': ChartAreaSlide,
  'chart-donut': ChartDonutSlide,
  'chart-combo': ChartComboSlide,
  'chart-funnel': ChartFunnelSlide,
  timeline: TimelineSlide,
  table: TableSlide,
  metrics: MetricsSlide,
  team: TeamSlide,
  image: ImageSlide,
  article: ArticleSlide,
  divider: DividerSlide,
  photo: PhotoSlide,
  report: ReportSlide,
  conclusion: ConclusionSlide,
  content: ContentSlide,
  'two-column': ContentSlide,
  'icon-grid': ContentSlide,
};

export default function SlideRenderer({ slide, theme, isThumbnail }: SlideRendererProps) {
  const Component = layoutMap[slide.layout] || ContentSlide;
  const reduceMotion = useReducedMotion();

  if (isThumbnail) {
    return <Component slide={slide} theme={theme} isThumbnail />;
  }

  return (
    <div className="relative">
      <motion.div
        key={slide.id}
        initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Component slide={slide} theme={theme} />
      </motion.div>
      <SlideInfo layout={slide.layout} />
    </div>
  );
}

