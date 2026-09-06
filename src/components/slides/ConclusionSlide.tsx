import { createElement } from 'react';
import { TrendingUp, Target, Lightbulb, Award, Star, Rocket, Globe, Zap, Shield, Heart, CheckCircle, BarChart3, Activity, Clock, Users, Check, ArrowRight, DollarSign, TrendingDown, XCircle, X, AlertTriangle, ArrowUpRight, ArrowDownRight, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';
import SlideDecor from './SlideDecor';

interface ConclusionSlideProps {
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

export default function ConclusionSlide({ slide, theme: themeProp, isThumbnail }: ConclusionSlideProps) {
  const t = themeProp;
  const { content } = slide;
  const items = content.items || [];
  const iconName = content.icons?.[0] || 'Rocket';

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
      </div>

      <div className="flex-1 px-8 pb-6 flex flex-col gap-4 relative z-10">
        {/* Main callout box */}
        <div
          className={cn(
            'rounded-xl overflow-hidden flex items-center gap-4',
            isThumbnail ? 'p-3' : 'p-5'
          )}
          style={{ background: t.colors.gradient }}
        >
          <div
            className={cn(
              'rounded-xl flex items-center justify-center shrink-0 bg-white/15',
              isThumbnail ? 'w-8 h-8' : 'w-14 h-14'
            )}
          >
            {createElement(getIcon(iconName), {
              className: cn(isThumbnail ? 'w-4 h-4' : 'w-7 h-7'),
              style: { color: 'white' },
            })}
          </div>
          <div className="flex-1">
            {content.subtitle && (
              <p
                className={cn(
                  'font-bold text-white',
                  isThumbnail ? 'text-xs' : 'text-lg md:text-xl'
                )}
              >
                {content.subtitle}
              </p>
            )}
            {content.description && (
              <p
                className={cn(
                  'text-white/80 mt-1',
                  isThumbnail ? 'text-[8px]' : 'text-xs md:text-sm'
                )}
              >
                {content.description}
              </p>
            )}
          </div>
        </div>

        {/* Summary points */}
        <div className="flex-1 flex flex-col gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center gap-3 rounded-lg border',
                isThumbnail ? 'px-2 py-1' : 'px-4 py-2.5'
              )}
              style={{
                background: t.colors.surface,
                borderColor: t.colors.border,
              }}
            >
              <div
                className={cn(
                  'rounded-full flex items-center justify-center shrink-0',
                  isThumbnail ? 'w-4 h-4' : 'w-6 h-6'
                )}
                style={{ background: `${t.colors.primary}15` }}
              >
                <Check
                  className={cn(isThumbnail ? 'w-2 h-2' : 'w-3 h-3')}
                  style={{ color: t.colors.primary }}
                />
              </div>
              <span
                className={cn(
                  'font-medium',
                  isThumbnail ? 'text-[8px]' : 'text-xs md:text-sm'
                )}
                style={{ color: t.colors.text }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Contact / closing */}
        <div
          className={cn(
            'flex items-center justify-between rounded-lg border',
            isThumbnail ? 'px-2 py-1.5' : 'px-5 py-3'
          )}
          style={{
            background: t.colors.surface,
            borderColor: t.colors.border,
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'rounded-full flex items-center justify-center',
                isThumbnail ? 'w-4 h-4' : 'w-6 h-6'
              )}
              style={{ background: t.colors.primary }}
            >
              <Star
                className={cn(isThumbnail ? 'w-2 h-2' : 'w-3 h-3')}
                style={{ color: 'white' }}
              />
            </div>
            <span
              className={cn(
                'font-semibold',
                isThumbnail ? 'text-[8px]' : 'text-xs md:text-sm'
              )}
              style={{ color: t.colors.text }}
            >
              Thank You
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(isThumbnail ? 'text-[7px]' : 'text-xs')}
              style={{ color: t.colors.textSecondary }}
            >
              Questions & Discussion
            </span>
            <ArrowRight
              className={cn(isThumbnail ? 'w-2 h-2' : 'w-3.5 h-3.5')}
              style={{ color: t.colors.primary }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
