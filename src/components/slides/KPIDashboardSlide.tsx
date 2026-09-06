import { TrendingUp, TrendingDown, Target, DollarSign, Users, BarChart3, PieChart, Activity, Zap, Award, Shield, Clock, Globe, Heart, Star, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTheme } from '@/data/themes';
import type { Slide, Theme, KPI } from '@/types';
import SlideDecor, { IconTile } from './SlideDecor';

interface KPIDashboardSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  TrendingUp, TrendingDown, Target, DollarSign, Users, BarChart3, PieChart, Activity, Zap, Award, Shield, Clock, Globe, Heart, Star,
};

function getIcon(name: string) {
  return iconMap[name] || BarChart3;
}

const defaultKPIsFactory = (t: ReturnType<typeof getTheme>): KPI[] => [
  { label: 'Revenue', value: '$2.4M', change: '+12.5%', changeType: 'positive', icon: 'TrendingUp', color: t.colors.chart1 },
  { label: 'Growth', value: '23.8%', change: '+5.2%', changeType: 'positive', icon: 'BarChart3', color: t.colors.chart2 },
  { label: 'Users', value: '48.2K', change: '+18.3%', changeType: 'positive', icon: 'Users', color: t.colors.chart3 },
  { label: 'Profit', value: '$890K', change: '+8.7%', changeType: 'positive', icon: 'DollarSign', color: t.colors.chart4 },
  { label: 'Conversion', value: '4.6%', change: '-0.3%', changeType: 'negative', icon: 'Target', color: t.colors.chart5 },
  { label: 'Traffic', value: '1.2M', change: '+22.1%', changeType: 'positive', icon: 'Activity', color: t.colors.primary },
];

export default function KPIDashboardSlide({ slide, theme: themeProp, isThumbnail }: KPIDashboardSlideProps) {
  const t = themeProp;
  const { content } = slide;
  const kpis = content.kpis || defaultKPIsFactory(t);

  return (
    <div
      className={cn(
        'relative w-full aspect-[16/9] overflow-hidden rounded-xl flex flex-col',
        isThumbnail && 'scale-[0.3] origin-top-left w-[333.33%] h-[333.33%]'
      )}
      style={{ background: t.colors.background }}
    >
      {/* Top accent */}
      <div className="h-1.5 w-full" style={{ background: t.colors.gradient }} />
      <SlideDecor theme={t} />

      {/* Header */}
      <div className="px-8 pt-5 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-1 h-7 rounded-full"
            style={{ background: t.colors.gradient }}
          />
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
                className={cn(isThumbnail ? 'text-[9px]' : 'text-sm')}
                style={{ color: t.colors.textSecondary }}
              >
                {content.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="flex-1 px-8 pb-6 relative z-10">
        <div className="grid grid-cols-3 gap-4 h-full">
          {kpis.slice(0, 6).map((kpi, index) => {
            const KpiIcon = getIcon(kpi.icon || 'BarChart3');
            const cardColor = kpi.color || [t.colors.chart1, t.colors.chart2, t.colors.chart3, t.colors.chart4, t.colors.chart5, t.colors.primary][index % 6];

            return (
              <div
                key={index}
                className={cn(
                  'relative rounded-xl border overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-lg',
                  isThumbnail ? 'p-2' : 'p-4'
                )}
                style={{
                  background: t.colors.surface,
                  borderColor: t.colors.border,
                  boxShadow: `0 1px 3px ${t.colors.border}40`,
                }}
              >
                {/* Top accent strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: cardColor }}
                />
                {/* Icon and label row */}
                <div className={cn('flex items-center gap-2', isThumbnail ? 'mt-1 mb-1' : 'mt-1.5 mb-2')}>
                  <IconTile
                    theme={t}
                    size={isThumbnail ? 'sm' : 'md'}
                    icon={<KpiIcon style={{ color: cardColor }} />}
                  />
                  <span
                    className={cn(
                      'font-semibold',
                      isThumbnail ? 'text-[8px]' : 'text-xs md:text-sm'
                    )}
                    style={{ color: t.colors.textSecondary }}
                  >
                    {kpi.label}
                  </span>
                </div>

                {/* Value */}
                <div
                  className={cn(
                    'font-bold tracking-tight',
                    isThumbnail ? 'text-lg' : 'text-2xl md:text-3xl'
                  )}
                  style={{ color: t.colors.text }}
                >
                  {kpi.value}
                </div>

                {/* Change indicator */}
                {kpi.change && (
                  <div className="flex items-center gap-1 mt-1">
                    {kpi.changeType === 'positive' ? (
                      <TrendingUp
                        className={cn(isThumbnail ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5')}
                        style={{ color: '#16a34a' }}
                      />
                    ) : kpi.changeType === 'negative' ? (
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
                        color: kpi.changeType === 'positive'
                          ? '#16a34a'
                          : kpi.changeType === 'negative'
                          ? '#dc2626'
                          : t.colors.textSecondary,
                      }}
                    >
                      {kpi.change}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
