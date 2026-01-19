const { createApp } = Vue;
const { PDFDocument, rgb } = PDFLib;

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

createApp({
    data() {
        return {
            currentTool: 'compress',
            file: null,
            resizeScale: "0.75",
            convertFormat: 'png',
            compressionLevel: 'medium',
            customTargetMB: null,
            splitRange: '',
            ocrLang: 'por',
            processing: false,
            progressPercent: 0,
            progressStats: 'Processando...',
            statusMessage: '',
            statusType: 'info',
            ocrResult: '',
            statusMessage: '',
            statusType: 'info',
            ocrResult: '',
            isDark: false,
            // Compression State
            lastResultSize: 0,
            pendingPdfBytes: null,
            compressionModalInstance: null
        }
    },
    mounted() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.isDark = savedTheme === 'dark';
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.isDark = true;
        }
        this.applyTheme();
    },
    computed: {
        toolTitle() {
            const map = {
                'compress': 'Comprimir PDF',
                'split': 'Dividir PDF',
                'resize': 'Redimensionar PDF',
                'convert': 'Converter PDF',
                'ocr': 'OCR (Reconhecimento de Texto)'
            };
            return map[this.currentTool];
        },
        toolDescription() {
            const map = {
                'compress': 'Reduza o tamanho do arquivo com opções avançadas',
                'split': 'Extraia páginas específicas ou divida o arquivo inteiro',
                'resize': 'Altere as dimensões físicas das páginas',
                'convert': 'Transforme seu PDF em outros formatos',
                'ocr': 'Converta imagens e PDFs digitalizados em texto editável'
            };
            return map[this.currentTool];
        },
        actionLabel() {
            if (this.currentTool === 'convert') return `Converter para ${this.convertFormat.toUpperCase()}`;
            return {
                'compress': 'Comprimir PDF',
                'split': 'Dividir Arquivo',
                'resize': 'Redimensionar',
                'ocr': 'Reconhecer Texto'
            }[this.currentTool];
        }
    },
    methods: {
        toggleTheme() {
            this.isDark = !this.isDark;
            this.applyTheme();
            localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
        },
        applyTheme() {
            document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
        },
        setTool(tool) {
            this.currentTool = tool;
            this.statusMessage = '';
            this.ocrResult = '';
            this.file = null;
            this.splitRange = '';
        },
        handleFileUpload(event) {
            this.file = event.target.files[0];
            this.statusMessage = '';
            this.ocrResult = '';
        },
        handleDrop(event) {
            this.file = event.dataTransfer.files[0];
        },
        async readFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });
        },
        // --- Helper: Parse Range ---
        parseRange(rangeStr, maxPages) {
            const pages = new Set();
            if (!rangeStr.trim()) return null; // All pages
            
            const parts = rangeStr.split(',');
            parts.forEach(part => {
                const bounds = part.trim().split('-');
                if (bounds.length === 2) {
                    let start = parseInt(bounds[0]);
                    let end = parseInt(bounds[1]);
                    if (start > end) [start, end] = [end, start];
                    for (let i = start; i <= end; i++) pages.add(i);
                } else {
                    pages.add(parseInt(bounds[0]));
                }
            });
            
            // Filter valid and 1-based index conversion to 0-based
            return Array.from(pages)
                .filter(p => !isNaN(p) && p >= 1 && p <= maxPages)
                .map(p => p - 1)
                .sort((a,b) => a-b);
        },

        async processFile() {
            if (!this.file) return;
            this.processing = true;
            this.progressPercent = 10;
            this.statusMessage = '';
            this.ocrResult = '';

            try {
                if (this.currentTool === 'compress') await this.compressPDF();
                else if (this.currentTool === 'split') await this.splitPDF();
                else if (this.currentTool === 'resize') await this.resizePDF();
                else if (this.currentTool === 'convert') await this.convertPDF();
                else if (this.currentTool === 'ocr') await this.runOCR();
                
                if (!this.ocrResult) { 
                    this.statusMessage = 'Operação concluída com sucesso!';
                }
                this.statusType = 'success';
            } catch (e) {
                console.error(e);
                this.statusMessage = 'Ocorreu um erro: ' + e.message;
                this.statusType = 'error';
            } finally {
                this.processing = false;
                this.progressPercent = 0;
                this.progressStats = 'Processando...';
            }
        },
        
        async compressPDF() {
                const bytes = await this.readFile(this.file);
                
                if (this.compressionLevel === 'low' || this.compressionLevel === 'medium') {
                    // Standard structure optimization
                    this.progressStats = 'Otimizando estrutura...';
                    const pdfDoc = await PDFDocument.load(bytes);
                    const pdfBytes = await pdfDoc.save(); 
                    this.progressPercent = 100;
                    this.finishCompression(pdfBytes, this.file.name);
                } else {
                    // High/Very High/Custom: Rasterize
                    // This is heavy.
                    
                    // Determine settings based on level
                    let quality = 0.6;
                    let scale = 1.5;
                    
                    if (this.compressionLevel === 'very_high') {
                        quality = 0.3;
                        scale = 1.0;
                    } else if (this.compressionLevel === 'custom') {
                        if (!this.customTargetMB || this.customTargetMB <= 0) {
                            alert("Por favor, insira um tamanho alvo válido.");
                            this.processing = false;
                            return;
                        }
                        
                        const currentSizeMB = this.file.size / (1024 * 1024);
                        const targetSizeMB = parseFloat(this.customTargetMB);
                        
                        // Ratio: Desired / Current
                        // e.g. 2MB / 10MB = 0.2
                        let ratio = targetSizeMB / currentSizeMB;
                        
                        if (ratio > 1) ratio = 0.9; // Target is bigger? Just use high quality.
                        
                        // Heuristic Mapping
                        // Quality typically impacts JPEG size linearly-ish above 0.5, but drastically below.
                        // We map ratio to quality roughly.
                        quality = Math.max(0.1, Math.min(0.9, ratio));
                        
                        // If ratio is very small, we must reduce scale (resolution) too
                        if (ratio < 0.3) {
                            scale = 1.0; // 72 DPI
                        } else if (ratio < 0.15) {
                            scale = 0.75; // Low Res
                        } else {
                            scale = 1.5; // Good Res (default for high)
                        }
                        
                        console.log(`Custom Compression: Target=${targetSizeMB}MB, Ratio=${ratio.toFixed(2)}, CalcQuality=${quality.toFixed(2)}, Scale=${scale}`);
                    }

                    this.progressStats = 'Rasterizando páginas (pode demorar)...';
                    const loadingTask = pdfjsLib.getDocument(bytes);
                    const pdf = await loadingTask.promise;
                    const total = pdf.numPages;
                    
                    const newPdf = await PDFDocument.create();
                    
                    // Quality and scale already determined above


                    for (let i = 1; i <= total; i++) {
                        this.progressPercent = (i / total) * 90;
                        this.progressStats = `Processando página ${i}/${total}`;
                        
                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: scale });
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        
                        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
                        
                        // To JPEG
                        const imgDataUrl = canvas.toDataURL('image/jpeg', quality);
                        const imgBytes = await fetch(imgDataUrl).then(res => res.arrayBuffer());
                        
                        const jpgImage = await newPdf.embedJpg(imgBytes);
                        const newPage = newPdf.addPage([viewport.width, viewport.height]);
                        newPage.drawImage(jpgImage, {
                            x: 0,
                            y: 0,
                            width: viewport.width,
                            height: viewport.height,
                        });
                    }
                    
                    const pdfBytes = await newPdf.save();
                    this.finishCompression(pdfBytes, this.file.name);
                }
        },

        async finishCompression(pdfBytes, filename) {
            this.pendingPdfBytes = pdfBytes;
            this.lastResultSize = pdfBytes.byteLength;
            
            // If custom compression and missed target
            if (this.compressionLevel === 'custom' && this.customTargetMB) {
                const targetBytes = parseFloat(this.customTargetMB) * 1024 * 1024;
                // Give a 5% tolerance
                if (this.lastResultSize > targetBytes * 1.05) {
                    // Show Decision Modal
                    if (!this.compressionModalInstance) {
                        this.compressionModalInstance = new bootstrap.Modal(document.getElementById('compressionDecisionModal'));
                    }
                    this.compressionModalInstance.show();
                    return; 
                }
            }
            
            // Default: just save
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            saveAs(blob, `comprimido_${filename}`);
        },

        handleCompressionDecision(action) {
            this.compressionModalInstance.hide();
            
            if (action === 'keep') {
                const blob = new Blob([this.pendingPdfBytes], { type: 'application/pdf' });
                saveAs(blob, `comprimido_max_${this.file.name}`);
                this.statusMessage = 'Arquivo salvo com a melhor compressão possível.';
                this.statusType = 'success';
            } else if (action === 'split') {
                this.smartSplitCompressed();
            } else {
                this.statusMessage = 'Operação cancelada.';
                this.statusType = 'info';
            }
            this.processing = false;
        },

        cleanupCompression() {
            this.pendingPdfBytes = null;
            this.processing = false;
        },

        async smartSplitCompressed() {
            this.processing = true;
            this.progressStats = 'Calculando divisão inteligente...';
            
            try {
                const pdfDoc = await PDFDocument.load(this.pendingPdfBytes);
                const totalPages = pdfDoc.getPageCount();
                const targetBytes = parseFloat(this.customTargetMB) * 1024 * 1024;
                
                const zip = new JSZip();
                let partCount = 1;
                let currentDoc = await PDFDocument.create();
                let currentDocSize = 0;
                let pagesInCurrentDoc = 0;

                for (let i = 0; i < totalPages; i++) {
                    const [page] = await currentDoc.copyPages(pdfDoc, [i]);
                    currentDoc.addPage(page);
                    pagesInCurrentDoc++;
                    
                    // Estimate size (expensive but necessary for smart split)
                    // Optimization: Only check every page or use header overhead estimate?
                    // For accuracy, we must save. Raster PDFs are simple structure + image stream.
                    // Saving gets expensive. We can try to rely on previous page additions?
                    // No, safe way is save.
                    const tempBytes = await currentDoc.save();
                    
                    if (tempBytes.byteLength > targetBytes) {
                        // If this single page alone is > target, we must accept it (or fail).
                        // If we have multiple pages, remove the last one, save current part, start new.
                        
                        if (pagesInCurrentDoc > 1) {
                            // Backtrack: Remove last page
                            currentDoc.removePage(pagesInCurrentDoc - 1);
                            
                            // Save Part
                            const partBytes = await currentDoc.save();
                            zip.file(`parte_${partCount}.pdf`, partBytes);
                            partCount++;
                            
                            // Start new doc with the current page
                            currentDoc = await PDFDocument.create();
                            const [retryPage] = await currentDoc.copyPages(pdfDoc, [i]);
                            currentDoc.addPage(retryPage);
                            pagesInCurrentDoc = 1;
                        } else {
                            // Even a single page is too big. We just save it as is.
                             const partBytes = await currentDoc.save();
                            zip.file(`parte_${partCount}.pdf`, partBytes);
                            partCount++;
                            
                            currentDoc = await PDFDocument.create();
                            pagesInCurrentDoc = 0;
                        }
                    }
                }
                
                // Save last part if exists
                if (pagesInCurrentDoc > 0) {
                     const partBytes = await currentDoc.save();
                     zip.file(`parte_${partCount}.pdf`, partBytes);
                }
                
                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, `comprimido_dividido_${this.file.name}.zip`);
                this.statusMessage = 'Arquivo comprimido e dividido com sucesso!';
                this.statusType = 'success';

            } catch (err) {
                console.error(err);
                this.statusMessage = 'Erro na divisão: ' + err.message;
                this.statusType = 'error';
            } finally {
                this.processing = false;
                this.pendingPdfBytes = null;
            }
        },
        
        async splitPDF() {
            const bytes = await this.readFile(this.file);
            const pdfDoc = await PDFDocument.load(bytes);
            const totalPages = pdfDoc.getPageCount();
            
            const pagesToExtract = this.parseRange(this.splitRange, totalPages);
            
            if (pagesToExtract) {
                this.progressStats = 'Extraindo páginas...';
                const newPdf = await PDFDocument.create();
                const copiedPages = await newPdf.copyPages(pdfDoc, pagesToExtract);
                copiedPages.forEach(page => newPdf.addPage(page));
                
                const pdfBytes = await newPdf.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                saveAs(blob, `dividido_${this.file.name}`);
                
            } else {
                // Burst all
                this.progressStats = 'Dividindo arquivos...';
                const zip = new JSZip();
                for (let i = 0; i < totalPages; i++) {
                    const newPdf = await PDFDocument.create();
                    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
                    newPdf.addPage(copiedPage);
                    const pdfBytes = await newPdf.save();
                    zip.file(`pagina_${i + 1}.pdf`, pdfBytes);
                }
                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, "paginas_individuais.zip");
            }
        },

        async resizePDF() {
            // Existing logic
                const scale = parseFloat(this.resizeScale);
            const bytes = await this.readFile(this.file);
            const pdfDoc = await PDFDocument.load(bytes);
            const pages = pdfDoc.getPages();
            pages.forEach(page => {
                const { width, height } = page.getSize();
                page.scale(scale, scale);
            });
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            saveAs(blob, `redimensionado_${this.file.name}`);
        },
        
        async convertPDF() {
                const bytes = await this.readFile(this.file);
                if (this.convertFormat === 'doc') {
                    this.progressStats = 'Extraindo texto...';
                const loadingTask = pdfjsLib.getDocument(bytes);
                const pdf = await loadingTask.promise;
                let fullText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    fullText += textContent.items.map(item => item.str).join(" ") + "\n\n";
                }
                const blob = new Blob([fullText], { type: 'application/msword' });
                saveAs(blob, `convertido.doc`);
                } else if (this.convertFormat === 'pptx') {
                const loadingTask = pdfjsLib.getDocument(bytes);
                const pdf = await loadingTask.promise;
                const pptx = new PptxGenJS();
                for (let i = 1; i <= pdf.numPages; i++) {
                    this.progressStats = `Gerando Slide ${i}`;
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.0 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    await page.render({ canvasContext: context, viewport: viewport }).promise;
                    const imgData = canvas.toDataURL('image/png');
                    const slide = pptx.addSlide();
                    slide.addImage({ data: imgData, x: 0, y: 0, w: '100%', h: '100%' });
                }
                await pptx.writeFile({ fileName: `convertido.pptx` });
                } else {
                    const loadingTask = pdfjsLib.getDocument(bytes);
                const pdf = await loadingTask.promise;
                const zip = new JSZip();
                for (let i = 1; i <= pdf.numPages; i++) {
                    this.progressStats = `Rasterizando página ${i}`;
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    await page.render({ canvasContext: context, viewport: viewport }).promise;
                    const blob = await new Promise(r => canvas.toBlob(r, `image/${this.convertFormat}`));
                    zip.file(`pagina_${i}.${this.convertFormat}`, blob);
                }
                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, `imagens_${this.convertFormat}.zip`);
                }
        },
        
        async runOCR() {
                // Check file type
                this.progressStats = 'Inicializando OCR...';
                let imageBlob = this.file;
                
                if (this.file.type === 'application/pdf') {
                    this.progressStats = 'Convertendo PDF para Imagem...';
                    const bytes = await this.readFile(this.file);
                    const loadingTask = pdfjsLib.getDocument(bytes);
                    const pdf = await loadingTask.promise;
                    const page = await pdf.getPage(1); // Only page 1 for now to avoid huge wait
                    const viewport = page.getViewport({ scale: 2.0 }); // High scale for better OCR
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    await page.render({ canvasContext: ctx, viewport: viewport }).promise;
                    
                    imageBlob = await new Promise(r => canvas.toBlob(r, 'image/png'));
                }
                
                this.progressStats = 'Lendo texto...';
                
                const { data: { text } } = await Tesseract.recognize(
                imageBlob, 
                this.ocrLang, 
                { 
                    logger: m => {
                        if(m.status === 'recognizing text') {
                            this.progressPercent = m.progress * 100;
                            this.progressStats = `OCR: ${(m.progress * 100).toFixed(0)}%`;
                        }
                    } 
                }
                );
                
                this.ocrResult = text;
                this.statusMessage = 'Texto extraído com sucesso!';
                
                // Auto download txt
                const blob = new Blob([text], { type: 'text/plain' });
                saveAs(blob, 'resultado_ocr.txt');
        }
    }
}).mount('#app');
