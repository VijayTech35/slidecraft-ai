import { toPng } from 'html-to-image';

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 60) || 'presentation'
  );
}

/**
 * Export a slide DOM node as a high-resolution PNG image.
 * The node should be a 16:9 slide (aspect-[16/9]) slide element.
 */
export async function exportSlideAsPng(
  node: HTMLElement,
  filename: string,
  pixelRatio = 2
): Promise<void> {
  if (!node) return;
  const backgroundColor = window.getComputedStyle(node).backgroundColor;
  const dataUrl = await toPng(node, {
    pixelRatio,
    cacheBust: true,
    backgroundColor,
  });
  const a = document.createElement('a');
  a.download = filename;
  a.href = dataUrl;
  a.click();
}

export function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
