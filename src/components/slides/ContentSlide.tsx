import { TrendingUp, Target, Lightbulb, Award, Star, Rocket, Globe, Zap, Shield, Heart, CheckCircle, BarChart3, Activity, Clock, Users, TrendingDown, XCircle, X, Check, DollarSign, PieChart, AlertTriangle, ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';
import SlideDecor, { IconTile } from './SlideDecor';

interface ContentSlideProps {
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

export default function ContentSlide({ slide, theme: themeProp, isThumbnail }: ContentSlideProps) {
  const t = themeProp;
  const { content } = slide;
  const highlights = content.highlights || [];

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

      <div className="flex-1 px-8 pb-6 flex flex-col gap-4 relative z-10">
        {/* Description text */}
        {content.description && (
          <p
            className={cn('leading-relaxed', isThumbnail ? 'text-[9px]' : 'text-sm md:text-base')}
            style={{ color: t.colors.text }}
          >
            {content.description}
          </p>
        )}

        {/* Highlights grid */}
        {highlights.length > 0 && (
          <div
            className={cn(
              'grid gap-3 flex-1',
              highlights.length <= 2 && 'grid-cols-2',
              highlights.length === 3 && 'grid-cols-3',
              highlights.length >= 4 && 'grid-cols-2 md:grid-cols-4'
            )}
          >
            {highlights.map((highlight, index) => {
              const HlIcon = getIcon(highlight.icon);
              const colors = [t.colors.primary, t.colors.secondary, t.colors.chart3, t.colors.chart4, t.colors.chart5];
              const cardColor = colors[index % colors.length];

              return (
                <div
                  key={index}
                  className={cn(
                    'relative flex flex-col overflow-hidden rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-lg',
                    isThumbnail ? 'p-2' : 'p-4'
                  )}
                  style={{
                    background: t.colors.surface,
                    borderColor: t.colors.border,
                    boxShadow: `0 1px 3px ${t.colors.border}40`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: cardColor }}
                  />
                  <div className={cn('mb-2', isThumbnail && 'mt-1')}>
                    <IconTile
                      theme={t}
                      size={isThumbnail ? 'sm' : 'md'}
                      icon={<HlIcon style={{ color: cardColor }} />}
                    />
                  </div>
                  <h3
                    className={cn(
                      'font-semibold mb-1',
                      isThumbnail ? 'text-[9px]' : 'text-sm md:text-base'
                    )}
                    style={{ color: t.colors.text }}
                  >
                    {highlight.title}
                  </h3>
                  <p
                    className={cn(
                      'leading-snug flex-1',
                      isThumbnail ? 'text-[7px]' : 'text-xs'
                    )}
                    style={{ color: t.colors.textSecondary }}
                  >
                    {highlight.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* If no highlights, show items list */}
        {highlights.length === 0 && content.items && content.items.length > 0 && (
          <div className="flex-1 grid grid-cols-2 gap-3">
            {content.items.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-2 rounded-lg border',
                  isThumbnail ? 'p-2' : 'p-3'
                )}
                style={{
                  background: t.colors.surface,
                  borderColor: t.colors.border,
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ background: t.colors.primary }}
                />
                <span
                  className={cn(isThumbnail ? 'text-[8px]' : 'text-xs md:text-sm')}
                  style={{ color: t.colors.text }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
