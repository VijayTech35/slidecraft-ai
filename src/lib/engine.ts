import type {
  Slide,
  SlideLayout,
  Presentation,
  KPI,
  ChartDataPoint,
  WorkflowStep,
  ProcessStep,
  ComparisonItem,
  SWOTData,
  RecommendationItem,
  TimelineItem,
  TeamMember,
  ThemeName,
} from '@/types';
import { generateId } from './utils';

export interface ChartConfig {
  title: string;
  subtitle?: string;
  type: string;
  data: ChartDataPoint[];
}

export interface CategoryData {
  theme: ThemeName;
  title: string;
  subtitle: string;
  intro: string;
  challenge: string;
  analysis: string;
  outlook: string;
  concepts: { heading: string; body: string }[];
  kpis: KPI[];
  charts?: ChartConfig[];
  workflowSteps: WorkflowStep[];
  mainChartData: ChartDataPoint[];
  mainChartType: string;
  additionalChartData: ChartDataPoint[];
  additionalChartType: string;
  thirdChartData: ChartDataPoint[];
  thirdChartType: string;
  comparison: ComparisonItem[];
  swot: SWOTData;
  recommendations: RecommendationItem[];
  strengths: { icon: string; title: string; description: string }[];
  weaknesses: { icon: string; title: string; description: string }[];
  processSteps: ProcessStep[];
  timeline: TimelineItem[];
  team: TeamMember[];
  conclusionPoints: string[];
  photoUrl?: string;
}

const CATEGORY_PHOTOS: Record<string, string> = {
  finance: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
  sales: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80',
  healthcare: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1600&q=80',
  marketing: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80',
  technology: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
  education: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80',
  sustainability: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=80',
  startup: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
};

const TOPIC_HEROES: { keywords: string[]; id: string }[] = [
  { keywords: ['ai', 'artificial', 'machine', 'cloud', 'server', 'software', 'code', 'data', 'cyber', 'saas', 'platform', 'devops', 'api'], id: 'photo-1558494949-ef010cbdcc31' },
  { keywords: ['health', 'medical', 'patient', 'hospital', 'clinical', 'drug', 'doctor', 'nurse', 'clinic', 'pharma', 'therapy'], id: 'photo-1505751172876-fa1923c5c528' },
  { keywords: ['market', 'brand', 'campaign', 'social', 'advert', 'seo', 'content', 'audience', 'community', 'influencer'], id: 'photo-1557804506-669a67965ba0' },
  { keywords: ['school', 'student', 'learning', 'campus', 'teaching', 'university', 'course', 'academy', 'education'], id: 'photo-1523050854058-8df90110c9f1' },
  { keywords: ['solar', 'energy', 'renewable', 'carbon', 'climate', 'green', 'wind', 'environ', 'eco', 'sustain'], id: 'photo-1509391366360-2e959784a276' },
  { keywords: ['pipeline', 'deal', 'customer', 'client', 'negotiation', 'sales', 'sell'], id: 'photo-1556761175-b413da4baf72' },
  { keywords: ['team', 'meeting', 'startup', 'founder', 'launch', 'office', 'people', 'collab', 'work', 'hire'], id: 'photo-1522202176988-66273c2fd55f' },
  { keywords: ['revenue', 'profit', 'earnings', 'capital', 'invest', 'bank', 'growth', 'money', 'finance', 'stock'], id: 'photo-1486406146926-c627a92ad1ab' },
];

const CATEGORY_ORDER = ['finance', 'sales', 'healthcare', 'marketing', 'technology', 'education', 'sustainability', 'startup'];

const GENERIC_HERO_IDS = CATEGORY_ORDER.map((c) => CATEGORY_PHOTOS[c].split('/photo-')[1].split('?')[0]);

function heroSeedHash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 4096;
}

function heroPhotoUrl(prompt: string, category: string): string {
  const lower = prompt.toLowerCase();
  let bestIndex = -1;
  let bestScore = 0;
  for (let i = 0; i < TOPIC_HEROES.length; i++) {
    let score = 0;
    for (const keyword of TOPIC_HEROES[i].keywords) {
      if (lower.includes(keyword)) score += keyword.length;
    }
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  const start =
    bestIndex >= 0
      ? bestIndex
      : Math.max(0, CATEGORY_ORDER.indexOf(category));
  const pool = [0, 1, 2].map((offset) => GENERIC_HERO_IDS[(start + offset) % GENERIC_HERO_IDS.length]);
  const picked = pool[heroSeedHash(`${prompt}::${category}::${bestScore}`) % pool.length];
  return `https://images.unsplash.com/${picked}?auto=format&fit=crop&w=1600&q=80`;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  finance: [
    'finance', 'financial', 'revenue', 'profit', 'investment', 'budget',
    'accounting', 'banking', 'portfolio', 'dividend', 'quarterly', 'earnings',
    'fiscal', 'capital', 'equity', 'debt', 'loan', 'interest rate', 'stock',
    'market cap', 'IPO', 'valuation', 'cash flow', 'balance sheet', 'ROI',
  ],
  sales: [
    'sales', 'sell', 'conversion', 'pipeline', 'lead', 'prospect',
    'deal', 'revenue', 'quota', 'commission', 'CRM', 'funnel', 'churn',
    'retention', 'acquisition', 'customer', 'client', 'negotiation',
  ],
  healthcare: [
    'health', 'medical', 'patient', 'hospital', 'clinical', 'pharma',
    'drug', 'diagnosis', 'treatment', 'therapy', 'wellness', 'disease',
    'epidemic', 'vaccine', 'surgery', 'doctor', 'nurse', 'healthcare',
  ],
  marketing: [
    'marketing', 'brand', 'campaign', 'advertising', 'social media',
    'content', 'SEO', 'email', 'audience', 'engagement', 'impression',
    'click', 'conversion', 'influencer', 'PR', 'media', 'awareness',
  ],
  technology: [
    'technology', 'tech', 'software', 'hardware', 'AI', 'machine learning',
    'cloud', 'cybersecurity', 'blockchain', 'DevOps', 'API', 'data',
    'infrastructure', 'SaaS', 'platform', 'digital', 'automation',
  ],
  education: [
    'education', 'learning', 'student', 'school', 'university', 'curriculum',
    'teaching', 'academic', 'course', 'training', 'skill', 'degree',
    'enrollment', 'campus', 'faculty', 'research', 'scholarship',
  ],
  sustainability: [
    'sustainability', 'environment', 'carbon', 'emission', 'green',
    'renewable', 'energy', 'climate', 'eco', 'recycle', 'waste',
    'conservation', 'biodiversity', 'solar', 'wind', 'pollution',
  ],
  startup: [
    'startup', 'venture', 'founder', 'entrepreneur', 'funding',
    'seed', 'Series A', 'pivot', 'MVP', 'market fit', 'growth hack',
    'burn rate', 'runway', 'bootstrapping', 'unicorn', 'disrupt',
  ],
};

export function detectCategory(prompt: string): string {
  const lower = prompt.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[category] = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        scores[category] += keyword.split(' ').length;
      }
    }
  }

  let bestCategory = 'finance';
  let bestScore = 0;
  for (const [category, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}

export function getCategoryData(category: string, prompt: string): CategoryData {
  const data: Record<string, CategoryData> = {
    finance: {
      theme: 'finance',
      title: 'Financial Performance Analysis',
      subtitle: 'Q4 2025 Comprehensive Review & Outlook',
      intro:
        'Financial performance is the clearest signal of operational health and strategic direction. This report examines how our financial position has evolved over the past year, where value is being created, and which levers will matter most in the quarters ahead. Beyond headline numbers, we look at the underlying drivers — revenue mix, cost structure, and working capital efficiency — and what they mean for sustainable growth.',
      challenge:
        'The central challenge is sustaining profitable growth in an environment of rising interest rates and intensifying competition. Margins are expanding, but that progress can erode quickly if capital allocation, cost discipline, and geographic concentration risk are not actively managed. The question is not whether to grow, but how to grow with discipline.',
      analysis:
        'Looking beyond the headline growth of 12.4%, the income statement, balance sheet, and cash flow statements tell a consistent story. Operating leverage improved as expenses grew slower than revenue, lifting net margin to 18.3%. A debt-to-equity ratio of 0.42 leaves significant headroom for strategic investment, and free cash flow of $6.1M funds organic initiatives without dilution. The principal risk sits on the revenue side: 62% of income is concentrated in North America, and variable-cost segments grew faster than stable recurring lines. Strengthening recurring revenue and expanding geographic reach are the most direct ways to de-risk the model.',
      outlook:
        'Our working assumption is that interest rates plateau before declining gradually, which favors disciplined expansion over hoarding cash. Priorities for the next 18 months are APAC market entry, working-capital optimization, and automation of the reporting stack. If current momentum holds, revenue is projected to reach $28M with margin expansion above 19% by the end of the fiscal year.',
      concepts: [
        {
          heading: 'Revenue Quality',
          body: 'Not all revenue is equal. Recurring, diversified streams — contracts, licensing, and services — are more predictable and more valuable than one-off transactions. We track revenue mix to ensure growth is durable rather than episodic.',
        },
        {
          heading: 'Cash Flow vs. Profit',
          body: 'Profit is an accounting measure; cash is reality. Free cash flow tells us whether the business funds itself, repays debt, and can reinvest without external capital. A company can be profitable yet cash-poor, which is why both are monitored together.',
        },
        {
          heading: 'Capital Efficiency',
          body: 'Capital efficiency measures how much output we get from every dollar invested. Metrics such as debt-to-equity, return on invested capital, and working-capital days reveal whether balance-sheet decisions support growth or constrain it.',
        },
      ],
      kpis: [
        { label: 'Total Revenue', value: '$24.8M', change: '+12.4%', changeType: 'positive', icon: 'DollarSign', color: '#10b981' },
        { label: 'Net Profit Margin', value: '18.3%', change: '+2.1%', changeType: 'positive', icon: 'TrendingUp', color: '#3b82f6' },
        { label: 'Operating Expenses', value: '$14.2M', change: '-3.8%', changeType: 'positive', icon: 'Receipt', color: '#f59e0b' },
        { label: 'Free Cash Flow', value: '$6.1M', change: '+15.7%', changeType: 'positive', icon: 'Wallet', color: '#8b5cf6' },
        { label: 'Debt-to-Equity', value: '0.42', change: '-0.08', changeType: 'positive', icon: 'Scale', color: '#ec4899' },
        { label: 'EPS', value: '$3.87', change: '+$0.54', changeType: 'positive', icon: 'BarChart3', color: '#14b8a6' },
      ],
      workflowSteps: [
        { icon: 'FileSearch', title: 'Data Collection', description: 'Gather financial data from ERP, banking APIs, and market feeds' },
        { icon: 'Filter', title: 'Validation', description: 'Cross-reference figures and validate against accounting standards' },
        { icon: 'BarChart3', title: 'Analysis', description: 'Compute ratios, trends, and variance analysis across periods' },
        { icon: 'FileText', title: 'Reporting', description: 'Generate income statement, balance sheet, and cash flow reports' },
        { icon: 'CheckCircle', title: 'Audit & Compliance', description: 'Internal review and regulatory compliance verification' },
      ],
      mainChartData: [
        { name: 'Q1', value: 22.1 },
        { name: 'Q2', value: 23.4 },
        { name: 'Q3', value: 21.8 },
        { name: 'Q4', value: 24.8 },
      ],
      mainChartType: 'bar',
      additionalChartData: [
        { name: 'Product Sales', value: 9.2 },
        { name: 'Services', value: 6.8 },
        { name: 'Licensing', value: 4.1 },
        { name: 'Consulting', value: 2.9 },
        { name: 'Other', value: 1.8 },
      ],
      additionalChartType: 'pie',
      thirdChartData: [
        { name: 'Jan', value: 7.8, value2: 6.2 },
        { name: 'Feb', value: 8.1, value2: 6.5 },
        { name: 'Mar', value: 7.5, value2: 6.8 },
        { name: 'Apr', value: 8.4, value2: 7.1 },
        { name: 'May', value: 8.9, value2: 7.4 },
        { name: 'Jun', value: 9.2, value2: 7.8 },
      ],
      thirdChartType: 'line',
      comparison: [
        { label: 'Our Company', icon: 'Building2', pros: ['18.3% net margin', 'Low debt ratio', 'Strong FCF'], cons: ['Lower market share', 'Regional concentration'], score: 85 },
        { label: 'Industry Average', icon: 'BarChart3', pros: ['Broader reach', 'Diversified portfolio'], cons: ['12.1% net margin', 'Higher leverage', 'Volatile cash flow'], score: 72 },
      ],
      swot: {
        strengths: ['Strong cash generation', 'Low debt levels', 'Consistent revenue growth', 'Diversified income streams'],
        weaknesses: ['Regional revenue concentration', 'High customer acquisition cost', 'Aging infrastructure', 'Talent retention challenges'],
        opportunities: ['Emerging market expansion', 'M&A opportunities', 'Digital transformation', 'New product lines'],
        threats: ['Rising interest rates', 'Regulatory changes', 'Market volatility', 'Competitive pressure'],
      },
      recommendations: [
        { icon: 'TrendingUp', title: 'Expand to APAC Markets', description: 'Enter Singapore and Tokyo markets to diversify geographic revenue mix and reduce concentration risk.', priority: 'high' },
        { icon: 'DollarSign', title: 'Optimize Working Capital', description: 'Reduce DSO by 12 days through improved AR processes, freeing up approximately $2.3M in working capital.', priority: 'high' },
        { icon: 'Shield', title: 'Hedge Currency Exposure', description: 'Implement FX hedging strategy to protect against currency fluctuations in international revenue streams.', priority: 'medium' },
        { icon: 'Users', title: 'Leadership Development Program', description: 'Launch internal pipeline for senior roles to reduce external hiring costs and improve retention.', priority: 'medium' },
        { icon: 'Zap', title: 'Automate Financial Reporting', description: 'Deploy AI-driven reporting tools to reduce month-end close from 8 days to 4 days.', priority: 'low' },
      ],
      strengths: [
        { icon: 'TrendingUp', title: 'Revenue Growth', description: '12.4% YoY growth outpacing industry average of 8.2%' },
        { icon: 'Shield', title: 'Risk Management', description: 'Conservative debt strategy with 0.42 debt-to-equity ratio' },
        { icon: 'Target', title: 'Profitability', description: 'Net margin of 18.3% is in top quartile of sector peers' },
      ],
      weaknesses: [
        { icon: 'MapPin', title: 'Geographic Risk', description: '62% of revenue concentrated in North American market' },
        { icon: 'Users', title: 'Turnover', description: '14% attrition rate in senior finance roles above industry benchmark' },
        { icon: 'Clock', title: 'Legacy Systems', description: 'Core accounting platform is 7 years old with limited automation' },
      ],
      processSteps: [
        { icon: 'Upload', title: 'Data Ingestion', description: 'Automated feeds from 12 banking institutions and 3 market data providers' },
        { icon: 'Cpu', title: 'AI Processing', description: 'ML models classify transactions and detect anomalies in real-time' },
        { icon: 'Eye', title: 'Human Review', description: 'Senior analysts review flagged items and approve exception handling' },
        { icon: 'Send', title: 'Distribution', description: 'Reports pushed to stakeholders via secure dashboards and email' },
      ],
      timeline: [
        { date: 'Oct 2025', title: 'Q3 Close', description: 'Completed quarterly close 2 days ahead of schedule', icon: 'CheckCircle' },
        { date: 'Nov 2025', title: 'System Upgrade', description: 'Rolled out enhanced forecasting module to FP&A team', icon: 'Cog' },
        { date: 'Dec 2025', title: 'Audit Start', description: 'Annual audit initiated with Deloitte, no material findings', icon: 'Search' },
        { date: 'Jan 2026', title: 'Budget Approval', description: 'Board approved FY2026 budget of $28.5M', icon: 'FileCheck' },
      ],
      team: [
        { name: 'Sarah Chen', role: 'Chief Financial Officer' },
        { name: 'Marcus Thompson', role: 'VP of Finance' },
        { name: 'Elena Rodriguez', role: 'Director, FP&A' },
        { name: 'James Okafor', role: 'Controller' },
      ],
      conclusionPoints: [
        'Revenue reached $24.8M representing 12.4% year-over-year growth',
        'Net profit margin improved to 18.3%, exceeding board target of 15%',
        'Free cash flow of $6.1M provides flexibility for strategic investments',
        'APAC expansion and working capital optimization are top priorities for 2026',
      ],
    },

    sales: {
      theme: 'modern',
      title: 'Sales Performance Dashboard',
      subtitle: 'Annual Revenue Analysis & Pipeline Review',
      intro:
        'Sales performance is the direct expression of market demand, sales effectiveness, and go-to-market execution. This report reviews bookings, win rates, pipeline quality, and retention to explain not just what we sold, but why we won, where we lost, and what must change to accelerate. The numbers below are a starting point; the operating cadence behind them is what drives repeatable results.',
      challenge:
        'Revenue growth of 22% masks two structural pressures: enterprise deals take too long to close, and the team has historically relied on a handful of accounts for a disproportionate share of bookings. Sustaining growth means converting a wider, healthier pipeline at predictable rates instead of chasing a small number of large wins.',
      analysis:
        'Bookings of $18.6M represent 22.1% growth, driven primarily by the enterprise segment while SMB volumes declined. Average deal size rose to $47.2K and the sales cycle shortened by eight days, evidence that recent qualification improvements are working. The weakness is concentration: the top three accounts contribute an uncomfortable share of bookings, and win/loss analysis shows many losses trace to late-stage pricing negotiations rather than product gaps. Fixing pricing guidance and expanding APAC coverage would do more for growth than hiring additional salespeople alone.',
      outlook:
        'The pipeline of $32.4M and coverage ratio of 3.2x support continued growth, but the mix must broaden. We expect the partner channel, AI-driven lead scoring, and the enterprise motion to contribute more than 30% of pipeline within two quarters. The targeted outcome is a win rate above 38%, an enterprise cycle under 55 days, and APAC contributing 10% of bookings by year-end.',
      concepts: [
        {
          heading: 'Pipeline Coverage',
          body: 'Coverage is the ratio of open pipeline to quota and answers whether the team holds enough qualified opportunities to hit targets. Coverage of 3.2x looks strong on average, but quality matters — opportunities must be scored and staged honestly so forecasts reflect reality.',
        },
        {
          heading: 'Win Rate and Deal Quality',
          body: 'Win rate is downstream evidence of qualification, pitch quality, and pricing discipline. Improving beyond 34% requires better discovery, sharper ROI-based messaging, and declining to pursue deals that will not justify the effort.',
        },
        {
          heading: 'Retention and Expansion',
          body: 'New logos drive short-term growth, but net revenue retention determines long-term value. A 94% renewal rate with expansion revenue from existing customers compounds quickly; losing that momentum silently raises the cost of every future booking.',
        },
      ],
      kpis: [
        { label: 'Total Bookings', value: '$18.6M', change: '+22.1%', changeType: 'positive', icon: 'ShoppingCart', color: '#10b981' },
        { label: 'Win Rate', value: '34.2%', change: '+4.8%', changeType: 'positive', icon: 'Target', color: '#3b82f6' },
        { label: 'Avg Deal Size', value: '$47.2K', change: '+$6.3K', changeType: 'positive', icon: 'DollarSign', color: '#f59e0b' },
        { label: 'Sales Cycle', value: '42 days', change: '-8 days', changeType: 'positive', icon: 'Clock', color: '#8b5cf6' },
        { label: 'Pipeline Value', value: '$32.4M', change: '+18.5%', changeType: 'positive', icon: 'Funnel', color: '#ec4899' },
        { label: 'Churn Rate', value: '5.1%', change: '-1.2%', changeType: 'positive', icon: 'UserMinus', color: '#14b8a6' },
      ],
      workflowSteps: [
        { icon: 'Search', title: 'Prospecting', description: 'Identify and qualify potential leads from multiple channels' },
        { icon: 'Phone', title: 'Outreach', description: 'Personalized multi-touch cadences via email, phone, and social' },
        { icon: 'Calendar', title: 'Discovery', description: 'Deep-dive meetings to understand pain points and requirements' },
        { icon: 'FileText', title: 'Proposal', description: 'Tailored proposals with ROI analysis and case studies' },
        { icon: 'Handshake', title: 'Close', description: 'Negotiate terms, secure signatures, and onboard new clients' },
      ],
      mainChartData: [
        { name: 'Jan', value: 1.2 },
        { name: 'Feb', value: 1.4 },
        { name: 'Mar', value: 1.6 },
        { name: 'Apr', value: 1.3 },
        { name: 'May', value: 1.8 },
        { name: 'Jun', value: 1.9 },
      ],
      mainChartType: 'bar',
      additionalChartData: [
        { name: 'Enterprise', value: 42 },
        { name: 'Mid-Market', value: 31 },
        { name: 'SMB', value: 18 },
        { name: 'Partner', value: 9 },
      ],
      additionalChartType: 'pie',
      thirdChartData: [
        { name: 'Jan', value: 320, value2: 180 },
        { name: 'Feb', value: 345, value2: 195 },
        { name: 'Mar', value: 380, value2: 210 },
        { name: 'Apr', value: 355, value2: 225 },
        { name: 'May', value: 410, value2: 240 },
        { name: 'Jun', value: 435, value2: 255 },
      ],
      thirdChartType: 'line',
      comparison: [
        { label: 'Top Performer', icon: 'Trophy', pros: ['$4.2M closed', '48% win rate', '38-day cycle'], cons: ['Over-reliance on 3 accounts', 'Low prospecting activity'], score: 92 },
        { label: 'Team Average', icon: 'Users', pros: ['$2.1M closed', '34% win rate', 'Diverse pipeline'], cons: ['42-day cycle', 'Inconsistent follow-up', 'Lower deal size'], score: 68 },
      ],
      swot: {
        strengths: ['Strong brand recognition', 'High customer satisfaction (NPS 72)', 'Growing enterprise segment', 'Effective sales enablement tools'],
        weaknesses: ['Long sales cycle for enterprise', 'Inconsistent follow-up rates', 'Limited presence in APAC', 'High CAC in SMB segment'],
        opportunities: ['Partnership channel expansion', 'AI-powered lead scoring', 'Vertical-specific solutions', 'Self-serve product tier'],
        threats: ['Aggressive competitor pricing', 'Economic slowdown affecting budgets', 'Longer procurement cycles', 'Key talent attrition'],
      },
      recommendations: [
        { icon: 'Rocket', title: 'Launch Partner Program', description: 'Develop a tiered partner program targeting 50 certified partners to drive 30% of pipeline by Q3.', priority: 'high' },
        { icon: 'Brain', title: 'Deploy AI Lead Scoring', description: 'Implement ML-based lead scoring to improve conversion rates by 15% and reduce wasted outreach.', priority: 'high' },
        { icon: 'Globe', title: 'APAC Market Entry', description: 'Hire 3 enterprise AEs and 2 SDRs focused on Singapore and Tokyo markets.', priority: 'medium' },
        { icon: 'Video', title: 'Sales Training Overhaul', description: 'Launch video-based roleplay platform with weekly coaching sessions from top performers.', priority: 'medium' },
        { icon: 'Layers', title: 'Segment Specialization', description: 'Create dedicated pods for Enterprise, Mid-Market, and SMB with tailored playbooks.', priority: 'low' },
      ],
      strengths: [
        { icon: 'Star', title: 'Brand Equity', description: 'NPS of 72 and 89% brand recall in target segments' },
        { icon: 'TrendingUp', title: 'Pipeline Growth', description: '32% QoQ pipeline growth with 3.2x coverage ratio' },
        { icon: 'HeartHandshake', title: 'Client Satisfaction', description: '94% renewal rate and 4.8/5.0 CSAT across accounts' },
      ],
      weaknesses: [
        { icon: 'Clock', title: 'Cycle Length', description: 'Enterprise sales cycle averaging 68 days vs 45-day target' },
        { icon: 'UserX', title: 'SDR Attrition', description: '38% annual attrition in SDR team increasing training costs' },
        { icon: 'AlertTriangle', title: 'Forecast Accuracy', description: 'Only 71% forecast accuracy leading to missed quarterly targets' },
      ],
      processSteps: [
        { icon: 'Database', title: 'CRM Hygiene', description: 'Weekly automated audits ensure 95% data accuracy across pipeline' },
        { icon: 'BarChart', title: 'Pipeline Review', description: 'Bi-weekly stage-by-stage reviews with SE and management' },
        { icon: 'MessageSquare', title: 'Win/Loss Analysis', description: 'Post-mortem on every closed deal to refine messaging and pricing' },
        { icon: 'Award', title: 'Recognition', description: 'Monthly leaderboards, quarterly President Club, and annual awards' },
      ],
      timeline: [
        { date: 'Q1 2026', title: 'CRM Migration', description: 'Completed migration to Salesforce with 98% data integrity', icon: 'Database' },
        { date: 'Q2 2026', title: 'APAC Launch', description: 'Opened Singapore office, hired 5 sales professionals', icon: 'Globe' },
        { date: 'Q3 2026', title: 'Partner Program', description: 'Launched tiered partner program with 23 certified partners', icon: 'Handshake' },
        { date: 'Q4 2026', title: 'AI Tools', description: 'Deployed AI lead scoring and conversation intelligence', icon: 'Brain' },
      ],
      team: [
        { name: 'David Park', role: 'VP of Sales' },
        { name: 'Lisa Nguyen', role: 'Enterprise Sales Director' },
        { name: 'Rachel Kim', role: 'SDR Team Lead' },
        { name: 'Tom Bradley', role: 'Sales Operations Manager' },
      ],
      conclusionPoints: [
        'Total bookings reached $18.6M representing 22.1% YoY growth',
        'Win rate improved to 34.2% through better qualification and demo standards',
        'Pipeline value of $32.4M provides strong visibility into next year',
        'Partner program and APAC expansion are critical growth vectors for 2026',
      ],
    },

    healthcare: {
      theme: 'green',
      title: 'Healthcare Operations Report',
      subtitle: 'Patient Outcomes & Resource Optimization',
      intro:
        'Healthcare operations succeed or fail on quality, capacity, and the experience of every patient and caregiver. This report reviews patient outcomes, resource utilization, and workforce health to understand how the system is performing today and where capacity will need to grow. Clinical quality and operational efficiency are treated as two sides of the same coin.',
      challenge:
        'Demand for services is rising faster than capacity. Emergency waits exceed national targets, nursing vacancies drive mandatory overtime, and aging infrastructure constrains how much we can safely treat. The core challenge is expanding achievable capacity without sacrificing care quality or exhausting the workforce.',
      analysis:
        'Outcomes are strong: 91.4% satisfaction, a 3.2-day average stay, and a readmission rate of 8.1% are each in the top quartile of peers. The operational constraint is capacity. Occupancy at 82.3% with emergency waits of 4.2 hours signals a system running near its limit, and 23 open nursing positions combined with 40% of equipment past its replacement cycle compound the risk. The most promising releases are telehealth, which moves stable chronic patients out of the physical facility, and AI-assisted diagnostics that compress turnaround in radiology and pathology. Both reduce pressure on the bottleneck resources.',
      outlook:
        'Telehealth will absorb the fastest-growing share of outpatient demand and is targeted to cover 30% of visits by year-end. Workforce initiatives — flexible scheduling, tuition support, and career ladders — aim to cut nursing turnover from 18% to 12%. Combined with phase-one facility modernization, these steps should bring emergency waits below three hours while sustaining the top-quartile quality scores we depend on.',
      concepts: [
        {
          heading: 'Length of Stay',
          body: 'Average length of stay reflects both clinical practice and process efficiency. Shorter stays usually mean safer, faster recovery and better bed availability — but only if readmission rates stay low, so the two metrics are always read together.',
        },
        {
          heading: 'Readmission as a Quality Signal',
          body: 'A readmission shortly after discharge often signals a breakdown in care transitions or discharge planning rather than poor medicine. Reducing it requires coordinated follow-up, medication reconciliation, and clear patient education. At 8.1% we outperform peers but still have headroom.',
        },
        {
          heading: 'Workforce Capacity',
          body: 'Staff-to-patient ratios and vacancy rates determine how much a hospital can actually deliver. Burnout and overtime are leading indicators of future turnover, which makes workforce planning a clinical safety issue as much as an HR issue.',
        },
      ],
      kpis: [
        { label: 'Patient Satisfaction', value: '91.4%', change: '+3.2%', changeType: 'positive', icon: 'Heart', color: '#10b981' },
        { label: 'Avg Length of Stay', value: '3.2 days', change: '-0.4 days', changeType: 'positive', icon: 'Clock', color: '#3b82f6' },
        { label: 'Readmission Rate', value: '8.1%', change: '-1.8%', changeType: 'positive', icon: 'RefreshCw', color: '#f59e0b' },
        { label: 'Bed Occupancy', value: '82.3%', change: '+2.1%', changeType: 'neutral', icon: 'Bed', color: '#8b5cf6' },
        { label: 'Staff-to-Patient', value: '1:4.2', change: '+0.3', changeType: 'positive', icon: 'Users', color: '#ec4899' },
        { label: 'Revenue Per Patient', value: '$8,420', change: '+$680', changeType: 'positive', icon: 'DollarSign', color: '#14b8a6' },
      ],
      workflowSteps: [
        { icon: 'ClipboardList', title: 'Triage', description: 'Initial patient assessment and priority classification upon arrival' },
        { icon: 'Stethoscope', title: 'Diagnosis', description: 'Clinical evaluation with diagnostic testing and imaging' },
        { icon: 'Pill', title: 'Treatment', description: 'Personalized care plan execution with medication management' },
        { icon: 'Activity', title: 'Monitoring', description: 'Continuous patient monitoring with real-time vitals tracking' },
        { icon: 'Home', title: 'Discharge', description: 'Discharge planning with follow-up care coordination' },
      ],
      mainChartData: [
        { name: 'Cardiology', value: 2840 },
        { name: 'Orthopedics', value: 1920 },
        { name: 'Neurology', value: 1540 },
        { name: 'Oncology', value: 1380 },
        { name: 'Pediatrics', value: 1120 },
      ],
      mainChartType: 'bar',
      additionalChartData: [
        { name: 'Emergency', value: 28 },
        { name: 'Surgical', value: 24 },
        { name: 'Medical', value: 22 },
        { name: 'Maternity', value: 14 },
        { name: 'ICU', value: 12 },
      ],
      additionalChartType: 'pie',
      thirdChartData: [
        { name: 'Jan', value: 78, value2: 82 },
        { name: 'Feb', value: 80, value2: 81 },
        { name: 'Mar', value: 82, value2: 79 },
        { name: 'Apr', value: 79, value2: 83 },
        { name: 'May', value: 83, value2: 80 },
        { name: 'Jun', value: 85, value2: 84 },
      ],
      thirdChartType: 'line',
      comparison: [
        { label: 'Our Hospital', icon: 'Hospital', pros: ['91.4% satisfaction', '3.2 day avg stay', 'Low readmission'], cons: ['High ER wait times', 'Staff burnout concerns'], score: 87 },
        { label: 'Peer Average', icon: 'Building2', pros: ['Broader specialties', 'More research funding'], cons: ['85% satisfaction', '4.1 day avg stay', 'Higher readmission'], score: 74 },
      ],
      swot: {
        strengths: ['Top-quartile patient outcomes', 'Strong clinical leadership', 'Advanced EHR system', 'Research partnerships'],
        weaknesses: ['ER overcrowding', 'Nursing staffing gaps', 'Aging facility infrastructure', 'Limited telehealth offerings'],
        opportunities: ['Telehealth expansion', 'AI-assisted diagnostics', 'Clinical trial partnerships', 'Value-based care contracts'],
        threats: ['Medicare reimbursement cuts', 'Nursing shortage crisis', 'Rising supply costs', 'Competitive hospital systems'],
      },
      recommendations: [
        { icon: 'Monitor', title: 'Expand Telehealth Services', description: 'Launch virtual care platform for chronic disease management, targeting 30% of outpatient visits by year-end.', priority: 'high' },
        { icon: 'Bot', title: 'AI Diagnostic Support', description: 'Deploy clinical decision support tools for radiology and pathology to reduce diagnostic errors by 20%.', priority: 'high' },
        { icon: 'Users', title: 'Nurse Retention Initiative', description: 'Implement flexible scheduling, tuition reimbursement, and career ladders to reduce turnover from 18% to 12%.', priority: 'medium' },
        { icon: 'Building', title: 'Facility Modernization', description: 'Phase 1 renovation of ICU and surgical suites with $4.2M capital investment.', priority: 'medium' },
        { icon: 'HandHeart', title: 'Patient Experience Program', description: 'Introduce bedside tablets, family communication tools, and extended visiting hours.', priority: 'low' },
      ],
      strengths: [
        { icon: 'Award', title: 'Clinical Excellence', description: 'Ranked top 5% nationally for patient safety and quality metrics' },
        { icon: 'GraduationCap', title: 'Teaching Hospital', description: '12 active residency programs attracting top medical talent' },
        { icon: 'Microscope', title: 'Research & Innovation', description: '47 active clinical trials generating $8.3M in research revenue' },
      ],
      weaknesses: [
        { icon: 'AlertCircle', title: 'ER Bottleneck', description: 'Average ER wait time of 4.2 hours exceeds 2-hour national target' },
        { icon: 'UserMinus', title: 'Nursing Shortage', description: '23 open nursing positions creating mandatory overtime burden' },
        { icon: 'Wrench', title: 'Infrastructure Age', description: '40% of medical equipment is past recommended replacement cycle' },
      ],
      processSteps: [
        { icon: 'ScanLine', title: 'Intake & Registration', description: 'Digital pre-registration reduces check-in time by 60%' },
        { icon: 'Pulse', title: 'Vitals & Assessment', description: 'Automated vital signs capture feeds directly into EHR' },
        { icon: 'TestTube', title: 'Lab & Diagnostics', description: 'In-house lab with 2-hour turnaround for 95% of common panels' },
        { icon: 'ClipboardCheck', title: 'Care Coordination', description: 'Dedicated care coordinators manage transitions between departments' },
      ],
      timeline: [
        { date: 'Jan 2026', title: 'EHR Upgrade', description: 'Launched Epic EHR module with integrated telehealth', icon: 'Monitor' },
        { date: 'Mar 2026', title: 'Quality Summit', description: 'Achieved Leapfrog A rating for third consecutive period', icon: 'Award' },
        { date: 'Jun 2026', title: 'Expansion', description: 'Opened 48-bed medical-surgical wing on schedule', icon: 'Building2' },
        { date: 'Sep 2026', title: 'AI Rollout', description: 'Pilot of AI-assisted radiology reading in ED department', icon: 'Brain' },
      ],
      team: [
        { name: 'Dr. Amara Osei', role: 'Chief Medical Officer' },
        { name: 'Patricia Walsh, RN', role: 'Chief Nursing Officer' },
        { name: 'Dr. Raj Mehta', role: 'VP of Clinical Operations' },
        { name: 'Angela Torres', role: 'Director of Quality & Safety' },
      ],
      conclusionPoints: [
        'Patient satisfaction reached 91.4%, a 3.2 percentage point improvement YoY',
        'Readmission rate reduced to 8.1% through enhanced discharge planning',
        'Telehealth and AI diagnostics represent highest-impact growth opportunities',
        'Nurse retention initiative is critical to sustaining operational quality',
      ],
    },

    marketing: {
      theme: 'vibrant',
      title: 'Marketing Strategy Overview',
      subtitle: 'Brand Performance & Campaign Analytics',
      intro:
        'Marketing today is measured on attention: how much we earn, how well we convert it, and at what cost. This report reviews brand awareness, campaign performance, and channel economics to explain which investments are compounding and which are leaking. Strategy success depends less on any single channel than on the feedback loop between data, creative, and audience.',
      challenge:
        'Growth is uneven across channels. Organic search and community carry the brand, while paid spend is getting more expensive and email is underperforming its benchmark. The marketing challenge is to shift the balance toward compounding assets — owned content, audience, and community — rather than renting attention at rising prices.',
      analysis:
        'Brand awareness climbed to 67.3% and cost per lead fell to $24.60, driven by SEO and community rather than paid scale. Search contributes 38% of traffic with page-one rankings on more than 240 high-intent keywords — a compounding asset competitors cannot simply buy. The gaps are video, which makes up only 12% of content, and email, which clicks at 14.2% versus a 21% target. Fixing email through better segmentation and energizing the video channel with short-form content address the two biggest content leverage points.',
      outlook:
        'Short-form video is the fastest-growing acquisition surface and will receive dedicated production capacity. AI personalization across email and the website is expected to lift conversion by 25%. The multi-quarter goal is for organic and community channels to supply the majority of qualified pipeline, reducing dependence on rising ad prices and shifting platform policies.',
      concepts: [
        {
          heading: 'Attribution and ROI',
          body: 'A campaign ROI of 5.4x only means something if we know which touchpoints actually drove revenue. Multi-touch attribution weights every interaction across the journey so that budget moves toward the highest-performing combination rather than the last click.',
        },
        {
          heading: 'Owned vs. Rented Audience',
          body: 'Owned channels — email lists, communities, and SEO — are assets we control and that compound over time. Rented channels — ads and platform feeds — stop working the moment the budget stops. The strategic direction is to convert paid reach into owned audience.',
        },
        {
          heading: 'Engagement Rate',
          body: 'Engagement measures how compelling content is beyond raw reach. Our 4.8% average engagement versus a 2.1% benchmark indicates that the audience is genuinely interested, which lowers the cost of every subsequent campaign.',
        },
      ],
      kpis: [
        { label: 'Brand Awareness', value: '67.3%', change: '+8.4%', changeType: 'positive', icon: 'Eye', color: '#10b981' },
        { label: 'Cost Per Lead', value: '$24.60', change: '-$3.80', changeType: 'positive', icon: 'DollarSign', color: '#3b82f6' },
        { label: 'Social Followers', value: '284K', change: '+42K', changeType: 'positive', icon: 'Users', color: '#f59e0b' },
        { label: 'Email Open Rate', value: '28.7%', change: '+2.1%', changeType: 'positive', icon: 'Mail', color: '#8b5cf6' },
        { label: 'Website Traffic', value: '1.2M', change: '+18.3%', changeType: 'positive', icon: 'Globe', color: '#ec4899' },
        { label: 'Campaign ROI', value: '5.4x', change: '+0.8x', changeType: 'positive', icon: 'TrendingUp', color: '#14b8a6' },
      ],
      workflowSteps: [
        { icon: 'Lightbulb', title: 'Strategy', description: 'Define target audience, messaging pillars, and channel strategy' },
        { icon: 'Palette', title: 'Creative', description: 'Develop visual identity, copy, and multimedia assets for campaigns' },
        { icon: 'Rocket', title: 'Launch', description: 'Deploy campaigns across digital, social, email, and paid channels' },
        { icon: 'BarChart3', title: 'Measure', description: 'Track KPIs, run A/B tests, and optimize in real-time' },
        { icon: 'Repeat', title: 'Iterate', description: 'Apply learnings to refine targeting and creative for next cycle' },
      ],
      mainChartData: [
        { name: 'Organic', value: 38 },
        { name: 'Paid', value: 28 },
        { name: 'Social', value: 18 },
        { name: 'Referral', value: 10 },
        { name: 'Email', value: 6 },
      ],
      mainChartType: 'donut',
      additionalChartData: [
        { name: 'Google Ads', value: 4200 },
        { name: 'Meta Ads', value: 3100 },
        { name: 'LinkedIn', value: 2400 },
        { name: 'TikTok', value: 1800 },
        { name: 'Programmatic', value: 1200 },
      ],
      additionalChartType: 'bar',
      thirdChartData: [
        { name: 'Jan', value: 82000, value2: 54000 },
        { name: 'Feb', value: 95000, value2: 61000 },
        { name: 'Mar', value: 108000, value2: 72000 },
        { name: 'Apr', value: 97000, value2: 68000 },
        { name: 'May', value: 124000, value2: 81000 },
        { name: 'Jun', value: 138000, value2: 92000 },
      ],
      thirdChartType: 'area',
      comparison: [
        { label: 'Our Brand', icon: 'Star', pros: ['67% awareness', 'Strong social presence', 'High engagement rates'], cons: ['Lower reach than competitors', 'SEO gaps in key terms'], score: 81 },
        { label: 'Top Competitor', icon: 'Zap', pros: ['72% awareness', 'Massive paid budget', 'Celebrity partnerships'], cons: ['Lower engagement', 'Higher CPL', 'Weak organic presence'], score: 78 },
      ],
      swot: {
        strengths: ['Strong organic search presence', 'High engagement on social', 'Loyal community of advocates', 'Data-driven decision culture'],
        weaknesses: ['Limited video content', 'Underperforming email sequences', 'Weak brand in APAC region', 'Small content team'],
        opportunities: ['Short-form video explosion', 'AI-generated personalization', 'Influencer partnerships', 'Community-led growth'],
        threats: ['Rising ad costs', 'Platform algorithm changes', 'Ad blocker adoption', 'Brand safety concerns'],
      },
      recommendations: [
        { icon: 'Video', title: 'Short-Form Video Strategy', description: 'Launch TikTok and Reels content producing 3 videos/week targeting 500K monthly views within 6 months.', priority: 'high' },
        { icon: 'Brain', title: 'AI Personalization Engine', description: 'Deploy AI-driven content personalization across email and website to boost conversion by 25%.', priority: 'high' },
        { icon: 'Handshake', title: 'Influencer Partnerships', description: 'Partner with 20 micro-influencers in target niches for authentic brand storytelling.', priority: 'medium' },
        { icon: 'Megaphone', title: 'Community Program', description: 'Build a branded community platform with ambassador rewards and exclusive content.', priority: 'medium' },
        { icon: 'Globe', title: 'APAC Brand Launch', description: 'Localized campaigns for Japan and Australia markets with region-specific messaging.', priority: 'low' },
      ],
      strengths: [
        { icon: 'Search', title: 'SEO Dominance', description: 'Page 1 rankings for 240+ high-intent keywords driving 38% of traffic' },
        { icon: 'MessageCircle', title: 'Community Engagement', description: '4.8% average engagement rate vs 2.1% industry average' },
        { icon: 'Lightbulb', title: 'Creative Excellence', description: 'Won 3 industry awards for campaign creative in the past year' },
      ],
      weaknesses: [
        { icon: 'Video', title: 'Video Gap', description: 'Only 12% of content is video vs 45% best practice benchmark' },
        { icon: 'Mail', title: 'Email Underperformance', description: '14.2% click rate vs 21% target across automated sequences' },
        { icon: 'MapPin', title: 'APAC Blindspot', description: 'Less than 2% of leads originate from Asia-Pacific region' },
      ],
      processSteps: [
        { icon: 'Target', title: 'Audience Research', description: 'Persona development using surveys, interviews, and behavioral data' },
        { icon: 'PenTool', title: 'Content Creation', description: 'Agile sprint model with bi-weekly content production cycles' },
        { icon: 'Share2', title: 'Distribution', description: 'Multi-channel syndication with platform-specific optimization' },
        { icon: 'PieChart', title: 'Analytics', description: 'Real-time dashboards tracking attribution across all touchpoints' },
      ],
      timeline: [
        { date: 'Jan 2026', title: 'Brand Refresh', description: 'Completed visual identity update and brand guidelines', icon: 'Palette' },
        { date: 'Mar 2026', title: 'Content Hub', description: 'Launched resource center generating 15K monthly leads', icon: 'BookOpen' },
        { date: 'Jun 2026', title: 'Video Launch', description: 'Started TikTok presence with 50K followers in first 60 days', icon: 'Video' },
        { date: 'Sep 2026', title: 'AI Tools', description: 'Deployed AI copywriter and personalization engine', icon: 'Bot' },
      ],
      team: [
        { name: 'Priya Sharma', role: 'VP of Marketing' },
        { name: 'Alex Morgan', role: 'Director of Content' },
        { name: 'Jordan Lee', role: 'Head of Growth' },
        { name: 'Casey Chen', role: 'Social Media Manager' },
      ],
      conclusionPoints: [
        'Brand awareness grew to 67.3% with strong gains in organic and social channels',
        'Campaign ROI reached 5.4x driven by improved targeting and creative testing',
        'Short-form video and AI personalization represent the highest-impact opportunities',
        'APAC expansion requires dedicated budget and localized strategy',
      ],
    },

    technology: {
      theme: 'dark',
      title: 'Technology Infrastructure Report',
      subtitle: 'Platform Performance & Engineering Roadmap',
      intro:
        'Technology is the engine of every other function in the business — its reliability, velocity, and security define what the organization can attempt. This report reviews platform performance, delivery cadence, and engineering health to assess whether the technical foundation can support the growth plan. The focus is on capabilities, not just uptime.',
      challenge:
        'The platform is fast and stable but showing strain. Technical debt consumes 14% of sprint capacity, the primary database runs in a single region, and machine-learning capabilities are thin relative to the opportunity. The challenge is investing in the foundation without slowing the feature velocity the business counts on.',
      analysis:
        'Reliability, security, and development velocity are all in strong shape: 99.97% uptime, an A+ security score, and forty-seven weekly deployments. The structural risks are architectural. A single-region database creates a four-hour recovery point objective, and 14% technical debt is consuming capacity that should flow to new capability. API latency of 89 milliseconds compares well against a 150ms benchmark, and an eight-minute CI/CD pipeline is industry leading. The next plateau requires multi-region architecture and an internal ML platform so that data science can ship models without waiting in engineering queue slots.',
      outlook:
        'Within two quarters we expect active-active deployment across two regions, cutting the recovery point objective from four hours to effectively zero. The internal ML platform will reach five production models this year, and a focused debt-reduction effort targets lowering rework from 14% to 8%. These investments keep the platform a supporting asset rather than a constraint.',
      concepts: [
        {
          heading: 'Uptime vs. Availability',
          body: 'Uptime of 99.97% reflects deliberate design: redundancy, failover, and automated incident response. High availability is an architecture property, not a monitoring metric — it is built before incidents occur, which is why an 18-minute mean time to recovery is a meaningful competitive asset.',
        },
        {
          heading: 'Deployment Velocity',
          body: 'Forty-seven deployments per week with an eight-minute pipeline means changes reach customers quickly and roll back safely. Velocity compresses feedback loops, which is the strongest predictor of both engineering morale and product quality.',
        },
        {
          heading: 'Technical Debt',
          body: 'Technical debt is deferred cost in the form of shortcuts that slow future change. A 14% share of capacity spent on rework is manageable but trending the wrong way; sharpening it below 10% releases meaningful capacity for new capability rather than maintenance.',
        },
      ],
      kpis: [
        { label: 'System Uptime', value: '99.97%', change: '+0.02%', changeType: 'positive', icon: 'Server', color: '#10b981' },
        { label: 'Deploy Frequency', value: '47/week', change: '+12', changeType: 'positive', icon: 'Rocket', color: '#3b82f6' },
        { label: 'MTTR', value: '18 min', change: '-7 min', changeType: 'positive', icon: 'Clock', color: '#f59e0b' },
        { label: 'API Response', value: '89ms', change: '-14ms', changeType: 'positive', icon: 'Zap', color: '#8b5cf6' },
        { label: 'Security Score', value: 'A+', change: 'Maintained', changeType: 'neutral', icon: 'Shield', color: '#ec4899' },
        { label: 'Tech Debt', value: '14%', change: '-4%', changeType: 'positive', icon: 'Code', color: '#14b8a6' },
      ],
      workflowSteps: [
        { icon: 'GitBranch', title: 'Development', description: 'Feature branches with automated testing and code review gates' },
        { icon: 'TestTube', title: 'CI/CD Pipeline', description: 'Automated build, test, and security scanning in under 8 minutes' },
        { icon: 'Cloud', title: 'Deployment', description: 'Blue-green deployments with instant rollback capabilities' },
        { icon: 'Activity', title: 'Monitoring', description: 'Real-time observability with Datadog, PagerDuty, and custom alerts' },
        { icon: 'MessageSquare', title: 'Incident Response', description: 'Runbook automation with on-call rotation and post-mortem process' },
      ],
      mainChartData: [
        { name: 'Jan', value: 3200, value2: 2800 },
        { name: 'Feb', value: 3600, value2: 3100 },
        { name: 'Mar', value: 3900, value2: 3400 },
        { name: 'Apr', value: 4200, value2: 3700 },
        { name: 'May', value: 4500, value2: 4000 },
        { name: 'Jun', value: 4800, value2: 4300 },
      ],
      mainChartType: 'area',
      additionalChartData: [
        { name: 'Compute', value: 42 },
        { name: 'Storage', value: 22 },
        { name: 'Network', value: 18 },
        { name: 'Database', value: 12 },
        { name: 'Other', value: 6 },
      ],
      additionalChartType: 'pie',
      thirdChartData: [
        { name: 'Jan', value: 99.94 },
        { name: 'Feb', value: 99.96 },
        { name: 'Mar', value: 99.93 },
        { name: 'Apr', value: 99.98 },
        { name: 'May', value: 99.97 },
        { name: 'Jun', value: 99.99 },
      ],
      thirdChartType: 'line',
      comparison: [
        { label: 'Our Platform', icon: 'Server', pros: ['99.97% uptime', '89ms latency', '47 deploys/week'], cons: ['14% tech debt', 'Single-region DB'], score: 88 },
        { label: 'Industry Benchmark', icon: 'BarChart', pros: ['Multi-region', 'More tooling'], cons: ['99.95% uptime', '150ms latency', '20 deploys/week'], score: 76 },
      ],
      swot: {
        strengths: ['Exceptional uptime and reliability', 'Fast deployment pipeline', 'Strong security posture', 'Experienced engineering team'],
        weaknesses: ['Growing tech debt', 'Single-region database', 'Limited ML/AI capabilities', 'Documentation gaps'],
        opportunities: ['Multi-cloud strategy', 'AI/ML platform buildout', 'Platform-as-a-Product', 'Open source contributions'],
        threats: ['Sophisticated cyber attacks', 'Talent market competition', 'Cloud cost inflation', 'Vendor lock-in risk'],
      },
      recommendations: [
        { icon: 'Database', title: 'Multi-Region Architecture', description: 'Implement active-active multi-region deployment for disaster recovery and latency reduction.', priority: 'high' },
        { icon: 'Brain', title: 'AI/ML Platform', description: 'Build internal ML platform to enable data science team self-service model training and deployment.', priority: 'high' },
        { icon: 'Code', title: 'Tech Debt Sprint', description: 'Allocate 20% of engineering capacity for 3 sprints to reduce tech debt from 14% to 8%.', priority: 'medium' },
        { icon: 'BookOpen', title: 'Documentation Drive', description: 'Launch internal wiki with API docs, architecture diagrams, and onboarding runbooks.', priority: 'medium' },
        { icon: 'Lock', title: 'Zero Trust Security', description: 'Implement zero trust network access replacing VPN for all internal services.', priority: 'low' },
      ],
      strengths: [
        { icon: 'Server', title: 'Reliability', description: '99.97% uptime with automated failover and self-healing infrastructure' },
        { icon: 'Rocket', title: 'Velocity', description: '47 deployments per week with 8-minute CI/CD pipeline' },
        { icon: 'ShieldCheck', title: 'Security', description: 'SOC 2 Type II certified with zero critical vulnerabilities in 18 months' },
      ],
      weaknesses: [
        { icon: 'Bug', title: 'Tech Debt', description: '14% of sprint capacity spent on rework due to accumulated technical debt' },
        { icon: 'HardDrive', title: 'Single-Region DB', description: 'Primary database running in single region with 4-hour RPO' },
        { icon: 'FileQuestion', title: 'Documentation', description: 'Only 40% of microservices have up-to-date API documentation' },
      ],
      processSteps: [
        { icon: 'Terminal', title: 'Local Dev', description: 'Docker Compose environments with hot-reload for rapid iteration' },
        { icon: 'GitMerge', title: 'Code Review', description: 'Mandatory 2-reviewer approval with automated linting and security scans' },
        { icon: 'Container', title: 'Staging', description: 'Full production mirror with synthetic data for comprehensive testing' },
        { icon: 'Globe', title: 'Production', description: 'Canary deployments with automated metrics comparison and rollback' },
      ],
      timeline: [
        { date: 'Jan 2026', title: 'K8s Migration', description: 'Completed migration from ECS to Kubernetes with zero downtime', icon: 'Cloud' },
        { date: 'Mar 2026', title: 'SOC 2 Renewal', description: 'Passed SOC 2 Type II audit with zero findings', icon: 'Shield' },
        { date: 'Jun 2026', title: 'ML Platform', description: 'Launched internal ML platform serving 5 models in production', icon: 'Brain' },
        { date: 'Sep 2026', title: 'Multi-Region', description: 'Active-active deployment to US-East and EU-West regions', icon: 'Globe' },
      ],
      team: [
        { name: 'Ryan Patel', role: 'VP of Engineering' },
        { name: 'Maya Johnson', role: 'Director of Platform' },
        { name: 'Kenji Tanaka', role: 'Head of SRE' },
        { name: 'Lisa Zhang', role: 'Security Architect' },
      ],
      conclusionPoints: [
        'System uptime maintained at 99.97% with MTTR reduced to 18 minutes',
        'Deployment frequency reached 47/week through CI/CD pipeline improvements',
        'Multi-region architecture and ML platform are top engineering priorities',
        'Tech debt reduction initiative will reclaim 20% of engineering capacity',
      ],
    },

    education: {
      theme: 'blue',
      title: 'Academic Performance Review',
      subtitle: 'Institutional Effectiveness & Student Outcomes',
      intro:
        'An institution\x27s quality is measured by what happens to its students — whether they learn, persist, graduate, and succeed afterward. This report reviews enrollment health, academic outcomes, and career results to understand institutional effectiveness beyond reputation. The data connects what the university does to what learners actually achieve.',
      challenge:
        'Enrollment is at a record high, but the demographic outlook is contracting, online competitors are expanding, and the built campus carries a $45M deferred maintenance backlog. The challenge is to grow access — through online, international, and corporate channels — while protecting the residential experience and outcomes that justify the cost.',
      analysis:
        'Enrollment of 12,840 students is a record, accompanied by a 94% sophomore return rate, an 87.3% four-year graduation rate, and 94.1% placement within six months. Research grants crossed $18.2M and student satisfaction sits at 4.6/5.0. The structural risks are about diversification: only three online programs exist versus fifteen or more at peer institutions, and alumni giving has slid from 22% to 16%. Revenue concentration in tuition — 52% — raises exposure to demographic contraction. The strategic answer is deliberate diversification across online degree lines, corporate partnerships, and international recruitment rather than betting the future on a single student segment.',
      outlook:
        'Five online degree programs targeting working professionals launch next year, with corporate partnerships bringing tuition-sponsored enrollments. International recruitment programs aim to double that segment within two years, and a phased $12M modernization of STEM facilities supports growth while beginning to clear the maintenance backlog. The goal is outcomes that stay strong while the revenue base broadens.',
      concepts: [
        {
          heading: 'Retention and Persistence',
          body: 'Retention tracks whether students who enroll continue into the next term. It is the earliest warning signal in the academic pipeline: persistence problems usually precede declines in graduation rate by years, which makes retention the metric to watch in real time.',
        },
        {
          heading: 'Graduation Rate',
          body: 'The graduation rate reflects the cumulative quality of advising, curriculum, and support over time. At 87.3%, with 94.1% placement within six months, outcomes justify the institution\x27s positioning — but they depend on staffing ratios and support services that must scale as the demographic base shifts.',
        },
        {
          heading: 'Career Outcomes',
          body: 'Employment and further-study rates after graduation are the truest external test of an education. Strong placement validates the curriculum and employer relationships, and is the difference between an enrollment number and a life-changing credential.',
        },
      ],
      kpis: [
        { label: 'Graduation Rate', value: '87.3%', change: '+2.4%', changeType: 'positive', icon: 'GraduationCap', color: '#10b981' },
        { label: 'Enrollment', value: '12,840', change: '+840', changeType: 'positive', icon: 'Users', color: '#3b82f6' },
        { label: 'Student Satisfaction', value: '4.6/5.0', change: '+0.3', changeType: 'positive', icon: 'Star', color: '#f59e0b' },
        { label: 'Faculty Ratio', value: '1:16', change: '+1', changeType: 'positive', icon: 'User', color: '#8b5cf6' },
        { label: 'Research Grants', value: '$18.2M', change: '+$2.4M', changeType: 'positive', icon: 'FlaskConical', color: '#ec4899' },
        { label: 'Job Placement', value: '94.1%', change: '+1.8%', changeType: 'positive', icon: 'Briefcase', color: '#14b8a6' },
      ],
      workflowSteps: [
        { icon: 'BookOpen', title: 'Curriculum Design', description: 'Faculty committees review and update course offerings annually' },
        { icon: 'Users', title: 'Enrollment', description: 'Digital admissions pipeline with AI-assisted application review' },
        { icon: 'Presentation', title: 'Teaching', description: 'Blended learning with lecture capture, labs, and discussion sections' },
        { icon: 'FileCheck', title: 'Assessment', description: 'Continuous evaluation through exams, projects, and peer review' },
        { icon: 'Award', title: 'Graduation', description: 'Degree conferral with career services and alumni onboarding' },
      ],
      mainChartData: [
        { name: 'Computer Sci', value: 2840 },
        { name: 'Business', value: 2210 },
        { name: 'Engineering', value: 1980 },
        { name: 'Liberal Arts', value: 1640 },
        { name: 'Sciences', value: 1520 },
      ],
      mainChartType: 'bar',
      additionalChartData: [
        { name: 'Tuition', value: 52 },
        { name: 'Grants', value: 18 },
        { name: 'Donations', value: 14 },
        { name: 'Research', value: 10 },
        { name: 'Other', value: 6 },
      ],
      additionalChartType: 'pie',
      thirdChartData: [
        { name: '2022', value: 11400, value2: 8400 },
        { name: '2023', value: 11900, value2: 9200 },
        { name: '2024', value: 12200, value2: 10100 },
        { name: '2025', value: 12840, value2: 11000 },
      ],
      thirdChartType: 'line',
      comparison: [
        { label: 'Our University', icon: 'GraduationCap', pros: ['87% graduation rate', '94% job placement', 'Strong research'], cons: ['Limited online programs', 'High cost of attendance'], score: 84 },
        { label: 'Peer Average', icon: 'Building', pros: ['Broader online reach', 'Lower cost'], cons: ['78% graduation rate', '82% placement', 'Less research output'], score: 71 },
      ],
      swot: {
        strengths: ['Strong employer relationships', 'High graduation rates', 'Growing research portfolio', 'Dedicated faculty'],
        weaknesses: ['Limited online degree offerings', 'Deferred maintenance backlog', 'Diverse student support gaps', 'Alumni engagement declining'],
        opportunities: ['Online program expansion', 'Corporate partnerships', 'International student growth', 'Micro-credentials'],
        threats: ['Enrollment demographic shift', 'Rising cost sensitivity', 'Competitive online platforms', 'Government funding uncertainty'],
      },
      recommendations: [
        { icon: 'Monitor', title: 'Online Degree Launch', description: 'Launch 5 fully online degree programs targeting working professionals by Fall 2026.', priority: 'high' },
        { icon: 'Handshake', title: 'Corporate Learning Partnerships', description: 'Establish partnerships with 20 Fortune 500 companies for tuition-sponsored programs.', priority: 'high' },
        { icon: 'Globe', title: 'International Recruitment', description: 'Double international enrollment with dedicated advisors in 5 key markets.', priority: 'medium' },
        { icon: 'Wrench', title: 'Campus Modernization', description: 'Phase 1 renovation of STEM buildings with $12M capital campaign.', priority: 'medium' },
        { icon: 'Award', title: 'Micro-Credentials', description: 'Launch stackable certificate programs in high-demand skills.', priority: 'low' },
      ],
      strengths: [
        { icon: 'Briefcase', title: 'Career Outcomes', description: '94.1% job placement rate within 6 months of graduation' },
        { icon: 'FlaskConical', title: 'Research Excellence', description: '$18.2M in active grants across 120 research projects' },
        { icon: 'Heart', title: 'Student Experience', description: '4.6/5.0 satisfaction with 92% return rate for sophomores' },
      ],
      weaknesses: [
        { icon: 'Wifi', title: 'Online Gap', description: 'Only 3 online programs vs 15+ at peer institutions' },
        { icon: 'Building', title: 'Facility Needs', description: '$45M deferred maintenance backlog on aging campus buildings' },
        { icon: 'Users', title: 'Alumni Engagement', description: 'Alumni giving rate dropped from 22% to 16% over 5 years' },
      ],
      processSteps: [
        { icon: 'FileText', title: 'Application Review', description: 'AI-assisted screening reduces review time by 40% while maintaining fairness' },
        { icon: 'UserCheck', title: 'Advising', description: 'Assigned advisors with 1:18 ratio meeting monthly with each student' },
        { icon: 'BookMarked', title: 'Learning', description: 'LMS with adaptive content delivery and real-time progress tracking' },
        { icon: 'Trophy', title: 'Outcome Tracking', description: '5-year longitudinal tracking of career outcomes and alumni success' },
      ],
      timeline: [
        { date: 'Aug 2025', title: 'Fall Semester', description: 'Record enrollment of 12,840 students with 94% retention', icon: 'Users' },
        { date: 'Dec 2025', title: 'Research Milestone', description: 'Surpassed $18M in annual research grants for first time', icon: 'FlaskConical' },
        { date: 'May 2026', title: 'Commencement', description: 'Graduated 2,840 students with 87.3% four-year rate', icon: 'GraduationCap' },
        { date: 'Sep 2026', title: 'Online Launch', description: 'Launching 3 online degree programs targeting 500 students', icon: 'Monitor' },
      ],
      team: [
        { name: 'Dr. Elena Vasquez', role: 'University Provost' },
        { name: 'Dr. Michael Brown', role: 'Dean of Faculty' },
        { name: 'Janet Liu', role: 'VP of Enrollment' },
        { name: 'Robert Hayes', role: 'Director of Career Services' },
      ],
      conclusionPoints: [
        'Graduation rate reached 87.3% with 94.1% job placement within 6 months',
        'Research portfolio grew to $18.2M in active grants across 120 projects',
        'Online programs and corporate partnerships represent highest-growth opportunities',
        'Campus modernization and alumni re-engagement are critical infrastructure priorities',
      ],
    },

    sustainability: {
      theme: 'green',
      title: 'Sustainability Impact Report',
      subtitle: 'Environmental Progress & Carbon Neutrality Roadmap',
      intro:
        'Sustainability performance is now a measure of business resilience, not just environmental goodwill. This report reviews emissions reduction, energy transition, and resource efficiency to explain progress toward net-zero and the business logic behind it. What gets measured here shapes the company\x27s license to operate, its cost base, and its access to capital.',
      challenge:
        'Progress on our own operations is strong, but 68% of our footprint sits in the supply chain, where we have the least control. The challenge is extending credible, verifiable decarbonization across suppliers and physical assets — at a moment when the marginal cost of each ton of reduction is rising.',
      analysis:
        'Emissions are down 34.2% from the 2021 baseline, renewable energy carries 62% of operations, and waste diversion reached 78.5% — results that put us on the CDP A-list two years running. The mathematics of the remaining journey is harder: Scope 3 is 68% of the footprint and requires supplier behavior we cannot control directly, while water intensity remains 15% above target. Financing is the other constraint: annual sustainability capital expenditure of $8M sits against the $15M the roadmap demands. Carbon credit markets, green financing, and circular product redesign are the cost-effective paths to closing the gap.',
      outlook:
        'The next milestones are a 5MW rooftop solar build-out, mandatory sustainability reporting for the top 100 suppliers, and B Corp certification. We target net-zero on Scope 1 and 2 by 2030 and, by 2028, verified participation of more than 50% of suppliers in reduction programs — the point at which Scope 3 becomes manageable rather than asymptotic.',
      concepts: [
        {
          heading: 'Scope 1, 2, 3 Emissions',
          body: 'Scopes define where emissions occur: direct operations, purchased energy, and the full value chain. Scope 3 — suppliers, logistics, and product use — is typically the largest share and the hardest to change, which is why 68% of our footprint lives beyond our four walls.',
        },
        {
          heading: 'Science-Based Targets',
          body: 'Science-based targets align company cuts with the Paris Agreement\x27s 1.5°C pathway. They convert a vague commitment into a specific, auditable trajectory — ours commits to net-zero for Scope 1 and 2 by 2030, and the transparency it creates binds decisions to the goal.',
        },
        {
          heading: 'Circular Economy',
          body: 'A circular model keeps materials and products in use rather than discarding them. Diversion of 78.5% of waste is a start, but true circularity redesigns products for disassembly and recyclability, changing the cost base over time rather than waiting for regulation to force it.',
        },
      ],
      kpis: [
        { label: 'Carbon Reduction', value: '34.2%', change: '+8.1%', changeType: 'positive', icon: 'Leaf', color: '#10b981' },
        { label: 'Renewable Energy', value: '62%', change: '+14%', changeType: 'positive', icon: 'Sun', color: '#f59e0b' },
        { label: 'Water Saved', value: '2.4M gal', change: '+420K', changeType: 'positive', icon: 'Droplets', color: '#3b82f6' },
        { label: 'Waste Diverted', value: '78.5%', change: '+5.2%', changeType: 'positive', icon: 'Recycle', color: '#8b5cf6' },
        { label: 'Green Certifications', value: '12', change: '+3', changeType: 'positive', icon: 'Award', color: '#ec4899' },
        { label: 'ESG Score', value: '82/100', change: '+7', changeType: 'positive', icon: 'BarChart3', color: '#14b8a6' },
      ],
      workflowSteps: [
        { icon: 'ScanLine', title: 'Assessment', description: 'Comprehensive carbon footprint audit across Scope 1, 2, and 3 emissions' },
        { icon: 'Target', title: 'Target Setting', description: 'Science-based targets aligned with 1.5°C Paris Agreement pathway' },
        { icon: 'Settings', title: 'Implementation', description: 'Energy efficiency upgrades, renewable procurement, and process changes' },
        { icon: 'BarChart3', title: 'Monitoring', description: 'Real-time emissions tracking with quarterly progress reporting' },
        { icon: 'CheckCircle', title: 'Certification', description: 'Third-party verification and sustainability certification attainment' },
      ],
      mainChartData: [
        { name: '2021', value: 14200 },
        { name: '2022', value: 12800 },
        { name: '2023', value: 11200 },
        { name: '2024', value: 9800 },
        { name: '2025', value: 8400 },
      ],
      mainChartType: 'bar',
      additionalChartData: [
        { name: 'Solar', value: 34 },
        { name: 'Wind', value: 18 },
        { name: 'Hydro', value: 10 },
        { name: 'Natural Gas', value: 28 },
        { name: 'Grid', value: 10 },
      ],
      additionalChartType: 'donut',
      thirdChartData: [
        { name: '2021', value: 42, value2: 58 },
        { name: '2022', value: 48, value2: 52 },
        { name: '2023', value: 54, value2: 46 },
        { name: '2024', value: 58, value2: 42 },
        { name: '2025', value: 62, value2: 38 },
      ],
      thirdChartType: 'area',
      comparison: [
        { label: 'Our Company', icon: 'Leaf', pros: ['34% carbon reduction', '62% renewable', 'Strong ESG score'], cons: ['Scope 3 lagging', 'High water intensity'], score: 82 },
        { label: 'Industry Average', icon: 'Factory', pros: ['More certifications', 'Better Scope 3 tracking'], cons: ['18% reduction', '35% renewable', '65 ESG score'], score: 64 },
      ],
      swot: {
        strengths: ['Strong renewable energy adoption', 'Leadership commitment', 'Detailed emissions tracking', 'Green product innovation'],
        weaknesses: ['Scope 3 emissions lagging', 'Water intensity above targets', 'Supply chain transparency gaps', 'High initial investment costs'],
        opportunities: ['Carbon credit markets', 'Green financing', 'Circular economy models', 'Green technology licensing'],
        threats: ['Regulatory complexity', 'Greenwashing accusations', 'Supply chain disruptions', 'Climate physical risks'],
      },
      recommendations: [
        { icon: 'Truck', title: 'Scope 3 Reduction Program', description: 'Mandate sustainability reporting from top 100 suppliers and provide capacity-building support.', priority: 'high' },
        { icon: 'Zap', title: 'On-Site Solar Expansion', description: 'Install 5MW of rooftop solar across 3 facilities, reducing grid dependency by 40%.', priority: 'high' },
        { icon: 'Droplets', title: 'Water Recycling System', description: 'Deploy closed-loop water recycling at manufacturing sites to cut freshwater use by 50%.', priority: 'medium' },
        { icon: 'Recycle', title: 'Circular Product Design', description: 'Redesign top 5 products for disassembly and recyclability within 18 months.', priority: 'medium' },
        { icon: 'FileCheck', title: 'B Corp Certification', description: 'Achieve B Corp certification across all operating subsidiaries.', priority: 'low' },
      ],
      strengths: [
        { icon: 'Sun', title: 'Renewable Energy', description: '62% of operations powered by renewable sources, up from 42% in 2021' },
        { icon: 'Leaf', title: 'Carbon Trajectory', description: 'On track for net-zero Scope 1&2 by 2030 with 34% cumulative reduction' },
        { icon: 'Award', title: 'Industry Recognition', description: 'Named to CDP A-list and Dow Jones Sustainability Index for 2nd year' },
      ],
      weaknesses: [
        { icon: 'Truck', title: 'Scope 3 Emissions', description: 'Scope 3 represents 68% of total footprint with limited supply chain data' },
        { icon: 'Droplets', title: 'Water Footprint', description: 'Water consumption 15% above science-based target for 2025' },
        { icon: 'AlertTriangle', title: 'Investment Gap', description: 'Annual sustainability capex at $8M vs $15M needed for targets' },
      ],
      processSteps: [
        { icon: 'Gauge', title: 'Measurement', description: 'IoT sensors and utility data feeds for real-time resource monitoring' },
        { icon: 'Database', title: 'Reporting', description: 'Automated GRI, SASB, and TCFD report generation from centralized data' },
        { icon: 'Target', title: 'Goal Tracking', description: 'Dashboard tracking 47 sustainability KPIs against 2030 targets' },
        { icon: 'Share2', title: 'Stakeholder Engagement', description: 'Quarterly investor briefings and annual sustainability report publication' },
      ],
      timeline: [
        { date: 'Jan 2026', title: 'Carbon Audit', description: 'Completed Scope 1-3 audit with third-party verification by Bureau Veritas', icon: 'ScanLine' },
        { date: 'Apr 2026', title: 'Solar Install', description: 'Completed 3MW rooftop solar installation at main manufacturing facility', icon: 'Sun' },
        { date: 'Jul 2026', title: 'Supplier Program', description: 'Launched supplier sustainability assessment covering 200+ vendors', icon: 'Truck' },
        { date: 'Oct 2026', title: 'B Corp Filing', description: 'Submitted B Corp application for 3 operating subsidiaries', icon: 'Award' },
      ],
      team: [
        { name: 'Dr. Maya Singh', role: 'Chief Sustainability Officer' },
        { name: 'Thomas Andersen', role: 'Director of EHS' },
        { name: 'Li Wei', role: 'Sustainability Analyst' },
        { name: 'Carla Mendez', role: 'Community Relations Manager' },
      ],
      conclusionPoints: [
        'Carbon emissions reduced 34.2% since 2021 baseline, on track for 2030 net-zero',
        'Renewable energy now powers 62% of operations with 5MW solar expansion underway',
        'Scope 3 emissions remain the critical challenge requiring supply chain engagement',
        'Green financing and circular economy models offer cost-effective decarbonization pathways',
      ],
    },

    startup: {
      theme: 'startup',
      title: 'Startup Growth Dashboard',
      subtitle: 'Seed Stage Performance & Series A Readiness',
      intro:
        'A startup succeeds when it finds a repeatable path from product to revenue with capital efficiency. This report reviews growth, retention, and readiness metrics to assess whether the company has earned the right to scale — and what must be in place before a Series A. Momentum is real, but momentum alone is not a strategy.',
      challenge:
        'The core challenge is translating exceptional product-market fit into a durable sales engine. Growth is strong and capital-efficient, but the team of 18 lacks dedicated sales leadership and enterprise-readiness features, and brand awareness is thin. Scaling too fast without those foundations could stall growth and burn runway precisely when the bar is highest.',
      analysis:
        'MRR of $142K is growing 24% month over month with 124% net revenue retention and an NPS of 78 — evidence that the core loop works. The operating profile is deliberately lean: $1.7M ARR against $2.4M raised, with an $86K monthly burn providing fourteen months of runway. The structural gap is go-to-market: without a sales team, SOC 2, or enterprise features, the largest contract values cannot close today. The sequencing problem is prioritization — adding enterprise capabilities the sales motion can reliably sell is worth more than more marketing spend against a weak funnel.',
      outlook:
        'Series A readiness rests on three dependencies: a leader for go-to-market, enterprise-class features including compliance and SSO, and demonstrated channel or content acquisition beyond inbound referral. Once those are in place, we project MRR beyond $250K on a path toward profitable growth, which puts the company on defensible footing for the next round.',
      concepts: [
        {
          heading: 'Net Revenue Retention',
          body: 'NRR measures how much revenue from existing customers grows or shrinks over time. At 124%, existing customers expand faster than they churn — the single strongest evidence of product-market fit and a foundation for capital-efficient growth.',
        },
        {
          heading: 'Runway and Burn',
          body: 'Runway is how many months operations can continue at the current burn rate. Fourteen months is a healthy buffer, but runway is not a countdown — it is negotiation leverage. The right question is whether each burned dollar buys measurable improvement in the metrics investors weigh.',
        },
        {
          heading: 'Product-Led Growth',
          body: 'A product-led motion lets users adopt, find value, and invite their team without a salesperson. It scales efficiently when the product is strong, which is why retention and organic acquisition are the leading indicators of whether the PLG economics hold.',
        },
      ],
      kpis: [
        { label: 'MRR', value: '$142K', change: '+$28K', changeType: 'positive', icon: 'DollarSign', color: '#10b981' },
        { label: 'ARR', value: '$1.7M', change: '+$336K', changeType: 'positive', icon: 'TrendingUp', color: '#3b82f6' },
        { label: 'Customers', value: '1,840', change: '+320', changeType: 'positive', icon: 'Users', color: '#f59e0b' },
        { label: 'NRR', value: '124%', change: '+8%', changeType: 'positive', icon: 'RefreshCw', color: '#8b5cf6' },
        { label: 'Burn Rate', value: '$86K/mo', change: '-$4K', changeType: 'positive', icon: 'Flame', color: '#ec4899' },
        { label: 'Runway', value: '14 months', change: '+2 mo', changeType: 'positive', icon: 'Clock', color: '#14b8a6' },
      ],
      workflowSteps: [
        { icon: 'Lightbulb', title: 'Ideation', description: 'Customer interviews and problem validation through design sprints' },
        { icon: 'Hammer', title: 'Build', description: 'Rapid MVP development with 2-week sprint cycles and continuous deployment' },
        { icon: 'TestTube', title: 'Test', description: 'Beta testing with early adopters and iterative feature refinement' },
        { icon: 'Rocket', title: 'Launch', description: 'Product Hunt launch, content marketing, and inbound demand generation' },
        { icon: 'TrendingUp', title: 'Scale', description: 'Growth loops, referrals, and sales-led expansion for enterprise' },
      ],
      mainChartData: [
        { name: 'Jul', value: 82 },
        { name: 'Aug', value: 94 },
        { name: 'Sep', value: 106 },
        { name: 'Oct', value: 118 },
        { name: 'Nov', value: 130 },
        { name: 'Dec', value: 142 },
      ],
      mainChartType: 'area',
      additionalChartData: [
        { name: 'SMB', value: 48 },
        { name: 'Mid-Market', value: 32 },
        { name: 'Enterprise', value: 14 },
        { name: 'Self-Serve', value: 6 },
      ],
      additionalChartType: 'pie',
      thirdChartData: [
        { name: 'Jul', value: 1220, value2: 38 },
        { name: 'Aug', value: 1340, value2: 42 },
        { name: 'Sep', value: 1460, value2: 48 },
        { name: 'Oct', value: 1580, value2: 52 },
        { name: 'Nov', value: 1720, value2: 56 },
        { name: 'Dec', value: 1840, value2: 62 },
      ],
      thirdChartType: 'line',
      comparison: [
        { label: 'Our Startup', icon: 'Rocket', pros: ['124% NRR', '24% MoM MRR growth', 'Strong retention'], cons: ['Small team (18 people)', 'Limited brand awareness'], score: 86 },
        { label: 'Series A Benchmark', icon: 'Target', pros: ['$1.5M+ ARR', 'Established GTM', 'Recognized brand'], cons: ['110% NRR avg', '15% MoM growth', 'Higher burn rate'], score: 74 },
      ],
      swot: {
        strengths: ['Exceptional NRR and retention', 'Capital-efficient growth', 'Strong founder-market fit', 'Product-led growth motion'],
        weaknesses: ['Small engineering team', 'Limited enterprise features', 'No dedicated sales team', 'Brand awareness gaps'],
        opportunities: ['Enterprise tier launch', 'Channel partnerships', 'International expansion', 'Platform ecosystem'],
        threats: ['Established competitor response', 'Funding market conditions', 'Key hire attrition', 'Market timing risk'],
      },
      recommendations: [
        { icon: 'Users', title: 'Hire VP of Sales', description: 'Recruit experienced B2B SaaS sales leader to build outbound function and accelerate enterprise pipeline.', priority: 'high' },
        { icon: 'Building', title: 'Enterprise Tier Launch', description: 'Build SOC 2 compliance, SSO, and admin features to unlock enterprise contracts worth $50K+ ACV.', priority: 'high' },
        { icon: 'Globe', title: 'International Beta', description: 'Launch localized versions for UK and DACH markets where demand signals are strongest.', priority: 'medium' },
        { icon: 'BookOpen', title: 'Content Marketing Engine', description: 'Hire content lead and publish weekly thought leadership to drive organic inbound.', priority: 'medium' },
        { icon: 'Handshake', title: 'Channel Partnerships', description: 'Build integration partners with top 5 tools in the category for co-marketing.', priority: 'low' },
      ],
      strengths: [
        { icon: 'TrendingUp', title: 'Growth Velocity', description: '24% MoM MRR growth with 124% net revenue retention' },
        { icon: 'Heart', title: 'Product Love', description: 'NPS of 78 and 4.8/5 G2 rating from 280+ reviews' },
        { icon: 'Wallet', title: 'Capital Efficiency', description: '$1.7M ARR on only $2.4M raised with 14 months runway' },
      ],
      weaknesses: [
        { icon: 'Users', title: 'Team Size', description: 'Only 18 employees creating bandwidth constraints across all functions' },
        { icon: 'Lock', title: 'Enterprise Readiness', description: 'No SOC 2, SSO, or admin features blocking enterprise deals' },
        { icon: 'Megaphone', title: 'Brand Building', description: 'Less than 5K monthly organic visitors with limited content presence' },
      ],
      processSteps: [
        { icon: 'MessageSquare', title: 'Customer Discovery', description: 'Weekly user interviews feeding directly into product roadmap' },
        { icon: 'Code', title: 'Sprint Planning', description: '2-week cycles with daily standups and Friday demo sessions' },
        { icon: 'TestTube', title: 'Quality Assurance', description: 'Automated testing suite with 92% code coverage and manual QA for edge cases' },
        { icon: 'BarChart', title: 'Metrics Review', description: 'Daily dashboard review with weekly deep-dives on cohort retention' },
      ],
      timeline: [
        { date: 'Jul 2025', title: 'Seed Round', description: 'Closed $2.4M seed round led by top-tier seed fund', icon: 'DollarSign' },
        { date: 'Sep 2025', title: '1000 Users', description: 'Hit 1,000 active users milestone with 110% NRR', icon: 'Users' },
        { date: 'Nov 2025', title: 'V2 Launch', description: 'Launched V2 with enterprise features generating $50K in new MRR', icon: 'Rocket' },
        { date: 'Jan 2026', title: 'Series A Prep', description: 'Started Series A process with $1.7M ARR and clear growth metrics', icon: 'Target' },
      ],
      team: [
        { name: 'Alex Rivera', role: 'CEO & Co-Founder' },
        { name: 'Jordan Kim', role: 'CTO & Co-Founder' },
        { name: 'Sam Patel', role: 'Head of Product' },
        { name: 'Casey Walsh', role: 'Head of Growth' },
      ],
      conclusionPoints: [
        'MRR reached $142K ($1.7M ARR) with 24% month-over-month growth',
        'Net revenue retention of 124% demonstrates exceptional product-market fit',
        'Enterprise tier and sales leadership are the key unlocks for next phase',
        '14 months runway provides ample buffer for Series A preparation',
      ],
    },
  };

  const defaultData: CategoryData = data.finance;

  if (!data[category]) {
    return {
      ...defaultData,
      title: extractTitleFromPrompt(prompt),
      subtitle: 'Comprehensive Analysis & Strategic Outlook',
      photoUrl: heroPhotoUrl(prompt, 'finance'),
    };
  }

  const result = { ...data[category] };
  result.title = extractTitleFromPrompt(prompt) || result.title;
  result.photoUrl = heroPhotoUrl(prompt, category);
  return result;
}

function extractTitleFromPrompt(prompt: string): string {
  const cleaned = prompt
    .replace(/^(generate|create|make|build|write|design|show)\s+(a\s+|an\s+|the\s+|me\s+)?/i, '')
    .replace(/(presentation|dashboard|report|deck|slides|overview)\s*(for|about|on|showing|of|covering)?\s*/i, '')
    .replace(/[.!?]+$/, '')
    .trim();

  if (cleaned.length > 5 && cleaned.length < 80) {
    const words = cleaned.split(/\s+/);
    const title = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    return title;
  }

  return '';
}

function createSlide(layout: SlideLayout, content: Slide['content'], order: number): Slide {
  return {
    id: generateId(),
    layout,
    content,
    order,
  };
}

function createReportSlide(cat: CategoryData, prompt: string, order: number): Slide {
  const charts: ChartConfig[] =
    cat.charts && cat.charts.length > 0
      ? cat.charts
      : [{ title: 'Performance Trends', subtitle: 'Monthly and quarterly performance data', type: cat.mainChartType, data: cat.mainChartData }];

  return createSlide('report', {
    title: cat.title,
    subtitle: cat.subtitle,
    description: cat.intro,
    image: cat.photoUrl ? { src: cat.photoUrl } : undefined,
    kpis: cat.kpis,
    charts,
    sections: [
      { heading: 'The Core Challenge', body: cat.challenge },
      { heading: 'In-Depth Analysis', body: cat.analysis },
      { heading: 'Future Outlook', body: cat.outlook },
      ...cat.concepts,
    ],
    comparison: cat.comparison,
    swot: cat.swot,
    recommendations: cat.recommendations,
    timeline: cat.timeline,
    team: cat.team,
    items: cat.conclusionPoints,
  }, order);
}

export function buildDeck(cat: CategoryData, prompt: string): Presentation {
  const now = new Date().toISOString();

  return {
    id: generateId(),
    title: cat.title,
    prompt,
    slides: [createReportSlide(cat, prompt, 0)],
    theme: cat.theme,
    createdAt: now,
    updatedAt: now,
  };
}

export function generatePresentation(prompt: string): Presentation {
  return buildDeck(getCategoryData(detectCategory(prompt), prompt), prompt);
}
