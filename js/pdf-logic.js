const { createApp } = Vue;
const { PDFDocument, rgb } = PDFLib;

// Initialize PDF.js worker
// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// Configure CMaps and Standard Fonts to fix rendering warnings/errors
const cdnUrl = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/';
pdfjsLib.GlobalWorkerOptions.cMapUrl = cdnUrl;
pdfjsLib.GlobalWorkerOptions.cMapPacked = true;
pdfjsLib.GlobalWorkerOptions.standardFontDataUrl = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/standard_fonts/';

createApp({
    data() {
        return {
            currentTool: 'merge', // Changed default to show new options first? No, keep user flow. 
            file: null, // Legacy single file support (for most tools)
            files: [], // Array for multiple files (merge)
            compareFile: null, // Second file for comparison
            previewImage: null, // For Rotation/Number/Crop Preview
            previewPage: 1,
            totalPages: 0,
            previewOriginalWidth: 0, // In Points
            previewOriginalHeight: 0, // In Points
            isCropping: false,
            cropStart: { x: 0, y: 0 },
            cropBox: { x: 0, y: 0, w: 0, h: 0 }, // For UI rendering in pixels
            pageCrops: {}, // Store crop margins per page { pageNum: {top,bottom...} }
            cropMode: 'all', // 'all' (entire doc) or 'selection' (cropped pages only)
            convertDirection: 'to_others', // 'to_others' (PDF->Formats) or 'to_pdf' (Formats->PDF)
            
            // Tool Options
            resizeScale: "0.75",
            convertFormat: 'png',
            compressionLevel: 'medium',
            customTargetMB: null,
            splitRange: '',
            rotateAngle: '90',
            numberPosition: 'bottom-center',
            cropMargins: { top: 0, bottom: 0, left: 0, right: 0 },
            
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
        toolDescription() {
            const map = {
                'compress': 'Reduza o tamanho do arquivo com opções avançadas',
                'split': 'Extraia páginas específicas ou divida o arquivo inteiro',
                'resize': 'Altere as dimensões físicas das páginas',
                'convert': 'Transforme seu PDF em outros formatos',
                'ocr': 'Converta imagens e PDFs digitalizados em texto editável',
                'merge': 'Junte múltiplos arquivos PDF em um único documento',
                'rotate': 'Gire as páginas do seu documento',
                'crop': 'Recorte margens ou conteúdo indesejado',
                'repair': 'Tente recuperar arquivos corrompidos ou normalize a estrutura',
                'number': 'Adicione numeração de páginas ao documento',
                'compare': 'Compare o conteúdo de texto entre dois arquivos PDF'
            };
            return map[this.currentTool];
        },
        actionLabel() {
            if (this.currentTool === 'convert') {
                return (this.convertDirection === 'to_pdf') ? 'Gerar PDF' : `Converter para ${this.convertFormat.toUpperCase()}`;
            }
            const map = {
                'compress': 'Comprimir PDF',
                'split': 'Dividir Arquivo',
                'resize': 'Redimensionar',
                'ocr': 'Reconhecer Texto',
                'merge': 'Juntar PDFs',
                'rotate': 'Rotacionar',
                'crop': 'Recortar',
                'repair': 'Reparar Arquivo',
                'number': 'Inserir Números',
                'compare': 'Comparar Arquivos'
            };
            return map[this.currentTool] || 'Processar';
        },
        toolTitle() {
             const map = {
                'compress': 'Comprimir PDF',
                'split': 'Dividir PDF',
                'resize': 'Redimensionar PDF',
                'convert': 'Converter PDF',
                'ocr': 'OCR',
                'merge': 'Juntar PDFs',
                'rotate': 'Rotacionar PDF',
                'crop': 'Recortar PDF',
                'repair': 'Reparar PDF',
                'number': 'Numeração de Páginas',
                'compare': 'Comparar PDFs'
            };
            return map[this.currentTool];
        },
        inputAccept() {
            if (this.currentTool === 'ocr') return '.pdf,.jpg,.jpeg,.png';
            if (this.currentTool === 'convert' && this.convertDirection === 'to_pdf') {
                 // Expanded accept for experimental office support
                 return '.jpg,.jpeg,.png,.docx,.xlsx';
            }
            return '.pdf';
        },
        allowMultiple() {
             if (this.currentTool === 'merge' || this.currentTool === 'compare') return true;
             if (this.currentTool === 'convert' && this.convertDirection === 'to_pdf') return true;
             return false;
        },
        reductionAnalysis() {
            if (!this.customTargetMB || !this.file) return {};
            const currentMB = this.file.size / (1024 * 1024);
            const targetMB = parseFloat(this.customTargetMB);
            const percent = (100 - (targetMB / currentMB * 100));
            
            if (percent < 20) {
                return { 
                    recommendation: 'Mínima / Baixa (Estrutura ou 300dpi)', 
                    color: 'bg-info', 
                    icon: 'fa-feather' 
                };
            } else if (percent < 50) {
                return { 
                    recommendation: 'Média (eBook / 150dpi)', 
                    color: 'bg-primary', 
                    icon: 'fa-book-reader' 
                };
            } else if (percent < 80) {
                return { 
                    recommendation: 'Alta (Tela / 72dpi)', 
                    color: 'bg-warning', 
                    icon: 'fa-mobile-alt'
                };
            } else {
                return { 
                    recommendation: 'Ultra (Reconstrução Necessária)', 
                    color: 'bg-danger', 
                    icon: 'fa-compress-arrows-alt'
                };
            }
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
            this.files = [];
            this.compareFile = null;
            this.splitRange = '';
            this.pageCrops = {};
            this.cropMargins = { top: 0, bottom: 0, left: 0, right: 0 };
        },
        handleFileUpload(event) {
            if (!event.target.files || event.target.files.length === 0) return;
            this.files = Array.from(event.target.files);
            
            // Validation Logic based on tool
            if (this.currentTool === 'merge' || this.currentTool === 'compare' || (this.currentTool === 'convert' && this.convertDirection === 'to_pdf')) {
                 this.file = this.files[0];
                 
                 if (this.currentTool === 'compare') {
                    if (this.files.length > 1) this.compareFile = this.files[1];
                    else this.compareFile = null;
                 }
            } else {
                this.file = event.target.files[0];
                if (this.file) {
                    this.files = [this.file];
                } else {
                    this.files = [];
                }
            }
            
            this.statusMessage = '';
            this.ocrResult = '';
            
            if (['rotate', 'number', 'crop'].includes(this.currentTool)) {
                this.previewPage = 1; // Reset to page 1
                this.generatePreview();
            }
        },
        handleDrop(event) {
             this.files = Array.from(event.dataTransfer.files);
             
             if (this.currentTool === 'merge' || this.currentTool === 'compare' || (this.currentTool === 'convert' && this.convertDirection === 'to_pdf')) {
                this.file = this.files[0];
                if (this.currentTool === 'compare' && this.files.length > 1) this.compareFile = this.files[1];
            } else {
                this.file = event.dataTransfer.files[0];
                this.files = [this.file];
            }
            
            if (['rotate', 'number', 'crop'].includes(this.currentTool)) {
                this.previewPage = 1;
                this.generatePreview();
            }
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
                else if (this.currentTool === 'merge') await this.mergePDF();
                else if (this.currentTool === 'rotate') await this.rotatePDF();
                else if (this.currentTool === 'repair') await this.repairPDF();
                else if (this.currentTool === 'number') await this.numberPDF();
                else if (this.currentTool === 'crop') await this.cropPDF();
                else if (this.currentTool === 'compare') await this.comparePDF();
                
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
                
                if (this.compressionLevel === 'low') {
                    // Standard structure optimization (Old 'Low/Medium' logic)
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

                    if (this.compressionLevel.startsWith('gs_')) {
                         await this.compressWithGhostscript(bytes);
                         return;
                    }
                    
                    if (this.compressionLevel === 'rebuild_ultra') {
                        await this.compressWithRebuild(bytes);
                        return;
                    }

                    this.progressStats = 'Rasterizando páginas (pode demorar)...';
                    const loadingTask = pdfjsLib.getDocument({
                        data: bytes,
                        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/',
                        cMapPacked: true,
                        standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/standard_fonts/'
                    });
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

        async compressWithGhostscript(fileBytes) {
            if (typeof Module === 'undefined') {
                throw new Error("Módulo Ghostscript (Wasm) ainda não carregou. Tente novamente em alguns segundos.");
            }

            this.progressStats = 'Inicializando Ghostscript...';
            console.log("Iniciando compressão Ghostscript...");

            // Capture Logs
            let gsOutput = [];
            const logFn = (msg) => {
                console.log("[GS]", msg);
                gsOutput.push(msg);
            };

            // Map settings
            const settingsMap = {
                'gs_screen': '/screen',
                'gs_ebook': '/ebook',
                'gs_printer': '/printer'
            };
            const setting = settingsMap[this.compressionLevel] || '/ebook';

            try {
                // Initialize Module with callbacks
                const instance = await Module({
                    print: logFn,
                    printErr: logFn
                });
                
                this.progressStats = 'Processando PDF (pode demorar)...';
                
                // Write input
                const inputName = 'input.pdf';
                const outputName = 'output.pdf';
                
                instance.FS.writeFile(inputName, new Uint8Array(fileBytes));
                
                // Arguments
                // Arguments Construction
                const args = [
                    '-sDEVICE=pdfwrite',
                    '-dCompatibilityLevel=1.4',
                    `-dPDFSETTINGS=${setting}`,
                    '-dNOPAUSE',
                    '-dQUIET',
                    '-dBATCH',
                    '-dSAFER',
                    '-dDetectDuplicateImages=true',
                    '-dStripProperties=true', // Remove Metadata
                    '-dRemoveMetadata=true',  // Remove Metadata
                    '-dPreserveOPIComments=false',
                    '-dPreserveEPSInfo=false',
                    '-dCompressFonts=true',
                    '-dSubsetFonts=true',
                    '-dMaxSubsetPct=100',
                    '-dEmbedAllFonts=true', // Ensure text remains readable but subset
                    `-sOutputFile=${outputName}`,
                    inputName
                ];
                
                // Fine-tune by level
                if (setting === '/screen') {
                    // Aggressive: 72dpi + Force JPEG (DCT) + Re-compress existing JPEGs
                    args.splice(args.length - 2, 0,
                        '-dDownsampleColorImages=true', '-dColorImageResolution=72',
                        '-dDownsampleGrayImages=true', '-dGrayImageResolution=72',
                        '-dDownsampleMonoImages=true', '-dMonoImageResolution=72',
                        '-dAutoFilterColorImages=false', '-dColorImageFilter=/DCTEncode',
                        '-dAutoFilterGrayImages=false', '-dGrayImageFilter=/DCTEncode',
                        '-dColorImageDownsampleType=/Bicubic',
                        // Force JPEG quality low specifically for screen
                        '-c', '<< /ColorImageDict << /QFactor 0.2 /Blend 1 /HSamples [2 1 1 2] /VSamples [2 1 1 2] >> >> setdistillerparams',
                        '-dPassThroughJPEGImages=false' 
                    );
                } else if (setting === '/ebook') {
                     // Balanced: 150dpi
                     args.splice(args.length - 2, 0,
                        '-dDownsampleColorImages=true', '-dColorImageResolution=150',
                        '-dColorImageDownsampleType=/Bicubic',
                        '-dPassThroughJPEGImages=false' 
                     );
                }

                console.log("Executando GS com args:", args);

                // Execute
                try {
                    instance.callMain(args);
                } catch (runErr) {
                     // Check if it's a simulated exit()
                     if (runErr instanceof instance.ExitStatus) {
                         if (runErr.status !== 0) throw new Error(`GS Exit Code: ${runErr.status}`);
                     } else if (runErr.message && runErr.message.includes('status')) {
                         // Some builds throw generic Error with status
                     } else {
                         throw runErr;
                     }
                }
                
                // Check if output exists
                let output;
                try {
                    output = instance.FS.readFile(outputName);
                } catch (readErr) {
                    throw new Error("O arquivo de saída não foi gerado. Logs: " + gsOutput.join('\n'));
                }
                
                if (!output || output.byteLength === 0) {
                     throw new Error("O arquivo gerado está vazio. Logs: " + gsOutput.join('\n'));
                }

                console.log(`Sucesso! Entrada: ${fileBytes.byteLength}, Saída: ${output.byteLength}`);
                
                // Clean
                try {
                    instance.FS.unlink(inputName);
                    instance.FS.unlink(outputName);
                } catch(e) {}

                this.finishCompression(output, this.file.name);

            } catch (e) {
                console.error("Erro Ghostscript:", e);
                throw new Error(`Falha no Ghostscript: ${e.message}`);
            }
        },

        async compressWithRebuild(bytes) {
             this.progressStats = "Iniciando reconstrução otimizada...";
             const loadingTask = pdfjsLib.getDocument({
                data: bytes,
                cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/',
                cMapPacked: true,
                standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/standard_fonts/'
             });
             const pdf = await loadingTask.promise;
             const total = pdf.numPages;
             const newPdf = await PDFDocument.create();

             // Options for browser-image-compression
             // Dynamic settings based on file size?
             // If file is really small, we need to be super aggressive or we will increase size (rasterization overhead)
             const isSmallFile = this.file.size < 2 * 1024 * 1024; // < 2MB

             const options = {
                maxSizeMB: isSmallFile ? 0.1 : 0.5,          // Tighter target: 100KB or 500KB per page
                maxWidthOrHeight: isSmallFile ? 800 : 1200, // Limit resolution
                useWebWorker: true,
                fileType: 'image/jpeg',
                initialQuality: isSmallFile ? 0.5 : 0.6
             };

             for (let i = 1; i <= total; i++) {
                this.progressStats = `Reconstruindo página ${i}/${total}...`;
                const page = await pdf.getPage(i);
                
                // Render scale: Lower for small files to avoid bloating vectors
                const scale = isSmallFile ? 1.0 : 1.5;
                const viewport = page.getViewport({ scale: scale });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                
                await page.render({ canvasContext: ctx, viewport: viewport }).promise;
                
                // Convert to Blob
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
                const imageFile = new File([blob], "page.jpg", { type: "image/jpeg" });

                // Run smart compression
                // Note: browser-image-compression is global 'imageCompression'
                let compressedFile;
                try {
                    console.log(`Comprimindo imagem pg ${i}, original: ${(imageFile.size/1024).toFixed(0)}KB`);
                    compressedFile = await imageCompression(imageFile, options);
                    console.log(`Resultado pg ${i}: ${(compressedFile.size/1024).toFixed(0)}KB`);
                } catch (e) {
                    console.warn("Falha na compressão de imagem, usando original", e);
                    compressedFile = imageFile;
                }

                const imgBuffer = await compressedFile.arrayBuffer();
                const embeddedImage = await newPdf.embedJpg(imgBuffer);
                
                // Add page matching the original aspect ratio (but using the embedded image dims might be different scaling)
                // We use original viewport dims for the page size in PDF
                const pdfPage = newPdf.addPage([viewport.width, viewport.height]);
                pdfPage.drawImage(embeddedImage, {
                    x: 0, 
                    y: 0,
                    width: viewport.width,
                    height: viewport.height
                });
             }
             
             this.progressStats = "Finalizando PDF...";
             const pdfBytes = await newPdf.save();
             this.finishCompression(pdfBytes, this.file.name);
        },

        async finishCompression(pdfBytes, filename) {
            this.pendingPdfBytes = pdfBytes;
            this.lastResultSize = pdfBytes.byteLength;
            
            // Check if file grew (Assessment)
            if (this.lastResultSize >= this.file.size) {
                 const increase = ((this.lastResultSize - this.file.size) / 1024).toFixed(2);
                 const allow = confirm(`Atenção: O arquivo resultante ficou MAIOR que o original (+${increase} KB).\n\nIsso acontece quando o arquivo original já é muito otimizado ou contém texto vetorial que foi transformado em imagem.\n\nDeseja baixar mesmo assim?`);
                 if (!allow) {
                     this.statusMessage = 'Download cancelado pelo usuário (arquivo ficou maior).';
                     this.statusType = 'warning';
                     this.processing = false;
                     return;
                 }
            }

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
        
        // --- CONVERT LOGIC ---
        async convertPDF() {
            if (this.convertDirection === 'to_pdf') {
                if (this.convertFormat === 'office_to_pdf') {
                    await this.convertOfficeToPDF();
                } else {
                    await this.imagesToPDF();
                }
                return;
            }

            this.progressStats = "Iniciando conversão...";
            const format = this.convertFormat;
            
            if (['jpg', 'png', 'svg'].includes(format)) {
                await this.convertToImages(format);
            } else {
                await this.convertToOffice(format);
            }
        },
        
        async convertToImages(format) {
            const bytes = await this.readFile(this.file);
            const loadingTask = pdfjsLib.getDocument(bytes);
            const pdf = await loadingTask.promise;
            
            const zip = new JSZip();
            
            for (let i = 1; i <= pdf.numPages; i++) {
                this.progressStats = `Convertendo página ${i}/${pdf.numPages}`;
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                
                let blob;
                if (format === 'svg') {
                     const opList = await page.getOperatorList();
                     const svgGfx = new pdfjsLib.SVGGraphics(page.commonObjs, page.objs);
                     const svg = await svgGfx.getSVG(opList, viewport);
                     const svgString = new XMLSerializer().serializeToString(svg);
                     blob = new Blob([svgString], {type: 'image/svg+xml'});
                } else {
                     const canvas = document.createElement('canvas');
                     const context = canvas.getContext('2d');
                     canvas.height = viewport.height;
                     canvas.width = viewport.width;
                     await page.render({ canvasContext: context, viewport: viewport }).promise;
                     blob = await new Promise(r => canvas.toBlob(r, `image/${format}`));
                }
                
                zip.file(`pagina_${i}.${format}`, blob);
            }
            
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `imagens_${format}.zip`);
        },
        
        async convertToOffice(format) {
             // Basic Text Extraction fallback for Doc/Xls
             if (format === 'pptx') {
                 // Delegate to existing logic if simple, but let's rewrite slightly for clarity or reuse
                 // Re-using old logic structure but cleaner
                 this.progressStats = 'Gerando slides...';
                 const pres = new PptxGenJS();
                 const bytes = await this.readFile(this.file);
                 const pdf = await pdfjsLib.getDocument(bytes).promise;
                 
                  for (let i = 1; i <= pdf.numPages; i++) {
                    this.progressStats = `Processando slide ${i}/${pdf.numPages}`;
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    await page.render({ canvasContext: ctx, viewport: viewport }).promise;
                    const imgData = canvas.toDataURL('image/png');
                    const slide = pres.addSlide();
                    slide.addImage({ data: imgData, x: 0, y: 0, w: "100%", h: "100%" });
                }
                await pres.writeFile({ fileName: `apresentacao.pptx` });
                return;
             }
             
             // Doc/Xls -> Text Extraction
             this.progressStats = 'Extraindo conteúdo...';
             const bytes = await this.readFile(this.file);
             const pdf = await pdfjsLib.getDocument(bytes).promise;
             let fullText = "";
             
             for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const text = textContent.items.map(s => s.str).join(" ");
                fullText += `--- Página ${i} ---\n${text}\n\n`;
             }
             
             if (format === 'doc') {
                  const blob = new Blob([fullText], { type: "application/msword;charset=utf-8" });
                  saveAs(blob, `documento.doc`);
             } else if (format === 'xls') {
                  // CSV approximation
                  const blob = new Blob([fullText.replace(/ /g, ',')], { type: "text/csv;charset=utf-8" });
                  saveAs(blob, `planilha.csv`);
             }
        },
        
        async imagesToPDF() {
            if (!this.files.length) return;
            this.progressStats = 'Gerando PDF...';
            const pdfDoc = await PDFDocument.create();
            
            for (let i = 0; i < this.files.length; i++) {
                const f = this.files[i];
                const arrayBuffer = await this.readFile(f);
                
                let image;
                if (f.type.includes('png')) {
                    image = await pdfDoc.embedPng(arrayBuffer);
                } else {
                     image = await pdfDoc.embedJpg(arrayBuffer);
                }
                
                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                });
            }
            
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            saveAs(blob, `imagens_combinadas.pdf`);
        },
        
        async convertOfficeToPDF() {
             if (!this.file) return;
             this.progressStats = 'Processando documento (Alpha)...';
             const arrayBuffer = await this.readFile(this.file);
             const name = this.file.name.toLowerCase();
             
             let textContent = "";
             
             try {
                if (name.endsWith('.docx')) {
                     // Convert Docx -> Raw Text
                     const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
                     textContent = result.value;
                } else if (name.endsWith('.xlsx')) {
                     // Convert Xlsx -> CSV-like Text
                     const wb = XLSX.read(arrayBuffer, { type: 'array' });
                     const firstSheet = wb.Sheets[wb.SheetNames[0]];
                     textContent = XLSX.utils.sheet_to_txt(firstSheet);
                }
                
                if (!textContent) {
                    alert('Não foi possível extrair texto deste arquivo.');
                    return;
                }
                
                // Create PDF with text
                await this.drawTextToNewPDF(textContent);
                
             } catch (e) {
                 console.error(e);
                 alert('Erro na conversão experimental: ' + e.message);
             }
        },
        
        async drawTextToNewPDF(text) {
             const pdfDoc = await PDFDocument.create();
             let page = pdfDoc.addPage();
             const { width, height } = page.getSize();
             const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
             const fontSize = 11;
             const margin = 50;
             const lineHeight = fontSize * 1.2;
             
             const textWidth = width - (margin * 2);
             
             // Wrap lines
             const paragraphs = text.split('\n');
             let yPosition = height - margin;
             
             for (let p of paragraphs) {
                 // Simple word wrap
                 const words = p.split(' ');
                 let currentLine = "";
                 
                 for (let word of words) {
                     const testLine = currentLine.length > 0 ? currentLine + " " + word : word;
                     const textLen = font.widthOfTextAtSize(testLine, fontSize);
                     
                     if (textLen > textWidth) {
                         // Print current line
                         page.drawText(currentLine, { x: margin, y: yPosition, size: fontSize, font: font });
                         yPosition -= lineHeight;
                         currentLine = word;
                         
                         if (yPosition < margin) {
                             page = pdfDoc.addPage();
                             yPosition = height - margin;
                         }
                     } else {
                         currentLine = testLine;
                     }
                 }
                 // Last line of paragraph
                 if (currentLine.length > 0) {
                      page.drawText(currentLine, { x: margin, y: yPosition, size: fontSize, font: font });
                      yPosition -= lineHeight;
                 }
                 
                 // Paragraph gap
                 yPosition -= lineHeight * 0.5;
                 
                 if (yPosition < margin) {
                      page = pdfDoc.addPage();
                      yPosition = height - margin;
                 }
             }
             
             const pdfBytes = await pdfDoc.save();
             const blob = new Blob([pdfBytes], { type: 'application/pdf' });
             saveAs(blob, `conversao_experimental.pdf`);
        },
        
        async mergePDF() {
            this.progressStats = 'Juntando arquivos...';
            const mergedPdf = await PDFDocument.create();
            
            for (let i = 0; i < this.files.length; i++) {
                this.progressStats = `Processando arquivo ${i + 1}/${this.files.length}`;
                const fileBytes = await this.readFile(this.files[i]);
                const pdf = await PDFDocument.load(fileBytes);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            
            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            saveAs(blob, `juntado.pdf`);
        },

        async rotatePDF() {
            const bytes = await this.readFile(this.file);
            const pdfDoc = await PDFDocument.load(bytes);
            const pages = pdfDoc.getPages();
            const angle = parseInt(this.rotateAngle);
            const { degrees } = PDFLib;
            
            pages.forEach(page => {
                const currentRotationData = page.getRotation();
                const currentAngle = currentRotationData.angle;
                const newAngle = (currentAngle + angle) % 360;
                page.setRotation(degrees(newAngle));
            });
            
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            saveAs(blob, `rotacionado_${this.file.name}`);
        },

        async generatePreview(pageNumber = this.previewPage) {
             if (!this.file || this.file.type !== 'application/pdf') {
                 this.previewImage = null;
                 this.totalPages = 0;
                 return;
             }
             
             try {
                 const bytes = await this.readFile(this.file);
                 const loadingTask = pdfjsLib.getDocument(bytes);
                 const pdf = await loadingTask.promise;
                 
                 this.totalPages = pdf.numPages;
                 if (pageNumber > this.totalPages) pageNumber = this.totalPages;
                 if (pageNumber < 1) pageNumber = 1;
                 this.previewPage = pageNumber;
                 
                 const page = await pdf.getPage(pageNumber);
                 
                 // Get Original Size in Points (1/72 inch)
                 // view[2] is width, view[3] is height
                 this.previewOriginalWidth = page.view[2];
                 this.previewOriginalHeight = page.view[3];

                 const viewport = page.getViewport({ scale: 0.8 }); // Lower scale for preview
                 const canvas = document.createElement('canvas');
                 const context = canvas.getContext('2d');
                 canvas.height = viewport.height;
                 canvas.width = viewport.width;
                 
                 await page.render({ canvasContext: context, viewport: viewport }).promise;
                 this.previewImage = canvas.toDataURL('image/png');
                 
                 // Reset Crop Box to full initially (if crop tool) - handled by onLoad now to sync with pageCrops

             } catch (e) {
                 console.error("Preview Error", e);
             }
        },
        
        onPreviewImageLoad() {
             // Called when preview image loads. Sync UI with current page's crop.
             if (this.currentTool !== 'crop') return;
             
             const savedCrop = this.pageCrops[this.previewPage];
             
             if (savedCrop) {
                 this.cropMargins = { ...savedCrop };
                 // Reconstruct CropBox from Margins
                 this.updateCropBoxFromMargins();
             } else {
                 this.cropMargins = { top: 0, bottom: 0, left: 0, right: 0 };
                 this.cropBox = { x: 0, y: 0, w: 0, h: 0 };
             }
        },

        updateCropBoxFromMargins() {
            // Convert current mm margins to pixel box
            const img = this.$refs.cropImg; // Direct ref better than finding via DOM
            if (!img) return; // Might happen if not mounted yet
            
            // Wait, accessing $refs in method might be risky if multiple? 
            // In Vue2, refs are okay. In the template we added ref="cropImg".
            // Since it's inside v-if="previewImage", it should exist when onload fires.
            
            // Calculations
            // mm -> pts -> px
            const k = 2.835; // mm -> pts
            
            const displayWidth = img.width || img.naturalWidth;
            const displayHeight = img.height || img.naturalHeight;
            
            if (!displayWidth || !this.previewOriginalWidth) return;
            
            const scaleX = displayWidth / this.previewOriginalWidth;
            const scaleY = displayHeight / this.previewOriginalHeight;
            
            const m = this.cropMargins;
            const topPts = m.top * k;
            const leftPts = m.left * k;
            const bottomPts = m.bottom * k;
            const rightPts = m.right * k;
            
            const x = leftPts * scaleX;
            const y = topPts * scaleY; // Visual Top depends on PDF coord system?
            // PDF: 0,0 is bottom-left. Visual: 0,0 is top-left.
            // Our crop logic in endCrop calculated margins relative to visual edges.
            // Top Margin = distance from visual top.
            // So:
            
            const w = displayWidth - x - (rightPts * scaleX);
            const h = displayHeight - y - (bottomPts * scaleY);
            
            this.cropBox = { x, y, w, h };
        },
        
        changePreviewPage(delta) {
            const newPage = this.previewPage + delta;
            if (newPage >= 1 && newPage <= this.totalPages) {
                this.generatePreview(newPage);
            }
        },
        
        // --- Crop Interactions ---
        startCrop(e) {
             if (!this.previewImage) return;
             this.isCropping = true;
             
             // Get click position relative to image
             const rect = e.target.getBoundingClientRect();
             const x = e.clientX - rect.left;
             const y = e.clientY - rect.top;
             
             this.cropStart = { x, y };
             this.cropBox = { x, y, w: 0, h: 0 };
             
             // Reset margins while drawing new box
             this.cropMargins = { top: 0, bottom: 0, left: 0, right: 0 };
        },
        
        moveCrop(e) {
            if (!this.isCropping) return;
            
            const img = e.target.parentElement.querySelector('img'); 
            // Note: e.target might be the overlay if we drag over it, 
            // but we bind events to the container or overlay?
            // Better to bind to container.
            
            const rect = img.getBoundingClientRect();
            let clientX = e.clientX;
            let clientY = e.clientY;
            
            // Constrain to image area
            if (clientX < rect.left) clientX = rect.left;
            if (clientX > rect.right) clientX = rect.right;
            if (clientY < rect.top) clientY = rect.top;
            if (clientY > rect.bottom) clientY = rect.bottom;

            const currentX = clientX - rect.left;
            const currentY = clientY - rect.top;
            
            const width = currentX - this.cropStart.x;
            const height = currentY - this.cropStart.y;
            
            // Allow drawing in any direction (handle negative w/h)
            this.cropBox = {
                x: width > 0 ? this.cropStart.x : currentX,
                y: height > 0 ? this.cropStart.y : currentY,
                w: Math.abs(width),
                h: Math.abs(height)
            };
        },
        
        endCrop(e) {
            if (!this.isCropping) return;
            this.isCropping = false;
            
            // Calculate Margins in mm
            // 1. Get Ratio of Displayed Image vs Original PDF Points
            const img = e.currentTarget.querySelector('img');
            if (!img) return;
            
            const displayWidth = img.width;
            const displayHeight = img.height;
            
            // Avoid division by zero
            if (displayWidth === 0 || displayHeight === 0) return;
            
            const scaleX = this.previewOriginalWidth / displayWidth;
            const scaleY = this.previewOriginalHeight / displayHeight;
            
            // 2. Convert CropBox (Pixels) -> PDF Points
            const cropLeftPts = this.cropBox.x * scaleX;
            const cropTopPts = this.cropBox.y * scaleY;
            const cropWidthPts = this.cropBox.w * scaleX;
            const cropHeightPts = this.cropBox.h * scaleY;
            
            // 3. Calculate Margins (Points)
            // Left Margin = Crop Left
            // Top Margin = Crop Top (PDF usually 0,0 is bottom-left, but visual is top-left. 
            // However, PDFLib page.setCropBox(x, y, w, h) uses bottom-left origin?
            // Yes. But here we are defining *Margins* to cut off.
            // My backend logic:
            // k = 2.835 (mm to pts)
            // top = margin.top * k
            // newHeight = height - top - bottom
            
            // So "Top Margin" is the distance from the top of the page to the top of the crop box.
            const marginTopPts = cropTopPts;
            const marginLeftPts = cropLeftPts;
            const marginRightPts = this.previewOriginalWidth - (cropLeftPts + cropWidthPts);
            const marginBottomPts = this.previewOriginalHeight - (cropTopPts + cropHeightPts);
            
            // 4. Convert Points -> mm (1 pt = 1/72 inch, 1 inch = 25.4 mm => 1 pt = 0.3527 mm)
            const ptsToMm = 0.352778;
            
            this.cropMargins = {
                top: Math.round(marginTopPts * ptsToMm),
                bottom: Math.round(marginBottomPts * ptsToMm),
                left: Math.round(marginLeftPts * ptsToMm),
                right: Math.round(marginRightPts * ptsToMm)
            };
            
            // Save to Page Config
            this.pageCrops[this.previewPage] = { ...this.cropMargins };
        },

        async repairPDF() {
            // "Repair" by ignoring encryption/normalization
            this.progressStats = 'Tentando normalizar estrutura...';
            const bytes = await this.readFile(this.file);
            // Ignore encryption is key for some "corrupted" but actually just restricted headers
            // Also standard load fixes XREF table.
            try {
                const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
                const pdfBytes = await pdfDoc.save(); 
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                saveAs(blob, `reparado_${this.file.name}`);
            } catch(e) {
                // If PDFLib fails, we can't do much on client.
                throw new Error("Arquivo muito danificado, não foi possível recuperar a estrutura.");
            }
        },

        async numberPDF() {
            const bytes = await this.readFile(this.file);
            const pdfDoc = await PDFDocument.load(bytes);
            const pages = pdfDoc.getPages();
            const total = pages.length;
            
            // Embed font
            const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

            pages.forEach((page, idx) => {
                const { width, height } = page.getSize();
                const text = `${idx + 1} / ${total}`;
                const textSize = 12;
                const textWidth = font.widthOfTextAtSize(text, textSize);
                const textHeight = font.heightAtSize(textSize); // approx
                
                let x = 0;
                let y = 30; // 30px from bottom default
                
                // Position Logic
                const [vPos, hPos] = this.numberPosition.split('-');
                
                if (vPos === 'top') y = height - 30;
                else y = 30;
                
                if (hPos === 'center') x = (width / 2) - (textWidth / 2);
                else if (hPos === 'right') x = width - textWidth - 30;
                else x = 30;
                
                page.drawText(text, {
                    x,
                    y,
                    size: textSize,
                    font: font,
                    color: rgb(0, 0, 0),
                });
            });
            
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            saveAs(blob, `numerado_${this.file.name}`);
        },

        async cropPDF() {
            const bytes = await this.readFile(this.file);
            const pdfDoc = await PDFDocument.load(bytes);
            const pages = pdfDoc.getPages();
            
            // Convert mm to points (1mm = 2.835 pts)
            const k = 2.835;
            
            // Iterate all pages, check if we have a crop for it
            pages.forEach((page, idx) => {
                const pageNum = idx + 1;
                const crop = this.pageCrops[pageNum];
                
                if (crop) {
                    const top = (crop.top || 0) * k;
                    const bottom = (crop.bottom || 0) * k;
                    const left = (crop.left || 0) * k;
                    const right = (crop.right || 0) * k;
                    
                    const { width, height } = page.getSize();
                    const newWidth = width - left - right;
                    const newHeight = height - top - bottom;
                    
                    if (newWidth > 0 && newHeight > 0) {
                        page.setCropBox(left, bottom, newWidth, newHeight); 
                    }
                }
            });
            
            let finalPdfBytes;
            let fileNamePrefix = 'recortado';
            
            if (this.cropMode === 'selection') {
                // Create new PDF with ONLY cropped pages
                const keys = Object.keys(this.pageCrops).map(k => parseInt(k)).sort((a,b) => a-b);
                
                if (keys.length === 0) throw new Error("Nenhuma página foi recortada para salvar.");
                
                const newPdf = await PDFDocument.create();
                // copyPages takes indices (0-based)
                const indices = keys.map(k => k - 1);
                const copiedPages = await newPdf.copyPages(pdfDoc, indices);
                copiedPages.forEach(p => newPdf.addPage(p));
                
                finalPdfBytes = await newPdf.save();
                fileNamePrefix = 'recorte_selecao';
            } else {
                // Save entire document
                finalPdfBytes = await pdfDoc.save();
            }
            
            const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
            saveAs(blob, `${fileNamePrefix}_${this.file.name}`);
        },

        async comparePDF() {
            if (!this.compareFile) throw new Error("Selecione o segundo arquivo para comparar.");
            
            this.progressStats = 'Extraindo textos dos arquivos...';
            
            const getText = async (f) => {
                const b = await this.readFile(f);
                const loadingTask = pdfjsLib.getDocument(b);
                const pdf = await loadingTask.promise;
                let full = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const p = await pdf.getPage(i);
                    const t = await p.getTextContent();
                    full += t.items.map(item => item.str).join(" ") + "\n";
                }
                return { text: full, pages: pdf.numPages };
            };
            
            const [data1, data2] = await Promise.all([getText(this.file), getText(this.compareFile)]);
            
            // Simple comparison
            let report = "RELATÓRIO DE COMPARAÇÃO\n========================\n\n";
            report += `Arquivo 1: ${this.file.name} (${data1.pages} páginas)\n`;
            report += `Arquivo 2: ${this.compareFile.name} (${data2.pages} páginas)\n\n`;
            
            if (data1.text === data2.text) {
                report += "RESULTADO: Os textos são IDÊNTICOS.\n";
            } else {
                report += "RESULTADO: Existem diferenças no conteúdo de texto.\n\n";
                // Simple Diff Check (First 500 chars limit)
                const diffIndex = this.findFirstDiff(data1.text, data2.text);
                if (diffIndex !== -1) {
                    report += `Primeira diferença encontrada próximo ao caractere ${diffIndex}:\n`;
                    report += `\n--- Arquivo 1 (Trecho) ---\n...${data1.text.substring(diffIndex, diffIndex + 100)}...\n`;
                    report += `\n--- Arquivo 2 (Trecho) ---\n...${data2.text.substring(diffIndex, diffIndex + 100)}...\n`;
                }
                
                const lenDiff = Math.abs(data1.text.length - data2.text.length);
                report += `\nDiferença de tamanho de texto: ${lenDiff} caracteres.\n`;
            }
            
            this.statusMessage = 'Comparação concluída. Baixe o relatório.';
            this.statusType = 'success';
            
            // Generate Report TXT
            const blob = new Blob([report], { type: 'text/plain' });
            saveAs(blob, `relatorio_comparacao.txt`);
        },
        
        findFirstDiff(a, b) {
            let i = 0;
            if (a === b) return -1;
            while (a[i] === b[i]) i++;
            return i;
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
