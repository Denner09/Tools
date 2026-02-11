
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function testEmbedSplit() {
    try {
        const filePath = 'e:/Código/Github/Tools/src/teste/4000324-53.2026.8.26.0084.PDF';
        const fileBuffer = fs.readFileSync(filePath);
        console.log(`Original file size: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`);

        const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
        
        const newPdf = await PDFDocument.create();
        
        // Try to EMBED page 0
        const [embeddedPage] = await newPdf.embedPdf(pdfDoc, [0]); // embedPdf returns [PDFEmbeddedPage]
        
        const page = newPdf.addPage([embeddedPage.width, embeddedPage.height]);
        page.drawPage(embeddedPage, {
            x: 0,
            y: 0,
            width: embeddedPage.width,
            height: embeddedPage.height,
        });

        const newPdfBytes = await newPdf.save();
        const newSize = newPdfBytes.length / 1024 / 1024;
        console.log(`Split (Embed approach, Page 1 only) size: ${newSize.toFixed(2)} MB`);
        
    } catch (e) {
        console.error('Error:', e);
    }
}

testEmbedSplit();
