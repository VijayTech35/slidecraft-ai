import { TrendingUp, Target, Lightbulb, Award, Rocket, Star, Globe, Zap, Shield, Heart, CheckCircle, BarChart3, Activity, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';
import SlideDecor from './SlideDecor';

interface ProcessSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  TrendingUp, Target, Lightbulb, Award, Rocket, Star, Globe, Zap, Shield, Heart, CheckCircle, BarChart3, Activity, Clock, Users,
};

function getIcon(name: string) {
  return iconMap[name] || Rocket;
}

const defaultSteps = [
  { icon: 'Target', title: 'Research & Discovery', description: 'Analyze market trends, gather insights, and define project scope' },
  { icon: 'Lightbulb', title: 'Strategic Planning', description: 'Develop comprehensive roadmap with milestones and deliverables' },
  { icon: 'Rocket', title: 'Development & Launch', description: 'Execute with agile methodology, ensuring quality at every stage' },
  { icon: 'BarChart3', title: 'Monitoring & Growth', description: 'Track KPIs, iterate based on data, and scale successful strategies' },
];

export default function ProcessSlide({ slide, theme: themeProp, isThumbnail }: ProcessSlideProps) {
  const t = themeProp;
  const { content } = slide;
  const steps = content.processSteps || content.steps || defaultSteps;

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

      {/* Process steps - vertical alternating layout */}
      <div className="flex-1 px-8 pb-6 relative z-10">
        {/* Central connecting line */}
        <div
          className="absolute left-1/2 top-2 bottom-6 w-0.5 -translate-x-1/2"
          style={{ background: `${t.colors.primary}20` }}
        />

        <div className="flex flex-col justify-around h-full">
          {steps.map((step, index) => {
            const StepIcon = getIcon(step.icon);
            const isLeft = index % 2 === 0;

            return (
              <div key={index} className="relative flex items-center">
                {/* Left content (even steps) */}
                <div
                  className={cn(
                    'flex-1 flex',
                    isLeft ? 'justify-end pr-6' : 'justify-end pr-6 invisible'
                  )}
                >
                  {isLeft && (
                    <div className="text-right max-w-[45%]">
                      <h3
                        className={cn(
                          'font-bold mb-0.5',
                          isThumbnail ? 'text-[9px]' : 'text-sm md:text-base'
                        )}
                        style={{ color: t.colors.text }}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={cn(
                          'leading-snug',
                          isThumbnail ? 'text-[6px]' : 'text-xs'
                        )}
                        style={{ color: t.colors.textSecondary }}
                      >
                        {step.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Center number circle */}
                <div
                  className={cn(
                    'rounded-full flex items-center justify-center z-10 border-4 flex-shrink-0',
                    isThumbnail ? 'w-8 h-8' : 'w-11 h-11'
                  )}
                  style={{
                    background: t.colors.primary,
                    borderColor: t.colors.background,
                  }}
                >
                  <span
                    className={cn(
                      'font-bold text-white',
                      isThumbnail ? 'text-[8px]' : 'text-sm'
                    )}
                  >
                    {index + 1}
                  </span>
                </div>

                {/* Right content (odd steps) */}
                <div
                  className={cn(
                    'flex-1 flex',
                    !isLeft ? 'justify-start pl-6' : 'justify-start pl-6 invisible'
                  )}
                >
                  {!isLeft && (
                    <div className="flex items-start gap-3 max-w-[45%]">
                      <div
                        className={cn(
                          'rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                          isThumbnail ? 'w-6 h-6' : 'w-9 h-9'
                        )}
                        style={{ background: `${t.colors.primary}12` }}
                      >
                        <StepIcon
                          className={cn(isThumbnail ? 'w-3 h-3' : 'w-4.5 h-4.5')}
                          style={{ color: t.colors.primary }}
                        />
                      </div>
                      <div>
                        <h3
                          className={cn(
                            'font-bold mb-0.5',
                            isThumbnail ? 'text-[9px]' : 'text-sm md:text-base'
                          )}
                          style={{ color: t.colors.text }}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={cn(
                            'leading-snug',
                            isThumbnail ? 'text-[6px]' : 'text-xs'
                          )}
                          style={{ color: t.colors.textSecondary }}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
