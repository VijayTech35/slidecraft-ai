import { ArrowUpRight, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';
import SlideDecor from './SlideDecor';

interface SWOTSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

export default function SWOTSlide({ slide, theme: themeProp, isThumbnail }: SWOTSlideProps) {
  const t = themeProp;
  const { content } = slide;
  const swot = content.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] };

  const swotColors = {
    strengths: { bg: t.colors.chart3 + '12', border: t.colors.chart3 + '30', icon: t.colors.chart3, iconBg: t.colors.chart3 + '20' },
    weaknesses: { bg: t.colors.chart4 + '12', border: t.colors.chart4 + '30', icon: t.colors.chart4, iconBg: t.colors.chart4 + '20' },
    opportunities: { bg: t.colors.primary + '12', border: t.colors.primary + '30', icon: t.colors.primary, iconBg: t.colors.primary + '20' },
    threats: { bg: t.colors.chart4 + '12', border: t.colors.chart4 + '30', icon: t.colors.chart4, iconBg: t.colors.chart4 + '20' },
  };

  const quadrants = [
    {
      title: 'Strengths',
      items: swot.strengths,
      icon: CheckCircle,
      iconColor: swotColors.strengths.icon,
      bgColor: swotColors.strengths.bg,
      borderColor: swotColors.strengths.border,
      iconBg: swotColors.strengths.iconBg,
    },
    {
      title: 'Weaknesses',
      items: swot.weaknesses,
      icon: XCircle,
      iconColor: swotColors.weaknesses.icon,
      bgColor: swotColors.weaknesses.bg,
      borderColor: swotColors.weaknesses.border,
      iconBg: swotColors.weaknesses.iconBg,
    },
    {
      title: 'Opportunities',
      items: swot.opportunities,
      icon: ArrowUpRight,
      iconColor: swotColors.opportunities.icon,
      bgColor: swotColors.opportunities.bg,
      borderColor: swotColors.opportunities.border,
      iconBg: swotColors.opportunities.iconBg,
    },
    {
      title: 'Threats',
      items: swot.threats,
      icon: AlertTriangle,
      iconColor: swotColors.threats.icon,
      bgColor: swotColors.threats.bg,
      borderColor: swotColors.threats.border,
      iconBg: swotColors.threats.iconBg,
    },
  ];

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

      {/* 2x2 Grid */}
      <div className="flex-1 px-8 pb-6 relative z-10">
        <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
          {quadrants.map((q) => {
            const Icon = q.icon;
            return (
              <div
                key={q.title}
                className={cn(
                  'relative rounded-xl border flex flex-col overflow-hidden shadow-sm',
                  isThumbnail && 'p-2'
                )}
                style={{
                  background: q.bgColor,
                  borderColor: q.borderColor,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: q.iconColor }}
                />
                {/* Quadrant header */}
                <div className={cn('flex items-center gap-2 mb-2', isThumbnail ? 'px-2 pt-1' : 'px-4 pt-3')}>
                  <div
                    className={cn(
                      'rounded-lg flex items-center justify-center',
                      isThumbnail ? 'w-5 h-5' : 'w-8 h-8'
                    )}
                    style={{ background: q.iconBg }}
                  >
                    <Icon
                      className={cn(isThumbnail ? 'w-3 h-3' : 'w-4 h-4')}
                      style={{ color: q.iconColor }}
                    />
                  </div>
                  <h3
                    className={cn('font-bold', isThumbnail ? 'text-[9px]' : 'text-sm md:text-base')}
                    style={{ color: q.iconColor }}
                  >
                    {q.title}
                  </h3>
                </div>

                {/* Bullet list */}
                <div className={cn('flex-1 overflow-hidden', isThumbnail ? 'px-2 pb-1' : 'px-4 pb-3')}>
                  <ul className={cn('space-y-1', isThumbnail && 'space-y-0')}>
                    {q.items.map((item, i) => (
                      <li
                        key={i}
                        className={cn(
                          'flex items-start gap-1.5',
                          isThumbnail ? 'text-[7px]' : 'text-xs'
                        )}
                      >
                        <div
                          className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                          style={{ background: q.iconColor }}
                        />
                        <span style={{ color: t.colors.text }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
