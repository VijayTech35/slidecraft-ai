import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Edit3,
  Eye,
  Palette,
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  GripVertical,
  X,
  Presentation,
  Download,
  Printer,
  RefreshCw,
  Link2,
  Check,
  Image as ImageIcon,
  FileJson,
} from 'lucide-react';
import { useStore } from '@/store';
import { getTheme, getThemeWithOverrides } from '@/data/themes';
import { cn, generateId } from '@/lib/utils';
import { exportSlideAsPng, downloadJson, slugify } from '@/lib/export';
import { generatePresentation } from '@/lib/engine';
import { applyPivotToDeck } from '@/lib/excel';
import SlideRenderer from '@/components/slides/SlideRenderer';
import { buildReportToc } from '@/components/slides/reportToc';
import type { SlideLayout, ThemeName, Slide } from '@/types';

const layoutOptions: { value: SlideLayout; label: string }[] = [
  { value: 'cover', label: 'Cover' },
  { value: 'executive-summary', label: 'Executive Summary' },
  { value: 'kpi-dashboard', label: 'KPI Dashboard' },
  { value: 'workflow', label: 'Workflow' },
  { value: 'process', label: 'Process' },
  { value: 'comparison', label: 'Comparison' },
  { value: 'swot', label: 'SWOT Analysis' },
  { value: 'recommendation', label: 'Recommendation' },
  { value: 'strengths', label: 'Strengths' },
  { value: 'weaknesses', label: 'Weaknesses' },
  { value: 'chart-bar', label: 'Bar Chart' },
  { value: 'chart-pie', label: 'Pie Chart' },
  { value: 'chart-line', label: 'Line Chart' },
  { value: 'chart-area', label: 'Area Chart' },
  { value: 'chart-donut', label: 'Donut Chart' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'content', label: 'Content' },
  { value: 'metrics', label: 'Metrics' },
  { value: 'team', label: 'Team' },
  { value: 'image', label: 'Image' },
  { value: 'article', label: 'Article' },
  { value: 'divider', label: 'Divider' },
  { value: 'photo', label: 'Photo' },
  { value: 'report', label: 'Single-Page Report' },
  { value: 'table', label: 'Table' },
  { value: 'conclusion', label: 'Conclusion' },
];

const themeOptions: { value: ThemeName; label: string }[] = [
  { value: 'corporate', label: 'Corporate' },
  { value: 'finance', label: 'Finance' },
  { value: 'dark', label: 'Dark Mode' },
  { value: 'light', label: 'Light' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'modern', label: 'Modern' },
  { value: 'blue', label: 'Ocean Blue' },
  { value: 'green', label: 'Forest' },
  { value: 'startup', label: 'Startup' },
  { value: 'vibrant', label: 'Vibrant' },
];

const EMPTY_SLIDES: Slide[] = [];

const IMAGE_PRESETS = [
  { name: 'Finance', src: '/img/finance.svg' },
  { name: 'Sales', src: '/img/sales.svg' },
  { name: 'Healthcare', src: '/img/healthcare.svg' },
  { name: 'Marketing', src: '/img/marketing.svg' },
  { name: 'Technology', src: '/img/technology.svg' },
  { name: 'Education', src: '/img/education.svg' },
  { name: 'Sustainability', src: '/img/sustainability.svg' },
  { name: 'Startup', src: '/img/startup.svg' },
  { name: 'Overview', src: '/img/default.svg' },
];

export default function PresentationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const presentations = useStore((s) => s.presentations);
  const currentPresentation = useStore((s) => s.currentPresentation);
  const currentSlideIndex = useStore((s) => s.currentSlideIndex);
  const isEditing = useStore((s) => s.isEditing);
  const isPresenting = useStore((s) => s.isPresenting);
  const editingTheme = useStore((s) => s.editingTheme);
  const setCurrentPresentation = useStore((s) => s.setCurrentPresentation);
  const setCurrentSlideIndex = useStore((s) => s.setCurrentSlideIndex);
  const setIsEditing = useStore((s) => s.setIsEditing);
  const setIsPresenting = useStore((s) => s.setIsPresenting);
  const setEditingTheme = useStore((s) => s.setEditingTheme);
  const updatePresentation = useStore((s) => s.updatePresentation);
  const updateSlide = useStore((s) => s.updateSlide);
  const deleteSlide = useStore((s) => s.deleteSlide);
  const duplicateSlide = useStore((s) => s.duplicateSlide);
  const duplicatePresentation = useStore((s) => s.duplicatePresentation);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [titleEditing, setTitleEditing] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [prevPresentationId, setPrevPresentationId] = useState<string | null | undefined>(undefined);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [isExporting, setIsExporting] = useState<'slide' | 'deck' | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRegenData, setIsRegenData] = useState(false);
  const [slideDirection, setSlideDirection] = useState(1);
  const [reportProgress, setReportProgress] = useState(0);
  const [reportActive, setReportActive] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const presentation = currentPresentation || presentations.find((p) => p.id === id);
  const slides = presentation?.slides || EMPTY_SLIDES;
  const currentSlide = slides[currentSlideIndex];
  const isReport = slides.length === 1 && slides[0].layout === 'report';
  const theme = presentation
    ? getThemeWithOverrides(presentation.theme, presentation.themeOverrides)
    : getTheme('corporate');
  const activeTheme = isEditing
    ? getThemeWithOverrides(editingTheme, presentation?.themeOverrides)
    : theme;

  const presentationId = presentation?.id ?? null;
  if (presentationId !== prevPresentationId) {
    setPrevPresentationId(presentationId);
    setTitleValue(presentation?.title ?? '');
  }

  useEffect(() => {
    if (id && !currentPresentation) {
      const found = presentations.find((p) => p.id === id);
      if (found) {
        setCurrentPresentation(found);
        setEditingTheme(found.theme);
      }
    }
  }, [id, presentations, currentPresentation, setCurrentPresentation, setEditingTheme]);

  useEffect(() => {
    if (titleEditing && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [titleEditing]);

  const handleSaveTitle = useCallback(() => {
    if (presentation && titleValue.trim()) {
      updatePresentation(presentation.id, { title: titleValue.trim() });
    }
    setTitleEditing(false);
  }, [presentation, titleValue, updatePresentation]);

  const navigateSlide = useCallback(
    (direction: number) => {
      const newIndex = currentSlideIndex + direction;
      if (newIndex >= 0 && newIndex < slides.length) {
        setSlideDirection(direction);
        setCurrentSlideIndex(newIndex);
      }
    },
    [currentSlideIndex, slides.length, setCurrentSlideIndex]
  );

  const goToSlide = useCallback(
    (index: number) => {
      setSlideDirection(index > currentSlideIndex ? 1 : -1);
      setCurrentSlideIndex(index);
    },
    [currentSlideIndex, setCurrentSlideIndex]
  );

  const handleAddSlide = useCallback(() => {
    if (!presentation) return;
    const newSlide: Slide = {
      id: generateId(),
      layout: 'content',
      content: { title: 'New Slide', subtitle: '', description: '' },
      order: slides.length,
    };
    updatePresentation(presentation.id, {
      slides: [...slides, newSlide],
    });
    setCurrentSlideIndex(slides.length);
  }, [presentation, slides, updatePresentation, setCurrentSlideIndex]);

  const handleDeleteSlide = useCallback(
    (slideId: string) => {
      if (!presentation || slides.length <= 1) return;
      deleteSlide(presentation.id, slideId);
    },
    [presentation, slides.length, deleteSlide]
  );

  const handleDuplicateSlide = useCallback(
    (slideId: string) => {
      if (!presentation) return;
      duplicateSlide(presentation.id, slideId);
    },
    [presentation, duplicateSlide]
  );

  const handleThemeChange = useCallback(
    (themeName: ThemeName) => {
      if (!presentation) return;
      setEditingTheme(themeName);
      updatePresentation(presentation.id, { theme: themeName });
      setShowThemeDropdown(false);
    },
    [presentation, setEditingTheme, updatePresentation]
  );

  const toggleFullscreen = useCallback(() => {
    if (!fullscreenContainerRef.current) return;
    if (!document.fullscreenElement) {
      fullscreenContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  const enterPresentationMode = useCallback(() => {
    setIsPresenting(true);
    if (fullscreenContainerRef.current) {
      fullscreenContainerRef.current.requestFullscreen().catch(() => {});
    }
  }, [setIsPresenting]);

  const exitPresentationMode = useCallback(() => {
    setIsPresenting(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, [setIsPresenting]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        if (isPresenting) {
          setIsPresenting(false);
        }
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isPresenting, setIsPresenting]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPresenting) {
        if (e.key === 'Escape') {
          exitPresentationMode();
        } else if (e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          navigateSlide(1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          navigateSlide(-1);
        }
        return;
      }

      if (titleEditing) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateSlide(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateSlide(-1);
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          toggleFullscreen();
        } else if (isEditing) {
          setIsEditing(false);
        }
      } else if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresenting, navigateSlide, exitPresentationMode, isFullscreen, toggleFullscreen, isEditing, setIsEditing, titleEditing]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target as Node)) {
        setShowThemeDropdown(false);
      }
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target as Node)) {
        setShowExportDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportSlide = useCallback(async () => {
    if (!currentSlide || !presentation) return;
    setIsExporting('slide');
    try {
      const label = currentSlide.content.title || `Slide ${currentSlideIndex + 1}`;
      const fileName = isReport
        ? `${slugify(presentation.title)}-report.png`
        : `${slugify(presentation.title)}-${slugify(label)}.png`;
      if (exportRef.current) {
        await exportSlideAsPng(exportRef.current, fileName, isReport ? 1.5 : 2);
      }
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(null);
      setShowExportDropdown(false);
    }
  }, [currentSlide, currentSlideIndex, presentation, isReport]);

  const handleExportDeck = useCallback(() => {
    if (!presentation) return;
    downloadJson(
      {
        app: 'DashCraft AI',
        exportedAt: new Date().toISOString(),
        title: presentation.title,
        theme: presentation.theme,
        prompt: presentation.prompt,
        slides: presentation.slides,
      },
      `${slugify(presentation.title)}.json`
    );
    setShowExportDropdown(false);
  }, [presentation]);

  const handleExportPdf = useCallback(() => {
    setShowExportDropdown(false);
    window.print();
  }, []);

  const handleDuplicateDashboard = useCallback(() => {
    if (!presentation) return;
    duplicatePresentation(presentation.id);
  }, [presentation, duplicatePresentation]);

  const handleShareLink = useCallback(async () => {
    if (!presentation) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/present/${presentation.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }, [presentation]);

  const handleRegenerateFromData = useCallback(async () => {
    if (!presentation?.dataPivot) return;
    setIsRegenData(true);
    try {
      const fresh = generatePresentation(presentation.prompt.trim() || presentation.title);
      const withData = applyPivotToDeck(fresh, presentation.dataPivot, 'data');
      updatePresentation(presentation.id, { slides: withData.slides });
    } catch (err) {
      console.error('Re-pivot failed', err);
    } finally {
      setIsRegenData(false);
    }
  }, [presentation, updatePresentation]);

  const handleReportScroll = useCallback(() => {
    const sc = scrollRef.current;
    if (!sc || !currentSlide) return;
    const max = sc.scrollHeight - sc.clientHeight;
    setReportProgress(max > 0 ? sc.scrollTop / max : 0);
    const containerTop = sc.getBoundingClientRect().top;
    const entries = buildReportToc(currentSlide.content);
    let active = '';
    for (const entry of entries) {
      const el = document.getElementById(entry.id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= containerTop + 120) active = entry.id;
    }
    setReportActive(active);
  }, [currentSlide]);

  useEffect(() => {
    if (!isReport) return;
    handleReportScroll();
    const sc = scrollRef.current;
    if (!sc) return;
    sc.addEventListener('scroll', handleReportScroll, { passive: true });
    return () => sc.removeEventListener('scroll', handleReportScroll);
  }, [isReport, handleReportScroll]);

  const scrollToReportSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (!presentation) {
    return (
      <div className="h-screen w-screen flex items-center justify-center" style={{ background: '#f1f5f9' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: '#e2e8f0' }}>
            <Presentation className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Presentation not found</h1>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            The presentation you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const renderEditPanel = () => {
    if (!currentSlide || !isEditing) return null;

    return (
      <motion.div
        initial={{ x: 320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 320, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-80 border-l flex flex-col overflow-hidden shrink-0"
        style={{
          borderColor: '#e2e8f0',
          background: '#ffffff',
        }}
      >
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#e2e8f0' }}>
          <h3 className="text-sm font-semibold text-gray-900">Edit Slide</h3>
          <button
            onClick={() => setIsEditing(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Layout
            </label>
            {isReport ? (
              <div className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 text-gray-700 flex items-center justify-between" style={{ borderColor: '#e2e8f0' }}>
                <span>Single-Page Report</span>
                <span className="text-[10px] font-semibold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Auto</span>
              </div>
            ) : (
              <select
                value={currentSlide.layout}
                onChange={(e) =>
                  updateSlide(presentation.id, currentSlide.id, {
                    layout: e.target.value as SlideLayout,
                  })
                }
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ borderColor: '#e2e8f0' }}
              >
                {layoutOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Title
            </label>
            <input
              type="text"
              value={currentSlide.content.title}
              onChange={(e) =>
                updateSlide(presentation.id, currentSlide.id, {
                  content: { ...currentSlide.content, title: e.target.value },
                })
              }
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ borderColor: '#e2e8f0' }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={currentSlide.content.subtitle || ''}
              onChange={(e) =>
                updateSlide(presentation.id, currentSlide.id, {
                  content: { ...currentSlide.content, subtitle: e.target.value },
                })
              }
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ borderColor: '#e2e8f0' }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={currentSlide.content.description || ''}
              onChange={(e) =>
                updateSlide(presentation.id, currentSlide.id, {
                  content: { ...currentSlide.content, description: e.target.value },
                })
              }
              rows={4}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              style={{ borderColor: '#e2e8f0' }}
            />
          </div>

          {(currentSlide.layout === 'kpi-dashboard' || currentSlide.layout === 'metrics') && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                KPI Values
              </label>
              <div className="space-y-3">
                {(currentSlide.content.kpis || []).map((kpi, idx) => (
                  <div key={idx} className="p-3 border rounded-lg space-y-2" style={{ borderColor: '#e2e8f0', background: '#f9fafb' }}>
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase">Label</label>
                      <input
                        type="text"
                        value={kpi.label}
                        onChange={(e) => {
                          const newKpis = [...(currentSlide.content.kpis || [])];
                          newKpis[idx] = { ...newKpis[idx], label: e.target.value };
                          updateSlide(presentation.id, currentSlide.id, {
                            content: { ...currentSlide.content, kpis: newKpis },
                          });
                        }}
                        className="w-full px-2 py-1 text-xs border rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        style={{ borderColor: '#e2e8f0' }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase">Value</label>
                      <input
                        type="text"
                        value={kpi.value}
                        onChange={(e) => {
                          const newKpis = [...(currentSlide.content.kpis || [])];
                          newKpis[idx] = { ...newKpis[idx], value: e.target.value };
                          updateSlide(presentation.id, currentSlide.id, {
                            content: { ...currentSlide.content, kpis: newKpis },
                          });
                        }}
                        className="w-full px-2 py-1 text-xs border rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        style={{ borderColor: '#e2e8f0' }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase">Change</label>
                      <input
                        type="text"
                        value={kpi.change || ''}
                        onChange={(e) => {
                          const newKpis = [...(currentSlide.content.kpis || [])];
                          newKpis[idx] = { ...newKpis[idx], change: e.target.value };
                          updateSlide(presentation.id, currentSlide.id, {
                            content: { ...currentSlide.content, kpis: newKpis },
                          });
                        }}
                        className="w-full px-2 py-1 text-xs border rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        style={{ borderColor: '#e2e8f0' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSlide.layout === 'image' && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Image
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {IMAGE_PRESETS.map((preset) => {
                  const isActive = currentSlide.content.image?.src === preset.src;
                  return (
                    <button
                      key={preset.src}
                      type="button"
                      onClick={() =>
                        updateSlide(presentation.id, currentSlide.id, {
                          content: {
                            ...currentSlide.content,
                            image: {
                              src: preset.src,
                              caption: currentSlide.content.image?.caption,
                              alt: currentSlide.content.image?.alt,
                            },
                          },
                        })
                      }
                      className={cn(
                        'relative rounded-lg overflow-hidden border-2 aspect-video transition-all',
                        isActive
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-400'
                      )}
                    >
                      <img src={preset.src} alt={preset.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] font-semibold text-white px-1 py-0.5 text-center">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase">Image URL</label>
                <input
                  type="text"
                  value={currentSlide.content.image?.src || ''}
                  onChange={(e) =>
                    updateSlide(presentation.id, currentSlide.id, {
                      content: {
                        ...currentSlide.content,
                        image: { ...(currentSlide.content.image ?? { src: '' }), src: e.target.value },
                      },
                    })
                  }
                  className="w-full px-2 py-1.5 text-xs border rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1"
                  style={{ borderColor: '#e2e8f0' }}
                  placeholder="https://… or /img/…"
                />
              </div>

              <div className="mt-2">
                <label className="text-[10px] text-gray-400 uppercase">Caption</label>
                <input
                  type="text"
                  value={currentSlide.content.image?.caption || ''}
                  onChange={(e) =>
                    updateSlide(presentation.id, currentSlide.id, {
                      content: {
                        ...currentSlide.content,
                        image: { ...(currentSlide.content.image ?? { src: '' }), caption: e.target.value },
                      },
                    })
                  }
                  className="w-full px-2 py-1.5 text-xs border rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1"
                  style={{ borderColor: '#e2e8f0' }}
                  placeholder="Optional caption"
                />
              </div>
            </div>
          )}

          {currentSlide.layout === 'article' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article Sections
                </label>
                <button
                  type="button"
                  onClick={() =>
                    updateSlide(presentation.id, currentSlide.id, {
                      content: {
                        ...currentSlide.content,
                        sections: [
                          ...(currentSlide.content.sections || []),
                          { heading: 'New Section', body: '' },
                        ],
                      },
                    })
                  }
                  className="text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-3">
                {(currentSlide.content.sections || []).map((section, idx) => (
                  <div key={idx} className="p-3 border rounded-lg space-y-2" style={{ borderColor: '#e2e8f0', background: '#f9fafb' }}>
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase">Heading</label>
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => {
                          const newSections = [...(currentSlide.content.sections || [])];
                          newSections[idx] = { ...newSections[idx], heading: e.target.value };
                          updateSlide(presentation.id, currentSlide.id, {
                            content: { ...currentSlide.content, sections: newSections },
                          });
                        }}
                        className="w-full px-2 py-1 text-xs border rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        style={{ borderColor: '#e2e8f0' }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase">Body</label>
                      <textarea
                        rows={3}
                        value={section.body}
                        onChange={(e) => {
                          const newSections = [...(currentSlide.content.sections || [])];
                          newSections[idx] = { ...newSections[idx], body: e.target.value };
                          updateSlide(presentation.id, currentSlide.id, {
                            content: { ...currentSlide.content, sections: newSections },
                          });
                        }}
                        className="w-full px-2 py-1 text-xs border rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                        style={{ borderColor: '#e2e8f0' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newSections = [...(currentSlide.content.sections || [])];
                        newSections.splice(idx, 1);
                        updateSlide(presentation.id, currentSlide.id, {
                          content: { ...currentSlide.content, sections: newSections },
                        });
                      }}
                      className="text-[11px] font-medium text-red-500 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {(currentSlide.content.sections || []).length === 0 && (
                  <p className="text-xs text-gray-400">No sections yet. Use the “+ Add” button to start writing.</p>
                )}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                Theme Colors
              </label>
              {(presentation?.themeOverrides && Object.keys(presentation.themeOverrides).length > 0) && (
                <button
                  onClick={() => updatePresentation(presentation.id, { themeOverrides: undefined })}
                  className="text-[11px] font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mb-3">
              Customize the base theme. Colors apply to the whole deck.
            </p>
            <div className="space-y-2">
              {[
                { key: 'primary', label: 'Primary' },
                { key: 'secondary', label: 'Secondary' },
                { key: 'accent', label: 'Accent' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3">
                  <label className="text-xs text-gray-600 w-20">{label}</label>
                  <input
                    type="color"
                    value={activeTheme.colors[key as keyof typeof activeTheme.colors]}
                    onChange={(e) => {
                      if (!presentation) return;
                      updatePresentation(presentation.id, {
                        themeOverrides: {
                          ...(presentation.themeOverrides || {}),
                          [key]: e.target.value,
                        },
                      });
                    }}
                    className="w-8 h-8 rounded-lg border cursor-pointer"
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderToolbar = () => (
    <div
      className="h-14 border-b flex items-center px-5 gap-3 shrink-0"
      style={{
        borderColor: '#e2e8f0',
        background: '#ffffff',
      }}
    >
      <button
        onClick={() => navigate('/')}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all"
        title="Back to Home"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="w-px h-6 bg-gray-200" />

      <div className="flex items-center gap-2 min-w-0">
        <Presentation className="w-4 h-4 text-blue-500 shrink-0" />
        {titleEditing ? (
          <input
            ref={titleInputRef}
            type="text"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveTitle();
              if (e.key === 'Escape') {
                setTitleValue(presentation.title);
                setTitleEditing(false);
              }
            }}
            className="text-sm font-semibold text-gray-900 border-b-2 border-blue-500 bg-transparent outline-none px-1 py-0.5 min-w-[200px]"
          />
        ) : (
          <button
            onClick={() => setTitleEditing(true)}
            className="text-sm font-semibold text-gray-900 hover:text-blue-600 truncate max-w-[280px] transition-colors"
            title="Click to edit title"
          >
            {presentation.title}
          </button>
        )}
      </div>

      <div className="flex-1" />

      <div className="relative" ref={themeDropdownRef}>
        <button
          onClick={() => setShowThemeDropdown(!showThemeDropdown)}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Palette className="w-3.5 h-3.5" />
          {getTheme(presentation.theme).label}
        </button>
        <AnimatePresence>
          {showThemeDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 w-52 bg-white border rounded-xl shadow-xl z-50 py-1 overflow-hidden"
              style={{ borderColor: '#e2e8f0' }}
            >
              {themeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleThemeChange(opt.value)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 text-xs font-medium transition-colors text-left',
                    presentation.theme === opt.value
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 shrink-0"
                    style={{
                      background: getTheme(opt.value).colors.primary,
                      borderColor: presentation.theme === opt.value ? '#2563eb' : 'transparent',
                    }}
                  />
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-px h-6 bg-gray-200" />

      <div className="relative" ref={exportDropdownRef}>
        <button
          onClick={() => setShowExportDropdown(!showExportDropdown)}
          disabled={isExporting !== null}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-60"
        >
          {isExporting !== null ? (
            <div className="w-3.5 h-3.5 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          {isExporting === 'slide' ? 'Exporting…' : isExporting === 'deck' ? 'Exporting…' : 'Export'}
        </button>
        <AnimatePresence>
          {showExportDropdown && isExporting === null && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 w-56 bg-white border rounded-xl shadow-xl z-50 py-1 overflow-hidden"
              style={{ borderColor: '#e2e8f0' }}
            >
              <button
                onClick={handleExportSlide}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 text-left transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-blue-500" />
                <span className="flex flex-col">
                  <span>{isReport ? 'Export full report' : 'Export current slide'}</span>
                  <span className="text-[10px] text-gray-400 font-normal">High-res {isReport ? 'PNG' : '16:9 PNG'}</span>
                </span>
              </button>
              <button
                onClick={handleExportPdf}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 text-left transition-colors"
              >
                <Printer className="w-4 h-4 text-violet-500" />
                <span className="flex flex-col">
                  <span>Print / Save as PDF</span>
                  <span className="text-[10px] text-gray-400 font-normal">All slides, one page each</span>
                </span>
              </button>
              <button
                onClick={handleExportDeck}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 text-left transition-colors"
              >
                <FileJson className="w-4 h-4 text-emerald-500" />
                <span className="flex flex-col">
                  <span>Export deck data</span>
                  <span className="text-[10px] text-gray-400 font-normal">JSON backup</span>
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {presentation?.dataPivot && (
        <button
          onClick={handleRegenerateFromData}
          disabled={isRegenData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-700 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors disabled:opacity-60"
          title="Rebuild this report from the saved data pivot"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRegenData ? 'animate-spin' : ''}`} />
          {isRegenData ? 'Re-pivoting…' : 'Re-pivot'}
        </button>
      )}

      <button
        onClick={handleDuplicateDashboard}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all"
        title="Duplicate dashboard"
        aria-label="Duplicate dashboard"
      >
        <Copy className="w-4 h-4" />
      </button>

      <button
        onClick={handleShareLink}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all"
        title={copied ? 'Link copied!' : 'Copy share link'}
        aria-label="Copy share link"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4" />}
      </button>

      <div className="w-px h-6 bg-gray-200" />

      <button
        onClick={() => setIsEditing(!isEditing)}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
          isEditing
            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
      >
        {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
        {isEditing ? 'Preview' : 'Edit'}
      </button>

      <button
        onClick={toggleFullscreen}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all"
        title={isFullscreen ? 'Exit Fullscreen (F11)' : 'Fullscreen (F11)'}
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>

      <button
        onClick={enterPresentationMode}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-200/50"
      >
        <Presentation className="w-3.5 h-3.5" />
        Present
      </button>
    </div>
  );

  const renderSidebar = () => (
    <div
      className="w-[280px] shrink-0 flex flex-col overflow-hidden"
      style={{ background: '#0f172a' }}
    >
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Slides</h3>
          <span className="text-xs text-white/40 font-medium bg-white/10 px-2 py-0.5 rounded-full">
            {slides.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {slides.map((slide, index) => (
            <motion.div
              key={slide.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={() => goToSlide(index)}
              className={cn(
                'group relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200',
                currentSlideIndex === index
                  ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0f172a]'
                  : 'ring-1 ring-white/10 hover:ring-white/25'
              )}
            >
              <div className="relative w-full aspect-[16/9] bg-white overflow-hidden rounded-lg">
                <SlideRenderer slide={slide} theme={activeTheme} isThumbnail={true} />
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-3 h-3 text-white/30" />
                  <span className="text-[10px] font-bold text-white/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {isEditing && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateSlide(slide.id);
                      }}
                      className="p-1 rounded hover:bg-white/20 text-white/60 hover:text-white transition-colors"
                      title="Duplicate Slide"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {slides.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSlide(slide.id);
                        }}
                        className="p-1 rounded hover:bg-red-500/30 text-white/60 hover:text-red-400 transition-colors"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isEditing && (
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleAddSlide}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/10 hover:border-white/20"
          >
            <Plus className="w-4 h-4" />
            Add Slide
          </button>
        </div>
      )}
    </div>
  );

  const renderMainViewer = () => {
    if (isReport) {
      const reportToc = currentSlide ? buildReportToc(currentSlide.content) : [];
      return (
        <div className="flex-1 flex flex-col overflow-hidden min-w-0" style={{ background: '#f1f5f9' }}>
          <div
            className="flex-1 overflow-y-auto relative"
            ref={scrollRef}
            onScroll={handleReportScroll}
          >
            <div className="sticky top-0 z-30 h-1 bg-black/5">
              <div
                className="h-full transition-[width] duration-150"
                style={{ width: `${Math.round(reportProgress * 100)}%`, background: activeTheme.colors.primary }}
              />
            </div>

            {reportToc.length > 1 && (
              <div className="lg:hidden sticky top-1 z-30 px-4 py-2 border-b bg-white/95 backdrop-blur-md flex items-center gap-1.5 overflow-x-auto">
                {reportToc.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => scrollToReportSection(entry.id)}
                    className={cn(
                      'shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors',
                      reportActive === entry.id
                        ? 'text-white'
                        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                    )}
                    style={reportActive === entry.id ? { background: activeTheme.colors.primary } : undefined}
                  >
                    {entry.index} · {entry.label}
                  </button>
                ))}
              </div>
            )}

            <div className="max-w-6xl mx-auto my-8 px-4 md:px-8" ref={fullscreenContainerRef}>
              {currentSlide && (
                <div ref={exportRef} className="rounded-2xl shadow-xl overflow-hidden">
                  <SlideRenderer slide={currentSlide} theme={activeTheme} />
                </div>
              )}
            </div>
          </div>

          {reportToc.length > 0 && (
            <div className="hidden xl:block fixed right-5 top-20 bottom-24 z-40 w-60 pointer-events-none">
              <div
                className="rounded-2xl border bg-white/95 backdrop-blur-md shadow-lg p-4 max-h-full overflow-y-auto pointer-events-auto"
                style={{ borderColor: '#e2e8f0' }}
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                  On this page
                </p>
                <ul className="space-y-1">
                  {reportToc.map((entry) => (
                    <li key={entry.id}>
                      <button
                        onClick={() => scrollToReportSection(entry.id)}
                        className={cn(
                          'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors',
                          reportActive === entry.id
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        <span className="w-5 shrink-0 text-[10px] font-bold opacity-60">{entry.index}</span>
                        <span className="truncate text-[13px]">{entry.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div
            className="h-11 border-t flex items-center justify-center gap-4 shrink-0"
            style={{ borderColor: '#e2e8f0', background: '#ffffff' }}
          >
            <span className="text-xs text-gray-400 font-medium">
              <span className="text-gray-900 font-semibold">1</span>
              {' / '}
              {slides.length} · Single-page dashboard
            </span>
          </div>
        </div>
      );
    }

    return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0" style={{ background: '#f1f5f9' }}>
      <div className="flex-1 flex items-center justify-center px-6 py-6 relative min-h-0">
        <button
          onClick={() => navigateSlide(-1)}
          disabled={currentSlideIndex === 0}
          className={cn(
            'absolute left-3 z-10 p-2.5 rounded-full transition-all',
            currentSlideIndex === 0
              ? 'bg-gray-200/50 text-gray-300 cursor-not-allowed'
              : 'bg-white text-gray-600 hover:text-gray-900 shadow-lg hover:shadow-xl hover:scale-110'
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="w-full max-w-6xl relative" ref={fullscreenContainerRef}>
          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              key={currentSlide?.id || currentSlideIndex}
              custom={slideDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', damping: 30, stiffness: 300 },
                opacity: { duration: 0.25 },
                scale: { duration: 0.25 },
              }}
              className="w-full"
            >
              {currentSlide && (
                <div ref={exportRef} className="w-full">
                  <SlideRenderer slide={currentSlide} theme={activeTheme} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={() => navigateSlide(1)}
          disabled={currentSlideIndex === slides.length - 1}
          className={cn(
            'absolute right-3 z-10 p-2.5 rounded-full transition-all',
            currentSlideIndex === slides.length - 1
              ? 'bg-gray-200/50 text-gray-300 cursor-not-allowed'
              : 'bg-white text-gray-600 hover:text-gray-900 shadow-lg hover:shadow-xl hover:scale-110'
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="h-11 border-t flex items-center justify-center gap-4 shrink-0" style={{ borderColor: '#e2e8f0', background: '#ffffff' }}>
        <span className="text-xs text-gray-400 font-medium">
          <span className="text-gray-900 font-semibold">{currentSlideIndex + 1}</span>
          {' / '}
          {slides.length}
        </span>
        <div className="flex items-center gap-1">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={cn(
                'rounded-full transition-all duration-300',
                i === currentSlideIndex
                  ? 'w-6 h-2 bg-blue-600'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              )}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400 font-medium">
          Use ← → keys to navigate
        </span>
      </div>
    </div>
  );
  };

  const renderPresentationMode = () => (
    <AnimatePresence>
      {isPresenting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'fixed inset-0 z-[9999] bg-black',
            isReport ? 'overflow-y-auto' : 'flex items-center justify-center'
          )}
        >
          <div className="w-full h-full relative" ref={fullscreenContainerRef}>
            <AnimatePresence mode="wait" custom={slideDirection}>
              <motion.div
                key={currentSlide?.id || currentSlideIndex}
                custom={slideDirection}
                variants={{
                  enter: (direction: number) => ({
                    x: direction > 0 ? '100%' : '-100%',
                    opacity: 0,
                  }),
                  center: {
                    x: 0,
                    opacity: 1,
                  },
                  exit: (direction: number) => ({
                    x: direction > 0 ? '-100%' : '100%',
                    opacity: 0,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', damping: 30, stiffness: 200 },
                  opacity: { duration: 0.2 },
                }}
                className={cn(
                  'p-8',
                  isReport ? 'relative' : 'absolute inset-0 flex items-center justify-center'
                )}
              >
                {currentSlide && (
                  <div className={cn('w-full', isReport ? 'max-w-6xl mx-auto' : 'max-w-7xl')}>
                    <SlideRenderer slide={currentSlide} theme={activeTheme} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <button
              onClick={exitPresentationMode}
              className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white backdrop-blur-sm transition-all"
              title="Exit (ESC)"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10"
              >
                <button
                  onClick={() => navigateSlide(-1)}
                  disabled={currentSlideIndex === 0}
                  className={cn(
                    'p-1.5 rounded-full transition-colors',
                    currentSlideIndex === 0 ? 'text-white/20 cursor-not-allowed' : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-semibold text-white min-w-[60px] text-center">
                  {currentSlideIndex + 1}
                  <span className="text-white/50"> / </span>
                  {slides.length}
                </span>
                <button
                  onClick={() => navigateSlide(1)}
                  disabled={currentSlideIndex === slides.length - 1}
                  className={cn(
                    'p-1.5 rounded-full transition-colors',
                    currentSlideIndex === slides.length - 1 ? 'text-white/20 cursor-not-allowed' : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            </div>

            <div className="absolute bottom-6 right-6 z-50">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center gap-1"
              >
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'rounded-full transition-all duration-300',
                      i === currentSlideIndex
                        ? 'w-5 h-1.5 bg-white'
                        : 'w-1.5 h-1.5 bg-white/25'
                    )}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 print:hidden">
        {renderToolbar()}

        <div className="flex-1 flex overflow-hidden min-h-0">
          {!isReport && renderSidebar()}
          {renderMainViewer()}
          <AnimatePresence>
            {isEditing && renderEditPanel()}
          </AnimatePresence>
        </div>

        {renderPresentationMode()}
      </div>

      {presentation && (
        <div id="print-deck" className="hidden print:block" aria-hidden="true">
          {slides.map((slide) => (
            <div key={slide.id} className="print-break-after w-[1024px] mx-auto">
              <SlideRenderer slide={slide} theme={theme} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
