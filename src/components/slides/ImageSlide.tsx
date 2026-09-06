import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';

interface ImageSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

export default function ImageSlide({ slide, theme: themeProp, isThumbnail }: ImageSlideProps) {
  const t = themeProp;
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
          alt={image.alt || content.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 opacity-90"
          style={{ background: `linear-gradient(135deg, ${t.colors.gradientFrom}, ${t.colors.gradientTo})` }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/40" />

      <div className="relative z-10 flex flex-col h-full p-7 md:p-10">
        <div className="h-1.5 w-10 rounded-full" style={{ background: t.colors.accent }} />

        <div className="mt-auto">
          {content.title && (
            <h2
              className={cn(
                'font-bold text-white tracking-tight leading-tight mb-1',
                isThumbnail ? 'text-lg' : 'text-2xl md:text-4xl'
              )}
            >
              {content.title}
            </h2>
          )}
          {content.subtitle && (
            <p className={cn('text-white/80 font-medium mb-2', isThumbnail ? 'text-[8px]' : 'text-sm md:text-base')}>
              {content.subtitle}
            </p>
          )}
          {content.description && (
            <p
              className={cn(
                'text-white/90 leading-snug max-w-xl',
                isThumbnail ? 'text-[7px]' : 'text-xs md:text-sm'
              )}
            >
              {content.description}
            </p>
          )}
          {image?.caption && (
            <p className={cn('text-white/55 uppercase tracking-[0.2em] mt-3', isThumbnail ? 'text-[6px]' : 'text-[11px]')}>
              {image.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}