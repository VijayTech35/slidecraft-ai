import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ComposedChart,
} from 'recharts';
import SlideDecor from './SlideDecor';

interface ChartLineSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

export default function ChartLineSlide({ slide, theme: themeProp, isThumbnail }: ChartLineSlideProps) {
  const t = themeProp;
  const data = slide.content.chartData || [];

  const hasValue2 = data.some((d) => typeof d.value2 === 'number');
  const hasValue3 = data.some((d) => typeof d.value3 === 'number');

  const series = [
    { key: 'value', name: 'Series 1', color: t.colors.chart1 },
    ...(hasValue2 ? [{ key: 'value2', name: 'Series 2', color: t.colors.chart2 }] : []),
    ...(hasValue3 ? [{ key: 'value3', name: 'Series 3', color: t.colors.chart3 }] : []),
  ];

  const last = data[data.length - 1] || { name: '', value: 0, value2: 0, value3: 0 };
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);

  const cards = [
    { label: 'Latest', value: last.name || '', color: t.colors.chart1 },
    { label: 'Current', value: (last.value || 0).toLocaleString(), color: t.colors.chart2 },
    { label: 'Total', value: total.toLocaleString(), color: t.colors.chart3 },
    { label: 'Series', value: String(series.length), color: t.colors.chart4 },
  ];

  return (
    <div
      className={cn(
        'relative w-full aspect-[16/9] overflow-hidden rounded-xl flex flex-col',
        isThumbnail && 'scale-[0.3] origin-top-left w-[333.33%] h-[333.33%]'
      )}
      style={{ background: t.colors.background }}
    >
      <div className="h-1.5 w-full" style={{ background: t.colors.gradient }} />
      <SlideDecor theme={t} />

      <div className="px-8 pt-5 pb-3 relative z-10">
        <h2
          className={cn(
            'font-bold tracking-tight',
            isThumbnail ? 'text-lg' : 'text-2xl md:text-3xl',
            'bg-gradient-to-r bg-clip-text text-transparent'
          )}
          style={{
            backgroundImage: `linear-gradient(to right, ${t.colors.text}, ${t.colors.primary})`,
          }}
        >
          {slide.content.title}
        </h2>
        {slide.content.subtitle && (
          <p
            className={cn(isThumbnail ? 'text-[8px]' : 'text-sm')}
            style={{ color: t.colors.textSecondary }}
          >
            {slide.content.subtitle}
          </p>
        )}
      </div>

      <div className="flex-1 px-8 pb-6 overflow-hidden relative z-10">
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="lineAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={t.colors.chart1} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={t.colors.chart1} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={t.colors.border} />
              <XAxis
                dataKey="name"
                tick={{ fill: t.colors.textSecondary, fontSize: isThumbnail ? 8 : 12 }}
                tickLine={false}
                axisLine={{ stroke: t.colors.border }}
              />
              <YAxis
                tick={{ fill: t.colors.textSecondary, fontSize: isThumbnail ? 8 : 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  border: '1px solid',
                  borderColor: t.colors.border,
                  backgroundColor: t.colors.surface,
                  color: t.colors.text,
                }}
                formatter={(value, name) => {
                  const num =
                    typeof value === 'number'
                      ? value
                      : typeof value === 'string'
                        ? Number(value)
                        : 0;
                  return [num.toLocaleString(), String(name ?? '')];
                }}
              />
              {!isThumbnail && (
                <Legend
                  wrapperStyle={{
                    color: t.colors.textSecondary,
                    fontSize: 12,
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey="value"
                stroke="none"
                fill="url(#lineAreaFill)"
                animationDuration={800}
              />
              {series.map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={isThumbnail ? 2 : 3}
                  dot={{ fill: s.color, r: isThumbnail ? 1 : 3, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  animationDuration={800}
                  animationBegin={100}
                  animationEasing="ease-out"
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {!isThumbnail && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mt-3">
            {cards.map((card) => (
              <div
                key={card.label}
                className="relative rounded-xl border p-3 overflow-hidden shadow-sm"
                style={{ borderColor: t.colors.border, backgroundColor: t.colors.surface }}
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: card.color }} />
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: t.colors.textSecondary }}>
                  {card.label}
                </p>
                <p className="mt-1 text-lg font-bold tracking-tight" style={{ color: card.color }}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
