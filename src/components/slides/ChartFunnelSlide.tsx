import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';
import { ResponsiveContainer, FunnelChart, Funnel, Trapezoid, LabelList, Tooltip } from 'recharts';
import SlideDecor from './SlideDecor';

interface ChartFunnelSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

export default function ChartFunnelSlide({ slide, theme: themeProp, isThumbnail }: ChartFunnelSlideProps) {
  const t = themeProp;
  const data = slide.content.chartData || [];

  const colors = [t.colors.chart1, t.colors.chart2, t.colors.chart3, t.colors.chart4, t.colors.chart5];
  const top = data[0]?.value || 0;
  const last = data[data.length - 1]?.value || 0;
  const overall = top > 0 && last > 0 ? Math.round((last / top) * 100) : 0;

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
            className={cn('flex items-center gap-2 text-sm', isThumbnail && 'text-[8px]')}
            style={{ color: t.colors.textSecondary }}
          >
            {slide.content.subtitle}
            {!isThumbnail && data.length >= 2 && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border"
                style={{ borderColor: t.colors.border, color: t.colors.primary, background: t.colors.surface }}
              >
                ↓ {overall}% end-to-end
              </span>
            )}
          </p>
        )}
      </div>

      <div className="flex-1 px-8 pb-6 overflow-hidden relative z-10">
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
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
                  const pct = top ? Math.round((num / top) * 100) : 0;
                  return [`${num.toLocaleString()} (${pct}%)`, String(name ?? '')];
                }}
              />
              <Funnel
                dataKey="value"
                name="Value"
                data={data}
                isAnimationActive={!isThumbnail}
                animationDuration={800}
                animationBegin={100}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <TrapezoidCell
                    key={`cell-${index}`}
                    index={index}
                    colors={colors}
                    stroke={t.colors.background}
                    opacity={1 - Math.min(index * 0.07, 0.28)}
                  />
                ))}
                {!isThumbnail && (
                  <LabelList
                    position="right"
                    dataKey="name"
                    fill={t.colors.textSecondary}
                    stroke="none"
                    fontSize={12}
                    width={140}
                  />
                )}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        {!isThumbnail && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mt-3">
            {data.slice(0, 4).map((d, i) => {
              const prev = i > 0 ? data[i - 1]?.value || 0 : 0;
              const conv = prev > 0 ? Math.round(((d.value || 0) / prev) * 100) : 100;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  style={{ borderColor: t.colors.border, backgroundColor: t.colors.surface }}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{d.name}</p>
                    <p className="text-[11px]" style={{ color: t.colors.textSecondary }}>
                      {(d.value || 0).toLocaleString()}
                      {i > 0 && (
                        <span className="text-emerald-600 font-semibold"> · {conv}%</span>
                      )}
                      <span className="opacity-70"> of top</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function TrapezoidCell({
  index,
  colors,
  stroke,
  opacity,
}: {
  index: number;
  colors: string[];
  stroke: string;
  opacity: number;
}) {
  return (
    <Trapezoid
      fill={colors[index % colors.length]}
      fillOpacity={opacity}
      strokeWidth={1.5}
      stroke={stroke}
    />
  );
}