
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function inspectPdf() {
    try {
        const filePath = 'e:/Código/Github/Tools/src/teste/4000324-53.2026.8.26.0084.PDF';
        const fileBuffer = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });

        // Check page count
        console.log(`Pages: ${pdfDoc.getPageCount()}`);

        // Check for AcroForm
        const form = pdfDoc.getForm();
        if (form) {
            console.log(`Has AcroForm with ${form.getFields().length} fields.`);
        } else {
            console.log('No AcroForm detected.');
        }

        // Check for Attachments (Embedded Files)
        const catalog = pdfDoc.catalog;
        // catalog.lookup(PDFName.of('Names')) ... complicated in high level API
        // pdf-lib doesn't have a simple "getAttachments"

        // Try to access Names -> EmbeddedFiles
        // We can check if any embedded files exist
        
        console.log('Done inspecting basic properties.');

    } catch (e) {
        console.error('Error:', e);
    }
}

inspectPdf();
