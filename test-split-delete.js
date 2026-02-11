
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function testSplitDelete() {
    try {
        const filePath = 'e:/Código/Github/Tools/src/teste/4000324-53.2026.8.26.0084.PDF';
        const fileBuffer = fs.readFileSync(filePath);
        console.log(`Original file size: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`);

        const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
        const totalPages = pdfDoc.getPageCount();
        console.log(`Total pages: ${totalPages}`);

        // Approach 2: Delete unwanted pages
        // We want to keep page 0 (1st page). Remove 1 to totalPages-1.
        // Note: removePage index shifts. It's better to remove from end to start.
        for (let i = totalPages - 1; i > 0; i--) {
            pdfDoc.removePage(i);
        }

        const newPdfBytes = await pdfDoc.save();
        const newSize = newPdfBytes.length / 1024 / 1024;
        console.log(`Split (Delete approach, Page 1 only) size: ${newSize.toFixed(2)} MB`);

        if ((newPdfBytes.length / fileBuffer.length) > 0.8) {
            console.log('FAILURE AGAIN: File size did not decrease significantly.');
        } else {
            console.log('SUCCESS: File size decreased significantly!');
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

testSplitDelete();
