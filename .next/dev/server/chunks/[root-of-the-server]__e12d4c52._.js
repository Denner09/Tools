module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/pages/api/process-pdf.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$busboy__$5b$external$5d$__$28$busboy$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$busboy$29$__ = __turbopack_context__.i("[externals]/busboy [external] (busboy, cjs, [project]/node_modules/busboy)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$pdf$2d$lib__$5b$external$5d$__$28$pdf$2d$lib$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$29$__ = __turbopack_context__.i("[externals]/pdf-lib [external] (pdf-lib, cjs, [project]/node_modules/pdf-lib)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$jszip__$5b$external$5d$__$28$jszip$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$jszip$29$__ = __turbopack_context__.i("[externals]/jszip [external] (jszip, cjs, [project]/node_modules/jszip)");
;
;
;
const config = {
    api: {
        bodyParser: false
    }
};
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }
    const busboy = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$busboy__$5b$external$5d$__$28$busboy$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$busboy$29$__["default"])({
        headers: req.headers
    });
    const files = [];
    const fields = {};
    return new Promise((resolve, reject)=>{
        busboy.on('file', (name, file, info)=>{
            const chunks = [];
            file.on('data', (data)=>chunks.push(data));
            file.on('end', ()=>{
                files.push({
                    buffer: Buffer.concat(chunks),
                    filename: info.filename,
                    mimeType: info.mimeType
                });
            });
        });
        busboy.on('field', (name, value)=>{
            fields[name] = value;
        });
        busboy.on('finish', async ()=>{
            try {
                const { action, ranges } = fields;
                if (!files.length) {
                    res.status(400).json({
                        error: 'No files uploaded'
                    });
                    return resolve();
                }
                let outputBuffer;
                let outputMime = 'application/pdf';
                let outputFilename = 'processado.pdf';
                if (action === 'merge') {
                    const mergedPdf = await __TURBOPACK__imported__module__$5b$externals$5d2f$pdf$2d$lib__$5b$external$5d$__$28$pdf$2d$lib$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$29$__["PDFDocument"].create();
                    for (const file of files){
                        const srcDoc = await __TURBOPACK__imported__module__$5b$externals$5d2f$pdf$2d$lib__$5b$external$5d$__$28$pdf$2d$lib$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$29$__["PDFDocument"].load(file.buffer);
                        const indices = srcDoc.getPageIndices();
                        const pages = await mergedPdf.copyPages(srcDoc, indices);
                        pages.forEach((page)=>mergedPdf.addPage(page));
                    }
                    outputBuffer = Buffer.from(await mergedPdf.save());
                    outputFilename = 'unido.pdf';
                } else if (action === 'compress') {
                    // Load the first file
                    const file = files[0];
                    const pdfDoc = await __TURBOPACK__imported__module__$5b$externals$5d2f$pdf$2d$lib__$5b$external$5d$__$28$pdf$2d$lib$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$29$__["PDFDocument"].load(file.buffer, {
                        ignoreEncryption: true
                    });
                    // Clear metadata for "compression"/privacy
                    pdfDoc.setTitle('');
                    pdfDoc.setAuthor('');
                    pdfDoc.setSubject('');
                    pdfDoc.setKeywords([]);
                    pdfDoc.setProducer('');
                    pdfDoc.setCreator('');
                    // Save allows re-generating the XRef table, potentially reducing size if objects were inefficient
                    // Enable Object Streams to compress the structure (significant for many small objects)
                    outputBuffer = Buffer.from(await pdfDoc.save({
                        useObjectStreams: true
                    }));
                    outputFilename = 'comprimido.pdf';
                } else if (action === 'split') {
                    const file = files[0];
                    const pdfDoc = await __TURBOPACK__imported__module__$5b$externals$5d2f$pdf$2d$lib__$5b$external$5d$__$28$pdf$2d$lib$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$29$__["PDFDocument"].load(file.buffer);
                    const rangeList = ranges ? ranges.split(',').map((r)=>r.trim()) : [];
                    if (rangeList.length > 1) {
                        // Multiple ranges -> ZIP
                        const zip = new __TURBOPACK__imported__module__$5b$externals$5d2f$jszip__$5b$external$5d$__$28$jszip$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$jszip$29$__["default"]();
                        for(let i = 0; i < rangeList.length; i++){
                            const rangeStr = rangeList[i];
                            // Parse 1-3 or 1
                            let [start, end] = rangeStr.split('-').map((n)=>parseInt(n));
                            if (isNaN(end)) end = start;
                            // 1-based to 0-based
                            start = Math.max(0, start - 1);
                            end = Math.min(pdfDoc.getPageCount() - 1, end - 1);
                            const subDoc = await __TURBOPACK__imported__module__$5b$externals$5d2f$pdf$2d$lib__$5b$external$5d$__$28$pdf$2d$lib$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$29$__["PDFDocument"].create();
                            const pageIndices = [];
                            for(let p = start; p <= end; p++)pageIndices.push(p);
                            const copiedPages = await subDoc.copyPages(pdfDoc, pageIndices);
                            copiedPages.forEach((page)=>subDoc.addPage(page));
                            const pdfBytes = await subDoc.save();
                            zip.file(`divisao_${i + 1}.pdf`, pdfBytes);
                        }
                        outputBuffer = await zip.generateAsync({
                            type: 'nodebuffer'
                        });
                        outputMime = 'application/zip';
                        outputFilename = 'arquivos_divididos.zip';
                    } else {
                        // Single range or extracting all pages as separate?
                        // Prompt: "gerar múltiplos buffers de saída". If API returns one response, ZIP is standard.
                        // If simplest case:
                        const subDoc = await __TURBOPACK__imported__module__$5b$externals$5d2f$pdf$2d$lib__$5b$external$5d$__$28$pdf$2d$lib$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$29$__["PDFDocument"].create();
                        // Default to all pages if no range? Or handle single range
                        // Let's assume whole file copy if range missing
                        const indices = pdfDoc.getPageIndices();
                        const pages = await subDoc.copyPages(pdfDoc, indices);
                        pages.forEach((p)=>subDoc.addPage(p));
                        outputBuffer = Buffer.from(await subDoc.save());
                    }
                }
                if (outputBuffer) {
                    // Clean memory
                    files.forEach((f)=>{
                        f.buffer = null;
                    });
                    res.setHeader('Content-Type', outputMime);
                    res.setHeader('Content-Disposition', `attachment; filename=${outputFilename}`);
                    res.write(outputBuffer);
                    res.end();
                } else {
                    res.status(400).json({
                        error: 'Ação não suportada'
                    });
                }
                resolve();
            } catch (err) {
                console.error('Processing error:', err);
                res.status(500).json({
                    error: err.message
                });
                resolve();
            }
        });
        req.pipe(busboy);
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e12d4c52._.js.map