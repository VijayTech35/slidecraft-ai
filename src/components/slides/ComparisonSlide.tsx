import { TrendingUp, TrendingDown, Target, DollarSign, Users, BarChart3, PieChart, Activity, Zap, Award, Rocket, Shield, Clock, Globe, Heart, Star, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';
import SlideDecor from './SlideDecor';

interface ComparisonSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  TrendingUp, TrendingDown, Target, DollarSign, Users, BarChart3, PieChart, Activity, Zap, Award, Rocket, Shield, Clock, Globe, Heart, Star,
};

function getIcon(name: string) {
  return iconMap[name] || Star;
}

const defaultComparison = [
  {
    label: 'Option A',
    icon: 'Rocket',
    pros: ['Faster implementation', 'Lower upfront cost', 'Scalable architecture'],
    cons: ['Limited customization', 'Vendor dependency'],
    score: 85,
  },
  {
    label: 'Option B',
    icon: 'Shield',
    pros: ['Full control & flexibility', 'No vendor lock-in', 'Custom integrations'],
    cons: ['Higher initial investment', 'Longer development cycle'],
    score: 78,
  },
];

export default function ComparisonSlide({ slide, theme: themeProp, isThumbnail }: ComparisonSlideProps) {
  const t = themeProp;
  const { content } = slide;
  const comparison = content.comparison || defaultComparison;

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

      {/* Comparison columns */}
      <div className="flex-1 px-8 pb-6 flex items-stretch gap-4 relative z-10">
        {comparison.map((item, index) => {
          const ItemIcon = getIcon(item.icon);
          const isLeft = index === 0;
          const scoreColor = isLeft ? t.colors.chart1 : t.colors.chart2;

          return (
            <div key={index} className="flex-1 flex items-center gap-4">
              {/* Column */}
              <div
                className={cn(
                  'relative flex-1 rounded-xl border p-5 flex flex-col overflow-hidden shadow-sm',
                  isThumbnail && 'p-2'
                )}
                style={{
                  background: t.colors.surface,
                  borderColor: t.colors.border,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: scoreColor }}
                />
                {/* Column header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={cn(
                      'rounded-xl flex items-center justify-center',
                      isThumbnail ? 'w-8 h-8' : 'w-12 h-12'
                    )}
                    style={{ background: `${scoreColor}15` }}
                  >
                    <ItemIcon
                      className={cn(isThumbnail ? 'w-4 h-4' : 'w-6 h-6')}
                      style={{ color: scoreColor }}
                    />
                  </div>
                  <div>
                    <h3
                      className={cn(
                        'font-bold',
                        isThumbnail ? 'text-xs' : 'text-base md:text-lg'
                      )}
                      style={{ color: t.colors.text }}
                    >
                      {item.label}
                    </h3>
                    {item.score !== undefined && (
                      <span
                        className={cn(
                          'font-bold',
                          isThumbnail ? 'text-[9px]' : 'text-xs'
                        )}
                        style={{ color: scoreColor }}
                      >
                        Score: {item.score}/100
                      </span>
                    )}
                  </div>
                </div>

                {/* Score bar */}
                {item.score !== undefined && (
                  <div className="mb-3">
                    <div
                      className={cn(
                        'w-full rounded-full overflow-hidden',
                        isThumbnail ? 'h-1' : 'h-2'
                      )}
                      style={{ background: `${scoreColor}15` }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${item.score}%`,
                          background: scoreColor,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Pros */}
                <div className="mb-2">
                  <span
                    className={cn(
                      'font-semibold mb-1.5 block',
                      isThumbnail ? 'text-[7px]' : 'text-xs'
                    )}
                    style={{ color: '#16a34a' }}
                  >
                    Advantages
                  </span>
                  <ul className="space-y-1">
                    {item.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle
                          className={cn(
                            'flex-shrink-0 mt-0.5',
                            isThumbnail ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'
                          )}
                          style={{ color: '#16a34a' }}
                        />
                        <span
                          className={cn(
                            'leading-snug',
                            isThumbnail ? 'text-[6px]' : 'text-xs'
                          )}
                          style={{ color: t.colors.text }}
                        >
                          {pro}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div>
                  <span
                    className={cn(
                      'font-semibold mb-1.5 block',
                      isThumbnail ? 'text-[7px]' : 'text-xs'
                    )}
                    style={{ color: '#dc2626' }}
                  >
                    Limitations
                  </span>
                  <ul className="space-y-1">
                    {item.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <XCircle
                          className={cn(
                            'flex-shrink-0 mt-0.5',
                            isThumbnail ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'
                          )}
                          style={{ color: '#dc2626' }}
                        />
                        <span
                          className={cn(
                            'leading-snug',
                            isThumbnail ? 'text-[6px]' : 'text-xs'
                          )}
                          style={{ color: t.colors.text }}
                        >
                          {con}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* VS Badge (only between columns) */}
              {isLeft && comparison.length > 1 && (
                <div
                  className={cn(
                    'rounded-full flex items-center justify-center font-bold z-10 flex-shrink-0',
                    isThumbnail ? 'w-7 h-7 text-[7px]' : 'w-12 h-12 text-sm'
                  )}
                  style={{
                    background: t.colors.gradient,
                    color: '#ffffff',
                    boxShadow: `0 4px 12px ${t.colors.primary}44`,
                  }}
                >
                  VS
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
