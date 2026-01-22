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
            spellCheckEnabled: false,
            showExportMenu: false,
            isNavOpen: false
        }
    },
    computed: {

        wordCount() {
            const text = this.inputText.trim();
            return text ? text.split(/\s+/).length : 0;
        },
        charCount() {
            return this.inputText.length;
        }
    },
    watch: {

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
        toggleExportMenu() {
            this.showExportMenu = !this.showExportMenu;
            if (this.showExportMenu) {
                // Add listener asynchronously to avoid immediate closing
                setTimeout(() => {
                    document.addEventListener('click', this.closeExportMenu);
                }, 0);
            }
        },
        closeExportMenu(e) {
            // Close menu on any click outside (or inside, acting like a selection)
            this.showExportMenu = false;
            document.removeEventListener('click', this.closeExportMenu);
        },
        toggleNav() {
            this.isNavOpen = !this.isNavOpen;
            if (this.isNavOpen) {
                setTimeout(() => document.addEventListener('click', this.closeNav), 0);
            }
        },
        closeNav() {
            this.isNavOpen = false;
            document.removeEventListener('click', this.closeNav);
        },
        handleInput(e) {
            this.inputText = e.target.innerText;
        },
        handlePaste(e) {
            e.preventDefault();
            const text = (e.originalEvent || e).clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        },
        clearText() {
            this.inputText = '';
            if (this.$refs.editor) {
                this.$refs.editor.innerText = '';
            }
        },
        transform(type) {
            const editor = this.$refs.editor;
            if (!editor) return;

            const selection = window.getSelection();
            if (!selection.rangeCount || !editor.contains(selection.anchorNode)) {
                 // No valid selection inside editor check
                 // If no selection or selection outside, we might assume "Select All" if focused?
                 // But let's check text length
            }

            const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
            let textToTransform = "";
            let replaceAll = false;
            
            // Check if there is actual text selected
            if (range && !selection.isCollapsed && editor.contains(range.commonAncestorContainer)) {
                 textToTransform = selection.toString();
            } else {
                 if (this.inputText.trim().length === 0) return;
                 
                 // No selection, ask user
                 if (confirm("Nenhum texto selecionado. Deseja aplicar a alteração em todo o texto?")) {
                    textToTransform = editor.innerText;
                    replaceAll = true;
                } else {
                    return; // Cancelled
                }
            }

            if (!textToTransform) return;

            let transformedText = "";
            switch (type) {
                case 'upper':
                    transformedText = textToTransform.toUpperCase();
                    break;
                case 'lower':
                    transformedText = textToTransform.toLowerCase();
                    break;
                case 'title':
                    transformedText = textToTransform.toLowerCase().replace(/(^|\s)\S/g, t => t.toUpperCase());
                    break;
                case 'alternating':
                    transformedText = "";
                    for (let i = 0; i < textToTransform.length; i++) {
                        if (i % 2 === 0) {
                            transformedText += textToTransform[i].toLowerCase();
                        } else {
                            transformedText += textToTransform[i].toUpperCase();
                        }
                    }
                    break;
                case 'sentence':
                    transformedText = textToTransform.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
                    break;
                case 'nolinebreak':
                    transformedText = textToTransform.replace(/(\r\n|\n|\r)/gm, " ");
                    break;
                case 'cnj':
                    // Transform 18 digits (NNNNNNNAAAAJTROOOO) to NNNNNNN-DD.AAAA.J.TR.OOOO
                    // Extract parts directly from selection (ignoring non-digits in between)
                    // Pattern: 7 digits (Seq) + 4 digits (Year) + 7 digits (Suffix: J+TR+OOOO)
                    const cnjRegex = /\b(\d{7})\D*(\d{4})\D*(\d{1})\D*(\d{2})\D*(\d{4})\b/g;
                    
                    let matchFound = false;
                    transformedText = textToTransform.replace(cnjRegex, (match, seq, year, j, tr, oooo) => {
                        matchFound = true;
                        // Suffix is J + TR + OOOO
                        const suffix = j + tr + oooo;
                        
                        // Calculate Mod 97
                        // Concatenate: NNNNNNN + AAAA + J + TR + OOOO + 00
                        const numStr = seq + year + suffix + "00";
                        
                        let remainder = BigInt(numStr) % 97n;
                        let dd = 98n - remainder;
                        let ddStr = dd.toString().padStart(2, '0');
                        
                        // Format: NNNNNNN-DD.AAAA.J.TR.OOOO
                        return `${seq}-${ddStr}.${year}.${j}.${tr}.${oooo}`;
                    });

                    if (!matchFound) {
                        // Fallback: Check if it looks like they selected just 11 digits? 
                        // User specifically asked to "Get suffix from number", so assume 18 is required.
                        alert("Nenhuma sequência válida de 18 dígitos (NNNNNNN...AAAA...J.TR.OOOO) encontrada para cálculo do dígito verificador.");
                        return;
                    }
                    break;
            }

            // Apply change
            editor.focus();
            if (replaceAll) {
                document.execCommand('selectAll', false, null);
            }
            // insertText simply replaces the current selection (or all if selected)
            document.execCommand('insertText', false, transformedText);
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
                "<head><meta charset='utf-8'><title>Exportar HTML para Documento Word</title></head><body>";
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
