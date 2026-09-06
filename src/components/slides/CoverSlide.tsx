import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';

interface CoverSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

export default function CoverSlide({ slide, theme: t, isThumbnail }: CoverSlideProps) {
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
          style={{ background: t.colors.gradient }}
        />
      )}

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex flex-col justify-center h-full px-10 md:px-16">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: t.colors.accent }}
          />
          <p
            className={cn(
              'text-white/70 font-medium tracking-widest uppercase',
              isThumbnail ? 'text-[7px]' : 'text-xs md:text-sm'
            )}
          >
            {content.subtitle || 'Presentation'}
          </p>
        </div>

        <h1
          className={cn(
            'font-bold text-white tracking-tight leading-[1.05] max-w-4xl',
            isThumbnail ? 'text-3xl' : 'text-5xl md:text-7xl'
          )}
        >
          {content.title}
        </h1>

        {content.description && (
          <p
            className={cn(
              'text-white/80 font-light leading-relaxed max-w-2xl mt-5',
              isThumbnail ? 'text-[9px]' : 'text-base md:text-xl'
            )}
          >
            {content.description}
          </p>
        )}

        <div
          className={cn(
            'mt-8 flex items-center gap-2 text-white/60 font-medium',
            isThumbnail ? 'text-[7px]' : 'text-xs'
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.colors.accent }} />
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </div>
  );
}