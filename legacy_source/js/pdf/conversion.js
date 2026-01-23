const pdfConversion = {
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
    }
};
