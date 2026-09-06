import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';

interface DividerSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

export default function DividerSlide({ slide, theme: t, isThumbnail }: DividerSlideProps) {
  const { content } = slide;
  const image = content.image;

  return (
    <div
      className={cn(
        'relative w-full aspect-[16/9] overflow-hidden rounded-xl',
        isThumbnail && 'scale-[0.3] origin-top-left w-[333.33%] h-[333.33%]'
      )}
      style={{ background: t.colors.background }}
    >
      {image ? (
        <img
          src={image.src}
          alt={content.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${t.colors.gradientFrom}, ${t.colors.gradientTo})` }}
        />
      )}

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex flex-col justify-center h-full px-12 md:px-16 text-center">
        <div
          className="mx-auto h-1 w-14 rounded-full mb-6"
          style={{ background: t.colors.accent }}
        />
        {content.subtitle && (
          <p
            className={cn(
              'text-white/70 font-medium tracking-wide uppercase',
              isThumbnail ? 'text-[7px]' : 'text-xs md:text-sm'
            )}
          >
            {content.subtitle}
          </p>
        )}
        <h2
          className={cn(
            'font-bold text-white tracking-tight leading-tight mt-2',
            isThumbnail ? 'text-2xl' : 'text-4xl md:text-6xl'
          )}
        >
          {content.title}
        </h2>
      </div>
    </div>
  );
}