import { generateId } from '@/lib/utils';
import type { Presentation, Slide, SlideLayout } from '@/types';
import { parseSpreadsheet, type DataWorkbook } from '@/lib/excel';

export interface UploadedDeck {
  kind: 'deck';
  name: string;
  deck: Presentation;
}

export interface UploadedDocument {
  kind: 'document';
  name: string;
  size: number;
  text: string;
}

export interface UploadedData {
  kind: 'data';
  name: string;
  workbook: DataWorkbook;
}

export type ExtractResult = UploadedDeck | UploadedDocument | UploadedData;

const MAX_PDF_PAGES = 40;
const MAX_DOC_CHARS = 24000;

function ext(name: string): string {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

async function readPdf(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();

  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const parts: string[] = [];
  const pages = Math.min(doc.numPages, MAX_PDF_PAGES);
  try {
    for (let i = 1; i <= pages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      parts.push(
        content.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ')
          .replace(/\s{2,}/g, ' ')
      );
    }
  } finally {
    doc.destroy();
  }
  return parts.join('\n');
}

function toDeck(raw: unknown): Presentation | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (!Array.isArray(r.slides) || r.slides.length === 0) return null;

  const looksLikeDeck =
    typeof r.title === 'string' &&
    r.slides.every(
      (s) =>
        !!s &&
        typeof s === 'object' &&
        'layout' in s &&
        'content' in s &&
        'order' in s
    );
  if (!looksLikeDeck) return null;

  const slides: Slide[] = (r.slides as Array<Record<string, unknown>>).map((s, i) => ({
    id: typeof s.id === 'string' && s.id ? s.id : generateId(),
    layout: (s.layout as SlideLayout) ?? 'title',
    content: (s.content as Slide['content']) ?? { heading: '', description: '' },
    order: typeof s.order === 'number' ? s.order : i,
  }));

  const now = new Date().toISOString();
  return {
    id: typeof r.id === 'string' && r.id ? r.id : generateId(),
    title: String(r.title),
    prompt: typeof r.prompt === 'string' ? r.prompt : String(r.title),
    slides,
    theme: typeof r.theme === 'string' ? (r.theme as Presentation['theme']) : 'corporate',
    themeOverrides: r.themeOverrides as Presentation['themeOverrides'],
    createdAt: typeof r.createdAt === 'string' ? r.createdAt : now,
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : now,
  };
}

export async function extractFileContent(file: File): Promise<ExtractResult> {
  const e = ext(file.name);

  if (e === 'pdf') {
    const text = (await readPdf(file)).slice(0, MAX_DOC_CHARS);
    return { kind: 'document', name: file.name, size: file.size, text };
  }

  if (e === 'xlsx' || e === 'xls' || e === 'ods' || e === 'csv') {
    try {
      const workbook = await parseSpreadsheet(file);
      if (workbook.sheets.length > 0) {
        return { kind: 'data', name: file.name, workbook };
      }
    } catch {
      /* fall through to plain document text */
    }
  }

  const raw = await file.text();

  if (e === 'json') {
    try {
      const deck = toDeck(JSON.parse(raw));
      if (deck) return { kind: 'deck', name: file.name, deck };
    } catch {
      /* treat as plain document text */
    }
  }

  return { kind: 'document', name: file.name, size: file.size, text: raw.slice(0, MAX_DOC_CHARS) };
}