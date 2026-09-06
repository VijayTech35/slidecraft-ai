import { TrendingUp, Target, Lightbulb, Award, Rocket, Star, Globe, Zap, Shield, Heart, CheckCircle, BarChart3, Activity, Clock, Users, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';
import SlideDecor from './SlideDecor';

interface WorkflowSlideProps {
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
  { icon: 'Target', title: 'Discovery', description: 'Identify goals and requirements' },
  { icon: 'Lightbulb', title: 'Strategy', description: 'Develop actionable plan' },
  { icon: 'Zap', title: 'Execution', description: 'Implement with precision' },
  { icon: 'BarChart3', title: 'Analysis', description: 'Measure results and impact' },
  { icon: 'Award', title: 'Optimize', description: 'Refine for maximum outcomes' },
];

export default function WorkflowSlide({ slide, theme: themeProp, isThumbnail }: WorkflowSlideProps) {
  const t = themeProp;
  const { content } = slide;
  const steps = content.steps || defaultSteps;

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

      {/* Workflow steps */}
      <div className="flex-1 px-8 pb-6 flex items-center relative z-10">
        <div className="w-full flex items-center justify-between gap-2">
          {steps.map((step, index) => {
            const StepIcon = getIcon(step.icon);

            return (
              <div key={index} className="flex items-center flex-1">
                {/* Step card */}
                <div className="flex flex-col items-center text-center flex-1">
                  {/* Icon circle */}
                  <div
                    className={cn(
                      'rounded-full flex items-center justify-center mb-3 border-2 transition-all',
                      isThumbnail ? 'w-12 h-12' : 'w-16 h-16'
                    )}
                    style={{
                      background: `linear-gradient(135deg, ${t.colors.primary}18, ${t.colors.secondary}14)`,
                      borderColor: t.colors.primary,
                      boxShadow: `0 6px 16px ${t.colors.primary}30`,
                    }}
                  >
                    <StepIcon
                      className={cn(isThumbnail ? 'w-5 h-5' : 'w-7 h-7')}
                      style={{ color: t.colors.primary }}
                    />
                  </div>

                  {/* Step number */}
                  <span
                    className={cn(
                      'font-bold mb-1',
                      isThumbnail ? 'text-[7px]' : 'text-xs'
                    )}
                    style={{ color: t.colors.primary }}
                  >
                    STEP {index + 1}
                  </span>

                  {/* Title */}
                  <h3
                    className={cn(
                      'font-bold mb-1',
                      isThumbnail ? 'text-[8px]' : 'text-sm md:text-base'
                    )}
                    style={{ color: t.colors.text }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={cn(
                      'max-w-[140px] leading-snug',
                      isThumbnail ? 'text-[6px]' : 'text-xs'
                    )}
                    style={{ color: t.colors.textSecondary }}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="flex items-center px-1 flex-shrink-0">
                    <ArrowRight
                      className={cn(isThumbnail ? 'w-4 h-4' : 'w-6 h-6')}
                      style={{ color: t.colors.primary, opacity: 0.55 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="px-8 pb-4">
        <div
          className="h-0.5 w-full rounded-full opacity-30"
          style={{ background: t.colors.gradient }}
        />
      </div>
    </div>
  );
}
