import { TrendingUp, Target, DollarSign, Users, BarChart3, PieChart, Activity, Zap, Award, Shield, Clock, Globe, Heart, Star, CheckCircle, Lightbulb, Rocket, ArrowRight, TrendingDown, XCircle, X, Check, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';
import SlideDecor, { IconTile } from './SlideDecor';

interface StrengthsSlideProps {
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

export default function StrengthsSlide({ slide, theme: themeProp, isThumbnail }: StrengthsSlideProps) {
  const t = themeProp;
  const { content } = slide;
  const highlights = content.highlights || [];
  const items = content.items || [];

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

      {/* Strength cards grid */}
      <div className="flex-1 px-8 pb-6 relative z-10">
        {highlights.length === 0 && items.length === 0 ? (
          <div
            className="flex h-full items-center justify-center rounded-xl border border-dashed"
            style={{ borderColor: t.colors.border }}
          >
            <p className="text-sm" style={{ color: t.colors.textSecondary }}>
              No strengths data available
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 h-full">
            {(highlights.length > 0 ? highlights : items.map((it) => ({ icon: 'Star', title: it.split(/[:\-–]/)[0]?.trim() || it, description: it.includes(':') || it.includes(' - ') || it.includes(' – ') ? it.split(/[:\-–]/).slice(1).join(':').trim() : '' }))).map((hl, index) => {
              const ItemIcon = getIcon(hl.icon);
              const accentColor = t.colors.chart3;

              return (
                <div
                  key={index}
                  className={cn(
                    'relative rounded-xl border flex overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg',
                    isThumbnail && 'p-2'
                  )}
                  style={{
                    background: t.colors.surface,
                    borderColor: t.colors.border,
                    boxShadow: `0 1px 3px ${t.colors.border}40`,
                  }}
                >
                  {/* Left accent */}
                  <div
                    className="w-1.5 shrink-0"
                    style={{ background: accentColor }}
                  />

                  <div className={cn('flex flex-col', isThumbnail ? 'p-2' : 'p-4')}>
                    {/* Icon */}
                    <div className={cn('mb-2', isThumbnail && 'mt-1')}>
                      <IconTile
                        theme={t}
                        size={isThumbnail ? 'sm' : 'md'}
                        icon={<ItemIcon style={{ color: accentColor }} />}
                      />
                    </div>

                    {/* Title */}
                    <h3
                      className={cn(
                        'font-semibold mb-1',
                        isThumbnail ? 'text-[9px]' : 'text-sm md:text-base'
                      )}
                      style={{ color: t.colors.text }}
                    >
                      {hl.title}
                    </h3>
                    {hl.description && (
                      <p
                        className={cn('leading-snug', isThumbnail ? 'text-[7px]' : 'text-xs')}
                        style={{ color: t.colors.textSecondary }}
                      >
                        {hl.description}
                      </p>
                    )}
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
