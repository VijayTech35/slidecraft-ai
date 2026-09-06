import type { ReactNode } from 'react';
import type { Theme } from '@/types';

/**
 * Subtle decorative background layer for interior slides:
 * a soft radial glow, faint dot pattern, and corner accent shapes.
 * Keeps the theme colors while adding depth so slides don't look flat.
 */
export default function SlideDecor({ theme }: { theme: Theme }) {
  const { colors } = theme;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Soft glow top-right */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl"
        style={{ background: `${colors.primary}14` }}
      />
      {/* Soft glow bottom-left */}
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl"
        style={{ background: `${colors.secondary}10` }}
      />
      {/* Faint dot pattern */}
      <div
        className="absolute top-6 right-8 w-28 h-28 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(${colors.primary} 1.2px, transparent 1.2px)`,
          backgroundSize: '14px 14px',
        }}
      />
      {/* Corner accent bar */}
      <div
        className="absolute top-0 left-0 w-24 h-1.5"
        style={{ background: colors.gradient }}
      />
    </div>
  );
}

/**
 * Compact icon tile with a tinted gradient background.
 */
export function IconTile({
  theme,
  icon,
  size = 'md',
  rounded = 'rounded-xl',
}: {
  theme: Theme;
  icon: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  rounded?: string;
}) {
  const { colors } = theme;
  const dims = {
    sm: 'w-8 h-8 [&_svg]:w-4 [&_svg]:h-4',
    md: 'w-11 h-11 [&_svg]:w-5 [&_svg]:h-5',
    lg: 'w-14 h-14 [&_svg]:w-7 [&_svg]:h-7',
  }[size];

  return (
    <div
      className={`${rounded} flex items-center justify-center shrink-0 ${dims} relative`}
      style={{
        background: `linear-gradient(135deg, ${colors.primary}22, ${colors.secondary}18)`,
        color: colors.primary,
      }}
    >
      {icon}
    </div>
  );
}
