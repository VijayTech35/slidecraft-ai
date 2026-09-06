import { Check, X, TrendingUp, TrendingDown, Target, DollarSign, Users, BarChart3, PieChart, Activity, Zap, Award, Shield, Clock, Globe, Heart, Star, CheckCircle, XCircle, ArrowRight, Lightbulb, Rocket, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';
import SlideDecor from './SlideDecor';

interface RecommendationSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  TrendingUp, TrendingDown, Target, DollarSign, Users, BarChart3, PieChart, Activity, Zap, Award, Shield, Clock, Globe, Heart, Star, CheckCircle, XCircle, ArrowRight, Lightbulb, Rocket, AlertTriangle, ArrowUpRight, ArrowDownRight, Check, X,
};

function getIcon(name: string) {
  return iconMap[name] || Star;
}

const priorityConfig = {
  high: { label: 'High', bg: '#fef2f2', text: '#dc2626', border: '#fecdd3' },
  medium: { label: 'Medium', bg: '#fefce8', text: '#ca8a04', border: '#fef08a' },
  low: { label: 'Low', bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
};

export default function RecommendationSlide({ slide, theme: themeProp, isThumbnail }: RecommendationSlideProps) {
  const t = themeProp;
  const { content } = slide;
  const recommendations = content.recommendations || [];

  return (
    <div
      className={cn(
        'relative w-full aspect-[16/9] overflow-hidden rounded-xl flex flex-col',
        isThumbnail && 'scale-[0.3] origin-top-left w-[333.33%] h-[333.33%]'
      )}
      style={{ background: t.colors.background }}
    >
      {/* Top accent bar */}
      <div className="h-1.5 w-full" style={{ background: t.colors.gradient }} />
      <SlideDecor theme={t} />

      {/* Header */}
      <div className="px-8 pt-5 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full" style={{ background: t.colors.gradient }} />
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
        </div>
        {content.subtitle && (
          <p
            className={cn('ml-4', isThumbnail ? 'text-xs' : 'text-sm')}
            style={{ color: t.colors.textSecondary }}
          >
            {content.subtitle}
          </p>
        )}
      </div>

      {/* Recommendations list */}
      <div className="flex-1 px-8 pb-6 overflow-hidden relative z-10">
        <div className={cn('grid gap-3', isThumbnail ? 'gap-2' : 'gap-3')}>
          {recommendations.map((rec, index) => {
            const RecIcon = getIcon(rec.icon);
            const priority = rec.priority ? priorityConfig[rec.priority] : null;

            return (
              <div
                key={index}
                className={cn(
                  'relative flex items-start gap-3 overflow-hidden rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-lg',
                  isThumbnail ? 'p-2' : 'p-3 md:p-4'
                )}
                style={{
                  background: t.colors.surface,
                  borderColor: t.colors.border,
                  boxShadow: `0 1px 3px ${t.colors.border}40`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: rec.checked ? t.colors.chart3 : t.colors.primary }}
                />
                {/* Checkbox / icon */}
                <div
                  className={cn(
                    'rounded-lg flex items-center justify-center shrink-0',
                    isThumbnail ? 'w-5 h-5' : 'w-9 h-9'
                  )}
                  style={{
                    background: rec.checked ? `${t.colors.chart3}20` : `${t.colors.primary}10`,
                  }}
                >
                  {rec.checked ? (
                    <Check
                      className={cn(isThumbnail ? 'w-3 h-3' : 'w-4 h-4')}
                      style={{ color: t.colors.chart3 }}
                    />
                  ) : (
                    <RecIcon
                      className={cn(isThumbnail ? 'w-3 h-3' : 'w-4 h-4')}
                      style={{ color: t.colors.primary }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className={cn(
                        'font-semibold',
                        isThumbnail ? 'text-[9px]' : 'text-sm md:text-base'
                      )}
                      style={{ color: t.colors.text }}
                    >
                      {rec.title}
                    </h3>
                    {priority && (
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full font-medium border',
                          isThumbnail ? 'px-1 py-0 text-[6px]' : 'px-2 py-0.5 text-[10px] md:text-xs'
                        )}
                        style={{
                          background: priority.bg,
                          color: priority.text,
                          borderColor: priority.border,
                        }}
                      >
                        {priority.label}
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      'leading-snug mt-0.5',
                      isThumbnail ? 'text-[7px]' : 'text-xs'
                    )}
                    style={{ color: t.colors.textSecondary }}
                  >
                    {rec.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
