const { createApp } = Vue;
const { PDFDocument, rgb } = PDFLib;

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
            currentTool: 'merge', 
            file: null, // Legacy single file support
            files: [], // Array for multiple files
            compareFile: null, // Second file
            previewImage: null, // For Rotation/Number/Crop Preview
            previewPage: 1,
            totalPages: 0,
            previewOriginalWidth: 0, // In Points
            previewOriginalHeight: 0, // In Points
            isCropping: false,
            cropStart: { x: 0, y: 0 },
            cropBox: { x: 0, y: 0, w: 0, h: 0 }, 
            pageCrops: {}, 
            cropMode: 'all', 
            convertDirection: 'to_others', 
            
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
        // Import methods from mixins
        ...pdfUtils,
        ...pdfCompression,
        ...pdfConversion,
        ...pdfManipulation,
        ...pdfAnalysis,

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
                const msg = (e && e.message) ? e.message : (typeof e === 'string' ? e : JSON.stringify(e));
                this.statusMessage = 'Ocorreu um erro: ' + msg;
                this.statusType = 'error';
            } finally {
                this.processing = false;
                this.progressPercent = 0;
                this.progressStats = 'Processando...';
            }
        }
    }
}).mount('#app');
