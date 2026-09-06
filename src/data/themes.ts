import type { Theme } from '@/types';

export const themes: Theme[] = [
  {
    name: 'corporate',
    label: 'Corporate',
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      chart1: '#2563eb',
      chart2: '#7c3aed',
      chart3: '#10b981',
      chart4: '#f59e0b',
      chart5: '#ef4444',
      gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)',
      gradientFrom: '#1e40af',
      gradientTo: '#3b82f6',
    },
  },
  {
    name: 'finance',
    label: 'Finance',
    colors: {
      primary: '#065f46',
      secondary: '#10b981',
      accent: '#34d399',
      background: '#ffffff',
      surface: '#f0fdf4',
      text: '#064e3b',
      textSecondary: '#6b7280',
      border: '#d1fae5',
      chart1: '#059669',
      chart2: '#0d9488',
      chart3: '#0284c7',
      chart4: '#d97706',
      chart5: '#dc2626',
      gradient: 'linear-gradient(135deg, #065f46, #10b981)',
      gradientFrom: '#065f46',
      gradientTo: '#10b981',
    },
  },
  {
    name: 'dark',
    label: 'Dark Mode',
    colors: {
      primary: '#818cf8',
      secondary: '#a78bfa',
      accent: '#c4b5fd',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      chart1: '#818cf8',
      chart2: '#f472b6',
      chart3: '#34d399',
      chart4: '#fbbf24',
      chart5: '#f87171',
      gradient: 'linear-gradient(135deg, #312e81, #4f46e5)',
      gradientFrom: '#312e81',
      gradientTo: '#4f46e5',
    },
  },
  {
    name: 'light',
    label: 'Light',
    colors: {
      primary: '#2563eb',
      secondary: '#60a5fa',
      accent: '#93c5fd',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      chart1: '#3b82f6',
      chart2: '#8b5cf6',
      chart3: '#10b981',
      chart4: '#f59e0b',
      chart5: '#ef4444',
      gradient: 'linear-gradient(135deg, #2563eb, #60a5fa)',
      gradientFrom: '#2563eb',
      gradientTo: '#60a5fa',
    },
  },
  {
    name: 'minimal',
    label: 'Minimal',
    colors: {
      primary: '#171717',
      secondary: '#525252',
      accent: '#a3a3a3',
      background: '#ffffff',
      surface: '#fafafa',
      text: '#171717',
      textSecondary: '#737373',
      border: '#e5e5e5',
      chart1: '#171717',
      chart2: '#525252',
      chart3: '#a3a3a3',
      chart4: '#d4d4d4',
      chart5: '#737373',
      gradient: 'linear-gradient(135deg, #171717, #525252)',
      gradientFrom: '#171717',
      gradientTo: '#525252',
    },
  },
  {
    name: 'modern',
    label: 'Modern',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#c084fc',
      background: '#ffffff',
      surface: '#faf5ff',
      text: '#1e1b4b',
      textSecondary: '#6b7280',
      border: '#e9d5ff',
      chart1: '#7c3aed',
      chart2: '#ec4899',
      chart3: '#06b6d4',
      chart4: '#f97316',
      chart5: '#22c55e',
      gradient: 'linear-gradient(135deg, #7c3aed, #ec4899)',
      gradientFrom: '#7c3aed',
      gradientTo: '#ec4899',
    },
  },
  {
    name: 'blue',
    label: 'Ocean Blue',
    colors: {
      primary: '#0369a1',
      secondary: '#0ea5e9',
      accent: '#38bdf8',
      background: '#ffffff',
      surface: '#f0f9ff',
      text: '#0c4a6e',
      textSecondary: '#64748b',
      border: '#bae6fd',
      chart1: '#0284c7',
      chart2: '#0d9488',
      chart3: '#8b5cf6',
      chart4: '#f59e0b',
      chart5: '#ef4444',
      gradient: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
      gradientFrom: '#0369a1',
      gradientTo: '#0ea5e9',
    },
  },
  {
    name: 'green',
    label: 'Forest',
    colors: {
      primary: '#166534',
      secondary: '#22c55e',
      accent: '#4ade80',
      background: '#ffffff',
      surface: '#f0fdf4',
      text: '#14532d',
      textSecondary: '#6b7280',
      border: '#bbf7d0',
      chart1: '#16a34a',
      chart2: '#0891b2',
      chart3: '#7c3aed',
      chart4: '#eab308',
      chart5: '#dc2626',
      gradient: 'linear-gradient(135deg, #166534, #22c55e)',
      gradientFrom: '#166534',
      gradientTo: '#22c55e',
    },
  },
  {
    name: 'startup',
    label: 'Startup',
    colors: {
      primary: '#ea580c',
      secondary: '#f97316',
      accent: '#fb923c',
      background: '#ffffff',
      surface: '#fff7ed',
      text: '#431407',
      textSecondary: '#78716c',
      border: '#fed7aa',
      chart1: '#f97316',
      chart2: '#e11d48',
      chart3: '#0d9488',
      chart4: '#6366f1',
      chart5: '#eab308',
      gradient: 'linear-gradient(135deg, #ea580c, #f97316)',
      gradientFrom: '#ea580c',
      gradientTo: '#f97316',
    },
  },
  {
    name: 'vibrant',
    label: 'Vibrant',
    colors: {
      primary: '#dc2626',
      secondary: '#f43f5e',
      accent: '#fb7185',
      background: '#ffffff',
      surface: '#fff1f2',
      text: '#1c1917',
      textSecondary: '#78716c',
      border: '#fecdd3',
      chart1: '#dc2626',
      chart2: '#7c3aed',
      chart3: '#0d9488',
      chart4: '#eab308',
      chart5: '#2563eb',
      gradient: 'linear-gradient(135deg, #dc2626, #f43f5e)',
      gradientFrom: '#dc2626',
      gradientTo: '#f43f5e',
    },
  },
];

export function getTheme(name: string): Theme {
  return themes.find((t) => t.name === name) || themes[0];
}

/**
 * Returns a theme with optional per-presentation color overrides merged in.
 * When overrides change core colors, the derived gradient strings are
 * recomputed so accents stay consistent.
 */
export function getThemeWithOverrides(
  name: string,
  overrides?: Partial<Theme['colors']>
): Theme {
  const base = getTheme(name);
  if (!overrides || Object.keys(overrides).length === 0) {
    return base;
  }
  const colors = { ...base.colors, ...overrides };

  // Recompute gradient fields if the gradient endpoints changed.
  const from = colors.gradientFrom || base.colors.gradientFrom;
  const to = colors.gradientTo || base.colors.gradientTo;
  const newGradientFrom = overrides.primary ?? overrides.gradientFrom ?? from;
  const newGradientTo = overrides.secondary ?? overrides.gradientTo ?? to;
  colors.gradient = `linear-gradient(135deg, ${newGradientFrom}, ${newGradientTo})`;
  colors.gradientFrom = newGradientFrom;
  colors.gradientTo = newGradientTo;

  return { ...base, colors };
}
