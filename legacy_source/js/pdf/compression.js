const pdfCompression = {
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
    }
};
