import type { Slide, Theme, TimelineItem } from '@/types';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Users,
  ChartBar,
  Activity,
  Zap,
  Award,
  Clock,
  Globe,
  Heart,
  Star,
  CircleCheck,
  Calendar,
  ArrowRight,
  ChartLine,
  ChartPie,
  ChartArea,
  Check,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TimelineSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Users,
  BarChart3: ChartBar,
  Activity,
  Zap,
  Award,
  Clock,
  Globe,
  Heart,
  Star,
  CheckCircle: CircleCheck,
  Calendar,
  ArrowRight,
  ChartBar,
  ChartLine,
  ChartPie,
  ChartArea,
  Check,
};

function getIcon(name: string): LucideIcon {
  return iconMap[name] || iconMap['CircleCheck'] || CircleCheck;
}

function TimelineSlide({ slide, theme, isThumbnail }: TimelineSlideProps) {
  const colors = theme.colors;
  const items: TimelineItem[] = slide.content.timeline || [];

  if (isThumbnail) {
    return (
      <div
        className="flex h-full w-full flex-col gap-1 rounded-md p-2"
        style={{ backgroundColor: colors.background, color: colors.text }}
      >
        <h3 className="text-xs font-bold">{slide.content.title}</h3>
        <div className="flex flex-1 flex-col justify-center gap-1">
          {items.slice(0, 4).map((item, index) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={index} className="flex items-center gap-1.5">
                <Icon size={10} style={{ color: colors.chart1 }} />
                <span className="text-[8px] truncate" style={{ color: colors.textSecondary }}>
                  {item.date} · {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }


  return (
    <div
      className="relative w-full aspect-[16/9] overflow-hidden rounded-xl flex flex-col"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <div className="h-1.5 w-full" style={{ background: colors.gradient }} />

      <div className="px-8 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full" style={{ background: colors.primary }} />
          <h2 className={cn('font-bold', isThumbnail ? 'text-lg' : 'text-2xl md:text-3xl')}>
            {slide.content.title}
          </h2>
        </div>
        {slide.content.subtitle && (
          <p className={cn('ml-4', isThumbnail ? 'text-xs' : 'text-sm')} style={{ color: colors.textSecondary }}>
            {slide.content.subtitle}
          </p>
        )}
      </div>

      <div className="flex-1 px-8 pb-6">
        <div className="relative flex-1">
          <div
            className="absolute bottom-0 left-[15px] top-0 w-0.5 md:left-1/2 md:-translate-x-1/2"
            style={{ backgroundColor: colors.border }}
          />
          <div className="flex flex-col gap-6 md:gap-8">
            {items.map((item, index) => {
              const Icon = getIcon(item.icon);
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={cn(
                    'relative flex items-start',
                    isLeft ? 'md:pr-[calc(50%+2rem)]' : 'md:pl-[calc(50%+2rem)]'
                  )}
                >
                  <div
                    className="absolute left-[15px] top-1 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 md:left-1/2"
                    style={{
                      borderColor: colors.chart1,
                      backgroundColor: colors.background,
                      color: colors.chart1,
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div
                    className={cn(
                      'ml-10 rounded-xl border p-4 md:ml-0',
                      isLeft ? '' : ''
                    )}
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                    }}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className="text-xs font-bold uppercase tracking-wide"
                        style={{ color: colors.chart1 }}
                      >
                        {item.date}
                      </span>
                    </div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimelineSlide;
