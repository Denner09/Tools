const pdfAnalysis = {
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
            if (typeof Tesseract === 'undefined') {
                throw new Error("Biblioteca OCR (Tesseract) não carregada. Verifique sua conexão ou bloqueadores.");
            }
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
                workerBlobURL: true, // Allow using Blob to bypass Cross-Origin worker restriction
                workerPath: 'https://unpkg.com/tesseract.js@v2.1.0/dist/worker.min.js',
                corePath: 'https://unpkg.com/tesseract.js-core@v2.0.0/tesseract-core.wasm.js',
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
};
