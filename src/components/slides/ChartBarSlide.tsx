import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import SlideDecor from './SlideDecor';

interface ChartBarSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

export default function ChartBarSlide({ slide, theme: themeProp, isThumbnail }: ChartBarSlideProps) {
  const t = themeProp;
  const data = slide.content.chartData || [];

  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);
  const average = data.length ? Math.round(total / data.length) : 0;
  const maxPoint = data.reduce(
    (max, d) => (d.value > max.value ? d : max),
    data[0] || { name: '', value: 0 }
  );
  const minPoint = data.reduce(
    (min, d) => (d.value < min.value ? d : min),
    data[0] || { name: '', value: 0 }
  );

  const cards = [
    { label: 'Total', value: total.toLocaleString(), color: t.colors.chart1 },
    { label: 'Average', value: average.toLocaleString(), color: t.colors.chart2 },
    { label: 'Highest', value: maxPoint.name || '', color: t.colors.chart3 },
    { label: 'Lowest', value: minPoint.name || '', color: t.colors.chart4 },
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
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                  wrapperStyle={{
                    color: t.colors.textSecondary,
                    fontSize: 12,
                  }}
                />
              )}
              <Bar
                dataKey="value"
                name="Value"
                radius={[6, 6, 0, 0]}
                animationDuration={800}
                animationBegin={100}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.value >= maxPoint.value ? t.colors.chart1 : `${t.colors.chart1}85`}
                  />
                ))}
              </Bar>
            </BarChart>
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
