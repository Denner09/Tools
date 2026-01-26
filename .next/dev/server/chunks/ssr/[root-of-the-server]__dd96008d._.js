module.exports = [
"[project]/src/pages/text-editor.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$jspdf__$5b$external$5d$__$28$jspdf$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$jspdf$29$__ = __turbopack_context__.i("[externals]/jspdf [external] (jspdf, cjs, [project]/node_modules/jspdf)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__ = __turbopack_context__.i("[externals]/docx [external] (docx, esm_import, [project]/node_modules/docx)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$file$2d$saver__$5b$external$5d$__$28$file$2d$saver$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$file$2d$saver$29$__ = __turbopack_context__.i("[externals]/file-saver [external] (file-saver, cjs, [project]/node_modules/file-saver)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
"use client";
;
;
;
;
;
const TextTools = ()=>{
    const [text, setText] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([
        ''
    ]);
    const [historyIndex, setHistoryIndex] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        words: 0,
        chars: 0
    });
    const [notification, setNotification] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const showNotification = (msg)=>{
        setNotification(msg);
        setTimeout(()=>setNotification(null), 3000);
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const savedContent = localStorage.getItem('business_tools_editor_content');
        if (savedContent) {
            updateText(savedContent, false); // Don't add initial load to history multiple times if strict, but here we just set it as base
            setHistory([
                savedContent
            ]);
            setHistoryIndex(0);
            showNotification('Texto importado do PDF Tools com sucesso!');
            localStorage.removeItem('business_tools_editor_content');
        }
    }, []);
    // Helper to update text and history
    const updateText = (newText, addToHistory = true)=>{
        setText(newText);
        updateStats(newText);
        if (addToHistory) {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(newText);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    };
    const undo = ()=>{
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            const previousText = history[newIndex];
            setText(previousText);
            updateStats(previousText);
        }
    };
    const redo = ()=>{
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            const nextText = history[newIndex];
            setText(nextText);
            updateStats(nextText);
        }
    };
    const handleTextChange = (e)=>{
        updateText(e.target.value);
    };
    const updateStats = (txt)=>{
        const trimmed = txt.trim();
        setStats({
            words: trimmed ? trimmed.split(/\s+/).length : 0,
            chars: txt.length
        });
    };
    const formatCNJ = (input)=>{
        const hasFormatting = /[\.\-]/.test(input) && /\d/.test(input);
        if (hasFormatting) {
            return input.replace(/\D/g, '');
        }
        let transformedText = input;
        const cnj20Regex = /\b(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})\b/g;
        transformedText = transformedText.replace(cnj20Regex, (match, seq, dd, year, j, tr, oooo)=>{
            return `${seq}-${dd}.${year}.${j}.${tr}.${oooo}`;
        });
        const cnj18Regex = /\b(\d{7})\D*(\d{4})\D*(\d{1})\D*(\d{2})\D*(\d{4})\b/g;
        transformedText = transformedText.replace(cnj18Regex, (match, seq, year, j, tr, oooo)=>{
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
    const applyTransformation = (str, type)=>{
        switch(type){
            case 'upper':
                return str.toUpperCase();
            case 'lower':
                return str.toLowerCase();
            case 'title':
                return str.toLowerCase().replace(/(^|\s)\S/g, (t)=>t.toUpperCase());
            case 'sentence':
                return str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c)=>c.toUpperCase());
            case 'alternating':
                let newText = "";
                for(let i = 0; i < str.length; i++){
                    newText += i % 2 === 0 ? str[i].toLowerCase() : str[i].toUpperCase();
                }
                return newText;
            case 'nolinebreak':
                return str.replace(/(\r\n|\n|\r)/gm, " ");
            case 'removeExtraSpaces':
                return str.replace(/[ \t]+/g, ' ').trim();
            case 'cnj':
                return formatCNJ(str);
            default:
                return str;
        }
    };
    const transform = (type)=>{
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
            setTimeout(()=>{
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
        if (msg) showNotification(msg);
    };
    const downloadFile = (content, fileName, mimeType)=>{
        const blob = new Blob([
            content
        ], {
            type: mimeType
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };
    const downloadDocx = ()=>{
        const doc = new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Document"]({
            sections: [
                {
                    properties: {},
                    children: text.split('\n').map((line)=>new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Paragraph"]({
                            children: [
                                new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["TextRun"](line)
                            ]
                        }))
                }
            ]
        });
        __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Packer"].toBlob(doc).then((blob)=>{
            (0, __TURBOPACK__imported__module__$5b$externals$5d2f$file$2d$saver__$5b$external$5d$__$28$file$2d$saver$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$file$2d$saver$29$__["saveAs"])(blob, "documento.docx");
        });
    };
    const downloadPDF = ()=>{
        const doc = new __TURBOPACK__imported__module__$5b$externals$5d2f$jspdf__$5b$external$5d$__$28$jspdf$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$jspdf$29$__["jsPDF"]();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 10;
        const maxLineWidth = pageWidth - margin * 2;
        const splitText = doc.splitTextToSize(text, maxLineWidth);
        doc.setFontSize(12);
        let y = 10;
        const pageHeight = doc.internal.pageSize.getHeight();
        splitText.forEach((line)=>{
            if (y > pageHeight - 10) {
                doc.addPage();
                y = 10;
            }
            doc.text(line, margin, y);
            y += 7;
        });
        doc.save('documento.pdf');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "min-h-[calc(100vh-64px)] w-full py-6 px-4",
        style: {
            backgroundColor: 'var(--bg-page)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "w-full max-w-[95vw] mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl font-bold mb-1",
                                    style: {
                                        color: 'var(--text-main)'
                                    },
                                    children: "Editor de Texto"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/text-editor.jsx",
                                    lineNumber: 243,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-sm opacity-80",
                                    style: {
                                        color: 'var(--text-muted)'
                                    },
                                    children: "Ferramentas rápidas para formatação, limpeza e conversão de textos."
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/text-editor.jsx",
                                    lineNumber: 244,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/text-editor.jsx",
                            lineNumber: 242,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        notification && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg text-sm font-medium animate-fade-in shadow-sm border border-green-200 dark:border-green-800",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: "fas fa-check-circle mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/text-editor.jsx",
                                    lineNumber: 250,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                notification
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/text-editor.jsx",
                            lineNumber: 249,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/text-editor.jsx",
                    lineNumber: 241,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "rounded-xl shadow-lg border overflow-hidden flex flex-col relative",
                    style: {
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-card)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-3 border-b flex flex-col xl:flex-row flex-wrap gap-x-6 gap-y-3 items-center justify-between",
                            style: {
                                backgroundColor: 'var(--bg-card-hover)',
                                borderColor: 'var(--border-card)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: undo,
                                            disabled: historyIndex <= 0,
                                            className: "w-9 h-9 rounded-lg flex items-center justify-center border hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm",
                                            style: {
                                                backgroundColor: 'var(--bg-card)',
                                                borderColor: 'var(--border-card)',
                                                color: 'var(--text-main)'
                                            },
                                            title: "Desfazer (Ctrl+Z)",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fas fa-undo text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/text-editor.jsx",
                                                lineNumber: 276,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 269,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: redo,
                                            disabled: historyIndex >= history.length - 1,
                                            className: "w-9 h-9 rounded-lg flex items-center justify-center border hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm",
                                            style: {
                                                backgroundColor: 'var(--bg-card)',
                                                borderColor: 'var(--border-card)',
                                                color: 'var(--text-main)'
                                            },
                                            title: "Refazer (Ctrl+Y)",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fas fa-redo text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/text-editor.jsx",
                                                lineNumber: 285,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 278,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 287,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-bold uppercase tracking-wider hidden sm:inline-block",
                                            style: {
                                                color: 'var(--text-muted)'
                                            },
                                            children: "Ferramentas:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 288,
                                            columnNumber: 30
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/text-editor.jsx",
                                    lineNumber: 268,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-2 items-center flex-1 justify-end",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2 text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>transform('upper'),
                                                    className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card)',
                                                        borderColor: 'var(--border-card)',
                                                        color: 'var(--text-main)'
                                                    },
                                                    title: "Tudo para maiúsculas",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-arrow-up text-xs opacity-70"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/text-editor.jsx",
                                                            lineNumber: 302,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "MAIÚSCULAS"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 296,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>transform('lower'),
                                                    className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card)',
                                                        borderColor: 'var(--border-card)',
                                                        color: 'var(--text-main)'
                                                    },
                                                    title: "Tudo para minúsculas",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-arrow-down text-xs opacity-70"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/text-editor.jsx",
                                                            lineNumber: 311,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "minúsculas"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 305,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>transform('title'),
                                                    className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card)',
                                                        borderColor: 'var(--border-card)',
                                                        color: 'var(--text-main)'
                                                    },
                                                    title: "Primeira Letra Maiúscula",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-heading text-xs opacity-70"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/text-editor.jsx",
                                                            lineNumber: 320,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "Título"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 314,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>transform('sentence'),
                                                    className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card)',
                                                        borderColor: 'var(--border-card)',
                                                        color: 'var(--text-main)'
                                                    },
                                                    title: "Primeira letra da frase maiúscula",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-align-left text-xs opacity-70"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/text-editor.jsx",
                                                            lineNumber: 329,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "Frase"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 323,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 295,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2 hidden xl:block"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 334,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2 text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>transform('nolinebreak'),
                                                    className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card)',
                                                        borderColor: 'var(--border-card)',
                                                        color: 'var(--text-main)'
                                                    },
                                                    title: "Remover quebras de linha",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-level-up-alt rotate-90 text-xs opacity-70 text-blue-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/text-editor.jsx",
                                                            lineNumber: 344,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "Remover Quebras"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 338,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>transform('removeExtraSpaces'),
                                                    className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card)',
                                                        borderColor: 'var(--border-card)',
                                                        color: 'var(--text-main)'
                                                    },
                                                    title: "Remover múltiplos espaços",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-compress-arrows-alt text-xs opacity-70 text-blue-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/text-editor.jsx",
                                                            lineNumber: 353,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "Remover Espaços"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 347,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>transform('cnj'),
                                                    className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card)',
                                                        borderColor: 'var(--border-card)',
                                                        color: 'var(--text-main)'
                                                    },
                                                    title: "Formatar numeração CNJ",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-balance-scale text-xs opacity-70 text-orange-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/text-editor.jsx",
                                                            lineNumber: 362,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "CNJ"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 356,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 337,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/text-editor.jsx",
                                    lineNumber: 292,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/text-editor.jsx",
                            lineNumber: 265,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex-grow relative",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                ref: textareaRef,
                                className: "w-full h-[50vh] p-6 resize-none focus:outline-none bg-transparent",
                                style: {
                                    color: 'var(--text-main)',
                                    fontSize: '1rem',
                                    lineHeight: '1.6'
                                },
                                value: text,
                                onChange: handleTextChange,
                                placeholder: "Cole ou digite seu texto aqui...",
                                spellCheck: "false"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/text-editor.jsx",
                                lineNumber: 371,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/text-editor.jsx",
                            lineNumber: 370,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "py-2 px-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm",
                            style: {
                                backgroundColor: 'var(--bg-card)',
                                borderColor: 'var(--border-card)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex gap-6 font-medium",
                                    style: {
                                        color: 'var(--text-muted)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                    className: "text-orange-500",
                                                    children: stats.words
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 388,
                                                    columnNumber: 35
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Palavras"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 388,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                    className: "text-orange-500",
                                                    children: stats.chars
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 389,
                                                    columnNumber: 35
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Caracteres"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 389,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/text-editor.jsx",
                                    lineNumber: 387,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                navigator.clipboard.writeText(text);
                                                showNotification("Conteúdo copiado!");
                                            },
                                            className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                            style: {
                                                backgroundColor: 'var(--bg-card)',
                                                borderColor: 'var(--border-card)',
                                                color: 'var(--text-main)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "far fa-copy text-xs opacity-70"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 398,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "Copiar"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 393,
                                            columnNumber: 30
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 402,
                                            columnNumber: 30
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>downloadFile(text, 'texto.txt', 'text/plain'),
                                            className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                            style: {
                                                backgroundColor: 'var(--bg-card)',
                                                borderColor: 'var(--border-card)',
                                                color: 'var(--text-main)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "far fa-file-alt text-xs opacity-70"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 409,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                ".TXT"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 404,
                                            columnNumber: 30
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>downloadFile(JSON.stringify({
                                                    text
                                                }), 'texto.json', 'application/json'),
                                            className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                            style: {
                                                backgroundColor: 'var(--bg-card)',
                                                borderColor: 'var(--border-card)',
                                                color: 'var(--text-main)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "far fa-file-code text-xs opacity-70"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 417,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                ".JSON"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 412,
                                            columnNumber: 30
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: downloadDocx,
                                            className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                            style: {
                                                backgroundColor: 'var(--bg-card)',
                                                borderColor: 'var(--border-card)',
                                                color: 'var(--text-main)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fas fa-file-word text-xs opacity-70 text-blue-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 425,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "DOCX"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 420,
                                            columnNumber: 30
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: downloadPDF,
                                            className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                            style: {
                                                backgroundColor: 'var(--bg-card)',
                                                borderColor: 'var(--border-card)',
                                                color: 'var(--text-main)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fas fa-file-pdf text-xs opacity-70 text-red-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 433,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "PDF"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 428,
                                            columnNumber: 30
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/text-editor.jsx",
                                    lineNumber: 392,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/text-editor.jsx",
                            lineNumber: 383,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/text-editor.jsx",
                    lineNumber: 257,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/text-editor.jsx",
            lineNumber: 239,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/pages/text-editor.jsx",
        lineNumber: 238,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = TextTools;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dd96008d._.js.map