import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Presentation, ThemeName } from '@/types';
import { generateId } from '@/lib/utils';

interface AppState {
  presentations: Presentation[];
  currentPresentation: Presentation | null;
  currentSlideIndex: number;
  isGenerating: boolean;
  isEditing: boolean;
  isPresenting: boolean;
  editingTheme: ThemeName;
  prompt: string;

  setPrompt: (prompt: string) => void;
  addPresentation: (p: Presentation) => void;
  duplicatePresentation: (id: string) => string | null;
  setCurrentPresentation: (p: Presentation | null) => void;
  setCurrentSlideIndex: (i: number) => void;
  setIsGenerating: (v: boolean) => void;
  setIsEditing: (v: boolean) => void;
  setIsPresenting: (v: boolean) => void;
  setEditingTheme: (t: ThemeName) => void;
  updatePresentation: (id: string, updates: Partial<Presentation>) => void;
  deletePresentation: (id: string) => void;
  updateSlide: (presentationId: string, slideId: string, content: Partial<Presentation['slides'][0]>) => void;
  reorderSlides: (presentationId: string, fromIndex: number, toIndex: number) => void;
  deleteSlide: (presentationId: string, slideId: string) => void;
  duplicateSlide: (presentationId: string, slideId: string) => void;
  reset: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      presentations: [],
      currentPresentation: null,
      currentSlideIndex: 0,
      isGenerating: false,
      isEditing: false,
      isPresenting: false,
      editingTheme: 'corporate',
      prompt: '',

      setPrompt: (prompt) => set({ prompt }),

      addPresentation: (p) => {
        set((state) => ({
          presentations: [...state.presentations, p],
          currentPresentation: p,
          currentSlideIndex: 0,
        }));
      },

      setCurrentPresentation: (p) => set({ currentPresentation: p, currentSlideIndex: 0 }),

      duplicatePresentation: (id) => {
        let newId: string | null = null;
        set((state) => {
          const source = state.presentations.find((p) => p.id === id);
          if (!source) return state;
          newId = generateId();
          const now = new Date().toISOString();
          const copy: Presentation = {
            ...source,
            id: newId,
            title: `${source.title} (Copy)`,
            slides: source.slides.map((s) => ({
              ...s,
              id: generateId(),
              content: JSON.parse(JSON.stringify(s.content)) as typeof s.content,
            })),
            createdAt: now,
            updatedAt: now,
          };
          return {
            presentations: [copy, ...state.presentations],
            currentPresentation: copy,
            currentSlideIndex: 0,
          };
        });
        return newId;
      },
      setCurrentSlideIndex: (i) => set({ currentSlideIndex: i }),
      setIsGenerating: (v) => set({ isGenerating: v }),
      setIsEditing: (v) => set({ isEditing: v }),
      setIsPresenting: (v) => set({ isPresenting: v }),
      setEditingTheme: (t) => set({ editingTheme: t }),

      updatePresentation: (id, updates) => {
        set((state) => {
          const presentations = state.presentations.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          );
          const current = state.currentPresentation;
          return {
            presentations,
            currentPresentation: current?.id === id
              ? { ...current, ...updates, updatedAt: new Date().toISOString() }
              : current,
          };
        });
      },

      deletePresentation: (id) => {
        set((state) => ({
          presentations: state.presentations.filter((p) => p.id !== id),
          currentPresentation: state.currentPresentation?.id === id ? null : state.currentPresentation,
        }));
      },

      updateSlide: (presentationId, slideId, content) => {
        set((state) => {
          const presentations = state.presentations.map((p) => {
            if (p.id !== presentationId) return p;
            return {
              ...p,
              slides: p.slides.map((s) => (s.id === slideId ? { ...s, ...content, content: { ...s.content, ...(content.content || {}) } } : s)),
              updatedAt: new Date().toISOString(),
            };
          });
          const current = state.currentPresentation;
          return {
            presentations,
            currentPresentation: current?.id === presentationId
              ? {
                  ...current,
                  slides: current.slides.map((s) =>
                    s.id === slideId ? { ...s, ...content, content: { ...s.content, ...(content.content || {}) } } : s
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : current,
          };
        });
      },

      reorderSlides: (presentationId, fromIndex, toIndex) => {
        set((state) => {
          const presentations = state.presentations.map((p) => {
            if (p.id !== presentationId) return p;
            const slides = [...p.slides];
            const [removed] = slides.splice(fromIndex, 1);
            slides.splice(toIndex, 0, removed);
            return { ...p, slides: slides.map((s, i) => ({ ...s, order: i })), updatedAt: new Date().toISOString() };
          });
          const current = state.currentPresentation;
          return {
            presentations,
            currentPresentation: current?.id === presentationId
              ? { ...current, slides: presentations.find((p) => p.id === presentationId)!.slides, updatedAt: new Date().toISOString() }
              : current,
          };
        });
      },

      deleteSlide: (presentationId, slideId) => {
        set((state) => {
          const presentations = state.presentations.map((p) => {
            if (p.id !== presentationId) return p;
            return {
              ...p,
              slides: p.slides.filter((s) => s.id !== slideId).map((s, i) => ({ ...s, order: i })),
              updatedAt: new Date().toISOString(),
            };
          });
          const current = state.currentPresentation;
          if (current?.id === presentationId) {
            const updated = presentations.find((p) => p.id === presentationId)!;
            const nextIndex = Math.min(state.currentSlideIndex, updated.slides.length - 1);
            return {
              presentations,
              currentPresentation: updated,
              currentSlideIndex: Math.max(nextIndex, 0),
            };
          }
          return { presentations };
        });
      },

      duplicateSlide: (presentationId, slideId) => {
        set((state) => {
          const presentations = state.presentations.map((p) => {
            if (p.id !== presentationId) return p;
            const slideIndex = p.slides.findIndex((s) => s.id === slideId);
            if (slideIndex === -1) return p;
            const original = p.slides[slideIndex];
            const duplicate = {
              ...original,
              id: generateId(),
              content: { ...original.content },
              order: slideIndex + 1,
            };
            const slides = [...p.slides];
            slides.splice(slideIndex + 1, 0, duplicate);
            return { ...p, slides: slides.map((s, i) => ({ ...s, order: i })), updatedAt: new Date().toISOString() };
          });
          const current = state.currentPresentation;
          return {
            presentations,
            currentPresentation: current?.id === presentationId
              ? { ...current, slides: presentations.find((p) => p.id === presentationId)!.slides, updatedAt: new Date().toISOString() }
              : current,
          };
        });
      },

      reset: () =>
        set({
          presentations: [],
          currentPresentation: null,
          currentSlideIndex: 0,
          isGenerating: false,
          isEditing: false,
          isPresenting: false,
          editingTheme: 'corporate',
          prompt: '',
        }),
    }),
    {
      name: 'slidecraft-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Only persist the durable data; keep transient UI state out of storage.
      partialize: (state) => ({
        presentations: state.presentations,
      }),
      // One-time migration from the legacy raw 'presentations' key so existing
      // decks aren't lost when moving to the versioned persist bucket.
      migrate: (persisted, version) => {
        if (version !== 1) {
          try {
            const legacy = localStorage.getItem('presentations');
            if (legacy) {
              const presentations = JSON.parse(legacy);
              if (Array.isArray(presentations)) {
                return { presentations };
              }
            }
          } catch {
            /* ignore corrupt legacy data */
          }
        }
        return persisted as any;
      },
    }
  )
);
