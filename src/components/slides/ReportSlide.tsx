import { cn } from '@/lib/utils';
import type { Slide, Theme, SlideChart, SlideLayout, SWOTData } from '@/types';
import ChartBarSlide from './ChartBarSlide';
import ChartLineSlide from './ChartLineSlide';
import ChartPieSlide from './ChartPieSlide';
import ChartAreaSlide from './ChartAreaSlide';
import ChartDonutSlide from './ChartDonutSlide';

interface ReportSlideProps {
  slide: Slide;
  theme: Theme;
  isThumbnail?: boolean;
}

const CHART_COMPONENTS: Record<string, React.ComponentType<{ slide: Slide; theme: Theme; isThumbnail?: boolean }>> = {
  bar: ChartBarSlide,
  line: ChartLineSlide,
  pie: ChartPieSlide,
  area: ChartAreaSlide,
  donut: ChartDonutSlide,
};

function ChartView({ chart, theme }: { chart: SlideChart; theme: Theme }) {
  const layoutName = (Object.prototype.hasOwnProperty.call(CHART_COMPONENTS, chart.type) ? chart.type : 'bar') as 'bar' | 'line' | 'pie' | 'area' | 'donut';
  const Layout = CHART_COMPONENTS[layoutName];
  const fakeSlide: Slide = {
    id: 'chart-fake',
    layout: `chart-${layoutName}` as SlideLayout,
    content: {
      title: chart.title || 'Trends',
      subtitle: chart.subtitle || '',
      chartData: chart.data,
      chartType: chart.type,
    },
    order: 0,
  };
  return <Layout slide={fakeSlide} theme={theme} />;
}

const priorityStyles: Record<string, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-red-500/10 text-red-600 border-red-200' },
  medium: { label: 'Medium', className: 'bg-amber-500/10 text-amber-700 border-amber-200' },
  low: { label: 'Low', className: 'bg-blue-500/10 text-blue-700 border-blue-200' },
};

function SectionHeading({ theme, index, title }: { theme: Theme; index: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span
        className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0"
        style={{ background: theme.colors.gradient }}
      >
        {index}
      </span>
      <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: theme.colors.text }}>
        {title}
      </h2>
    </div>
  );
}

export default function ReportSlide({ slide, theme: t, isThumbnail }: ReportSlideProps) {
  const { content } = slide;
  const charts = content.charts || [];
  const swot: SWOTData = content.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] };
  const image = content.image?.src;
  let sectionNumber = 0;
  const nextIndex = () => String(++sectionNumber).padStart(2, '0');

  if (isThumbnail) {
    return (
      <div
        className="relative w-full aspect-[16/9] overflow-hidden rounded-xl"
        style={{ background: `linear-gradient(135deg, ${t.colors.gradientFrom}, ${t.colors.gradientTo})` }}
      >
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 h-full flex flex-col justify-end p-3">
          <p className="text-[7px] font-semibold uppercase tracking-widest text-white/70 mb-1">
            Single-page report
          </p>
          <p className="text-[11px] font-bold text-white leading-snug">{content.title}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-hidden"
      style={{ background: t.colors.background, color: t.colors.text }}
    >
      {/* Hero */}
      <div className="relative overflow-hidden">
        {image ? (
          <img src={image} alt={content.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${t.colors.gradientFrom}, ${t.colors.gradientTo})` }}
          />
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 max-w-5xl mx-auto px-8 md:px-12 py-16 md:py-20">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.colors.accent }} />
            <span className="text-[11px] md:text-xs font-semibold uppercase tracking-widest text-white/70">
              {content.subtitle || 'Full report'}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
            {content.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm md:text-lg text-white/80 font-light leading-relaxed">
            {content.description}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white"
              style={{ background: t.colors.accent }}
            >
              {charts.length} chart{charts.length === 1 ? '' : 's'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white/85 bg-white/15 border border-white/20">
              {content.kpis?.length || 0} metrics
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white/85 bg-white/15 border border-white/20">
              Single-page dashboard
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-8 md:px-12 py-12 space-y-14">
        {content.kpis && content.kpis.length > 0 && (
          <section id="report-kpis">
            <SectionHeading theme={t} index={nextIndex()} title="Key numbers at a glance" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {content.kpis.map((kpi, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-5 relative overflow-hidden"
                  style={{ borderColor: t.colors.border, background: t.colors.surface }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: kpi.color || t.colors.chart1 }}
                  />
                  <p className="text-xs font-medium uppercase tracking-wide" style={{ color: t.colors.textSecondary }}>
                    {kpi.label}
                  </p>
                  <p className="mt-2 text-2xl md:text-3xl font-bold tracking-tight" style={{ color: t.colors.text }}>
                    {kpi.value}
                  </p>
                  {kpi.change && (
                    <p
                      className={cn(
                        'mt-1 text-xs font-semibold',
                        kpi.changeType === 'negative'
                          ? 'text-red-500'
                          : kpi.changeType === 'positive'
                            ? 'text-emerald-600'
                            : t.colors.textSecondary
                      )}
                    >
                      {kpi.change}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {content.sections && content.sections.length > 0 && (
          <section id="report-topics">
            <SectionHeading theme={t} index={nextIndex()} title="Topics covered" />
            <div className="grid md:grid-cols-3 gap-5">
              {content.sections.map((section, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-5"
                  style={{ borderColor: t.colors.border, background: t.colors.background }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white" style={{ background: t.colors.primary }}>
                      {i + 1}
                    </span>
                    <h3 className="font-semibold text-sm" style={{ color: t.colors.text }}>
                      {section.heading}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: t.colors.textSecondary }}>
                    {section.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {charts.length > 0 && (
          <section id="report-charts">
            <SectionHeading theme={t} index={nextIndex()} title="Data & trends" />
            <div className="space-y-6">
              {charts.map((chart, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden border shadow-sm"
                  style={{ borderColor: t.colors.border, background: t.colors.background }}
                >
                  <ChartView chart={chart} theme={t} />
                </div>
              ))}
            </div>
          </section>
        )}

        {content.table && content.table.rows.length > 0 && (
          <section id="report-data">
            <SectionHeading theme={t} index={nextIndex()} title="Breakdown by group" />
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: t.colors.border, background: t.colors.background }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left" style={{ background: t.colors.surface }}>
                    {content.table.headers.map((h, i) => (
                      <th
                        key={i}
                        className={cn('px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider', i > 0 && 'text-right')}
                        style={{ color: t.colors.textSecondary }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.table.rows.map((row, r) => {
                    const share = row.length > 2 ? row[2] || '' : '';
                    const hasPct = /%$/.test(share);
                    const pct = hasPct ? Math.min(100, Number.parseFloat(share) || 0) : 0;
                    return (
                      <tr key={r} className="border-t" style={{ borderColor: t.colors.border, background: r % 2 ? t.colors.surface : undefined }}>
                        <td className="px-5 py-3.5 font-medium" style={{ color: t.colors.text }}>{row[0]}</td>
                        <td className="px-5 py-3.5 text-right font-semibold" style={{ color: t.colors.primary }}>{row[1]}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: t.colors.border }}>
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: t.colors.gradient }} />
                            </div>
                            <span className="w-11 text-right text-xs font-semibold" style={{ color: t.colors.textSecondary }}>{share}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {content.comparison && content.comparison.length > 0 && (
          <section id="report-benchmark">
            <SectionHeading theme={t} index={nextIndex()} title="Benchmark comparison" />
            <div className="grid md:grid-cols-2 gap-5">
              {content.comparison.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-6"
                  style={{ borderColor: t.colors.border, background: t.colors.surface }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold" style={{ color: t.colors.text }}>{item.label}</h3>
                    {typeof item.score === 'number' && (
                      <span className="text-sm font-bold px-2.5 py-1 rounded-full bg-white/60" style={{ color: t.colors.primary }}>
                        {item.score}
                      </span>
                    )}
                  </div>
                  {item.pros.length > 0 && (
                    <ul className="space-y-1.5 mb-3">
                      {item.pros.map((pro, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-emerald-700">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.cons.length > 0 && (
                    <ul className="space-y-1.5">
                      {item.cons.map((con, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-red-600">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {(swot.strengths.length > 0 || swot.weaknesses.length > 0 || swot.opportunities.length > 0 || swot.threats.length > 0) && (
          <section id="report-swot">
            <SectionHeading theme={t} index={nextIndex()} title="SWOT analysis" />
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Strengths', items: swot.strengths, color: 'text-emerald-700', dot: 'bg-emerald-500' },
                { label: 'Weaknesses', items: swot.weaknesses, color: 'text-red-600', dot: 'bg-red-400' },
                { label: 'Opportunities', items: swot.opportunities, color: 'text-blue-700', dot: 'bg-blue-500' },
                { label: 'Threats', items: swot.threats, color: 'text-amber-700', dot: 'bg-amber-500' },
              ].map((quad, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-5"
                  style={{ borderColor: t.colors.border, background: t.colors.background }}
                >
                  <h3 className="font-semibold text-sm mb-3" style={{ color: t.colors.text }}>{quad.label}</h3>
                  <ul className="space-y-2">
                    {quad.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className={cn('mt-1.5 w-1.5 h-1.5 rounded-full shrink-0', quad.dot)} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {content.recommendations && content.recommendations.length > 0 && (
          <section id="report-actions">
            <SectionHeading theme={t} index={nextIndex()} title="Recommended actions" />
            <div className="space-y-3">
              {content.recommendations.map((rec, i) => {
                const style = priorityStyles[rec.priority || 'medium'] || priorityStyles.medium;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-4 rounded-xl border p-5"
                    style={{ borderColor: t.colors.border, background: t.colors.surface }}
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: t.colors.gradient }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <h3 className="font-semibold text-sm" style={{ color: t.colors.text }}>{rec.title}</h3>
                        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', style.className)}>
                          {style.label}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: t.colors.textSecondary }}>
                        {rec.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {content.timeline && content.timeline.length > 0 && (
          <section id="report-timeline">
            <SectionHeading theme={t} index={nextIndex()} title="Timeline & milestones" />
            <div className="grid sm:grid-cols-2 gap-4">
              {content.timeline.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-xl border p-5"
                  style={{ borderColor: t.colors.border, background: t.colors.background }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: t.colors.gradient }}>
                    <span className="text-xs font-bold">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: t.colors.primary }}>
                      {item.date}
                    </p>
                    <h3 className="font-semibold text-sm mt-0.5" style={{ color: t.colors.text }}>{item.title}</h3>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: t.colors.textSecondary }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {content.team && content.team.length > 0 && (
          <section id="report-team">
            <SectionHeading theme={t} index={nextIndex()} title="The team" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {content.team.map((member, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-4 text-center"
                  style={{ borderColor: t.colors.border, background: t.colors.surface }}
                >
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold" style={{ background: t.colors.gradient }}>
                    {member.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                  </div>
                  <p className="text-sm font-semibold" style={{ color: t.colors.text }}>{member.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: t.colors.textSecondary }}>{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {content.items && content.items.length > 0 && (
          <section id="report-closing">
            <SectionHeading theme={t} index={nextIndex()} title="Bottom line" />
            <div
              className="rounded-2xl p-7"
              style={{ background: `linear-gradient(135deg, ${t.colors.gradientFrom}, ${t.colors.gradientTo})` }}
            >
              <ul className="space-y-3">
                {content.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/95 text-sm md:text-base leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <div className="pt-6 pb-4 border-t flex items-center justify-between" style={{ borderColor: t.colors.border }}>
          <p className="text-xs" style={{ color: t.colors.textSecondary }}>
            {content.subtitle || 'Full report'}
          </p>
          <p className="text-xs" style={{ color: t.colors.textSecondary }}>
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}