module.exports = [
"[project]/src/pages/pdf-tools.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>PDFToolsPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$dropzone__$5b$external$5d$__$28$react$2d$dropzone$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$dropzone$29$__ = __turbopack_context__.i("[externals]/react-dropzone [external] (react-dropzone, esm_import, [project]/node_modules/react-dropzone)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$tesseract$2e$js__$5b$external$5d$__$28$tesseract$2e$js$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$tesseract$2e$js$29$__ = __turbopack_context__.i("[externals]/tesseract.js [external] (tesseract.js, cjs, [project]/node_modules/tesseract.js)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$diff__$5b$external$5d$__$28$diff$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$diff$29$__ = __turbopack_context__.i("[externals]/diff [external] (diff, esm_import, [project]/node_modules/diff)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$clsx__$5b$external$5d$__$28$clsx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$clsx$29$__ = __turbopack_context__.i("[externals]/clsx [external] (clsx, esm_import, [project]/node_modules/clsx)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$dropzone__$5b$external$5d$__$28$react$2d$dropzone$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$dropzone$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$diff__$5b$external$5d$__$28$diff$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$diff$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$clsx__$5b$external$5d$__$28$clsx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$clsx$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$dropzone__$5b$external$5d$__$28$react$2d$dropzone$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$dropzone$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$diff__$5b$external$5d$__$28$diff$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$diff$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$clsx__$5b$external$5d$__$28$clsx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$clsx$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
"use client";
;
;
;
;
;
;
function PDFToolsPage() {
    const [activeTool, setActiveTool] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('merge');
    const [files, setFiles] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [processing, setProcessing] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [splitRanges, setSplitRanges] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [diffResult, setDiffResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [ocrProgress, setOcrProgress] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [compressionLevel, setCompressionLevel] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('normal');
    const [customTargetMB, setCustomTargetMB] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [showSplitConfirm, setShowSplitConfirm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [compressedBlob, setCompressedBlob] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [splitMode, setSplitMode] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('range'); // 'range' or 'size'
    const [ocrMode, setOcrMode] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('extract'); // 'extract', 'searchable', 'compare'
    const [extractedText, setExtractedText] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    // Crop States
    const [cropPage, setCropPage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(1);
    const [cropSelection, setCropSelection] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null); // {x, y, w, h} (normalized 0-1 or pixels)
    const [cropFormat, setCropFormat] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('png'); // png, jpg, pdf
    const [cropImgData, setCropImgData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null); // To store the rendered page data URL for display
    // Rotate States
    const [rotateMode, setRotateMode] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('all'); // 'all', 'page'
    const [rotateAngle, setRotateAngle] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(90); // 90, 180, 270 (clockwise adds to current)
    const [rotatePage, setRotatePage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(1);
    const [rotateImgData, setRotateImgData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    // Numbering States
    const [numPosition, setNumPosition] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('bottom-center'); // 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'
    const [numStart, setNumStart] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(1);
    const [numColor, setNumColor] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('#000000');
    const [numTextFormat, setNumTextFormat] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('page_num'); // 'page_num' ("Página X") or 'num_only' ("X")
    const [numPage, setNumPage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(1); // For preview navigation
    const [numImgData, setNumImgData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null); // Preview image logic
    // Convert States
    const [convertFormat, setConvertFormat] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('word'); // 'word', 'excel', 'powerpoint', 'jpg', 'png', 'svg'
    // Crop Refs
    const dragStart = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const isDragging = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(false);
    const onCropMouseDown = (e)=>{
        if (activeTool !== 'crop') return;
        // Don't start drag if clicking on the control handles (if we had them)
        // For simple Box drawing:
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        dragStart.current = {
            x,
            y
        };
        isDragging.current = true;
        // Update selection to start point
        setCropSelection((prev)=>({
                ...prev,
                x: x,
                y: y,
                width: 0,
                height: 0
            }));
    };
    const onCropMouseMove = (e)=>{
        if (!isDragging.current || !dragStart.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        const startX = dragStart.current.x;
        const startY = dragStart.current.y;
        // Calculate new box
        let newX = Math.min(startX, currentX);
        let newY = Math.min(startY, currentY);
        let newW = Math.abs(currentX - startX);
        let newH = Math.abs(currentY - startY);
        // Bounds Checking (cannot go outside image)
        // We need the image dimensions. cropSelection.imgWidth should be set.
        const maxW = cropSelection?.imgWidth || rect.width;
        const maxH = cropSelection?.imgHeight || rect.height;
        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX + newW > maxW) newW = maxW - newX;
        if (newY + newH > maxH) newH = maxH - newY;
        setCropSelection((prev)=>({
                ...prev,
                x: newX,
                y: newY,
                width: newW,
                height: newH
            }));
    };
    const onCropMouseUp = ()=>{
        isDragging.current = false;
        dragStart.current = null;
    };
    const tools = [
        {
            id: 'merge',
            icon: 'fa-layer-group',
            label: 'Juntar PDF',
            subtitle: 'Combine múltiplos arquivos em um único PDF'
        },
        {
            id: 'split',
            icon: 'fa-cut',
            label: 'Dividir PDF',
            subtitle: 'Extraia páginas ou divida seu arquivo'
        },
        {
            id: 'compress',
            icon: 'fa-compress-arrows-alt',
            label: 'Comprimir PDF',
            subtitle: 'Reduza o tamanho do arquivo mantendo a qualidade'
        },
        {
            id: 'ocr',
            icon: 'fa-font',
            label: 'OCR e Texto',
            subtitle: 'Reconhecimento de texto e comparação'
        },
        {
            id: 'crop',
            icon: 'fa-crop-alt',
            label: 'Cortar',
            subtitle: 'Recorte partes específicas das páginas'
        },
        {
            id: 'rotate',
            icon: 'fa-sync-alt',
            label: 'Rotacionar',
            subtitle: 'Gire páginas ou todo o documento'
        },
        {
            id: 'number',
            icon: 'fa-list-ol',
            label: 'Numeração',
            subtitle: 'Adicione números de página personalizados'
        },
        {
            id: 'convert',
            icon: 'fa-exchange-alt',
            label: 'Converter',
            subtitle: 'Converta PDF para Word, Excel, JPG e mais'
        },
        {
            id: 'repair',
            icon: 'fa-wrench',
            label: 'Reparar PDF',
            subtitle: 'Analise e corrija arquivos corrompidos'
        }
    ];
    const onDrop = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((acceptedFiles)=>{
        if (activeTool === 'split' || activeTool === 'compress' || activeTool === 'crop' || activeTool === 'rotate' || activeTool === 'number' || activeTool === 'convert' || activeTool === 'repair') {
            setFiles([
                acceptedFiles[0]
            ]);
            // Reset crop state on new file
            if (activeTool === 'crop') {
                setCropPage(1);
                setCropSelection(null);
                setCropImgData(null);
            }
            // Reset rotate state on new file
            if (activeTool === 'rotate') {
                setRotatePage(1);
                setRotateAngle(0);
                setRotateImgData(null);
                setRotateMode('all');
            }
            // Reset number state
            if (activeTool === 'number') {
                setNumPosition('bottom-center');
                setNumStart(1);
                setNumPage(1);
                setNumImgData(null);
                setNumColor('#000000');
                setNumTextFormat('page_num');
            }
        } else if (activeTool === 'ocr') {
            if (ocrMode === 'compare') {
                setFiles((prev)=>[
                        ...prev,
                        ...acceptedFiles
                    ].slice(0, 2));
            } else {
                setFiles([
                    acceptedFiles[0]
                ]);
            }
        } else {
            setFiles((prev)=>[
                    ...prev,
                    ...acceptedFiles
                ]);
        }
    }, [
        activeTool,
        ocrMode
    ]);
    const { getRootProps, getInputProps, isDragActive } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$dropzone__$5b$external$5d$__$28$react$2d$dropzone$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$dropzone$29$__["useDropzone"])({
        onDrop,
        accept: {
            'application/pdf': [
                '.pdf'
            ]
        },
        multiple: activeTool === 'merge' || activeTool === 'ocr' && ocrMode === 'compare'
    });
    const handleCompressClientSide = async ()=>{
        try {
            setProcessing(true);
            // Import PDF.js
            const pdfJS = await __turbopack_context__.A("[project]/node_modules/pdfjs-dist/build/pdf.mjs [ssr] (ecmascript, async loader)");
            // Set worker properly
            pdfJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs`;
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfJS.getDocument(arrayBuffer).promise;
            const totalPages = pdf.numPages;
            const { PDFDocument } = await __turbopack_context__.A("[externals]/pdf-lib [external] (pdf-lib, cjs, [project]/node_modules/pdf-lib, async loader)");
            const newPdf = await PDFDocument.create();
            let scale = 1.0;
            let quality = 0.7;
            // Ajuste de parâmetros
            let level = compressionLevel;
            if (level === 'custom') level = 'normal'; // Base para custom é normal
            if (level === 'normal') {
                scale = 1.0;
                quality = 0.6;
            } else if (level === 'high') {
                scale = 0.7;
                quality = 0.5;
            } else if (level === 'extreme') {
                scale = 0.5;
                quality = 0.4;
            }
            for(let i = 1; i <= totalPages; i++){
                setOcrProgress(Math.round(i / totalPages * 100));
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({
                    scale: scale
                });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({
                    canvasContext: context,
                    viewport
                }).promise;
                const imgData = canvas.toDataURL('image/jpeg', quality);
                const imgBytes = await fetch(imgData).then((r)=>r.arrayBuffer());
                const jpgImage = await newPdf.embedJpg(imgBytes);
                const newPage = newPdf.addPage([
                    viewport.width,
                    viewport.height
                ]);
                newPage.drawImage(jpgImage, {
                    x: 0,
                    y: 0,
                    width: viewport.width,
                    height: viewport.height
                });
            }
            const pdfBytes = await newPdf.save();
            const blob = new Blob([
                pdfBytes
            ], {
                type: 'application/pdf'
            });
            const newSizeMB = blob.size / 1024 / 1024;
            // Lógica Personalizada
            if (compressionLevel === 'custom' && customTargetMB) {
                const target = parseFloat(customTargetMB);
                if (newSizeMB > target) {
                    setCompressedBlob(blob);
                    setShowSplitConfirm(true);
                    setProcessing(false);
                    return;
                }
            }
            // Download normal
            downloadBlob(blob, `comprimido_${compressionLevel}_${file.name}`);
            const originalSize = file.size / 1024 / 1024;
            alert(`Compressão Concluída!\n\nOriginal: ${originalSize.toFixed(2)} MB\nNovo: ${newSizeMB.toFixed(2)} MB\nRedução: ${(100 - newSizeMB / originalSize * 100).toFixed(1)}%`);
            setFiles([]);
        } catch (e) {
            console.error(e);
            alert("Erro na compressão local: " + e.message);
        } finally{
            if (!showSplitConfirm) {
                setProcessing(false);
                setOcrProgress(0);
            }
        }
    };
    const downloadBlob = (blob, filename)=>{
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };
    const handleSplitAndDownload = async ()=>{
        if (!compressedBlob || !customTargetMB) return;
        setProcessing(true);
        setShowSplitConfirm(false);
        setOcrProgress(0);
        try {
            const JSZip = (await __turbopack_context__.A("[externals]/jszip [external] (jszip, cjs, [project]/node_modules/jszip, async loader)")).default;
            const { PDFDocument } = await __turbopack_context__.A("[externals]/pdf-lib [external] (pdf-lib, cjs, [project]/node_modules/pdf-lib, async loader)");
            const zip = new JSZip();
            const arrayBuffer = await compressedBlob.arrayBuffer();
            const sourcePdf = await PDFDocument.load(arrayBuffer);
            const totalPages = sourcePdf.getPageCount();
            // Margem de segurança de 20% para garantir que metadados não estourem o limite
            const targetBytes = parseFloat(customTargetMB) * 1024 * 1024 * 0.80;
            let currentPdf = await PDFDocument.create();
            let currentPart = 1;
            let currentSize = 0;
            let pagesInCurrent = 0;
            for(let i = 0; i < totalPages; i++){
                setOcrProgress(Math.round(i / totalPages * 100));
                const [copiedPage] = await currentPdf.copyPages(sourcePdf, [
                    i
                ]);
                currentPdf.addPage(copiedPage);
                pagesInCurrent++;
                const pdfBytes = await currentPdf.save();
                if (pdfBytes.byteLength > targetBytes) {
                    if (pagesInCurrent > 1) {
                        currentPdf.removePage(pagesInCurrent - 1);
                        const partBytes = await currentPdf.save();
                        zip.file(`parte_${currentPart}.pdf`, partBytes);
                        currentPart++;
                        currentPdf = await PDFDocument.create();
                        const [retryPage] = await currentPdf.copyPages(sourcePdf, [
                            i
                        ]);
                        currentPdf.addPage(retryPage);
                        pagesInCurrent = 1;
                    } else {
                        // Se UMA única página já é maior que o alvo (mesmo com margem),
                        // tentamos salvar ela sozinha. Se for maior que o target REAL (sem margem),
                        // não há o que fazer a não ser entregar ela assim.
                        const partBytes = await currentPdf.save();
                        zip.file(`parte_${currentPart}.pdf`, partBytes);
                        currentPart++;
                        currentPdf = await PDFDocument.create();
                        pagesInCurrent = 0;
                    }
                }
            }
            if (pagesInCurrent > 0) {
                const partBytes = await currentPdf.save();
                zip.file(`parte_${currentPart}.pdf`, partBytes);
            }
            const content = await zip.generateAsync({
                type: "blob"
            });
            downloadBlob(content, `comprimido_dividido_partes.zip`);
            alert("Arquivo dividido e baixado com sucesso!");
            setFiles([]);
        } catch (e) {
            console.error(e);
            alert("Erro ao dividir: " + e.message);
        } finally{
            setProcessing(false);
            setOcrProgress(0);
            setCompressedBlob(null);
        }
    };
    const handleSplitBySize = async ()=>{
        if (!files[0] || !customTargetMB) return;
        setProcessing(true);
        setOcrProgress(0);
        try {
            const JSZip = (await __turbopack_context__.A("[externals]/jszip [external] (jszip, cjs, [project]/node_modules/jszip, async loader)")).default;
            const { PDFDocument } = await __turbopack_context__.A("[externals]/pdf-lib [external] (pdf-lib, cjs, [project]/node_modules/pdf-lib, async loader)");
            const zip = new JSZip();
            const arrayBuffer = await files[0].arrayBuffer();
            const sourcePdf = await PDFDocument.load(arrayBuffer);
            const totalPages = sourcePdf.getPageCount();
            // Margem de 20%
            const targetBytes = parseFloat(customTargetMB) * 1024 * 1024 * 0.80;
            let currentPdf = await PDFDocument.create();
            let currentPart = 1;
            let currentSize = 0;
            let pagesInCurrent = 0;
            for(let i = 0; i < totalPages; i++){
                setOcrProgress(Math.round(i / totalPages * 100));
                const [copiedPage] = await currentPdf.copyPages(sourcePdf, [
                    i
                ]);
                currentPdf.addPage(copiedPage);
                pagesInCurrent++;
                const pdfBytes = await currentPdf.save();
                if (pdfBytes.byteLength > targetBytes) {
                    if (pagesInCurrent > 1) {
                        currentPdf.removePage(pagesInCurrent - 1);
                        const partBytes = await currentPdf.save();
                        zip.file(`parte_${currentPart}.pdf`, partBytes);
                        currentPart++;
                        currentPdf = await PDFDocument.create();
                        const [retryPage] = await currentPdf.copyPages(sourcePdf, [
                            i
                        ]);
                        currentPdf.addPage(retryPage);
                        pagesInCurrent = 1;
                    } else {
                        const partBytes = await currentPdf.save();
                        zip.file(`parte_${currentPart}.pdf`, partBytes);
                        currentPart++;
                        currentPdf = await PDFDocument.create();
                        pagesInCurrent = 0;
                    }
                }
            }
            if (pagesInCurrent > 0) {
                const partBytes = await currentPdf.save();
                zip.file(`parte_${currentPart}.pdf`, partBytes);
            }
            const content = await zip.generateAsync({
                type: "blob"
            });
            downloadBlob(content, `split_por_tamanho_${files[0].name}.zip`);
            alert("Arquivo dividido por tamanho e baixado com sucesso!");
            setFiles([]);
        } catch (e) {
            console.error(e);
            alert("Erro ao dividir por tamanho: " + e.message);
        } finally{
            setProcessing(false);
            setOcrProgress(0);
        }
    };
    // Recortar: Lógica de Renderização da Página
    const renderCropPage = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        if (activeTool !== 'crop' || !files.length) return;
        try {
            setProcessing(true);
            const pdfJS = await __turbopack_context__.A("[project]/node_modules/pdfjs-dist/build/pdf.mjs [ssr] (ecmascript, async loader)");
            pdfJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs`;
            const buffer = await files[0].arrayBuffer();
            const pdf = await pdfJS.getDocument(buffer).promise;
            if (cropPage > pdf.numPages) setCropPage(pdf.numPages);
            if (cropPage < 1) setCropPage(1);
            const page = await pdf.getPage(cropPage);
            // Escala reduzida para 0.75 conforme solicitado (redução de 50% em relação ao anterior 1.5)
            const viewport = page.getViewport({
                scale: 0.75
            });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({
                canvasContext: context,
                viewport
            }).promise;
            setCropImgData(canvas.toDataURL('image/png'));
            setProcessing(false);
            // Seleção automática ao centro se não houver seleção
            const w = viewport.width;
            const h = viewport.height;
            if (!cropSelection) {
                setCropSelection({
                    x: w * 0.25,
                    y: h * 0.25,
                    width: w * 0.5,
                    height: h * 0.5,
                    imgWidth: w,
                    imgHeight: h
                });
            } else {
                // Ensure img dims are up to date for bounds checking
                setCropSelection((prev)=>({
                        ...prev,
                        imgWidth: w,
                        imgHeight: h
                    }));
            }
        } catch (e) {
            console.error(e);
            alert("Erro ao renderizar página para corte");
            setProcessing(false);
        }
    }, [
        activeTool,
        files,
        cropPage
    ]);
    __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["default"].useEffect(()=>{
        if (activeTool === 'crop' && files.length > 0) {
            renderCropPage();
        }
    }, [
        activeTool,
        files,
        cropPage,
        renderCropPage
    ]);
    const handleCropDownload = async ()=>{
        if (!cropSelection || !cropImgData) return;
        try {
            // Carrega a imagem de origem (a página renderizada)
            const img = new Image();
            img.src = cropImgData;
            await new Promise((r)=>img.onload = r);
            // Cria canvas para a área recortada
            const canvas = document.createElement('canvas');
            canvas.width = cropSelection.width;
            canvas.height = cropSelection.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, cropSelection.x, cropSelection.y, cropSelection.width, cropSelection.height, 0, 0, cropSelection.width, cropSelection.height);
            if (cropFormat === 'pdf') {
                const { PDFDocument } = await __turbopack_context__.A("[externals]/pdf-lib [external] (pdf-lib, cjs, [project]/node_modules/pdf-lib, async loader)");
                const newPdf = await PDFDocument.create();
                const pngUrl = canvas.toDataURL('image/png');
                const pngImageBytes = await fetch(pngUrl).then((res)=>res.arrayBuffer());
                const embeddedImage = await newPdf.embedPng(pngImageBytes);
                const page = newPdf.addPage([
                    cropSelection.width,
                    cropSelection.height
                ]);
                page.drawImage(embeddedImage, {
                    x: 0,
                    y: 0,
                    width: cropSelection.width,
                    height: cropSelection.height
                });
                const pdfBytes = await newPdf.save();
                const blob = new Blob([
                    pdfBytes
                ], {
                    type: 'application/pdf'
                });
                downloadBlob(blob, `corte_pagina_${cropPage}.pdf`);
            } else {
                canvas.toBlob((blob)=>{
                    downloadBlob(blob, `corte_pagina_${cropPage}.${cropFormat}`);
                }, `image/${cropFormat}`);
            }
        } catch (e) {
            console.error(e);
            alert("Erro ao realizar o corte: " + e.message);
        }
    };
    // Rotacionar: Lógica de Renderização da Página
    const renderRotatePage = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        if (activeTool !== 'rotate' || !files.length) return;
        try {
            setProcessing(true);
            const pdfJS = await __turbopack_context__.A("[project]/node_modules/pdfjs-dist/build/pdf.mjs [ssr] (ecmascript, async loader)");
            pdfJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs`;
            const buffer = await files[0].arrayBuffer();
            const pdf = await pdfJS.getDocument(buffer).promise;
            if (rotatePage > pdf.numPages) setRotatePage(pdf.numPages);
            if (rotatePage < 1) setRotatePage(1);
            const page = await pdf.getPage(rotatePage);
            const viewport = page.getViewport({
                scale: 0.5
            }); // Small preview
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({
                canvasContext: context,
                viewport
            }).promise;
            setRotateImgData(canvas.toDataURL('image/png'));
            setProcessing(false);
        } catch (e) {
            console.error(e);
            alert("Erro ao renderizar página para rotação");
            setProcessing(false);
        }
    }, [
        activeTool,
        files,
        rotatePage
    ]);
    __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["default"].useEffect(()=>{
        if (activeTool === 'rotate' && files.length > 0) {
            renderRotatePage();
        }
    }, [
        activeTool,
        files,
        rotatePage,
        renderRotatePage
    ]);
    const handleRotate = async ()=>{
        if (!files.length) return;
        try {
            setProcessing(true);
            const { PDFDocument, degrees } = await __turbopack_context__.A("[externals]/pdf-lib [external] (pdf-lib, cjs, [project]/node_modules/pdf-lib, async loader)");
            const arrayBuffer = await files[0].arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();
            // Define rotation angle (additive or absolute? Let's treat rotateAngle as additional rotation)
            // The user perceives they are setting an angle.
            // If I say "Rotate 90", I expect it to turn 90 degrees relative to current.
            // But usually tools are "Rotate Clockwise" etc.
            // Let's assume rotateAngle is the DESIRED ROTATION TO APPLY.
            if (rotateMode === 'all') {
                pages.forEach((page)=>{
                    const currentRotation = page.getRotation().angle;
                    page.setRotation(degrees(currentRotation + rotateAngle));
                });
            } else {
                if (rotatePage >= 1 && rotatePage <= pages.length) {
                    const page = pages[rotatePage - 1];
                    const currentRotation = page.getRotation().angle;
                    page.setRotation(degrees(currentRotation + rotateAngle));
                }
            }
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([
                pdfBytes
            ], {
                type: 'application/pdf'
            });
            downloadBlob(blob, `rotacionado_${files[0].name}`);
            // Reset angle after save? Or keep it? keeping is fine.
            setProcessing(false);
        } catch (e) {
            console.error(e);
            alert("Erro ao rotacionar PDF: " + e.message);
            setProcessing(false);
        }
    };
    // Numbering: Render Page Logic for Preview
    const renderNumPage = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        if (activeTool !== 'number' || !files.length) return;
        try {
            // We use pdfjs to render the base page
            const pdfJS = await __turbopack_context__.A("[project]/node_modules/pdfjs-dist/build/pdf.mjs [ssr] (ecmascript, async loader)");
            pdfJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs`;
            const buffer = await files[0].arrayBuffer();
            const pdf = await pdfJS.getDocument(buffer).promise;
            if (numPage > pdf.numPages) setNumPage(pdf.numPages);
            if (numPage < 1) setNumPage(1);
            const page = await pdf.getPage(numPage);
            const viewport = page.getViewport({
                scale: 0.6
            }); // Preview scale
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({
                canvasContext: context,
                viewport
            }).promise;
            // Now draw the number on top of the canvas
            // Logic must match handleNumbering but adapted for Canvas coordinate system (Top-Left 0,0)
            const fontSize = 14;
            context.font = `${fontSize}px Helvetica, Arial, sans-serif`;
            context.fillStyle = numColor;
            const text = numTextFormat === 'page_num' ? `Página ${numStart + numPage - 1}` : `${numStart + numPage - 1}`;
            const textMetrics = context.measureText(text);
            const textWidth = textMetrics.width;
            const textHeight = fontSize; // Approximate height
            const margin = 20; // Visual margin
            let x = 0;
            let y = 0; // Canvas Y starts from top
            // Position Logic for Canvas
            // Top in Canvas is small Y. Bottom in Canvas is large Y.
            if (numPosition.includes('top')) {
                y = margin + textHeight;
            } else {
                y = canvas.height - margin;
            }
            if (numPosition.includes('left')) {
                x = margin;
            } else if (numPosition.includes('right')) {
                x = canvas.width - margin - textWidth;
            } else {
                x = canvas.width / 2 - textWidth / 2;
            }
            context.fillText(text, x, y);
            setNumImgData(canvas.toDataURL('image/png'));
        } catch (e) {
            console.error(e);
        // Silent fail for preview or alert?
        }
    }, [
        activeTool,
        files,
        numPage,
        numPosition,
        numStart,
        numColor,
        numTextFormat
    ]);
    __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["default"].useEffect(()=>{
        if (activeTool === 'number' && files.length > 0) {
            renderNumPage();
        }
    }, [
        activeTool,
        files,
        numPage,
        numPosition,
        numStart,
        numColor,
        numTextFormat,
        renderNumPage
    ]);
    const handleNumbering = async ()=>{
        if (!files.length) return;
        try {
            setProcessing(true);
            const { PDFDocument, StandardFonts, rgb } = await __turbopack_context__.A("[externals]/pdf-lib [external] (pdf-lib, cjs, [project]/node_modules/pdf-lib, async loader)");
            // Helper to parse hex color to rgb (0-1)
            const r = parseInt(numColor.slice(1, 3), 16) / 255;
            const g = parseInt(numColor.slice(3, 5), 16) / 255;
            const b = parseInt(numColor.slice(5, 7), 16) / 255;
            const arrayBuffer = await files[0].arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const pages = pdfDoc.getPages();
            pages.forEach((page, index)=>{
                const { width, height } = page.getSize();
                const fontSize = 12;
                // Correct logic for text
                const text = numTextFormat === 'page_num' ? `Página ${numStart + index}` : `${numStart + index}`;
                const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
                const textHeight = helveticaFont.heightAtSize(fontSize);
                let x = 0;
                let y = 0;
                const margin = 20;
                // Position Logic for PDF-Lib (Bottom-Left 0,0)
                // Top in PDF is Large Y. Bottom in PDF is Small Y.
                if (numPosition.includes('top')) {
                    y = height - margin - textHeight;
                } else {
                    y = margin;
                }
                if (numPosition.includes('left')) {
                    x = margin;
                } else if (numPosition.includes('right')) {
                    x = width - margin - textWidth;
                } else {
                    x = width / 2 - textWidth / 2;
                }
                page.drawText(text, {
                    x,
                    y,
                    size: fontSize,
                    font: helveticaFont,
                    color: rgb(r, g, b)
                });
            });
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([
                pdfBytes
            ], {
                type: 'application/pdf'
            });
            downloadBlob(blob, `numerado_${files[0].name}`);
            setProcessing(false);
        } catch (e) {
            console.error(e);
            alert("Erro ao inserir numeração: " + e.message);
            setProcessing(false);
        }
    };
    const handleConvert = async ()=>{
        if (!files.length) return;
        setProcessing(true);
        try {
            // Setup PDFJS for rasterization (JPG, PNG) or SVG extraction
            const pdfJS = await __turbopack_context__.A("[project]/node_modules/pdfjs-dist/build/pdf.mjs [ssr] (ecmascript, async loader)");
            pdfJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs`;
            const buffer = await files[0].arrayBuffer();
            const pdf = await pdfJS.getDocument(buffer).promise;
            // Format Specific Logic
            if ([
                'jpg',
                'png',
                'svg'
            ].includes(convertFormat)) {
                const JSZip = (await __turbopack_context__.A("[externals]/jszip [external] (jszip, cjs, [project]/node_modules/jszip, async loader)")).default;
                const zip = new JSZip();
                for(let i = 1; i <= pdf.numPages; i++){
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({
                        scale: 2.0
                    }); // High quality
                    if (convertFormat === 'svg') {
                        // Fallback: Embed rendered image in SVG (True vector is complex without external libs)
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        await page.render({
                            canvasContext: context,
                            viewport
                        }).promise;
                        const imgData = canvas.toDataURL('image/png');
                        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${viewport.width}" height="${viewport.height}">
                            <image href="${imgData}" width="100%" height="100%" />
                         </svg>`;
                        zip.file(`pagina_${i}.svg`, svgString);
                    } else {
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        await page.render({
                            canvasContext: context,
                            viewport
                        }).promise;
                        const blob = await new Promise((resolve)=>canvas.toBlob(resolve, `image/${convertFormat}`));
                        zip.file(`pagina_${i}.${convertFormat}`, blob);
                    }
                    // Update progress (reusing ocrProgress for visual feedback if needed, distinct from OCR)
                    setOcrProgress(Math.round(i / pdf.numPages * 100));
                }
                const content = await zip.generateAsync({
                    type: "blob"
                });
                downloadBlob(content, `convertido_${convertFormat}.zip`);
            } else {
                // Word, Excel, PowerPoint
                // Client-side conversion for these is extremely limited/impossible without complex libraries or server.
                // We will implement a basic "Text Extraction to format" or alert the user about limitation.
                // For a robust agentic solution, we might usually use a serverless API or a heavy WASM library.
                // Given "No external APIs" constraint usually implies local logic.
                // Hacky Solution: Extract text and simple layout, put in HTML, and save as .doc/.xls
                // This is "Fake" conversion but works for basic text. 
                // However, user requested "Convert". 
                // Let's implement the Image->Format hack or just Text->Format.
                alert("Aviso: Conversão para Office (Word, Excel, PPT) via navegador é experimental e pode não preservar a formatação exata. Imagens serão extraídas.");
                // For this demo, let's just do a simple text dump or placeholder.
                // OR better: Convert pages to Images and embed in the Office file (Scan-like PDF to Word).
                // This ensures visual fidelity.
                const { Document, Packer, Paragraph, ImageRun } = await __turbopack_context__.A("[externals]/docx [external] (docx, esm_import, [project]/node_modules/docx, async loader)"); // pdf-to-docx is heavy.
                // Since we don't have docx/exceljs/pptxgenjs installed in package.json (likely), we might need to rely on what's available or generic HTML methods.
                // Let's check package.json... We don't have them.
                // We will use the HTML-to-Office trick. Render PDF pages as Images, put in HTML, download as .doc.
                // Actually, simple Image Extraction -> Zip is better if we can't do real doc generation.
                // Let's stick to Images for now for Office formats as "Scan Pages".
                const JSZip = (await __turbopack_context__.A("[externals]/jszip [external] (jszip, cjs, [project]/node_modules/jszip, async loader)")).default;
                const zip = new JSZip();
                // We will basically save images and tell user to insert them, OR 
                // we can try to generate a basic HTML file that Word opens.
                let htmlContent = `<html><body>`;
                for(let i = 1; i <= pdf.numPages; i++){
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({
                        scale: 1.5
                    });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    await page.render({
                        canvasContext: context,
                        viewport
                    }).promise;
                    const imgData = canvas.toDataURL('image/jpeg', 0.8);
                    htmlContent += `<img src="${imgData}" style="width:100%; max-width: ${viewport.width}px;"><br><br>`;
                    setOcrProgress(Math.round(i / pdf.numPages * 100));
                }
                htmlContent += `</body></html>`;
                const mimeType = convertFormat === 'word' ? 'application/msword' : convertFormat === 'excel' ? 'application/vnd.ms-excel' : 'application/vnd.ms-powerpoint';
                const extension = convertFormat === 'word' ? 'doc' : convertFormat === 'excel' ? 'xls' : 'ppt';
                const blob = new Blob([
                    '\ufeff',
                    htmlContent
                ], {
                    type: mimeType
                });
                downloadBlob(blob, `documento_convertido.${extension}`);
            }
            setProcessing(false);
            setOcrProgress(0);
        } catch (e) {
            console.error(e);
            alert("Erro na conversão: " + e.message);
            setProcessing(false);
        }
    };
    const handleRepair = async ()=>{
        if (!files.length) return;
        setProcessing(true);
        try {
            // "Repair" strategy:
            // 1. Try to load with pdf-lib. It has some self-repair capabilities for XRef tables.
            // 2. If valid, save it as a new fresh PDF.
            // 3. If standard load fails, we can try to use pdfjs to read pages one by one and reconstruct.
            const { PDFDocument } = await __turbopack_context__.A("[externals]/pdf-lib [external] (pdf-lib, cjs, [project]/node_modules/pdf-lib, async loader)");
            const arrayBuffer = await files[0].arrayBuffer();
            let pdfDoc;
            try {
                // Try standard load (ignores some garbage)
                pdfDoc = await PDFDocument.load(arrayBuffer, {
                    ignoreEncryption: true
                });
            } catch (loadErr) {
                console.warn("Load failed, trying fallback...", loadErr);
                // Fallback: If pdf-lib fails, maybe pdf.js can read it?
                // If so, we render to images and rebuild. (Last resort repair)
                // For now let's report failure if pdf-lib can't parse headers.
                throw new Error("O arquivo está muito corrompido e não pôde ser lido.");
            }
            // If loaded, we "repair" by saving it fresh, which reconstructs the XRef table and file structure.
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([
                pdfBytes
            ], {
                type: 'application/pdf'
            });
            downloadBlob(blob, `reparado_${files[0].name}`);
            setProcessing(false);
            alert("Arquivo processado! Se ele estava com erros leves, agora deve abrir normalmente.");
        } catch (e) {
            console.error(e);
            alert("Erro ao reparar PDF: " + e.message + "\n\nO arquivo pode estar criptografado ou irreparável.");
            setProcessing(false);
        }
    };
    const handleOCR = async ()=>{
        if (!files.length) return;
        setProcessing(true);
        setExtractedText('');
        setDiffResult(null);
        setOcrProgress(0);
        try {
            // Setup Worker
            const worker = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$tesseract$2e$js__$5b$external$5d$__$28$tesseract$2e$js$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$tesseract$2e$js$29$__["createWorker"])('por');
            // Helper to rasterize PDF page to Image URL
            const getPageImage = async (pdf, pageNum, scale = 2.0)=>{
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({
                    scale
                });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({
                    canvasContext: context,
                    viewport
                }).promise;
                return canvas.toDataURL('image/png');
            };
            const pdfJS = await __turbopack_context__.A("[project]/node_modules/pdfjs-dist/build/pdf.mjs [ssr] (ecmascript, async loader)");
            pdfJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs`;
            if (ocrMode === 'extract') {
                const file = files[0];
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfJS.getDocument(arrayBuffer).promise;
                const numPages = pdf.numPages;
                let fullText = '';
                for(let i = 1; i <= numPages; i++){
                    setOcrProgress(Math.round((i - 1) / numPages * 100));
                    const imgUrl = await getPageImage(pdf, i);
                    const { data: { text } } = await worker.recognize(imgUrl);
                    fullText += `--- Página ${i} ---\n${text}\n\n`;
                }
                setExtractedText(fullText);
                // Auto download txt
                const blob = new Blob([
                    fullText
                ], {
                    type: 'text/plain'
                });
                downloadBlob(blob, `texto_extraido_${file.name}.txt`);
            } else if (ocrMode === 'searchable') {
                // For searchable PDF, we'll try to use Tesseract's PDF output if possible or simple text overlay construction.
                // Tesseract JS `getPDF` returns a PDF file with text layer.
                // We need to do this page by page and merge.
                const { PDFDocument } = await __turbopack_context__.A("[externals]/pdf-lib [external] (pdf-lib, cjs, [project]/node_modules/pdf-lib, async loader)");
                const mergedPdf = await PDFDocument.create();
                const file = files[0];
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfJS.getDocument(arrayBuffer).promise;
                const numPages = pdf.numPages;
                for(let i = 1; i <= numPages; i++){
                    setOcrProgress(Math.round((i - 1) / numPages * 100));
                    const imgUrl = await getPageImage(pdf, i);
                    // Tesseract PDF output
                    // in v6+, recognize returns the pdf data directly if requested
                    const { data } = await worker.recognize(imgUrl, {
                        pdfTitle: `Page ${i}`
                    }, {
                        pdf: true
                    });
                    // data.pdf contains the PDF bytes
                    const pdfBytes = data.pdf;
                    if (!pdfBytes) throw new Error("Falha ao gerar PDF pesquisável para página " + i);
                    const pageDoc = await PDFDocument.load(pdfBytes);
                    const [copiedPage] = await mergedPdf.copyPages(pageDoc, [
                        0
                    ]);
                    mergedPdf.addPage(copiedPage);
                }
                const pdfBytes = await mergedPdf.save();
                const blob = new Blob([
                    pdfBytes
                ], {
                    type: 'application/pdf'
                });
                downloadBlob(blob, `ocr_pesquisavel_${file.name}`);
            } else if (ocrMode === 'compare') {
                if (files.length < 2) throw new Error("Precisa de 2 arquivos");
                const getText = async (file)=>{
                    const ab = await file.arrayBuffer();
                    const pdf = await pdfJS.getDocument(ab).promise;
                    let txt = '';
                    for(let i = 1; i <= pdf.numPages; i++){
                        const img = await getPageImage(pdf, i);
                        const { data } = await worker.recognize(img);
                        txt += data.text + '\n';
                    }
                    return txt;
                };
                setOcrProgress(10);
                const text1 = await getText(files[0]);
                setOcrProgress(50);
                const text2 = await getText(files[1]);
                setOcrProgress(90);
                const diff = __TURBOPACK__imported__module__$5b$externals$5d2f$diff__$5b$external$5d$__$28$diff$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$diff$29$__["diffLines"](text1, text2);
                setDiffResult(diff);
            }
            await worker.terminate();
            setOcrProgress(100);
            setProcessing(false);
        } catch (e) {
            console.error(e);
            alert("Erro no OCR: " + e.message);
            setProcessing(false);
        }
    };
    const handleProcess = async ()=>{
        if (files.length === 0) return;
        if (activeTool === 'compress') {
            await handleCompressClientSide();
            return;
        }
        if (activeTool === 'split' && splitMode === 'size') {
            await handleSplitBySize();
            return;
        }
        if (activeTool === 'ocr') {
            await handleOCR();
            return;
        }
        setProcessing(true);
        setDiffResult(null);
        // Server-side processing
        try {
            const formData = new FormData();
            formData.append('action', activeTool);
            if (activeTool === 'split') {
                formData.append('ranges', splitRanges);
            }
            files.forEach((file)=>{
                formData.append('file', file);
            });
            const res = await fetch('/api/process-pdf', {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error(await res.text());
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const filename = activeTool === 'split' && splitRanges.includes(',') ? 'resultado_divisao.zip' : `saida_${activeTool}.pdf`;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setFiles([]);
        } catch (err) {
            console.error(err);
            alert("Erro no Processamento: " + err.message);
        } finally{
            setProcessing(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex min-h-[calc(100vh-64px)]",
        style: {
            backgroundColor: 'var(--bg-page)'
        },
        children: [
            showSplitConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "text-center mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fas fa-cut text-2xl"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                        lineNumber: 1101,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                    lineNumber: 1100,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-bold text-gray-800 dark:text-white mb-2",
                                    children: "Alvo Não Atingido"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                    lineNumber: 1103,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-gray-600 dark:text-gray-300",
                                    children: [
                                        "O arquivo comprimido ficou com ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                            children: [
                                                (compressedBlob?.size / 1024 / 1024).toFixed(2),
                                                " MB"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                            lineNumber: 1105,
                                            columnNumber: 64
                                        }, this),
                                        ", o que é maior que seu alvo de ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                            children: [
                                                customTargetMB,
                                                " MB"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                            lineNumber: 1106,
                                            columnNumber: 63
                                        }, this),
                                        "."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                    lineNumber: 1104,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500 dark:text-gray-400 mt-2",
                                    children: "Deseja dividir o arquivo em múltiplas partes para respeitar o limite de tamanho?"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                    lineNumber: 1108,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/pdf-tools.jsx",
                            lineNumber: 1099,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowSplitConfirm(false);
                                        setCompressedBlob(null);
                                        setFiles([]);
                                    },
                                    className: "flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700",
                                    children: "Cancelar"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                    lineNumber: 1113,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>downloadBlob(compressedBlob, `comprimido_parcial_${files[0].name}`),
                                    className: "flex-1 py-2 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-900",
                                    children: "Baixar Inteiro"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                    lineNumber: 1119,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: handleSplitAndDownload,
                                    className: "flex-1 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600",
                                    children: "Dividir"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                    lineNumber: 1125,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/pdf-tools.jsx",
                            lineNumber: 1112,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/pdf-tools.jsx",
                    lineNumber: 1098,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/pdf-tools.jsx",
                lineNumber: 1097,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("aside", {
                className: "hidden md:flex flex-col w-72 border-r fixed top-16 bottom-0 left-0 z-40 overflow-y-auto",
                style: {
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-card)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "p-6 border-b",
                        style: {
                            borderColor: 'var(--border-card)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "text-base font-bold uppercase tracking-wider",
                            style: {
                                color: 'var(--text-muted)'
                            },
                            children: "Ferramentas PDF"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/pdf-tools.jsx",
                            lineNumber: 1145,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/pdf-tools.jsx",
                        lineNumber: 1144,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                        className: "flex-1 p-4 space-y-1",
                        children: tools.map((tool)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setActiveTool(tool.id);
                                    setFiles([]);
                                    setDiffResult(null);
                                },
                                className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$clsx__$5b$external$5d$__$28$clsx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$clsx$29$__["default"])("flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all w-full text-left group", activeTool === tool.id ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 shadow-sm ring-1 ring-orange-200 dark:ring-orange-800" : "hover:bg-gray-50 dark:hover:bg-white/5"),
                                style: {
                                    color: activeTool === tool.id ? undefined : 'var(--text-muted)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$clsx__$5b$external$5d$__$28$clsx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$clsx$29$__["default"])("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", activeTool === tool.id ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400" : "bg-gray-100/50 dark:bg-white/5 text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-white/10"),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: `fas ${tool.icon}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                            lineNumber: 1166,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                        lineNumber: 1162,
                                        columnNumber: 29
                                    }, this),
                                    tool.label
                                ]
                            }, tool.id, true, {
                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                lineNumber: 1149,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/pdf-tools.jsx",
                        lineNumber: 1147,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-gray-50 dark:bg-white/5 border-t",
                        style: {
                            borderColor: 'var(--border-card)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "text-xs text-center",
                            style: {
                                color: 'var(--text-muted)'
                            },
                            children: "Business Tools v1.0"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/pdf-tools.jsx",
                            lineNumber: 1173,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/pdf-tools.jsx",
                        lineNumber: 1172,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/pdf-tools.jsx",
                lineNumber: 1137,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "md:hidden w-full border-b p-4 sticky top-16 z-30 overflow-x-auto whitespace-nowrap",
                style: {
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-card)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex gap-2",
                    children: tools.map((tool)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setActiveTool(tool.id);
                                setFiles([]);
                                setDiffResult(null);
                            },
                            className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$clsx__$5b$external$5d$__$28$clsx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$clsx$29$__["default"])("flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border", activeTool === tool.id ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400" : "border-gray-200 dark:border-gray-700"),
                            style: {
                                backgroundColor: activeTool === tool.id ? undefined : 'var(--bg-card)',
                                color: activeTool === tool.id ? undefined : 'var(--text-muted)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: `fas ${tool.icon}`
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                    lineNumber: 1201,
                                    columnNumber: 29
                                }, this),
                                tool.label
                            ]
                        }, tool.id, true, {
                            fileName: "[project]/src/pages/pdf-tools.jsx",
                            lineNumber: 1187,
                            columnNumber: 25
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/pages/pdf-tools.jsx",
                    lineNumber: 1185,
                    columnNumber: 18
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/pdf-tools.jsx",
                lineNumber: 1178,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                className: "flex-1 md:ml-72 p-6 md:p-10 w-full min-h-screen",
                style: {
                    backgroundColor: 'var(--bg-page)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "max-w-[1600px] mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    className: "text-3xl font-bold mb-2",
                                    style: {
                                        color: 'var(--text-main)'
                                    },
                                    children: tools.find((t)=>t.id === activeTool)?.label
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                    lineNumber: 1214,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "inline-block bg-zinc-800 dark:bg-gray-800 rounded px-3 py-1 text-sm font-medium text-white",
                                    children: [
                                        activeTool === 'merge' && 'Junte múltiplos arquivos PDF em um único documento',
                                        activeTool === 'split' && 'Separe um PDF em várias páginas ou extraia intervalos',
                                        activeTool === 'compress' && 'Otimize o tamanho dos seus arquivos PDF',
                                        activeTool === 'ocr' && 'Reconhecimento de texto e conversão par formatos editáveis',
                                        activeTool === 'crop' && 'Recorte partes específicas das páginas do seu PDF',
                                        activeTool === 'rotate' && 'Gire páginas ou todo o documento de forma permanente',
                                        activeTool === 'number' && 'Adicione numeração de página personalizada',
                                        activeTool === 'convert' && 'Converta PDF para Word, Excel, JPG e outros formatos',
                                        activeTool === 'repair' && 'Recupere dados de arquivos PDF corrompidos',
                                        activeTool === 'compare' && 'Compare o texto entra dois arquivos automaticamente'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                    lineNumber: 1217,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/pdf-tools.jsx",
                            lineNumber: 1213,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "rounded-xl shadow-sm border overflow-hidden min-h-[600px] flex flex-col justify-between",
                            style: {
                                backgroundColor: 'var(--bg-card)',
                                borderColor: 'var(--border-card)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "p-8 flex-grow flex flex-col",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                            className: "font-semibold mb-4",
                                            style: {
                                                color: 'var(--text-muted)'
                                            },
                                            children: "Selecione seus arquivos PDF (Ordem de seleção importa)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                            lineNumber: 1240,
                                            columnNumber: 30
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            ...getRootProps(),
                                            className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$clsx__$5b$external$5d$__$28$clsx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$clsx$29$__["default"])("flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-300 min-h-[400px]", isDragActive ? "border-orange-500 bg-orange-50 dark:bg-orange-900/10" : "hover:border-orange-400"),
                                            style: {
                                                backgroundColor: isDragActive ? undefined : 'var(--bg-card-hover)',
                                                borderColor: isDragActive ? undefined : 'var(--border-card)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    ...getInputProps()
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1254,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "text-center p-10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$clsx__$5b$external$5d$__$28$clsx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$clsx$29$__["default"])("w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 transition-all", isDragActive ? "bg-white dark:bg-gray-800 text-orange-600 shadow-md" : "bg-gray-400 dark:bg-gray-600 text-white"),
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fas fa-cloud-upload-alt text-4xl"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                lineNumber: 1260,
                                                                columnNumber: 41
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1256,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                            className: "text-2xl font-bold mb-2",
                                                            style: {
                                                                color: 'var(--text-muted)'
                                                            },
                                                            children: isDragActive ? "Solte para enviar" : "Clique ou arraste seus arquivos aqui"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1262,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "font-medium uppercase text-sm tracking-wide",
                                                            style: {
                                                                color: 'var(--text-muted)'
                                                            },
                                                            children: [
                                                                "PDF Suportado",
                                                                activeTool === 'compare' && ' (Necessário 2 arquivos)'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1265,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1255,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                            lineNumber: 1243,
                                            columnNumber: 30
                                        }, this),
                                        files.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mt-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 gap-2",
                                                children: files.map((f, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between p-3 border rounded-lg shadow-sm",
                                                        style: {
                                                            backgroundColor: 'var(--bg-card)',
                                                            borderColor: 'var(--border-card)'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fas fa-file-pdf text-red-500 text-xl"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                        lineNumber: 1279,
                                                                        columnNumber: 54
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium",
                                                                        style: {
                                                                            color: 'var(--text-main)'
                                                                        },
                                                                        children: [
                                                                            f.name,
                                                                            " (",
                                                                            (f.size / 1024 / 1024).toFixed(2),
                                                                            " MB)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                        lineNumber: 1280,
                                                                        columnNumber: 54
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                lineNumber: 1278,
                                                                columnNumber: 50
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fas fa-check text-green-500"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                lineNumber: 1282,
                                                                columnNumber: 50
                                                            }, this)
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                        lineNumber: 1277,
                                                        columnNumber: 46
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                lineNumber: 1275,
                                                columnNumber: 38
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                            lineNumber: 1274,
                                            columnNumber: 34
                                        }, this),
                                        (activeTool === 'split' || activeTool === 'ocr') && files.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mt-6 p-4 rounded-lg",
                                            style: {
                                                backgroundColor: 'var(--bg-card-hover)',
                                                borderColor: 'var(--border-card)'
                                            },
                                            children: [
                                                activeTool === 'split' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-4 mb-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "flex items-center gap-2 cursor-pointer",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            value: "range",
                                                                            checked: splitMode === 'range',
                                                                            onChange: ()=>setSplitMode('range'),
                                                                            className: "text-orange-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1296,
                                                                            columnNumber: 55
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            style: {
                                                                                color: 'var(--text-main)'
                                                                            },
                                                                            children: "Por Página/Intervalo"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1297,
                                                                            columnNumber: 55
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1295,
                                                                    columnNumber: 51
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "flex items-center gap-2 cursor-pointer",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            value: "size",
                                                                            checked: splitMode === 'size',
                                                                            onChange: ()=>setSplitMode('size'),
                                                                            className: "text-orange-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1300,
                                                                            columnNumber: 55
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            style: {
                                                                                color: 'var(--text-main)'
                                                                            },
                                                                            children: "Por Tamanho (MB)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1301,
                                                                            columnNumber: 55
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1299,
                                                                    columnNumber: 51
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1294,
                                                            columnNumber: 47
                                                        }, this),
                                                        splitMode === 'range' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-bold mb-2",
                                                                    style: {
                                                                        color: 'var(--text-main)'
                                                                    },
                                                                    children: "Intervalos (Ex: 1-5, 8)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1307,
                                                                    columnNumber: 50
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: splitRanges,
                                                                    onChange: (e)=>setSplitRanges(e.target.value),
                                                                    className: "w-full p-2 border rounded focus:border-orange-500 focus:outline-none",
                                                                    style: {
                                                                        backgroundColor: 'var(--bg-card)',
                                                                        borderColor: 'var(--border-card)',
                                                                        color: 'var(--text-main)'
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1308,
                                                                    columnNumber: 50
                                                                }, this)
                                                            ]
                                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "p-3 border rounded",
                                                            style: {
                                                                backgroundColor: 'var(--bg-card)',
                                                                borderColor: 'var(--border-card)'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-bold mb-2",
                                                                    style: {
                                                                        color: 'var(--text-main)'
                                                                    },
                                                                    children: "Tamanho Máximo por Arquivo (MB)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1318,
                                                                    columnNumber: 54
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                            type: "number",
                                                                            value: customTargetMB,
                                                                            onChange: (e)=>setCustomTargetMB(e.target.value),
                                                                            className: "w-24 p-2 border rounded focus:border-orange-500 focus:outline-none",
                                                                            style: {
                                                                                backgroundColor: 'var(--bg-card)',
                                                                                borderColor: 'var(--border-card)',
                                                                                color: 'var(--text-main)'
                                                                            },
                                                                            placeholder: "Ex: 5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1320,
                                                                            columnNumber: 58
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm",
                                                                            style: {
                                                                                color: 'var(--text-muted)'
                                                                            },
                                                                            children: "MB"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1328,
                                                                            columnNumber: 58
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1319,
                                                                    columnNumber: 54
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs mt-2",
                                                                    style: {
                                                                        color: 'var(--text-muted)'
                                                                    },
                                                                    children: "O arquivo será dividido em partes menores que este valor."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1330,
                                                                    columnNumber: 54
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1317,
                                                            columnNumber: 50
                                                        }, this)
                                                    ]
                                                }, void 0, true),
                                                activeTool === 'ocr' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-bold mb-3",
                                                            style: {
                                                                color: 'var(--text-main)'
                                                            },
                                                            children: "Modo de OCR"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1339,
                                                            columnNumber: 46
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-orange-300",
                                                                    style: {
                                                                        backgroundColor: 'var(--bg-card)',
                                                                        borderColor: 'var(--border-card)'
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "ocrMode",
                                                                            value: "extract",
                                                                            checked: ocrMode === 'extract',
                                                                            onChange: ()=>setOcrMode('extract'),
                                                                            className: "text-orange-500 focus:ring-orange-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1342,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "font-bold block text-sm",
                                                                                    style: {
                                                                                        color: 'var(--text-main)'
                                                                                    },
                                                                                    children: "Extrair Texto (.txt)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                    lineNumber: 1344,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs",
                                                                                    style: {
                                                                                        color: 'var(--text-muted)'
                                                                                    },
                                                                                    children: "Lê o conteúdo e gera um arquivo de texto simples."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                    lineNumber: 1345,
                                                                                    columnNumber: 57
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1343,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1341,
                                                                    columnNumber: 50
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-orange-300",
                                                                    style: {
                                                                        backgroundColor: 'var(--bg-card)',
                                                                        borderColor: 'var(--border-card)'
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "ocrMode",
                                                                            value: "searchable",
                                                                            checked: ocrMode === 'searchable',
                                                                            onChange: ()=>setOcrMode('searchable'),
                                                                            className: "text-orange-500 focus:ring-orange-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1349,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "font-bold block text-sm",
                                                                                    style: {
                                                                                        color: 'var(--text-main)'
                                                                                    },
                                                                                    children: "PDF Pesquisável"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                    lineNumber: 1351,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs",
                                                                                    style: {
                                                                                        color: 'var(--text-muted)'
                                                                                    },
                                                                                    children: "Gera um novo PDF onde o texto da imagem pode ser selecionado/pesquisado."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                    lineNumber: 1352,
                                                                                    columnNumber: 57
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1350,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1348,
                                                                    columnNumber: 50
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-orange-300",
                                                                    style: {
                                                                        backgroundColor: 'var(--bg-card)',
                                                                        borderColor: 'var(--border-card)'
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "ocrMode",
                                                                            value: "compare",
                                                                            checked: ocrMode === 'compare',
                                                                            onChange: ()=>{
                                                                                setOcrMode('compare');
                                                                                if (files.length > 2) setFiles(files.slice(0, 2));
                                                                            },
                                                                            className: "text-orange-500 focus:ring-orange-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1356,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "font-bold block text-sm",
                                                                                    style: {
                                                                                        color: 'var(--text-main)'
                                                                                    },
                                                                                    children: "Comparar Arquivos (Original vs Alterado)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                    lineNumber: 1358,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs",
                                                                                    style: {
                                                                                        color: 'var(--text-muted)'
                                                                                    },
                                                                                    children: "Extrai o texto de dois arquivos e mostra as diferenças."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                    lineNumber: 1359,
                                                                                    columnNumber: 57
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1357,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1355,
                                                                    columnNumber: 50
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1340,
                                                            columnNumber: 46
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1338,
                                                    columnNumber: 42
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                            lineNumber: 1291,
                                            columnNumber: 34
                                        }, this),
                                        activeTool === 'crop' && files.length > 0 && cropImgData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mt-6 flex flex-col gap-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between p-4 border rounded-lg",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card-hover)',
                                                        borderColor: 'var(--border-card)'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setCropPage((p)=>Math.max(1, p - 1)),
                                                                    className: "w-10 h-10 flex items-center justify-center border rounded transition-colors",
                                                                    style: {
                                                                        backgroundColor: 'var(--bg-card)',
                                                                        borderColor: 'var(--border-card)',
                                                                        color: 'var(--text-main)'
                                                                    },
                                                                    title: "Página Anterior",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fas fa-chevron-left"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                        lineNumber: 1379,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1373,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "font-bold",
                                                                    style: {
                                                                        color: 'var(--text-main)'
                                                                    },
                                                                    children: [
                                                                        "Página ",
                                                                        cropPage
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1381,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setCropPage((p)=>p + 1),
                                                                    className: "w-10 h-10 flex items-center justify-center border rounded transition-colors",
                                                                    style: {
                                                                        backgroundColor: 'var(--bg-card)',
                                                                        borderColor: 'var(--border-card)',
                                                                        color: 'var(--text-main)'
                                                                    },
                                                                    title: "Próxima Página",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fas fa-chevron-right"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                        lineNumber: 1388,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1382,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1372,
                                                            columnNumber: 42
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                value: cropFormat,
                                                                onChange: (e)=>setCropFormat(e.target.value),
                                                                className: "p-2 border rounded focus:border-orange-500 focus:outline-none text-sm font-medium",
                                                                style: {
                                                                    backgroundColor: 'var(--bg-card)',
                                                                    borderColor: 'var(--border-card)',
                                                                    color: 'var(--text-main)'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "png",
                                                                        children: "Salvar como PNG"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                        lineNumber: 1398,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "jpg",
                                                                        children: "Salvar como JPG"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                        lineNumber: 1399,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "pdf",
                                                                        children: "Salvar como PDF"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                        lineNumber: 1400,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                lineNumber: 1392,
                                                                columnNumber: 45
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1391,
                                                            columnNumber: 42
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1371,
                                                    columnNumber: 38
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative overflow-auto border rounded-lg flex justify-center p-4",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card-hover)',
                                                        borderColor: 'var(--border-card)'
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "relative shadow-lg select-none cursor-crosshair",
                                                        onMouseDown: onCropMouseDown,
                                                        onMouseMove: onCropMouseMove,
                                                        onMouseUp: onCropMouseUp,
                                                        onMouseLeave: onCropMouseUp,
                                                        style: {
                                                            width: cropSelection?.imgWidth,
                                                            height: cropSelection?.imgHeight
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                                src: cropImgData,
                                                                alt: "Page",
                                                                className: "block max-w-none pointer-events-none",
                                                                style: {
                                                                    width: '100%',
                                                                    height: '100%'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                lineNumber: 1414,
                                                                columnNumber: 46
                                                            }, this),
                                                            cropSelection && cropSelection.width > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "absolute border-2 border-orange-500 bg-orange-500/20",
                                                                style: {
                                                                    // Convert stored Source coordinates back to Visual percentage/pixels for display
                                                                    left: `${cropSelection.x / cropSelection.imgWidth * 100}%`,
                                                                    top: `${cropSelection.y / cropSelection.imgHeight * 100}%`,
                                                                    width: `${cropSelection.width / cropSelection.imgWidth * 100}%`,
                                                                    height: `${cropSelection.height / cropSelection.imgHeight * 100}%`
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                lineNumber: 1422,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                        lineNumber: 1406,
                                                        columnNumber: 42
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1405,
                                                    columnNumber: 38
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm border border-blue-100 dark:border-blue-800 flex items-start gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-info-circle mt-0.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1438,
                                                            columnNumber: 42
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "font-bold",
                                                                    children: "Instruções:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1440,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    children: "Clique e arraste na imagem para selecionar a área que deseja cortar. Use os botões de navegação para trocar de página."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1441,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1439,
                                                            columnNumber: 42
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1437,
                                                    columnNumber: 38
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-end",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: handleCropDownload,
                                                        disabled: !cropSelection || cropSelection.width === 0,
                                                        className: "px-6 py-3 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fas fa-cut"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                lineNumber: 1451,
                                                                columnNumber: 45
                                                            }, this),
                                                            "Cortar e Salvar"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                        lineNumber: 1446,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1445,
                                                    columnNumber: 38
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                            lineNumber: 1370,
                                            columnNumber: 33
                                        }, this),
                                        activeTool === 'rotate' && files.length > 0 && rotateImgData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mt-6 flex flex-col gap-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg gap-4",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card-hover)',
                                                        borderColor: 'var(--border-card)'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setRotatePage((p)=>Math.max(1, p - 1)),
                                                                    className: "w-10 h-10 flex items-center justify-center border rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-colors",
                                                                    style: {
                                                                        backgroundColor: 'var(--bg-card)',
                                                                        borderColor: 'var(--border-card)',
                                                                        color: 'var(--text-main)'
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fas fa-chevron-left"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                        lineNumber: 1470,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1465,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "font-bold",
                                                                    style: {
                                                                        color: 'var(--text-main)'
                                                                    },
                                                                    children: [
                                                                        "Página ",
                                                                        rotatePage
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1472,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setRotatePage((p)=>p + 1),
                                                                    className: "w-10 h-10 flex items-center justify-center border rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-colors",
                                                                    style: {
                                                                        backgroundColor: 'var(--bg-card)',
                                                                        borderColor: 'var(--border-card)',
                                                                        color: 'var(--text-main)'
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fas fa-chevron-right"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                        lineNumber: 1478,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1473,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1464,
                                                            columnNumber: 42
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex rounded-lg border p-1",
                                                            style: {
                                                                backgroundColor: 'var(--bg-card)',
                                                                borderColor: 'var(--border-card)'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setRotateMode('all'),
                                                                    className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$clsx__$5b$external$5d$__$28$clsx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$clsx$29$__["default"])("px-4 py-2 rounded-md text-sm font-medium transition-colors", rotateMode === 'all' ? "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"),
                                                                    children: "Todas as Páginas"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1484,
                                                                    columnNumber: 46
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setRotateMode('page'),
                                                                    className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$clsx__$5b$external$5d$__$28$clsx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$clsx$29$__["default"])("px-4 py-2 rounded-md text-sm font-medium transition-colors", rotateMode === 'page' ? "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"),
                                                                    children: "Apenas Esta Página"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1493,
                                                                    columnNumber: 46
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1483,
                                                            columnNumber: 42
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setRotateAngle((a)=>a - 90),
                                                                    className: "px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2",
                                                                    style: {
                                                                        backgroundColor: 'var(--bg-card)',
                                                                        borderColor: 'var(--border-card)',
                                                                        color: 'var(--text-main)'
                                                                    },
                                                                    title: "Girar 90° Anti-horário",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "fas fa-undo"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1512,
                                                                            columnNumber: 49
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "hidden sm:inline",
                                                                            children: "Esq."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1513,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1506,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setRotateAngle(0),
                                                                    className: "px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-white/5 font-bold",
                                                                    style: {
                                                                        backgroundColor: 'var(--bg-card)',
                                                                        borderColor: 'var(--border-card)',
                                                                        color: 'var(--text-main)'
                                                                    },
                                                                    title: "Resetar",
                                                                    children: "0°"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1515,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setRotateAngle((a)=>a + 90),
                                                                    className: "px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2",
                                                                    style: {
                                                                        backgroundColor: 'var(--bg-card)',
                                                                        borderColor: 'var(--border-card)',
                                                                        color: 'var(--text-main)'
                                                                    },
                                                                    title: "Girar 90° Horário",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "hidden sm:inline",
                                                                            children: "Dir."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1529,
                                                                            columnNumber: 49
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "fas fa-redo"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1530,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1523,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1505,
                                                            columnNumber: 42
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1461,
                                                    columnNumber: 38
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative overflow-hidden border rounded-lg flex justify-center p-8",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card-hover)',
                                                        borderColor: 'var(--border-card)'
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "shadow-xl transition-transform duration-300 ease-in-out",
                                                        style: {
                                                            transform: `rotate(${rotateAngle}deg)`,
                                                            maxWidth: '100%',
                                                            maxHeight: '60vh'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                            src: rotateImgData,
                                                            alt: "Page Preview",
                                                            className: "block rounded"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1545,
                                                            columnNumber: 46
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                        lineNumber: 1537,
                                                        columnNumber: 42
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1536,
                                                    columnNumber: 38
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-end gap-4 items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "text-sm",
                                                            style: {
                                                                color: 'var(--text-muted)'
                                                            },
                                                            children: rotateMode === 'all' ? `Rotacionando TODO o documento em ${rotateAngle}°` : `Rotacionando a página ${rotatePage} em ${rotateAngle}°`
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1554,
                                                            columnNumber: 42
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: handleRotate,
                                                            className: "px-8 py-3 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 transition flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fas fa-save"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1564,
                                                                    columnNumber: 45
                                                                }, this),
                                                                "Salvar Rotação"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1560,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1553,
                                                    columnNumber: 38
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                            lineNumber: 1460,
                                            columnNumber: 33
                                        }, this),
                                        activeTool === 'number' && files.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mt-6 flex flex-col gap-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col gap-4 p-6 border rounded-lg",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card-hover)',
                                                        borderColor: 'var(--border-card)'
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col md:flex-row gap-8",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-bold mb-3",
                                                                        style: {
                                                                            color: 'var(--text-main)'
                                                                        },
                                                                        children: "Posição da Numeração"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                        lineNumber: 1581,
                                                                        columnNumber: 50
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "grid grid-cols-3 gap-3 w-48 mx-auto md:mx-0",
                                                                        children: [
                                                                            'top-left',
                                                                            'top-center',
                                                                            'top-right',
                                                                            'bottom-left',
                                                                            'bottom-center',
                                                                            'bottom-right'
                                                                        ].map((pos)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setNumPosition(pos),
                                                                                className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$clsx__$5b$external$5d$__$28$clsx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$clsx$29$__["default"])("w-12 h-16 border-2 rounded transition-all flex items-center justify-center relative", numPosition === pos ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" : "hover:border-orange-300"),
                                                                                style: {
                                                                                    backgroundColor: numPosition === pos ? undefined : 'var(--bg-card)',
                                                                                    borderColor: numPosition === pos ? undefined : 'var(--border-card)'
                                                                                },
                                                                                title: pos,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$clsx__$5b$external$5d$__$28$clsx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$clsx$29$__["default"])("absolute w-2 h-2 rounded-full", pos.includes('top') ? "top-2" : "bottom-2", pos.includes('left') ? "left-2" : pos.includes('right') ? "right-2" : "left-1/2 -translate-x-1/2"),
                                                                                        style: {
                                                                                            backgroundColor: 'var(--text-muted)'
                                                                                        },
                                                                                        children: [
                                                                                            numPosition === pos && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "absolute inset-0 bg-orange-600 rounded-full animate-ping"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                                lineNumber: 1606,
                                                                                                columnNumber: 90
                                                                                            }, this),
                                                                                            numPosition === pos && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "absolute inset-0 bg-orange-600 rounded-full"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                                lineNumber: 1607,
                                                                                                columnNumber: 90
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                        lineNumber: 1599,
                                                                                        columnNumber: 62
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "w-8 h-0.5 top-6 absolute rounded",
                                                                                        style: {
                                                                                            backgroundColor: 'var(--border-card)'
                                                                                        }
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                        lineNumber: 1610,
                                                                                        columnNumber: 62
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "w-8 h-0.5 top-8 absolute rounded",
                                                                                        style: {
                                                                                            backgroundColor: 'var(--border-card)'
                                                                                        }
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                        lineNumber: 1611,
                                                                                        columnNumber: 62
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "w-6 h-0.5 top-10 absolute rounded",
                                                                                        style: {
                                                                                            backgroundColor: 'var(--border-card)'
                                                                                        }
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                        lineNumber: 1612,
                                                                                        columnNumber: 62
                                                                                    }, this)
                                                                                ]
                                                                            }, pos, true, {
                                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                lineNumber: 1584,
                                                                                columnNumber: 58
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                        lineNumber: 1582,
                                                                        columnNumber: 50
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                lineNumber: 1580,
                                                                columnNumber: 46
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-bold mb-3",
                                                                        style: {
                                                                            color: 'var(--text-main)'
                                                                        },
                                                                        children: "Iniciar em"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                        lineNumber: 1620,
                                                                        columnNumber: 50
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2 mb-4",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "1",
                                                                                value: numStart,
                                                                                onChange: (e)=>setNumStart(parseInt(e.target.value) || 1),
                                                                                className: "w-24 p-3 border rounded-lg text-lg font-bold text-center focus:border-orange-500 focus:outline-none",
                                                                                style: {
                                                                                    backgroundColor: 'var(--bg-card)',
                                                                                    borderColor: 'var(--border-card)',
                                                                                    color: 'var(--text-main)'
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                lineNumber: 1622,
                                                                                columnNumber: 54
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "text-sm",
                                                                                style: {
                                                                                    color: 'var(--text-muted)'
                                                                                },
                                                                                children: [
                                                                                    '(A primeira página do PDF será "',
                                                                                    numStart,
                                                                                    '")'
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                lineNumber: 1630,
                                                                                columnNumber: 54
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                        lineNumber: 1621,
                                                                        columnNumber: 50
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-bold mb-3",
                                                                        style: {
                                                                            color: 'var(--text-main)'
                                                                        },
                                                                        children: "Cor da Numeração"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                        lineNumber: 1633,
                                                                        columnNumber: 50
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2 mb-4",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                type: "color",
                                                                                value: numColor,
                                                                                onChange: (e)=>setNumColor(e.target.value),
                                                                                className: "h-10 w-10 p-1 border rounded cursor-pointer",
                                                                                style: {
                                                                                    backgroundColor: 'var(--bg-card)',
                                                                                    borderColor: 'var(--border-card)'
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                lineNumber: 1635,
                                                                                columnNumber: 54
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "text-sm",
                                                                                style: {
                                                                                    color: 'var(--text-muted)'
                                                                                },
                                                                                children: numColor
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                lineNumber: 1642,
                                                                                columnNumber: 54
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                        lineNumber: 1634,
                                                                        columnNumber: 50
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-bold mb-3",
                                                                        style: {
                                                                            color: 'var(--text-main)'
                                                                        },
                                                                        children: "Formato do Texto"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                        lineNumber: 1645,
                                                                        columnNumber: 50
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setNumTextFormat('page_num'),
                                                                                className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$clsx__$5b$external$5d$__$28$clsx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$clsx$29$__["default"])("px-3 py-2 rounded text-sm font-bold border transition-colors", numTextFormat === 'page_num' ? "bg-orange-100 dark:bg-orange-900/40 border-orange-500 text-orange-700 dark:text-orange-400" : "hover:bg-gray-50 dark:hover:bg-white/5"),
                                                                                style: {
                                                                                    backgroundColor: numTextFormat === 'page_num' ? undefined : 'var(--bg-card)',
                                                                                    borderColor: numTextFormat === 'page_num' ? undefined : 'var(--border-card)',
                                                                                    color: numTextFormat === 'page_num' ? undefined : 'var(--text-muted)'
                                                                                },
                                                                                children: "Página X"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                lineNumber: 1647,
                                                                                columnNumber: 54
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setNumTextFormat('num_only'),
                                                                                className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$clsx__$5b$external$5d$__$28$clsx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$clsx$29$__["default"])("px-3 py-2 rounded text-sm font-bold border transition-colors", numTextFormat === 'num_only' ? "bg-orange-100 dark:bg-orange-900/40 border-orange-500 text-orange-700 dark:text-orange-400" : "hover:bg-gray-50 dark:hover:bg-white/5"),
                                                                                style: {
                                                                                    backgroundColor: numTextFormat === 'num_only' ? undefined : 'var(--bg-card)',
                                                                                    borderColor: numTextFormat === 'num_only' ? undefined : 'var(--border-card)',
                                                                                    color: numTextFormat === 'num_only' ? undefined : 'var(--text-muted)'
                                                                                },
                                                                                children: "XX"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                lineNumber: 1663,
                                                                                columnNumber: 54
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                        lineNumber: 1646,
                                                                        columnNumber: 50
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                lineNumber: 1619,
                                                                columnNumber: 46
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                        lineNumber: 1578,
                                                        columnNumber: 42
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1576,
                                                    columnNumber: 38
                                                }, this),
                                                numImgData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                    className: "text-sm font-bold",
                                                                    style: {
                                                                        color: 'var(--text-main)'
                                                                    },
                                                                    children: "Pré-visualização:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1689,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>setNumPage((p)=>Math.max(1, p - 1)),
                                                                            className: "w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 transition-colors",
                                                                            style: {
                                                                                backgroundColor: 'var(--bg-card)',
                                                                                borderColor: 'var(--border-card)'
                                                                            },
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "fas fa-chevron-left text-xs",
                                                                                style: {
                                                                                    color: 'var(--text-muted)'
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                lineNumber: 1696,
                                                                                columnNumber: 57
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1691,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm font-medium",
                                                                            style: {
                                                                                color: 'var(--text-main)'
                                                                            },
                                                                            children: [
                                                                                "Página ",
                                                                                numPage
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1698,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>setNumPage((p)=>p + 1),
                                                                            className: "w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 transition-colors",
                                                                            style: {
                                                                                backgroundColor: 'var(--bg-card)',
                                                                                borderColor: 'var(--border-card)'
                                                                            },
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "fas fa-chevron-right text-xs",
                                                                                style: {
                                                                                    color: 'var(--text-muted)'
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                lineNumber: 1704,
                                                                                columnNumber: 57
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1699,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1690,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1688,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "relative overflow-hidden border rounded-lg flex justify-center p-8",
                                                            style: {
                                                                backgroundColor: 'var(--bg-card-hover)',
                                                                borderColor: 'var(--border-card)'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "shadow-xl",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                                    src: numImgData,
                                                                    alt: "Page Preview",
                                                                    className: "block rounded max-h-[50vh]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1710,
                                                                    columnNumber: 53
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                lineNumber: 1709,
                                                                columnNumber: 49
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1708,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1687,
                                                    columnNumber: 42
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-end gap-4 items-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: handleNumbering,
                                                        className: "px-8 py-3 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 transition flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fas fa-list-ol"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                lineNumber: 1725,
                                                                columnNumber: 45
                                                            }, this),
                                                            "Inserir Numeração"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                        lineNumber: 1721,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1720,
                                                    columnNumber: 38
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                            lineNumber: 1575,
                                            columnNumber: 33
                                        }, this),
                                        activeTool === 'convert' && files.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mt-6 flex flex-col gap-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "p-6 border rounded-lg",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card-hover)',
                                                        borderColor: 'var(--border-card)'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-bold mb-4",
                                                            style: {
                                                                color: 'var(--text-main)'
                                                            },
                                                            children: "Escolha o formato de destino:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1737,
                                                            columnNumber: 42
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-2 md:grid-cols-3 gap-4",
                                                            children: [
                                                                {
                                                                    id: 'word',
                                                                    label: 'Word (.doc)',
                                                                    icon: 'fa-file-word',
                                                                    color: 'text-blue-600'
                                                                },
                                                                {
                                                                    id: 'excel',
                                                                    label: 'Excel (.xls)',
                                                                    icon: 'fa-file-excel',
                                                                    color: 'text-green-600'
                                                                },
                                                                {
                                                                    id: 'powerpoint',
                                                                    label: 'PowerPoint (.ppt)',
                                                                    icon: 'fa-file-powerpoint',
                                                                    color: 'text-orange-600'
                                                                },
                                                                {
                                                                    id: 'jpg',
                                                                    label: 'Imagem (.jpg)',
                                                                    icon: 'fa-file-image',
                                                                    color: 'text-purple-600'
                                                                },
                                                                {
                                                                    id: 'png',
                                                                    label: 'Imagem (.png)',
                                                                    icon: 'fa-file-image',
                                                                    color: 'text-purple-600'
                                                                },
                                                                {
                                                                    id: 'svg',
                                                                    label: 'Vetor (.svg)',
                                                                    icon: 'fa-bezier-curve',
                                                                    color: 'text-pink-600'
                                                                }
                                                            ].map((fmt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setConvertFormat(fmt.id),
                                                                    className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$clsx__$5b$external$5d$__$28$clsx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$clsx$29$__["default"])("flex flex-col items-center gap-3 p-6 border-2 rounded-xl transition-all", convertFormat === fmt.id ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md" : "hover:border-orange-300 hover:shadow-sm"),
                                                                    style: {
                                                                        backgroundColor: convertFormat === fmt.id ? undefined : 'var(--bg-card)',
                                                                        borderColor: convertFormat === fmt.id ? undefined : 'var(--border-card)'
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$clsx__$5b$external$5d$__$28$clsx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$clsx$29$__["default"])("fas fa-3x", fmt.icon, fmt.color)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1761,
                                                                            columnNumber: 54
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "font-bold",
                                                                            style: {
                                                                                color: 'var(--text-main)'
                                                                            },
                                                                            children: fmt.label
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1762,
                                                                            columnNumber: 54
                                                                        }, this)
                                                                    ]
                                                                }, fmt.id, true, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1747,
                                                                    columnNumber: 50
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1738,
                                                            columnNumber: 42
                                                        }, this),
                                                        [
                                                            'word',
                                                            'excel',
                                                            'powerpoint'
                                                        ].includes(convertFormat) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm border border-yellow-200 dark:border-yellow-800",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fas fa-exclamation-triangle mr-2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1769,
                                                                    columnNumber: 50
                                                                }, this),
                                                                "Atenção: A conversão para Office irá gerar um arquivo contendo as páginas como imagens para garantir a fidelidade visual."
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1768,
                                                            columnNumber: 46
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1736,
                                                    columnNumber: 38
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-end gap-4 items-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: handleConvert,
                                                        className: "px-8 py-3 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 transition flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fas fa-exchange-alt"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                lineNumber: 1780,
                                                                columnNumber: 45
                                                            }, this),
                                                            "Converter agora"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                        lineNumber: 1776,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1775,
                                                    columnNumber: 38
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                            lineNumber: 1735,
                                            columnNumber: 33
                                        }, this),
                                        activeTool === 'repair' && files.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mt-6 flex flex-col gap-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                            className: "font-bold text-blue-800 dark:text-blue-300 mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fas fa-search-plus mr-2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1793,
                                                                    columnNumber: 46
                                                                }, this),
                                                                "Análise de Integridade"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1792,
                                                            columnNumber: 42
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-blue-700 dark:text-blue-200 text-sm mb-4",
                                                            children: 'O PDFMaster tentará reconstruir a tabela de referências do seu arquivo (XRef) e salvar uma nova cópia limpa. Isso geralmente corrige erros como "Arquivo corrompido", "Fim de arquivo inesperado" ou páginas em branco.'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1796,
                                                            columnNumber: 42
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "p-4 rounded border border-blue-100 dark:border-blue-800 text-sm",
                                                            style: {
                                                                backgroundColor: 'var(--bg-card)',
                                                                color: 'var(--text-muted)'
                                                            },
                                                            children: [
                                                                "Status: ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "font-bold",
                                                                    style: {
                                                                        color: 'var(--text-main)'
                                                                    },
                                                                    children: "Pronto para análise"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1801,
                                                                    columnNumber: 54
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1800,
                                                            columnNumber: 42
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1791,
                                                    columnNumber: 38
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-end gap-4 items-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: handleRepair,
                                                        className: "px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fas fa-wrench"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                lineNumber: 1810,
                                                                columnNumber: 45
                                                            }, this),
                                                            "Reparar Arquivo"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                        lineNumber: 1806,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1805,
                                                    columnNumber: 38
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                            lineNumber: 1790,
                                            columnNumber: 33
                                        }, this),
                                        activeTool === 'compress' && files.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mb-8 p-6 rounded-xl border",
                                            style: {
                                                backgroundColor: 'var(--bg-card-hover)',
                                                borderColor: 'var(--border-card)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-bold mb-3",
                                                    style: {
                                                        color: 'var(--text-main)'
                                                    },
                                                    children: "Nível de Compressão"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1820,
                                                    columnNumber: 38
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-orange-300",
                                                            style: {
                                                                backgroundColor: 'var(--bg-card)',
                                                                borderColor: 'var(--border-card)'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "radio",
                                                                    name: "compLevel",
                                                                    value: "normal",
                                                                    checked: compressionLevel === 'normal',
                                                                    onChange: ()=>setCompressionLevel('normal'),
                                                                    className: "text-orange-500 focus:ring-orange-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1823,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "font-bold block text-sm",
                                                                            style: {
                                                                                color: 'var(--text-main)'
                                                                            },
                                                                            children: "Normal (Recomendado)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1825,
                                                                            columnNumber: 49
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs",
                                                                            style: {
                                                                                color: 'var(--text-muted)'
                                                                            },
                                                                            children: "Boa qualidade, tamanho reduzido (Qualidade ~70%)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1826,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1824,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1822,
                                                            columnNumber: 42
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-orange-300",
                                                            style: {
                                                                backgroundColor: 'var(--bg-card)',
                                                                borderColor: 'var(--border-card)'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "radio",
                                                                    name: "compLevel",
                                                                    value: "high",
                                                                    checked: compressionLevel === 'high',
                                                                    onChange: ()=>setCompressionLevel('high'),
                                                                    className: "text-orange-500 focus:ring-orange-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1830,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "font-bold block text-sm",
                                                                            style: {
                                                                                color: 'var(--text-main)'
                                                                            },
                                                                            children: "Alta Compressão"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1832,
                                                                            columnNumber: 49
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs",
                                                                            style: {
                                                                                color: 'var(--text-muted)'
                                                                            },
                                                                            children: "Qualidade de imagem reduzida, foco em tamanho (Qualidade ~50%)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1833,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1831,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1829,
                                                            columnNumber: 42
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-orange-300",
                                                            style: {
                                                                backgroundColor: 'var(--bg-card)',
                                                                borderColor: 'var(--border-card)'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "radio",
                                                                    name: "compLevel",
                                                                    value: "extreme",
                                                                    checked: compressionLevel === 'extreme',
                                                                    onChange: ()=>setCompressionLevel('extreme'),
                                                                    className: "text-orange-500 focus:ring-orange-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1837,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "font-bold block text-sm",
                                                                            style: {
                                                                                color: 'var(--text-main)'
                                                                            },
                                                                            children: "Extrema"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1839,
                                                                            columnNumber: 49
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs",
                                                                            style: {
                                                                                color: 'var(--text-muted)'
                                                                            },
                                                                            children: "Baixa resolução, máxima redução (Ideal para rascunhos)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1840,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1838,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1836,
                                                            columnNumber: 42
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-orange-300",
                                                            style: {
                                                                backgroundColor: 'var(--bg-card)',
                                                                borderColor: 'var(--border-card)'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "radio",
                                                                    name: "compLevel",
                                                                    value: "custom",
                                                                    checked: compressionLevel === 'custom',
                                                                    onChange: ()=>setCompressionLevel('custom'),
                                                                    className: "text-orange-500 focus:ring-orange-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1844,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "w-full",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "font-bold block text-sm",
                                                                            style: {
                                                                                color: 'var(--text-main)'
                                                                            },
                                                                            children: "Personalizado (Alvo MB)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1846,
                                                                            columnNumber: 49
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "mt-1 flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs",
                                                                                    style: {
                                                                                        color: 'var(--text-muted)'
                                                                                    },
                                                                                    children: "Tamanho Máximo:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                    lineNumber: 1848,
                                                                                    columnNumber: 53
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                    type: "number",
                                                                                    placeholder: "Ex: 5",
                                                                                    value: customTargetMB,
                                                                                    onChange: (e)=>setCustomTargetMB(e.target.value),
                                                                                    disabled: compressionLevel !== 'custom',
                                                                                    className: "w-24 px-2 py-1 text-sm border rounded focus:ring-orange-500 focus:outline-none",
                                                                                    style: {
                                                                                        backgroundColor: 'var(--bg-page)',
                                                                                        borderColor: 'var(--border-card)',
                                                                                        color: 'var(--text-main)'
                                                                                    }
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                    lineNumber: 1849,
                                                                                    columnNumber: 53
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs",
                                                                                    style: {
                                                                                        color: 'var(--text-muted)'
                                                                                    },
                                                                                    children: "MB"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                                    lineNumber: 1858,
                                                                                    columnNumber: 53
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                            lineNumber: 1847,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1845,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1843,
                                                            columnNumber: 42
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1821,
                                                    columnNumber: 38
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "mt-3 text-xs",
                                                    style: {
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-info-circle mr-1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1864,
                                                            columnNumber: 42
                                                        }, this),
                                                        "Se o Alvo Personalizado não for atingido, ofereceremos dividir o arquivo automaticamente."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1863,
                                                    columnNumber: 38
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                            lineNumber: 1819,
                                            columnNumber: 34
                                        }, this),
                                        processing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mt-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "bg-orange-500 h-full transition-all duration-300 striped-progress",
                                                        style: {
                                                            width: `${activeTool === 'ocr' || activeTool === 'compress' ? ocrProgress : 100}%`
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                                        lineNumber: 1874,
                                                        columnNumber: 42
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1873,
                                                    columnNumber: 38
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-center text-sm mt-2",
                                                    style: {
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: [
                                                        "Processando... ",
                                                        activeTool === 'ocr' || activeTool === 'compress' ? `${ocrProgress}%` : ''
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1879,
                                                    columnNumber: 38
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                            lineNumber: 1872,
                                            columnNumber: 34
                                        }, this),
                                        diffResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mt-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h5", {
                                                    className: "font-bold mb-2",
                                                    style: {
                                                        color: 'var(--text-main)'
                                                    },
                                                    children: "Resultado da Comparação:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1888,
                                                    columnNumber: 38
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "bg-slate-900 text-gray-300 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm",
                                                    children: diffResult.map((part, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: part.added ? 'text-green-400 bg-green-900/30' : part.removed ? 'text-red-400 bg-red-900/30 line-through' : '',
                                                            children: part.value
                                                        }, index, false, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1891,
                                                            columnNumber: 46
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1889,
                                                    columnNumber: 38
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                            lineNumber: 1887,
                                            columnNumber: 34
                                        }, this),
                                        extractedText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mt-6 animate-fade-in",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h5", {
                                                            className: "font-bold",
                                                            style: {
                                                                color: 'var(--text-main)'
                                                            },
                                                            children: "Texto Extraído:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1904,
                                                            columnNumber: 42
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                localStorage.setItem('business_tools_editor_content', extractedText);
                                                                window.location.href = '/text-editor';
                                                            },
                                                            className: "text-sm px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded hover:bg-orange-200 transition-colors font-medium flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fas fa-edit"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                                    lineNumber: 1912,
                                                                    columnNumber: 46
                                                                }, this),
                                                                "Editar no Editor de Texto"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                                            lineNumber: 1905,
                                                            columnNumber: 42
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1903,
                                                    columnNumber: 38
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "border p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm whitespace-pre-wrap shadow-inner",
                                                    style: {
                                                        backgroundColor: 'var(--bg-page)',
                                                        borderColor: 'var(--border-card)',
                                                        color: 'var(--text-main)'
                                                    },
                                                    children: extractedText
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                                    lineNumber: 1916,
                                                    columnNumber: 38
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/pdf-tools.jsx",
                                            lineNumber: 1902,
                                            columnNumber: 34
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                    lineNumber: 1238,
                                    columnNumber: 26
                                }, this),
                                activeTool !== 'crop' && activeTool !== 'rotate' && activeTool !== 'number' && activeTool !== 'convert' && activeTool !== 'repair' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "p-6 border-t",
                                    style: {
                                        backgroundColor: 'var(--bg-card)',
                                        borderColor: 'var(--border-card)'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: handleProcess,
                                        disabled: processing || files.length === 0,
                                        className: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$clsx__$5b$external$5d$__$28$clsx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$clsx$29$__["default"])("w-full py-4 rounded-xl text-lg font-bold text-white transition-all shadow-md", processing || files.length === 0 ? "bg-orange-300 cursor-not-allowed opacity-70" : "bg-orange-400 hover:bg-orange-500 shadow-orange-200"),
                                        children: processing ? 'Processando...' : `${tools.find((t)=>t.id === activeTool)?.label}s`
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/pdf-tools.jsx",
                                        lineNumber: 1929,
                                        columnNumber: 34
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/pdf-tools.jsx",
                                    lineNumber: 1928,
                                    columnNumber: 30
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/pdf-tools.jsx",
                            lineNumber: 1231,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/pdf-tools.jsx",
                    lineNumber: 1210,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/pdf-tools.jsx",
                lineNumber: 1209,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/pdf-tools.jsx",
        lineNumber: 1093,
        columnNumber: 9
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1e4f6689._.js.map