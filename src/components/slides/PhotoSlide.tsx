import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';

interface PhotoSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

export default function PhotoSlide({ slide, theme: t, isThumbnail }: PhotoSlideProps) {
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

      <div className="relative z-10 flex flex-col h-full px-10 md:px-14 pb-10 md:pb-14">
        <div
          className="mt-8 h-1.5 w-12 rounded-full"
          style={{ background: t.colors.accent }}
        />
        {content.title && (
          <h2
            className={cn(
              'font-bold text-white tracking-tight leading-tight mt-auto',
              isThumbnail ? 'text-xl' : 'text-3xl md:text-5xl'
            )}
          >
            {content.title}
          </h2>
        )}
        {content.description && (
          <p
            className={cn(
              'text-white/85 font-light leading-relaxed mt-3 max-w-2xl',
              isThumbnail ? 'text-[8px]' : 'text-sm md:text-lg'
            )}
          >
            {content.description}
          </p>
        )}
      </div>
    </div>
  );
}