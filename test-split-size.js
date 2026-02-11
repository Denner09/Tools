
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function testSplit() {
    try {
        const filePath = 'e:/Código/Github/Tools/src/teste/4000324-53.2026.8.26.0084.PDF'; // Use absolute path if easier
        if (!fs.existsSync(filePath)) {
            console.log('File not found:', filePath);
            // List teste folder to debug
            try {
                const files = fs.readdirSync('e:/Código/Github/Tools/src/teste');
                console.log('Files in src/teste:', files);
            } catch (err) {
                 console.log('Cannot list src/teste:', err);
            }
            return;
        }

        const fileBuffer = fs.readFileSync(filePath);
        console.log(`Original file size: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`);

        const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
        const totalPages = pdfDoc.getPageCount();
        console.log(`Total pages: ${totalPages}`);

        // Try to save just the first page
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [0]);
        newPdf.addPage(copiedPage);

        const newPdfBytes = await newPdf.save();
        const newSize = newPdfBytes.length / 1024 / 1024;
        console.log(`Split (Page 1 only) size: ${newSize.toFixed(2)} MB`);

        if ((newPdfBytes.length / fileBuffer.length) > 0.8) {
            console.log('FAILURE: Split file is almost as large as original.');
        } else {
            console.log('SUCCESS: Split file is significantly smaller.');
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

testSplit();
