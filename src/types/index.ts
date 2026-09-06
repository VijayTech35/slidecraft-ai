export type SlideLayout =
  | 'cover'
  | 'executive-summary'
  | 'kpi-dashboard'
  | 'workflow'
  | 'process'
  | 'comparison'
  | 'swot'
  | 'recommendation'
  | 'strengths'
  | 'weaknesses'
  | 'chart-bar'
  | 'chart-pie'
  | 'chart-line'
  | 'chart-area'
  | 'chart-donut'
  | 'timeline'
  | 'table'
  | 'conclusion'
  | 'content'
  | 'two-column'
  | 'icon-grid'
  | 'metrics'
  | 'team'
  | 'image'
  | 'article'
  | 'divider'
  | 'photo'
  | 'report';

export type ThemeName =
  | 'corporate'
  | 'finance'
  | 'dark'
  | 'light'
  | 'minimal'
  | 'modern'
  | 'blue'
  | 'green'
  | 'startup'
  | 'vibrant';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  gradient: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface Theme {
  name: ThemeName;
  label: string;
  colors: ThemeColors;
}

export interface KPI {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: string;
  color?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  value2?: number;
  value3?: number;
}

export interface WorkflowStep {
  icon: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  icon: string;
  title: string;
  description: string;
}

export interface ComparisonItem {
  label: string;
  icon: string;
  pros: string[];
  cons: string[];
  score?: number;
}

export interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface RecommendationItem {
  icon: string;
  title: string;
  description: string;
  priority?: 'high' | 'medium' | 'low';
  checked?: boolean;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  icon: string;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
}

export interface SlideChart {
  title: string;
  subtitle?: string;
  type: string;
  data: ChartDataPoint[];
}

export interface SlideContent {
  title: string;
  subtitle?: string;
  description?: string;
  kpis?: KPI[];
  charts?: SlideChart[];
  chartData?: ChartDataPoint[];
  chartType?: string;
  steps?: WorkflowStep[];
  processSteps?: ProcessStep[];
  comparison?: ComparisonItem[];
  swot?: SWOTData;
  recommendations?: RecommendationItem[];
  table?: TableData;
  timeline?: TimelineItem[];
  team?: TeamMember[];
  items?: string[];
  icons?: string[];
  highlights?: { icon: string; title: string; description: string }[];
  image?: { src: string; caption?: string; alt?: string };
  sections?: { heading: string; body: string }[];
}

export interface Slide {
  id: string;
  layout: SlideLayout;
  content: SlideContent;
  order: number;
}

export interface DataPivotBucket {
  label: string;
  value: number;
  share?: number;
}

export interface DataPivot {
  dimension: string;
  measure: string;
  agg: 'sum' | 'avg' | 'count' | 'min' | 'max';
  granularity?: 'month' | 'quarter' | 'year';
  buckets: DataPivotBucket[];
  total: number;
  avg: number;
  min: number;
  max: number;
  count: number;
  topLabel: string;
}

export interface Presentation {
  id: string;
  title: string;
  prompt: string;
  slides: Slide[];
  theme: ThemeName;
  themeOverrides?: Partial<ThemeColors>;
  dataPivot?: DataPivot;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  prompt: string;
  color: string;
}
