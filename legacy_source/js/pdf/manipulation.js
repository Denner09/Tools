const pdfManipulation = {
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
    }
};
