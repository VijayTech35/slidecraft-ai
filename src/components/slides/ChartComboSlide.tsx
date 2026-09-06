import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import SlideDecor from './SlideDecor';

interface ChartComboSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

export default function ChartComboSlide({ slide, theme: themeProp, isThumbnail }: ChartComboSlideProps) {
  const t = themeProp;
  const data = slide.content.chartData || [];
  const secondary = slide.content.chartSecondaryData || [];

  const cumulative = secondary.length > 0
    ? secondary
    : data.reduce<Array<{ name: string; value: number }>>((acc, d) => {
        const prev = acc.length ? acc[acc.length - 1].value : 0;
        acc.push({ name: d.name, value: prev + (d.value || 0) });
        return acc;
      }, []);

  const barTotal = data.reduce((sum, d) => sum + (d.value || 0), 0);
  const linePeak = cumulative.reduce((mx, d) => Math.max(mx, d.value || 0), 0);

  const cards = [
    { label: 'Total', value: barTotal.toLocaleString(), color: t.colors.chart1 },
    { label: 'Cumulative peak', value: linePeak.toLocaleString(), color: t.colors.chart2 },
    { label: 'Points', value: String(cumulative.length), color: t.colors.chart3 },
    { label: 'Avg / period', value: (data.length ? Math.round(barTotal / data.length) : 0).toLocaleString(), color: t.colors.chart4 },
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
              <CartesianGrid strokeDasharray="3 3" stroke={t.colors.border} />
              <XAxis
                dataKey="name"
                tick={{ fill: t.colors.textSecondary, fontSize: isThumbnail ? 8 : 12 }}
                tickLine={false}
                axisLine={{ stroke: t.colors.border }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: t.colors.textSecondary, fontSize: isThumbnail ? 8 : 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                hide={isThumbnail}
                tick={{ fill: t.colors.textSecondary, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
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
                  return [num.toLocaleString(), String(name ?? 'Value')];
                }}
              />
              {!isThumbnail && (
                <Legend
                  wrapperStyle={{ color: t.colors.textSecondary, fontSize: 12 }}
                />
              )}
              <Bar
                yAxisId="left"
                dataKey="value"
                name="Value"
                radius={[6, 6, 0, 0]}
                fill={t.colors.chart1}
                animationDuration={800}
                animationBegin={100}
                animationEasing="ease-out"
              />
              <Line
                yAxisId="right"
                data={cumulative}
                dataKey="value"
                name="Cumulative"
                type="monotone"
                stroke={t.colors.chart2}
                strokeWidth={isThumbnail ? 2 : 3}
                dot={{ fill: t.colors.chart2, r: isThumbnail ? 1 : 3, strokeWidth: 0 }}
                animationDuration={800}
                animationBegin={200}
                animationEasing="ease-out"
              />
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
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: card.color }}
                />
                <p
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: t.colors.textSecondary }}
                >
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