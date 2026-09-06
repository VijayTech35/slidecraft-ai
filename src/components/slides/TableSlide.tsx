import { Table } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';
import SlideDecor from './SlideDecor';

interface TableSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

export default function TableSlide({ slide, theme: themeProp, isThumbnail }: TableSlideProps) {
  const t = themeProp;
  const { content } = slide;
  const headers = content.table?.headers || ['Metric', 'Q1', 'Q2', 'Q3', 'Q4'];
  const rows = content.table?.rows || [
    ['Revenue', '$1.2M', '$1.5M', '$1.8M', '$2.4M'],
    ['Users', '12K', '18K', '28K', '48K'],
    ['Retention', '82%', '85%', '88%', '92%'],
  ];

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
            <Table
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

      <div className="flex-1 px-8 pb-6 overflow-hidden relative z-10">
        <div
          className="w-full h-full rounded-xl border overflow-hidden shadow-sm"
          style={{ borderColor: t.colors.border }}
        >
          <table className="w-full h-full border-collapse">
            <thead>
              <tr style={{ background: t.colors.gradient }}>
                {headers.map((header, i) => (
                  <th
                    key={i}
                    className={cn(
                      'text-left font-semibold uppercase tracking-wider',
                      isThumbnail ? 'px-2 py-1.5 text-[7px]' : 'px-5 py-3 text-xs'
                    )}
                    style={{ color: '#ffffff' }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="transition-colors hover:opacity-90"
                  style={{
                    background: rowIndex % 2 === 0 ? t.colors.surface : t.colors.background,
                    borderBottom: `1px solid ${t.colors.border}`,
                  }}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={cn(
                        cellIndex === 0 ? 'font-medium' : '',
                        isThumbnail ? 'px-2 py-1.5 text-[7px]' : 'px-5 py-3 text-sm'
                      )}
                      style={{ color: cellIndex === 0 ? t.colors.text : t.colors.textSecondary }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
