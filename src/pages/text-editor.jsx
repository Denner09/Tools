"use client";

import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';


const TextTools = () => {
    const [text, setText] = useState('');
    const [history, setHistory] = useState(['']);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [stats, setStats] = useState({ words: 0, chars: 0 });
    const [notification, setNotification] = useState(null);
    const textareaRef = useRef(null);

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        const savedContent = localStorage.getItem('business_tools_editor_content');
        if (savedContent) {
            updateText(savedContent, false); // Don't add initial load to history multiple times if strict, but here we just set it as base
            setHistory([savedContent]);
            setHistoryIndex(0);
            showNotification('Texto importado do PDF Tools com sucesso!');
            localStorage.removeItem('business_tools_editor_content');
        }
    }, []);

    // Helper to update text and history
    const updateText = (newText, addToHistory = true) => {
        setText(newText);
        updateStats(newText);

        if (addToHistory) {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(newText);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            const previousText = history[newIndex];
            setText(previousText);
            updateStats(previousText);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            const nextText = history[newIndex];
            setText(nextText);
            updateStats(nextText);
        }
    };

    const handleTextChange = (e) => {
        updateText(e.target.value);
    };

    const updateStats = (txt) => {
        const trimmed = txt.trim();
        setStats({
            words: trimmed ? trimmed.split(/\s+/).length : 0,
            chars: txt.length
        });
    };

    const formatCNJ = (input) => {
        const hasFormatting = /[\.\-]/.test(input) && /\d/.test(input);
        if (hasFormatting) {
            return input.replace(/\D/g, ''); 
        }

        let transformedText = input;
        
        const cnj20Regex = /\b(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})\b/g;
        transformedText = transformedText.replace(cnj20Regex, (match, seq, dd, year, j, tr, oooo) => {
            return `${seq}-${dd}.${year}.${j}.${tr}.${oooo}`;
        });

        const cnj18Regex = /\b(\d{7})\D*(\d{4})\D*(\d{1})\D*(\d{2})\D*(\d{4})\b/g;
        transformedText = transformedText.replace(cnj18Regex, (match, seq, year, j, tr, oooo) => {
            if (match.includes('-') || match.includes('.')) {
                return match;
            }
            const suffix = j + tr + oooo;
            const numStr = seq + year + suffix + "00";
            try {
                let remainder = BigInt(numStr) % 97n;
                let dd = 98n - remainder;
                let ddStr = dd.toString().padStart(2, '0');
                return `${seq}-${ddStr}.${year}.${j}.${tr}.${oooo}`;
            } catch (e) {
                console.error("CNJ Calc Error", e);
                return match;
            }
        });

        return transformedText;
    };

    const applyTransformation = (str, type) => {
         switch (type) {
            case 'upper': return str.toUpperCase();
            case 'lower': return str.toLowerCase();
            case 'title': return str.toLowerCase().replace(/(^|\s)\S/g, t => t.toUpperCase());
            case 'sentence': return str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
            case 'alternating': 
                 let newText = "";
                 for (let i = 0; i < str.length; i++) {
                     newText += i % 2 === 0 ? str[i].toLowerCase() : str[i].toUpperCase();
                 }
                 return newText;
            case 'nolinebreak': return str.replace(/(\r\n|\n|\r)/gm, " ");
            case 'removeExtraSpaces': return str.replace(/[ \t]+/g, ' ').trim();
            case 'cnj': return formatCNJ(str);
            default: return str;
        }
    };

    const transform = (type) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const hasSelection = start !== end;
        let newText = text;
        let msg = "";

        // Messages map
        const messages = {
            'upper': "Maiúsculas",
            'lower': "Minúsculas",
            'title': "Título",
            'sentence': "Frase",
            'alternating': "Alternado",
            'nolinebreak': "Sem Quebras",
            'removeExtraSpaces': "Espaços Extras Removidos",
            'cnj': "Formatado CNJ"
        };
        const actionName = messages[type] || "Transformado";

        if (hasSelection) {
            const before = text.substring(0, start);
            const selected = text.substring(start, end);
            const after = text.substring(end);
            
            const transformedSelection = applyTransformation(selected, type);
            newText = before + transformedSelection + after;
            
            msg = `${actionName} (Seleção)`;
            updateText(newText);
            
            // Restore selection asynchronously to wait for React render
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.setSelectionRange(start, start + transformedSelection.length);
                    textareaRef.current.focus();
                }
            }, 0);

        } else {
            if (window.confirm("Nenhum texto selecionado. Deseja aplicar a transformação em TODO o texto?")) {
                newText = applyTransformation(text, type);
                msg = `${actionName} (Tudo)`;
                updateText(newText);
            } else {
                return; // User cancelled
            }
        }

        if(msg) showNotification(msg);
    };

    const downloadFile = (content, fileName, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const downloadDocx = () => {
        const doc = new Document({
            sections: [{
                properties: {},
                children: text.split('\n').map(line => new Paragraph({
                    children: [new TextRun(line)],
                })),
            }],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, "documento.docx");
        });
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 10;
        const maxLineWidth = pageWidth - (margin * 2);
        
        const splitText = doc.splitTextToSize(text, maxLineWidth);
        
        doc.setFontSize(12);
        let y = 10;
        const pageHeight = doc.internal.pageSize.getHeight();
        
        splitText.forEach(line => {
            if (y > pageHeight - 10) {
                doc.addPage();
                y = 10;
            }
            doc.text(line, margin, y);
            y += 7;
        });
        
        doc.save('documento.pdf');
    };

    return (
        <div className="min-h-[calc(100vh-64px)] w-full py-6 px-4" style={{ backgroundColor: 'var(--bg-page)' }}>
            <div className="w-full max-w-[95vw] mx-auto">
                {/* Header */}
                <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-main)' }}>Editor de Texto</h1>
                        <p className="text-sm opacity-80" style={{ color: 'var(--text-muted)' }}>
                            Ferramentas rápidas para formatação, limpeza e conversão de textos.
                        </p>
                    </div>
                    {notification && (
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg text-sm font-medium animate-fade-in shadow-sm border border-green-200 dark:border-green-800">
                            <i className="fas fa-check-circle mr-2"></i>
                            {notification}
                        </div>
                    )}
                </div>

                {/* Main Card */}
                <div 
                    className="rounded-xl shadow-lg border overflow-hidden flex flex-col relative"
                    style={{ 
                        backgroundColor: 'var(--bg-card)', 
                        borderColor: 'var(--border-card)' 
                    }}
                >
                    {/* Toolbar */}
                    <div className="p-3 border-b flex flex-col xl:flex-row flex-wrap gap-x-6 gap-y-3 items-center justify-between" style={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-card)' }}>
                        
                        {/* Undo / Redo Group */}
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={undo} 
                                disabled={historyIndex <= 0}
                                className="w-9 h-9 rounded-lg flex items-center justify-center border hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                title="Desfazer (Ctrl+Z)"
                            >
                                <i className="fas fa-undo text-sm"></i>
                            </button>
                            <button 
                                onClick={redo} 
                                disabled={historyIndex >= history.length - 1}
                                className="w-9 h-9 rounded-lg flex items-center justify-center border hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                title="Refazer (Ctrl+Y)"
                            >
                                <i className="fas fa-redo text-sm"></i>
                            </button>
                            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>
                             <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline-block" style={{ color: 'var(--text-muted)' }}>Ferramentas:</span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 items-center flex-1 justify-end">
                            
                            {/* Casing Group */}
                            <div className="flex flex-wrap gap-2 text-sm">
                                <button 
                                    onClick={() => transform('upper')} 
                                    className="px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm"
                                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                    title="Tudo para maiúsculas"
                                >
                                    <i className="fas fa-arrow-up text-xs opacity-70"></i>
                                    MAIÚSCULAS
                                </button>
                                <button 
                                    onClick={() => transform('lower')} 
                                    className="px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm"
                                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                    title="Tudo para minúsculas"
                                >
                                    <i className="fas fa-arrow-down text-xs opacity-70"></i>
                                    minúsculas
                                </button>
                                <button 
                                    onClick={() => transform('title')} 
                                    className="px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm"
                                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                    title="Primeira Letra Maiúscula"
                                >
                                    <i className="fas fa-heading text-xs opacity-70"></i>
                                    Título
                                </button>
                                <button 
                                    onClick={() => transform('sentence')} 
                                    className="px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm"
                                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                    title="Primeira letra da frase maiúscula"
                                >
                                    <i className="fas fa-align-left text-xs opacity-70"></i>
                                    Frase
                                </button>
                            </div>
                            
                            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2 hidden xl:block"></div>

                            {/* Cleaning Group */}
                            <div className="flex flex-wrap gap-2 text-sm">
                                <button 
                                    onClick={() => transform('nolinebreak')} 
                                    className="px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm"
                                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                    title="Remover quebras de linha"
                                >
                                    <i className="fas fa-level-up-alt rotate-90 text-xs opacity-70 text-blue-500"></i> 
                                    Remover Quebras
                                </button>
                                <button 
                                    onClick={() => transform('removeExtraSpaces')} 
                                    className="px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm"
                                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                    title="Remover múltiplos espaços"
                                >
                                    <i className="fas fa-compress-arrows-alt text-xs opacity-70 text-blue-500"></i> 
                                    Remover Espaços
                                </button>
                                <button 
                                    onClick={() => transform('cnj')} 
                                    className="px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm"
                                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                    title="Formatar numeração CNJ"
                                >
                                    <i className="fas fa-balance-scale text-xs opacity-70 text-orange-500"></i> 
                                    CNJ
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Text Area */}
                    <div className="flex-grow relative">
                        <textarea
                            ref={textareaRef}
                            className="w-full h-[50vh] p-6 resize-none focus:outline-none bg-transparent"
                            style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6' }}
                            value={text}
                            onChange={handleTextChange}
                            placeholder="Cole ou digite seu texto aqui..."
                            spellCheck="false"
                        ></textarea>
                    </div>

                    {/* Footer / Status Bar */}
                    <div 
                        className="py-2 px-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                    >
                        <div className="flex gap-6 font-medium" style={{ color: 'var(--text-muted)' }}>
                            <span><strong className="text-orange-500">{stats.words}</strong> Palavras</span>
                            <span><strong className="text-orange-500">{stats.chars}</strong> Caracteres</span>
                        </div>

                        <div className="flex items-center gap-2">
                             <button 
                                onClick={() => { navigator.clipboard.writeText(text); showNotification("Conteúdo copiado!"); }}
                                className="px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm"
                                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                             >
                                <i className="far fa-copy text-xs opacity-70"></i> 
                                Copiar
                             </button>

                             <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>

                             <button 
                                onClick={() => downloadFile(text, 'texto.txt', 'text/plain')}
                                className="px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm"
                                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                             >
                                <i className="far fa-file-alt text-xs opacity-70"></i>
                                .TXT
                             </button>
                             <button 
                                onClick={() => downloadFile(JSON.stringify({text}), 'texto.json', 'application/json')}
                                className="px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm"
                                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                             >
                                <i className="far fa-file-code text-xs opacity-70"></i>
                                .JSON
                             </button>
                             <button 
                                onClick={downloadDocx}
                                className="px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm"
                                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                             >
                                <i className="fas fa-file-word text-xs opacity-70 text-blue-600"></i> 
                                DOCX
                             </button>
                             <button 
                                onClick={downloadPDF}
                                className="px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm"
                                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                             >
                                <i className="fas fa-file-pdf text-xs opacity-70 text-red-500"></i> 
                                PDF
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextTools;

