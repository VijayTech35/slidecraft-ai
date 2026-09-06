import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide, Theme, TeamMember } from '@/types';
import SlideDecor from './SlideDecor';

interface TeamSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function TeamSlide({ slide, theme: themeProp, isThumbnail }: TeamSlideProps) {
  const t = themeProp;
  const { content } = slide;

  const defaultTeam: TeamMember[] = [
    { name: 'Alex Johnson', role: 'CEO & Founder' },
    { name: 'Sarah Chen', role: 'CTO' },
    { name: 'Marcus Williams', role: 'Head of Design' },
    { name: 'Emily Park', role: 'VP Engineering' },
    { name: 'David Kim', role: 'Head of Marketing' },
    { name: 'Rachel Torres', role: 'Product Manager' },
  ];

  const team = content.team || defaultTeam;

  return (
    <div
      className={cn(
        'relative w-full aspect-[16/9] overflow-hidden rounded-xl flex flex-col',
        isThumbnail && 'scale-[0.3] origin-top-left w-[333.33%] h-[333.33%]'
      )}
      style={{ background: t.colors.background }}
    >
      <div className="h-1.5 w-full" style={{ background: t.colors.gradient }} />
      <SlideDecor theme={t} />

      <div className="px-8 pt-5 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'rounded-xl flex items-center justify-center',
              isThumbnail ? 'w-8 h-8' : 'w-11 h-11'
            )}
            style={{
              background: `linear-gradient(135deg, ${t.colors.primary}20, ${t.colors.secondary}18)`,
            }}
          >
            <Users
              className={cn(isThumbnail ? 'w-4 h-4' : 'w-5 h-5')}
              style={{ color: t.colors.primary }}
            />
          </div>
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
            {content.subtitle && (
              <p
                className={cn(isThumbnail ? 'text-[8px]' : 'text-sm')}
                style={{ color: t.colors.textSecondary }}
              >
                {content.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-8 pb-6 relative z-10">
        <div
          className={cn(
            'grid gap-3 h-full',
            team.length <= 2 && 'grid-cols-2',
            team.length <= 4 && team.length > 2 && 'grid-cols-2 md:grid-cols-4',
            team.length > 4 && 'grid-cols-2 md:grid-cols-3'
          )}
        >
          {team.map((member, index) => {
            const cardColors = [
              t.colors.chart1,
              t.colors.chart2,
              t.colors.chart3,
              t.colors.chart4,
              t.colors.chart5,
              t.colors.primary,
            ];
            const color = cardColors[index % cardColors.length];

            return (
              <div
                key={index}
                className={cn(
                  'relative flex flex-col items-center justify-center overflow-hidden rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg',
                  isThumbnail && 'p-2'
                )}
                style={{
                  background: t.colors.surface,
                  borderColor: t.colors.border,
                  boxShadow: `0 1px 3px ${t.colors.border}40`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: color }}
                />
                <div
                  className={cn(
                    'rounded-full flex items-center justify-center font-bold text-white mb-2',
                    isThumbnail ? 'w-8 h-8 text-[7px]' : 'w-14 h-14 text-base md:text-lg'
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${t.colors.secondary})`,
                    boxShadow: `0 4px 10px ${color}55`,
                  }}
                >
                  {getInitials(member.name)}
                </div>
                <h3
                  className={cn(
                    'font-semibold text-center',
                    isThumbnail ? 'text-[8px]' : 'text-sm md:text-base'
                  )}
                  style={{ color: t.colors.text }}
                >
                  {member.name}
                </h3>
                <p
                  className={cn(
                    'text-center mt-0.5',
                    isThumbnail ? 'text-[6px]' : 'text-xs'
                  )}
                  style={{ color: t.colors.textSecondary }}
                >
                  {member.role}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
