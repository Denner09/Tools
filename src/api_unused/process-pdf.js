import Busboy from 'busboy';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const busboy = Busboy({ headers: req.headers });
  const files = [];
  const fields = {};

  return new Promise((resolve, reject) => {
    busboy.on('file', (name, file, info) => {
      const chunks = [];
      file.on('data', (data) => chunks.push(data));
      file.on('end', () => {
        files.push({
          buffer: Buffer.concat(chunks),
          filename: info.filename,
          mimeType: info.mimeType,
        });
      });
    });

    busboy.on('field', (name, value) => {
      fields[name] = value;
    });

    busboy.on('finish', async () => {
      try {
        const { action, ranges } = fields;
        
        if (!files.length) {
            res.status(400).json({ error: 'No files uploaded' });
            return resolve();
        }

        let outputBuffer;
        let outputMime = 'application/pdf';
        let outputFilename = 'processado.pdf';

        if (action === 'merge') {
            const mergedPdf = await PDFDocument.create();
            for (const file of files) {
                const srcDoc = await PDFDocument.load(file.buffer);
                const indices = srcDoc.getPageIndices();
                const pages = await mergedPdf.copyPages(srcDoc, indices);
                pages.forEach((page) => mergedPdf.addPage(page));
            }
            outputBuffer = Buffer.from(await mergedPdf.save());
            outputFilename = 'unido.pdf';
        } 
        else if (action === 'compress') {
             // Load the first file
             const file = files[0];
             const pdfDoc = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
             
             // Clear metadata for "compression"/privacy
             pdfDoc.setTitle('');
             pdfDoc.setAuthor('');
             pdfDoc.setSubject('');
             pdfDoc.setKeywords([]);
             pdfDoc.setProducer('');
             pdfDoc.setCreator('');
             
             // Save allows re-generating the XRef table, potentially reducing size if objects were inefficient
             // Enable Object Streams to compress the structure (significant for many small objects)
             outputBuffer = Buffer.from(await pdfDoc.save({ useObjectStreams: true }));
             outputFilename = 'comprimido.pdf';
        }
        else if (action === 'split') {
             const file = files[0];
             const pdfDoc = await PDFDocument.load(file.buffer);
             const rangeList = ranges ? ranges.split(',').map(r => r.trim()) : [];
             
             if (rangeList.length > 1) {
                 // Multiple ranges -> ZIP
                 const zip = new JSZip();
                 
                 for (let i = 0; i < rangeList.length; i++) {
                     const rangeStr = rangeList[i];
                     // Parse 1-3 or 1
                     let [start, end] = rangeStr.split('-').map(n => parseInt(n));
                     if (isNaN(end)) end = start;
                     
                     // 1-based to 0-based
                     start = Math.max(0, start - 1);
                     end = Math.min(pdfDoc.getPageCount() - 1, end - 1);
                     
                     const subDoc = await PDFDocument.create();
                     const pageIndices = [];
                     for(let p = start; p <= end; p++) pageIndices.push(p);
                     
                     const copiedPages = await subDoc.copyPages(pdfDoc, pageIndices);
                     copiedPages.forEach(page => subDoc.addPage(page));
                     
                     const pdfBytes = await subDoc.save();
                     zip.file(`divisao_${i+1}.pdf`, pdfBytes);
                 }
                 
                 outputBuffer = await zip.generateAsync({ type: 'nodebuffer' });
                 outputMime = 'application/zip';
                 outputFilename = 'arquivos_divididos.zip';
             } else {
                 // Single range or extracting all pages as separate?
                 // Prompt: "gerar múltiplos buffers de saída". If API returns one response, ZIP is standard.
                 // If simplest case:
                  const subDoc = await PDFDocument.create();
                  // Default to all pages if no range? Or handle single range
                  // Let's assume whole file copy if range missing
                  const indices = pdfDoc.getPageIndices();
                  const pages = await subDoc.copyPages(pdfDoc, indices);
                  pages.forEach(p => subDoc.addPage(p)); 
                  outputBuffer = Buffer.from(await subDoc.save());
             }
        }

        if (outputBuffer) {
            // Clean memory
            files.forEach(f => { f.buffer = null; });
            
            res.setHeader('Content-Type', outputMime);
            res.setHeader('Content-Disposition', `attachment; filename=${outputFilename}`);
            res.write(outputBuffer);
            res.end();
        } else {
            res.status(400).json({ error: 'Ação não suportada' });
        }
        
        resolve();

      } catch (err) {
        console.error('Processing error:', err);
        res.status(500).json({ error: err.message });
        resolve();
      }
    });

    req.pipe(busboy);
  });
}
