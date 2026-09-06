import type { Presentation, KPI, ChartDataPoint, RecommendationItem, SWOTData } from '@/types';
import { detectCategory, getCategoryData, buildDeck } from './engine';
import type { CategoryData, ChartConfig } from './engine';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = (import.meta.env.VITE_GROQ_API_KEY as string | undefined) ?? '';
const OVERRIDE_GROQ_MODEL = (import.meta.env.VITE_GROQ_MODEL as string | undefined) ?? '';
const GROQ_MODELS = [
  OVERRIDE_GROQ_MODEL,
  'qwen/qwen3.8-27b',
  'allam-2-7b',
  'qwen/qwen3.6-27b',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
].filter(Boolean) as string[];

export function isAIEnabled(): boolean {
  return Boolean(GROQ_API_KEY);
}

export interface DeckSpec {
  title?: string;
  subtitle?: string;
  intro?: string;
  challenge?: string;
  analysis?: string;
  outlook?: string;
  concepts?: { heading: string; body: string }[];
  kpis?: KPI[];
  charts?: ChartConfig[];
  recommendations?: RecommendationItem[];
  swot?: SWOTData;
  conclusionPoints?: string[];
}

const CHART_TYPES = ['bar', 'line', 'area', 'pie', 'donut', 'combo', 'funnel'];
const PRIORITIES = ['high', 'medium', 'low'];
const ICON_ALLOWLIST = [
  'TrendingUp', 'TrendingDown', 'Target', 'DollarSign', 'Users', 'BarChart3', 'PieChart',
  'Activity', 'Zap', 'Award', 'Shield', 'Clock', 'Globe', 'Heart', 'Star', 'CheckCircle',
  'XCircle', 'ArrowRight', 'Lightbulb', 'Rocket', 'AlertTriangle', 'ShoppingCart', 'Funnel',
  'Search', 'Phone', 'Calendar', 'FileText', 'Handshake', 'Brain', 'Video', 'Layers',
  'Megaphone', 'Truck', 'Sun', 'Leaf', 'Droplets', 'Recycle', 'Server', 'Code', 'Cloud',
  'Database', 'Wifi', 'GraduationCap', 'BookOpen', 'Briefcase', 'FlaskConical', 'Building',
  'Monitor', 'Wrench', 'UserCheck', 'UserPlus', 'Mail', 'Settings', 'Sparkles',
];

const SYSTEM_PROMPT = `You are the content engine for a presentation generator. You turn a user's topic prompt into a structured "deck spec" that fills every slide with topic-specific, realistic, and internally consistent content.

Return ONLY a single JSON object, no markdown, no commentary. JSON schema:

{
  "title": "string - catchy deck title derived from the topic",
  "subtitle": "string - descriptive subtitle",
  "kpis": [ exactly 6 objects: { "label": "short metric name", "value": "string with units (%, $, K, M, days, etc.)", "change": "string relative change, e.g. '+12.4%' or '-3 days'", "changeType": "positive" | "negative" | "neutral", "icon": "name from the icon list below", "color": "hex color" } ],
  "charts": [ 1 to 3 objects: { "title": "string", "subtitle": "string", "type": "bar" | "line" | "area" | "pie" | "donut", "data": [ 4 to 6 points: { "name": "label", "value": "number", "value2": "optional second series number" } ] } ],
  "concepts": [ exactly 3 objects: { "heading": "short concept name", "body": "1-2 sentence plain-language explanation, specific to the topic" } ],
  "intro": "string - 2-3 sentence background/context paragraph",
  "challenge": "string - 2-3 sentence paragraph on the main challenge",
  "analysis": "string - 3-4 sentence paragraph interpreting the data",
  "outlook": "string - 2-3 sentence forward-looking paragraph",
  "recommendations": [ 3 to 5 objects: { "icon": "icon from list", "title": "string", "description": "string", "priority": "high" | "medium" | "low" } ],
  "swot": { "strengths": [3-4 strings], "weaknesses": [3-4 strings], "opportunities": [3-4 strings], "threats": [3-4 strings] },
  "conclusionPoints": [ exactly 4 strings ]
}

Rules:
- Make everything specific to the user's topic; do not copy generic filler.
- Charts MUST be different and relevant: pick each type based on the data story (line/area = trend over time, bar = comparison across groups, pie/donut = composition/share). Use at least two different chart types across the deck, always 2-3 charts, and give every chart a unique title/subtitle.
- Keep numbers plausible, consistent across KPIs, charts, and prose (e.g. a bar named Q1 with value 22 and KPI revenue "$24.8M" must roughly align).
- Allowed icons are exactly: ${ICON_ALLOWLIST.join(', ')}.
- Responses must be valid JSON parselable with JSON.parse.`;

function parseJsonResponse(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenceMatch) {
      try {
        return JSON.parse(fenceMatch[1].trim());
      } catch {
        /* fall through to brace extraction */
      }
    }
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      throw new Error('AI response did not contain a JSON object');
    }
    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

async function callGroq(userMessage: string): Promise<unknown> {
  if (!GROQ_API_KEY) {
    throw new Error('Missing GROQ API key (set VITE_GROQ_API_KEY in .env)');
  }

  let lastError: Error | null = null;

  for (const model of GROQ_MODELS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    try {
      const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          max_tokens: 4096,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMessage },
          ],
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`Groq API error ${res.status} (${model}): ${body.slice(0, 160)}`);
      }

      const json = await res.json();
      const content = json?.choices?.[0]?.message?.content;
      if (typeof content !== 'string' || content.length === 0) {
        throw new Error(`Empty response from Groq API (${model})`);
      }
      return parseJsonResponse(content);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (lastError.name === 'TimeoutError' || controller.signal.aborted) break;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError ?? new Error('Groq API request failed');
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function sanitizeKpis(value: unknown): KPI[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const kpis: KPI[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as Record<string, unknown>;
    const label = asString(rec.label);
    const kpiValue = asString(rec.value);
    if (!label || !kpiValue) continue;
    const change = asString(rec.change);
    const changeType = ['positive', 'negative', 'neutral'].includes(rec.changeType as string)
      ? (rec.changeType as 'positive' | 'negative' | 'neutral')
      : (change?.startsWith('-') ? 'negative' : 'positive');
    const icon = asString(rec.icon);
    const color = asString(rec.color);
    kpis.push({
      label,
      value: kpiValue,
      change: change || '',
      changeType,
      icon: icon && ICON_ALLOWLIST.includes(icon) ? icon : 'TrendingUp',
      color: color || '#3b82f6',
    });
    if (kpis.length >= 6) break;
  }
  return kpis.length >= 4 ? kpis : undefined;
}

function sanitizeChartData(value: unknown): ChartDataPoint[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const points: ChartDataPoint[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as Record<string, unknown>;
    const name = asString(rec.name);
    const valueNum = asNumber(rec.value);
    if (!name || valueNum === undefined) continue;
    const point: ChartDataPoint = { name, value: valueNum };
    const value2 = asNumber(rec.value2);
    if (value2 !== undefined) point.value2 = value2;
    points.push(point);
  }
  return points.length >= 3 ? points.slice(0, 8) : undefined;
}

function sanitizeCharts(value: unknown): ChartConfig[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const charts: ChartConfig[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as Record<string, unknown>;
    const data = sanitizeChartData(rec.data);
    if (!data) continue;
    const type = asString(rec.type);
    charts.push({
      title: asString(rec.title) || 'Performance Trends',
      subtitle: asString(rec.subtitle),
      type: type && CHART_TYPES.includes(type) ? type : 'bar',
      data,
    });
    if (charts.length >= 3) break;
  }
  return charts.length >= 1 ? charts : undefined;
}

function sanitizeStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => asString(item))
    .filter((item): item is string => Boolean(item))
    .slice(0, 4);
}

function sanitizeSwot(value: unknown): SWOTData | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const rec = value as Record<string, unknown>;
  const strengths = sanitizeStrings(rec.strengths);
  const weaknesses = sanitizeStrings(rec.weaknesses);
  const opportunities = sanitizeStrings(rec.opportunities);
  const threats = sanitizeStrings(rec.threats);
  if (strengths.length === 0 && weaknesses.length === 0 && opportunities.length === 0 && threats.length === 0) {
    return undefined;
  }
  return {
    strengths: strengths.length >= 2 ? strengths : ['Strong fundamentals', 'Experienced leadership', 'Solid execution track record'],
    weaknesses: weaknesses.length >= 2 ? weaknesses : ['Resource constraints', 'Growing complexity', 'Limited reach'],
    opportunities: opportunities.length >= 2 ? opportunities : ['Market expansion', 'New partnerships', 'Digital acceleration'],
    threats: threats.length >= 2 ? threats : ['Competition', 'Economic volatility', 'Regulatory change'],
  };
}

function sanitizeRecommendations(value: unknown): RecommendationItem[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const recs: RecommendationItem[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as Record<string, unknown>;
    const title = asString(rec.title);
    const description = asString(rec.description);
    if (!title || !description) continue;
    const icon = asString(rec.icon);
    recs.push({
      icon: icon && ICON_ALLOWLIST.includes(icon) ? icon : 'Target',
      title,
      description,
      priority: PRIORITIES.includes(rec.priority as string) ? (rec.priority as 'high' | 'medium' | 'low') : 'medium',
    });
    if (recs.length >= 5) break;
  }
  return recs.length >= 2 ? recs : undefined;
}

function sanitizeConcepts(value: unknown): { heading: string; body: string }[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const concepts: { heading: string; body: string }[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as Record<string, unknown>;
    const heading = asString(rec.heading);
    const body = asString(rec.body);
    if (!heading || !body) continue;
    concepts.push({ heading, body });
    if (concepts.length >= 3) break;
  }
  return concepts.length === 3 ? concepts : undefined;
}

export function mergeSpec(base: CategoryData, spec: DeckSpec): CategoryData {
  return {
    ...base,
    ...(spec.title ? { title: spec.title } : {}),
    ...(spec.subtitle ? { subtitle: spec.subtitle } : {}),
    ...(spec.intro ? { intro: spec.intro } : {}),
    ...(spec.challenge ? { challenge: spec.challenge } : {}),
    ...(spec.analysis ? { analysis: spec.analysis } : {}),
    ...(spec.outlook ? { outlook: spec.outlook } : {}),
    ...(spec.concepts ? { concepts: spec.concepts } : {}),
    ...(spec.kpis ? { kpis: spec.kpis } : {}),
    ...(spec.charts ? { charts: spec.charts } : {}),
    ...(spec.recommendations ? { recommendations: spec.recommendations } : {}),
    ...(spec.swot ? { swot: spec.swot } : {}),
    ...(spec.conclusionPoints ? { conclusionPoints: spec.conclusionPoints } : {}),
  };
}

export async function generateAIDeckSpec(prompt: string, category: string): Promise<DeckSpec> {
  const raw = await callGroq(
    `Topic: "${prompt}"\n\nDetected category: ${category}.\n\nGenerate the full deck spec JSON for this topic.`
  );

  if (!raw || typeof raw !== 'object') {
    throw new Error('AI returned a non-object response');
  }
  const rec = raw as Record<string, unknown>;

  const spec: DeckSpec = {
    title: asString(rec.title),
    subtitle: asString(rec.subtitle),
    intro: asString(rec.intro),
    challenge: asString(rec.challenge),
    analysis: asString(rec.analysis),
    outlook: asString(rec.outlook),
    concepts: sanitizeConcepts(rec.concepts),
    kpis: sanitizeKpis(rec.kpis),
    charts: sanitizeCharts(rec.charts),
    recommendations: sanitizeRecommendations(rec.recommendations),
    swot: sanitizeSwot(rec.swot),
    conclusionPoints: sanitizeStrings(rec.conclusionPoints),
  };

  if (spec.conclusionPoints && spec.conclusionPoints.length !== 4) {
    spec.conclusionPoints = undefined;
  }

  const meaningful = spec.title || spec.kpis || spec.charts || spec.concepts || spec.intro;
  if (!meaningful) {
    throw new Error('AI response did not contain usable content');
  }

  return spec;
}

export async function generatePresentationWithAI(prompt: string): Promise<Presentation> {
  const category = detectCategory(prompt);
  const base = getCategoryData(category, prompt);
  const spec = await generateAIDeckSpec(prompt, category);
  return buildDeck(mergeSpec(base, spec), prompt);
}