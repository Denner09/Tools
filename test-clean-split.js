
import fs from 'fs';
import { PDFDocument, PDFName } from 'pdf-lib';

async function testCleanSplit() {
    try {
        const filePath = 'e:/Código/Github/Tools/src/teste/4000324-53.2026.8.26.0084.PDF';
        const fileBuffer = fs.readFileSync(filePath);
        console.log(`Original file size: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`);

        const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });

        // CLEANUP: Remove potentially huge global structures
        const catalog = pdfDoc.catalog; // This gets the PDFDict for Catalog

        // Remove Outlines (Bookmarks)
        catalog.delete(PDFName.of('Outlines'));
        
        // Remove Names (Embedded Files, JS, etc.)
        catalog.delete(PDFName.of('Names'));

        // Remove AcroForm (Interactive Forms)
        catalog.delete(PDFName.of('AcroForm'));

        // Also remove Metadata? Sometimes helps.
        catalog.delete(PDFName.of('Metadata'));
        
        // Remove OpenAction?
        catalog.delete(PDFName.of('OpenAction'));

        // Now save this "cleaned" doc
        // Actually, let's try to copy page 0 from this cleaned doc to a NEW doc.
        // Or just save the cleaned doc directly (after deleting other pages).
        
        // Let's try "Delete Pages approach" on cleaned doc.
        const totalPages = pdfDoc.getPageCount();
        for (let i = totalPages - 1; i > 0; i--) {
            pdfDoc.removePage(i);
        }

        const newPdfBytes = await pdfDoc.save();
        const newSize = newPdfBytes.length / 1024 / 1024;
        console.log(`Split (Cleaned + Delete approach, Page 1 only) size: ${newSize.toFixed(2)} MB`);
        
        // Also try "Copy Pages approach" from cleaned doc to fresh doc
        const freshPdf = await PDFDocument.create();
        const [page0] = await freshPdf.copyPages(pdfDoc, [0]);
        freshPdf.addPage(page0);
        
        const freshBytes = await freshPdf.save();
        const freshSize = freshBytes.length / 1024 / 1024;
        console.log(`Split (Cleaned + Copy approach, Page 1 only) size: ${freshSize.toFixed(2)} MB`);

    } catch (e) {
        console.error('Error:', e);
    }
}

testCleanSplit();
