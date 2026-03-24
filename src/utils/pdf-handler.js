import { PDFDocument, degrees } from 'pdf-lib';

/**
 * PDFHandler: Core logic for PDF manipulation, inspired by BentoPDF.
 */
export const PDFHandler = {
    /**
     * Helper to load and configure pdfjs-dist
     */
    async getPDFJS() {
        const pdfjs = await import('pdfjs-dist/build/pdf.min.mjs');
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        return pdfjs;
    },

    /**
     * Loads multiple PDF files and extracts their pages into a unified state.
     * @param {File[]} files - An array of File objects.
     * @returns {Promise<Object[]>} - A list of page objects { id, file, pageIndex, rotation }.
     */
    async loadPagesFromFiles(files) {
        let allPages = [];
        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pageCount = pdfDoc.getPageCount();
            
            for (let i = 0; i < pageCount; i++) {
                allPages.push({
                    id: `${file.name}-${i}-${Date.now()}`,
                    file: file,
                    fileName: file.name,
                    pageIndex: i, // 0-indexed
                    rotation: 0,  // degrees
                    isSelected: false
                });
            }
        }
        return allPages;
    },

    /**
     * Generates a new PDF from a list of selected pages.
     * @param {Object[]} pages - The pages to include in the new PDF.
     * @returns {Promise<Uint8Array>}
     */
    async generatePdfFromPages(pages) {
        const newPdf = await PDFDocument.create();
        
        // Group pages by source file to minimize PDFDocument.load calls
        const fileMap = new Map();
        for (const page of pages) {
            if (!fileMap.has(page.file)) {
                fileMap.set(page.file, []);
            }
            fileMap.get(page.file).push(page);
        }

        for (const [file, filePages] of fileMap.entries()) {
            const arrayBuffer = await file.arrayBuffer();
            const sourcePdf = await PDFDocument.load(arrayBuffer);
            
            // Extract the required page indices from this file
            const indicesToCopy = filePages.map(p => p.pageIndex);
            const copiedPages = await newPdf.copyPages(sourcePdf, indicesToCopy);
            
            // Add copied pages to the new document and apply rotations
            copiedPages.forEach((pdfPage, idx) => {
                const originalPageData = filePages[idx];
                if (originalPageData.rotation !== 0) {
                    pdfPage.setRotation(degrees(originalPageData.rotation));
                }
                newPdf.addPage(pdfPage);
            });
        }

        return await newPdf.save();
    },

    /**
     * Splits a PDF into multiple documents based on page ranges.
     * @param {File} file - The source file.
     * @param {string} rangeText - e.g., "1-2, 5-10"
     * @returns {Promise<Uint8Array[]>}
     */
    async splitPdfByRanges(file, rangeText) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const totalPages = pdfDoc.getPageCount();
        
        const ranges = rangeText.split(',').map(r => r.trim()).filter(r => r);
        const results = [];

        for (const range of ranges) {
            const newPdf = await PDFDocument.create();
            let start, end;

            if (range.includes('-')) {
                [start, end] = range.split('-').map(n => parseInt(n));
            } else {
                start = end = parseInt(range);
            }

            if (isNaN(start) || isNaN(end)) continue;

            const indices = [];
            for (let i = start; i <= end; i++) {
                if (i >= 1 && i <= totalPages) {
                    indices.push(i - 1);
                }
            }

            if (indices.length > 0) {
                const copiedPages = await newPdf.copyPages(pdfDoc, indices);
                copiedPages.forEach(p => newPdf.addPage(p));
                results.push(await newPdf.save());
            }
        }
        return results;
    },

    /**
     * Compresses a PDF by rasterizing pages (optimized for size/privacy like BentoPDF).
     * @param {File} file 
     * @param {number} quality - 0 to 1
     * @param {number} scale - 0 to 1
     * @returns {Promise<Uint8Array>}
     */
    async compressPdf(file, quality = 0.5, scale = 1.0) {
        // This usually requires pdfjs-dist for rendering and then pdf-lib for re-wrapping
        // Replicating a simple version of the rasterization-based compression
        const pdfjs = await this.getPDFJS();
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: buffer }).promise;
        const newPdf = await PDFDocument.create();

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: ctx, viewport }).promise;
            
            const imgData = canvas.toDataURL('image/jpeg', quality);
            const imgBytes = await fetch(imgData).then(r => r.arrayBuffer());
            const jpgImage = await newPdf.embedJpg(imgBytes);

            const newPage = newPdf.addPage([viewport.width, viewport.height]);
            newPage.drawImage(jpgImage, {
                x: 0,
                y: 0,
                width: viewport.width,
                height: viewport.height,
            });
        }

        return await newPdf.save();
    }
};
