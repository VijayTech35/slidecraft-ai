import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import SlideDecor from './SlideDecor';

interface ChartDonutSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

export default function ChartDonutSlide({ slide, theme: themeProp, isThumbnail }: ChartDonutSlideProps) {
  const t = themeProp;
  const data = slide.content.chartData || [];

  const chartColors = [
    t.colors.chart1,
    t.colors.chart2,
    t.colors.chart3,
    t.colors.chart4,
    t.colors.chart5,
  ];

  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);

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
        <div className={cn('w-full h-full flex gap-4', isThumbnail ? 'flex-row items-center' : 'md:flex-row')}>
          <div className={cn('relative min-h-0 flex-1', isThumbnail && 'h-24 w-24')}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={isThumbnail ? '55%' : '62%'}
                  outerRadius={isThumbnail ? '90%' : '92%'}
                  paddingAngle={2}
                  cornerRadius={isThumbnail ? 3 : 6}
                  animationDuration={800}
                  animationBegin={100}
                  animationEasing="ease-out"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={chartColors[index % chartColors.length]}
                      stroke={t.colors.background}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
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
                    const percent = total ? Math.round((num / total) * 100) : 0;
                    return [`${num.toLocaleString()} (${percent}%)`, String(name ?? '')];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {!isThumbnail && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{total.toLocaleString()}</span>
                <span className="text-xs uppercase tracking-wide" style={{ color: t.colors.textSecondary }}>
                  Total
                </span>
              </div>
            )}
          </div>

          {!isThumbnail && (
            <div className="flex flex-col justify-center gap-2 md:w-56">
              {data.map((d, index) => {
                const percent = total ? Math.round((d.value / total) * 100) : 0;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl border px-3 py-2"
                    style={{ borderColor: t.colors.border, backgroundColor: t.colors.surface }}
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: chartColors[index % chartColors.length] }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{d.name}</p>
                      <p className="text-xs" style={{ color: t.colors.textSecondary }}>
                        {d.value.toLocaleString()} · {percent}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
