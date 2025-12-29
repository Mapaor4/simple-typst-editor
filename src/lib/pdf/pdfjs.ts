import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

let pdfjsPromise: Promise<typeof import('pdfjs-dist')> | null = null;

export async function getPdfjs() {
	if (!pdfjsPromise) {
		pdfjsPromise = import('pdfjs-dist').then((mod) => {
			mod.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
			// PDF.js 的 viewer（`pdfjs-dist/web/pdf_viewer.mjs`）会从 `globalThis.pdfjsLib` 读取核心 API。
			(globalThis as unknown as { pdfjsLib?: typeof import('pdfjs-dist') }).pdfjsLib = mod;
			return mod;
		});
	}

	return pdfjsPromise;
}
