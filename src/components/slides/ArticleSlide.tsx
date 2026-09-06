import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';
import SlideDecor from './SlideDecor';

interface ArticleSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

export default function ArticleSlide({ slide, theme: t, isThumbnail }: ArticleSlideProps) {
  const { content } = slide;
  const sections = content.sections || [];

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

      <div className="px-8 pt-4 pb-6 flex-1 flex flex-col relative z-10">
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
            className={cn('ml-4 mt-0.5', isThumbnail ? 'text-[10px]' : 'text-sm')}
            style={{ color: t.colors.textSecondary }}
          >
            {content.subtitle}
          </p>
        )}

        {content.description && (
          <p
            className={cn('ml-4 mt-3 leading-relaxed', isThumbnail ? 'text-[9px]' : 'text-sm md:text-[15px]')}
            style={{ color: t.colors.text }}
          >
            {content.description}
          </p>
        )}

        {sections.length > 0 && (
          <div
            className={cn(
              'flex-1 grid gap-3 mt-4',
              sections.length === 1 && 'grid-cols-1',
              sections.length === 2 && 'grid-cols-1 md:grid-cols-2',
              sections.length > 2 && 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
            )}
          >
            {sections.slice(0, 6).map((section, index) => (
              <div
                key={index}
                className={cn(
                  'relative flex flex-col rounded-xl border overflow-hidden',
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
                  style={{ background: t.colors.primary }}
                />
                <h3
                  className={cn(
                    'font-semibold mb-1',
                    isThumbnail ? 'text-[9px]' : 'text-sm md:text-base'
                  )}
                  style={{ color: t.colors.text }}
                >
                  {section.heading}
                </h3>
                <p
                  className={cn(
                    'leading-snug flex-1',
                    isThumbnail ? 'text-[7px]' : 'text-xs md:text-sm'
                  )}
                  style={{ color: t.colors.textSecondary }}
                >
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}