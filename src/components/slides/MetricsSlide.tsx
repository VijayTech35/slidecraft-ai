import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';
import SlideDecor from './SlideDecor';

interface MetricsSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

export default function MetricsSlide({ slide, theme: themeProp, isThumbnail }: MetricsSlideProps) {
  const t = themeProp;
  const { content } = slide;
  const kpis = content.kpis || [];

  const defaultMetrics = [
    { label: 'Total Revenue', value: '$2.4M', change: '+18.2%', changeType: 'positive' as const },
    { label: 'Active Users', value: '48.5K', change: '+12.4%', changeType: 'positive' as const },
    { label: 'Conversion Rate', value: '3.8%', change: '+0.6%', changeType: 'positive' as const },
    { label: 'Avg. Session', value: '4m 32s', change: '-0.3%', changeType: 'negative' as const },
    { label: 'NPS Score', value: '72', change: '+8', changeType: 'positive' as const },
    { label: 'Churn Rate', value: '2.1%', change: '0.0%', changeType: 'neutral' as const },
  ];

  const metrics = kpis.length > 0
    ? kpis.map((kpi) => ({
        label: kpi.label,
        value: kpi.value,
        change: kpi.change || '',
        changeType: kpi.changeType || ('neutral' as const),
      }))
    : defaultMetrics;

  const gridCols = metrics.length <= 2
    ? 'grid-cols-2'
    : metrics.length <= 4
    ? 'grid-cols-2 md:grid-cols-4'
    : 'grid-cols-2 md:grid-cols-3';

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
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'rounded-xl flex items-center justify-center',
              isThumbnail ? 'w-8 h-8' : 'w-11 h-11'
            )}
            style={{
              background: `linear-gradient(135deg, ${t.colors.primary}20, ${t.colors.secondary}18)`,
            }}
          >
            <BarChart3
              className={cn(isThumbnail ? 'w-4 h-4' : 'w-5 h-5')}
              style={{ color: t.colors.primary }}
            />
          </div>
          <div>
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
              {content.title}
            </h2>
            {content.subtitle && (
              <p
                className={cn(isThumbnail ? 'text-[8px]' : 'text-sm')}
                style={{ color: t.colors.textSecondary }}
              >
                {content.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-8 pb-6 relative z-10">
        <div className={cn('grid gap-3 h-full', gridCols)}>
          {metrics.map((metric, index) => {
            const cardColors = [
              t.colors.chart1,
              t.colors.chart2,
              t.colors.chart3,
              t.colors.chart4,
              t.colors.chart5,
              t.colors.primary,
            ];
            const color = cardColors[index % cardColors.length];
            const parsed = parseFloat(metric.value.replace(/[^0-9.]/g, '')) || 0;
            const cap = Math.min(parsed, 100);
            const barWidth = metric.value.includes('%') ? cap : parsed > 0 ? Math.min(100, parsed / 12) : 55;

            return (
              <div
                key={index}
                className={cn(
                  'relative rounded-xl border p-4 flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-lg overflow-hidden',
                  isThumbnail && 'p-2'
                )}
                style={{
                  background: t.colors.surface,
                  borderColor: t.colors.border,
                  boxShadow: `0 1px 3px ${t.colors.border}40`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: color }}
                />
                <span
                  className={cn(
                    'font-semibold',
                    isThumbnail ? 'text-[8px]' : 'text-xs md:text-sm'
                  )}
                  style={{ color: t.colors.textSecondary }}
                >
                  {metric.label}
                </span>

                <div className="flex items-end justify-between mt-2">
                  <span
                    className={cn(
                      'font-bold tracking-tight',
                      isThumbnail ? 'text-lg' : 'text-2xl md:text-3xl'
                    )}
                    style={{ color: t.colors.text }}
                  >
                    {metric.value}
                  </span>

                  {metric.change && (
                    <div className="flex items-center gap-1">
                      {metric.changeType === 'positive' ? (
                        <TrendingUp
                          className={cn(isThumbnail ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5')}
                          style={{ color: '#16a34a' }}
                        />
                      ) : metric.changeType === 'negative' ? (
                        <TrendingDown
                          className={cn(isThumbnail ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5')}
                          style={{ color: '#dc2626' }}
                        />
                      ) : (
                        <Minus
                          className={cn(isThumbnail ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5')}
                          style={{ color: t.colors.textSecondary }}
                        />
                      )}
                      <span
                        className={cn(
                          'font-semibold',
                          isThumbnail ? 'text-[7px]' : 'text-xs'
                        )}
                        style={{
                          color:
                            metric.changeType === 'positive'
                              ? '#16a34a'
                              : metric.changeType === 'negative'
                              ? '#dc2626'
                              : t.colors.textSecondary,
                        }}
                      >
                        {metric.change}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className={cn(
                    'w-full rounded-full overflow-hidden mt-2',
                    isThumbnail ? 'h-1' : 'h-1.5'
                  )}
                  style={{ background: `${color}20` }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      background: `linear-gradient(to right, ${color}, ${t.colors.secondary})`,
                      width: `${barWidth}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
