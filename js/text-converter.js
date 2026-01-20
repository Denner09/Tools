const { createApp } = Vue;
const { jsPDF } = window.jspdf;

createApp({
    data() {
        return {
            isDark: false,
            inputText: '',
            // We'll trust inputText as the source of truth for transformations
            // But we display it in the output div.
            // Since the output div is contenteditable (for spellcheck fixes by user), 
            // we need to be careful about sync. 
            // For now, let's make transformations apply to inputText, 
            // and inputText updates the output.
            // If user edits output, we should probably update inputText? 
            // Or just treat Input as "Raw" and Output as "Final".
            // Let's treat Input as Source. Transformations apply to Source and update Output.
            spellCheckEnabled: false
        }
    },
    computed: {
        outputText() {
            return this.inputText;
        },
        wordCount() {
            const text = this.inputText.trim();
            return text ? text.split(/\s+/).length : 0;
        },
        charCount() {
            return this.inputText.length;
        }
    },
    watch: {
        inputText(newVal) {
            // When input changes, update the content of the ref
            // We use keyup/input binding on the contenteditable to go the other way if needed?
            // For now, one-way sync Input -> Output is safer for "Tools".
            // If user fixes spelling in Output, they might want to keep it.
            // Let's check: if I fix spelling in output, I want it to persist.
            // But if I type in input, it overwrites output.
            // To support both, we might just have ONE `text` model and two views?
            // "Viewer em tempo real" implies watching changes.
            // Let's make the Output follow Input, but if user edits Output, update Input.
            
            // Actually, we'll manually update the innerText of the div to avoid cursor jumping
            // only if the generic v-html/interpolation isn't enough.
            // Vue's {{ outputText }} inside the div works for one-way.
            
            // To keep it simple: Input is for "Raw Entry". Output is "Result".
            // Transformations change the INPUT text directly? Or just the Output?
            // "coloque o texto em um campo... e possa ver as edições numa viewer em tempo real"
            // Usually means Input -> Process -> Output.
            
            // Let's update the DOM of the contenteditable manually if needed to trigger spellcheck re-render
            this.$nextTick(() => {
                if (this.$refs.outputArea && this.$refs.outputArea.innerText !== newVal) {
                    this.$refs.outputArea.innerText = newVal;
                }
            });
        }
    },
    mounted() {
        // Theme initialization
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.isDark = savedTheme === 'dark';
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.isDark = true;
        }
        this.applyTheme();

        // Listen for edits in the output area to sync back (optional, but good for "corrector")
        if (this.$refs.outputArea) {
            this.$refs.outputArea.addEventListener('input', (e) => {
                this.inputText = e.target.innerText;
            });
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
        toggleSpellCheck() {
            this.spellCheckEnabled = !this.spellCheckEnabled;
        },
        clearText() {
            this.inputText = '';
        },
        transform(type) {
            let text = this.inputText;
            switch (type) {
                case 'upper':
                    this.inputText = text.toUpperCase();
                    break;
                case 'lower':
                    this.inputText = text.toLowerCase();
                    break;
                case 'sentence':
                    // Capitalize first letter of each sentence (. ! ?)
                    this.inputText = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
                    break;
                case 'nolinebreak':
                    this.inputText = text.replace(/(\r\n|\n|\r)/gm, " ");
                    break;
            }
        },
        copyToClipboard() {
            navigator.clipboard.writeText(this.inputText).then(() => {
                alert('Texto copiado para a área de transferência!');
            }).catch(err => {
                console.error('Erro ao copiar: ', err);
            });
        },
        downloadTxt() {
            this.downloadFile(this.inputText, 'texto.txt', 'text/plain');
        },
        downloadJson() {
            const data = JSON.stringify({ text: this.inputText, date: new Date().toISOString() }, null, 2);
            this.downloadFile(data, 'texto.json', 'application/json');
        },
        downloadDoc() {
            // Simple HTML doc export
            const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
                "xmlns:w='urn:schemas-microsoft-com:office:word' " +
                "xmlns='http://www.w3.org/TR/REC-html40'>. " +
                "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
            const footer = "</body></html>";
            // Replace newlines with <br> for HTML rendering in Word
            const htmlContent = this.inputText.replace(/\n/g, "<br>");
            const sourceHTML = header + htmlContent + footer;
            
            this.downloadFile(sourceHTML, 'documento.doc', 'application/msword');
        },
        downloadPDF() {
            const doc = new jsPDF();
            
            // Split text to fit page
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 10;
            const maxLineWidth = pageWidth - (margin * 2);
            
            const splitText = doc.splitTextToSize(this.inputText, maxLineWidth);
            
            // Add text
            doc.setFontSize(12);
            // Handle long text pagination
            let y = 10;
            const pageHeight = doc.internal.pageSize.getHeight();
            
            splitText.forEach(line => {
                if (y > pageHeight - 10) {
                    doc.addPage();
                    y = 10;
                }
                doc.text(line, margin, y);
                y += 7; // Line height
            });
            
            doc.save('documento.pdf');
        },
        downloadFile(content, fileName, mimeType) {
            const blob = new Blob([content], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    }
}).mount('#app');
