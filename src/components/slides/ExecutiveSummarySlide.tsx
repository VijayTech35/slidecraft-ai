import { TrendingUp, Target, Lightbulb, Award, Star, Rocket, Globe, Zap, Shield, Heart, CheckCircle, BarChart3, Activity, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';
import SlideDecor, { IconTile } from './SlideDecor';

interface ExecutiveSummarySlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  TrendingUp, Target, Lightbulb, Award, Star, Rocket, Globe, Zap, Shield, Heart, CheckCircle, BarChart3, Activity, Clock, Users,
};

function getIcon(name: string) {
  return iconMap[name] || Star;
}

export default function ExecutiveSummarySlide({ slide, theme: themeProp, isThumbnail }: ExecutiveSummarySlideProps) {
  const t = themeProp;
  const { content } = slide;

  const defaultHighlights = [
    { icon: 'TrendingUp', title: 'Growth', description: 'Strong upward trajectory across all metrics' },
    { icon: 'Target', title: 'Focus', description: 'Targeted strategies driving measurable outcomes' },
    { icon: 'Lightbulb', title: 'Innovation', description: 'Creative solutions for complex challenges' },
    { icon: 'Award', title: 'Excellence', description: 'Industry-leading performance standards' },
  ];

  const highlights = content.highlights || defaultHighlights;

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

      {/* Header section */}
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
            {content.description && (
              <p
                className={cn(isThumbnail ? 'text-xs' : 'text-sm md:text-base')}
                style={{ color: t.colors.textSecondary }}
              >
                {content.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Highlights grid */}
      <div className="flex-1 px-8 pb-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
          {highlights.map((highlight, index) => {
            const HlIcon = getIcon(highlight.icon);
            const cardColors = [t.colors.primary, t.colors.secondary, t.colors.chart3, t.colors.chart4];

            return (
              <div
                key={index}
                className={cn(
                  'relative flex flex-col items-center text-center overflow-hidden rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-lg',
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
                  style={{ background: cardColors[index % cardColors.length] }}
                />
                {/* Icon circle */}
                <div className={cn('mb-3', isThumbnail && 'mt-1')}>
                  <IconTile
                    theme={t}
                    size={isThumbnail ? 'sm' : 'lg'}
                    rounded="rounded-2xl"
                    icon={<HlIcon style={{ color: cardColors[index % cardColors.length] }} />}
                  />
                </div>

                {/* Title */}
                <h3
                  className={cn(
                    'font-bold mb-1',
                    isThumbnail ? 'text-xs' : 'text-sm md:text-base'
                  )}
                  style={{ color: t.colors.text }}
                >
                  {highlight.title}
                </h3>

                {/* Description */}
                <p
                  className={cn(
                    'leading-snug',
                    isThumbnail ? 'text-[8px]' : 'text-xs'
                  )}
                  style={{ color: t.colors.textSecondary }}
                >
                  {highlight.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
