module.exports = [
"[project]/src/components/bpmn/modules/CustomPaletteProvider.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CustomPaletteProvider
]);
function CustomPaletteProvider(palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, translate, commandStack) {
    this._create = create;
    this._elementFactory = elementFactory;
    this._spaceTool = spaceTool;
    this._lassoTool = lassoTool;
    this._handTool = handTool;
    this._globalConnect = globalConnect;
    this._translate = translate;
    this._commandStack = commandStack;
    palette.registerProvider(this);
}
CustomPaletteProvider.$inject = [
    'palette',
    'create',
    'elementFactory',
    'spaceTool',
    'lassoTool',
    'handTool',
    'globalConnect',
    'translate',
    'commandStack'
];
CustomPaletteProvider.prototype.getPaletteEntries = function(element) {
    const { _commandStack } = this;
    return {
        'action.undo': {
            group: 'zz_footer',
            className: 'fas fa-undo custom-palette-icon',
            title: 'Desfazer',
            action: {
                click: function() {
                    _commandStack.undo();
                }
            }
        },
        'action.redo': {
            group: 'zz_footer',
            className: 'fas fa-redo custom-palette-icon',
            title: 'Refazer',
            action: {
                click: function() {
                    _commandStack.redo();
                }
            }
        }
    };
};
}),
"[project]/src/pages/bpmn.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$bpmn$2d$js$2f$dist$2f$bpmn$2d$modeler$2e$production$2e$min$2e$js__$5b$external$5d$__$28$bpmn$2d$js$2f$dist$2f$bpmn$2d$modeler$2e$production$2e$min$2e$js$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$bpmn$2d$js$29$__ = __turbopack_context__.i("[externals]/bpmn-js/dist/bpmn-modeler.production.min.js [external] (bpmn-js/dist/bpmn-modeler.production.min.js, cjs, [project]/node_modules/bpmn-js)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeToggle$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ThemeToggle.jsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ThemeContext.jsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$bpmn$2f$modules$2f$CustomPaletteProvider$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/bpmn/modules/CustomPaletteProvider.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeToggle$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeToggle$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
const initialDiagram = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
    <bpmn:process id="Process_1" isExecutable="false">
    </bpmn:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
    </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
const BPMNPage = ()=>{
    const containerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const modelerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [notification, setNotification] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    // State hoisted for Auto-Save access
    const [filename, setFilename] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('diagrama');
    const [isDropdownOpen, setDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const hasChangesRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!modelerRef.current && containerRef.current) {
            // Intialize BPMN Modeler
            modelerRef.current = new __TURBOPACK__imported__module__$5b$externals$5d2f$bpmn$2d$js$2f$dist$2f$bpmn$2d$modeler$2e$production$2e$min$2e$js__$5b$external$5d$__$28$bpmn$2d$js$2f$dist$2f$bpmn$2d$modeler$2e$production$2e$min$2e$js$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$bpmn$2d$js$29$__["default"]({
                container: containerRef.current,
                additionalModules: [
                    {
                        // Disable default zoom scroll to prevent accidental zooming while scrolling page
                        zoomScroll: [
                            'value',
                            {
                                toggle: function() {},
                                scroll: function() {}
                            }
                        ]
                    },
                    {
                        __init__: [
                            'customPaletteProvider'
                        ],
                        customPaletteProvider: [
                            'type',
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$bpmn$2f$modules$2f$CustomPaletteProvider$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
                        ]
                    }
                ]
            });
            const modeler = modelerRef.current;
            // Hook for applying custom CSS classes (Legacy Dark Mode Support)
            modeler.on('shape.added', (e)=>{
                const element = e.element;
                const canvas = modeler.get('canvas');
                // 1. DataObject and DataStore (Fix for Dark Mode fills)
                if ([
                    'bpmn:DataObjectReference',
                    'bpmn:DataStoreReference'
                ].includes(element.type)) {
                    canvas.addMarker(element, 'dark-fill-fix');
                }
                // 2. Message Intermediate Throw Event (Specific styling)
                if (element.type === 'bpmn:IntermediateThrowEvent') {
                    const bo = element.businessObject;
                    if (bo.eventDefinitions && bo.eventDefinitions.some((ed)=>ed.$type === 'bpmn:MessageEventDefinition')) {
                        canvas.addMarker(element, 'message-event-styled');
                    }
                }
            });
            // Auto-Save: Detect Changes
            modeler.on('commandStack.changed', ()=>{
                hasChangesRef.current = true;
            });
            // Load Draft or Default
            const savedDraft = localStorage.getItem('bpmnDraft');
            const savedFilename = localStorage.getItem('bpmnFilename');
            if (savedDraft) {
                openDiagram(savedDraft);
                if (savedFilename) setFilename(savedFilename);
                showNotify('Rascunho automático recuperado.');
            } else {
                openDiagram(initialDiagram);
            }
        }
        return ()=>{
            if (modelerRef.current) {
                modelerRef.current.destroy();
                modelerRef.current = null;
            }
        };
    }, []);
    // Auto-Save Interval (Every 60s)
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const interval = setInterval(async ()=>{
            if (modelerRef.current && hasChangesRef.current) {
                try {
                    const { xml } = await modelerRef.current.saveXML({
                        format: true
                    });
                    localStorage.setItem('bpmnDraft', xml);
                    localStorage.setItem('bpmnFilename', filename);
                    hasChangesRef.current = false;
                    showNotify('Rascunho salvo automaticamente.');
                } catch (e) {
                    console.error(e);
                }
            }
        }, 60000);
        return ()=>clearInterval(interval);
    }, [
        filename
    ]);
    const openDiagram = async (xml)=>{
        try {
            await modelerRef.current.importXML(xml);
            const canvas = modelerRef.current.get('canvas');
            canvas.zoom('fit-viewport');
        } catch (err) {
            console.error(err);
            showNotify('Erro ao carregar diagrama.');
        }
    };
    const showNotify = (msg)=>{
        setNotification(msg);
        setTimeout(()=>setNotification(''), 3000);
    };
    const createNewDiagram = ()=>{
        if (confirm('Tem certeza que deseja criar um novo diagrama? O rascunho atual será apagado.')) {
            // Clear Cache
            localStorage.removeItem('bpmnDraft');
            localStorage.removeItem('bpmnFilename');
            hasChangesRef.current = false;
            openDiagram(initialDiagram);
            setFilename('diagrama');
            showNotify('Novo diagrama criado (Cache limpo).');
        }
    };
    // State for Dropdown and Filename (Moved to top)
    // Close dropdown when clicking outside
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handleClickOutside = (event)=>{
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return ()=>document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const toggleDropdown = ()=>setDropdownOpen(!isDropdownOpen);
    const handleAction = (action)=>{
        setDropdownOpen(false);
        action();
    };
    const handleFileLoad = (e)=>{
        const file = e.target.files[0];
        if (file) {
            const name = file.name.replace(/\.[^/.]+$/, "");
            setFilename(name);
            const reader = new FileReader();
            reader.onload = (e)=>{
                openDiagram(e.target.result);
                showNotify('Diagrama carregado com sucesso!');
            };
            reader.readAsText(file);
        }
    };
    const saveXML = async ()=>{
        try {
            const { xml } = await modelerRef.current.saveXML({
                format: true
            });
            const blob = new Blob([
                xml
            ], {
                type: 'application/xml'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.bpmn`;
            a.click();
            window.URL.revokeObjectURL(url);
            showNotify('Diagrama salvo (XML)!');
        } catch (err) {
            console.error(err);
            showNotify('Erro ao salvar XML.');
        }
    };
    const saveSVG = async ()=>{
        try {
            const { svg } = await modelerRef.current.saveSVG();
            const blob = new Blob([
                svg
            ], {
                type: 'image/svg+xml'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.svg`;
            a.click();
            window.URL.revokeObjectURL(url);
            showNotify('Imagem salva (SVG)!');
        } catch (err) {
            console.error(err);
            showNotify('Erro ao salvar SVG.');
        }
    };
    const savePNG = async ()=>{
        try {
            const { svg } = await modelerRef.current.saveSVG();
            const image = new Image();
            const svgBlob = new Blob([
                svg
            ], {
                type: 'image/svg+xml;charset=utf-8'
            });
            const url = URL.createObjectURL(svgBlob);
            image.onload = ()=>{
                const canvas = document.createElement('canvas');
                // Set canvas size to image size
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                // Draw image (transparent background)
                ctx.drawImage(image, 0, 0);
                const pngUrl = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = pngUrl;
                a.download = `${filename}.png`;
                a.click();
                URL.revokeObjectURL(url);
                showNotify('Imagem salva (PNG)!');
            };
            image.src = url;
        } catch (err) {
            console.error(err);
            showNotify('Erro ao salvar PNG.');
        }
    };
    const savePDF = async ()=>{
        try {
            const { jsPDF } = await __turbopack_context__.A("[externals]/jspdf [external] (jspdf, cjs, [project]/node_modules/jspdf, async loader)");
            const { svg } = await modelerRef.current.saveSVG();
            const image = new Image();
            const svgBlob = new Blob([
                svg
            ], {
                type: 'image/svg+xml;charset=utf-8'
            });
            const url = URL.createObjectURL(svgBlob);
            image.onload = ()=>{
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                // PDF usually looks better with a white background than transparent black
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, 0);
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: image.width > image.height ? 'landscape' : 'portrait'
                });
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = image.height * pdfWidth / image.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${filename}.pdf`);
                URL.revokeObjectURL(url);
                showNotify('Documento salvo (PDF)!');
            };
            image.src = url;
        } catch (err) {
            console.error(err);
            showNotify('Erro ao salvar PDF.');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-[#121212]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                className: "shrink-0 w-full z-50 border-b backdrop-blur-md transition-colors duration-300",
                style: {
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-card)',
                    height: '80px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "w-full px-6 h-20 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            href: "/",
                            className: "flex items-center gap-3 group text-decoration-none focus:outline-none shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 bg-orange-500 blur-lg opacity-20 rounded-full group-hover:opacity-40 transition-opacity"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/bpmn.jsx",
                                            lineNumber: 308,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                            src: __turbopack_context__.r('[project]/src/assets/logo.png.mjs { IMAGE => "[project]/src/assets/logo.png (static in ecmascript, tag client)" } [ssr] (structured image object with data url, ecmascript)').default.src,
                                            alt: "Business Tools",
                                            className: "h-8 w-auto relative z-10"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/bpmn.jsx",
                                            lineNumber: 310,
                                            columnNumber: 30
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/bpmn.jsx",
                                    lineNumber: 307,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "font-bold text-xl tracking-tight transition-colors",
                                    style: {
                                        color: 'var(--text-main)'
                                    },
                                    children: [
                                        "Business ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-orange-500",
                                            children: "tools"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/bpmn.jsx",
                                            lineNumber: 317,
                                            columnNumber: 38
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/bpmn.jsx",
                                    lineNumber: 316,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/bpmn.jsx",
                            lineNumber: 306,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-[#333] hover:border-gray-200 dark:hover:border-gray-600 transition-all group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fas fa-pen text-gray-400 text-xs group-hover:text-orange-500 transition-colors"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/bpmn.jsx",
                                        lineNumber: 324,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: filename,
                                        onChange: (e)=>setFilename(e.target.value),
                                        className: "bg-transparent border-none outline-none text-center font-medium text-gray-700 dark:text-gray-200 placeholder-gray-400 w-48 focus:w-64 transition-all",
                                        placeholder: "Nome do arquivo"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/bpmn.jsx",
                                        lineNumber: 325,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-gray-400 text-sm font-medium select-none",
                                        children: ".bpmn"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/bpmn.jsx",
                                        lineNumber: 332,
                                        columnNumber: 30
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/bpmn.jsx",
                                lineNumber: 323,
                                columnNumber: 26
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/bpmn.jsx",
                            lineNumber: 322,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-6 shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeToggle$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/src/pages/bpmn.jsx",
                                    lineNumber: 340,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    ref: dropdownRef,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: toggleDropdown,
                                            className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors py-2",
                                            style: {
                                                color: 'var(--text-muted)'
                                            },
                                            children: [
                                                "Menu",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: `fas fa-chevron-down text-[10px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/bpmn.jsx",
                                                    lineNumber: 350,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/bpmn.jsx",
                                            lineNumber: 344,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        isDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute right-0 top-full mt-2 w-64 bg-menu-light bg-menu-dark rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in-up origin-top-right",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "p-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                                        href: "/",
                                                        style: {
                                                            textDecoration: 'none'
                                                        },
                                                        className: "w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 text-sm flex items-center gap-3 transition-colors group mb-1 !no-underline",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "w-8 h-8 rounded-full icon-bg-back flex items-center justify-center group-hover:scale-110 transition-transform",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fas fa-arrow-left"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/bpmn.jsx",
                                                                    lineNumber: 360,
                                                                    columnNumber: 49
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/bpmn.jsx",
                                                                lineNumber: 359,
                                                                columnNumber: 45
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "font-semibold text-gray-900 dark:text-gray-100",
                                                                        children: "Voltar"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/bpmn.jsx",
                                                                        lineNumber: 363,
                                                                        columnNumber: 49
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "text-xs text-gray-500 dark:text-gray-400",
                                                                        children: "Menu principal"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/bpmn.jsx",
                                                                        lineNumber: 364,
                                                                        columnNumber: 49
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/bpmn.jsx",
                                                                lineNumber: 362,
                                                                columnNumber: 45
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/bpmn.jsx",
                                                        lineNumber: 358,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "h-px bg-gray-100 dark:bg-[#333] my-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/bpmn.jsx",
                                                        lineNumber: 367,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleAction(createNewDiagram),
                                                        className: "w-full text-left px-4 py-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/10 text-gray-700 dark:text-gray-200 text-sm flex items-center gap-3 transition-colors group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "w-8 h-8 rounded-full icon-bg-orange flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fas fa-file"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/bpmn.jsx",
                                                                    lineNumber: 371,
                                                                    columnNumber: 49
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/bpmn.jsx",
                                                                lineNumber: 370,
                                                                columnNumber: 45
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "font-semibold text-gray-900 dark:text-gray-100",
                                                                        children: "Novo"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/bpmn.jsx",
                                                                        lineNumber: 374,
                                                                        columnNumber: 49
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "text-xs text-gray-500 dark:text-gray-400",
                                                                        children: "Começar do zero"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/bpmn.jsx",
                                                                        lineNumber: 375,
                                                                        columnNumber: 49
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/bpmn.jsx",
                                                                lineNumber: 373,
                                                                columnNumber: 45
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/bpmn.jsx",
                                                        lineNumber: 369,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            setDropdownOpen(false);
                                                            fileInputRef.current.click();
                                                        },
                                                        className: "w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 text-gray-700 dark:text-gray-200 text-sm flex items-center gap-3 transition-colors group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "w-8 h-8 rounded-full icon-bg-blue flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fas fa-folder-open"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/bpmn.jsx",
                                                                    lineNumber: 381,
                                                                    columnNumber: 49
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/bpmn.jsx",
                                                                lineNumber: 380,
                                                                columnNumber: 46
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "font-semibold text-gray-900 dark:text-gray-100",
                                                                        children: "Abrir"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/bpmn.jsx",
                                                                        lineNumber: 384,
                                                                        columnNumber: 49
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "text-xs text-gray-500 dark:text-gray-400",
                                                                        children: "Importar arquivo local"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/bpmn.jsx",
                                                                        lineNumber: 385,
                                                                        columnNumber: 49
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/bpmn.jsx",
                                                                lineNumber: 383,
                                                                columnNumber: 45
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/bpmn.jsx",
                                                        lineNumber: 379,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "h-px bg-gray-100 dark:bg-[#333] my-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/bpmn.jsx",
                                                        lineNumber: 389,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1",
                                                        children: "Exportar como"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/bpmn.jsx",
                                                        lineNumber: 391,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleAction(saveXML),
                                                        className: "w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 text-sm flex items-center gap-3 transition-colors text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fas fa-code w-5 text-center text-gray-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/bpmn.jsx",
                                                                lineNumber: 394,
                                                                columnNumber: 45
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            " XML (BPMN 2.0)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/bpmn.jsx",
                                                        lineNumber: 393,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleAction(saveSVG),
                                                        className: "w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 text-sm flex items-center gap-3 transition-colors text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fas fa-image w-5 text-center text-gray-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/bpmn.jsx",
                                                                lineNumber: 397,
                                                                columnNumber: 45
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            " Imagem (SVG)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/bpmn.jsx",
                                                        lineNumber: 396,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleAction(savePNG),
                                                        className: "w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 text-sm flex items-center gap-3 transition-colors text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fas fa-file-image w-5 text-center text-gray-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/bpmn.jsx",
                                                                lineNumber: 400,
                                                                columnNumber: 45
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            " Imagem (PNG)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/bpmn.jsx",
                                                        lineNumber: 399,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleAction(savePDF),
                                                        className: "w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 text-sm flex items-center gap-3 transition-colors text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fas fa-file-pdf w-5 text-center text-gray-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/bpmn.jsx",
                                                                lineNumber: 403,
                                                                columnNumber: 45
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            " Documento (PDF)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/bpmn.jsx",
                                                        lineNumber: 402,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/bpmn.jsx",
                                                lineNumber: 357,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/bpmn.jsx",
                                            lineNumber: 354,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/bpmn.jsx",
                                    lineNumber: 343,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "file",
                                    ref: fileInputRef,
                                    accept: ".bpmn,.xml",
                                    onChange: handleFileLoad,
                                    className: "hidden"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/bpmn.jsx",
                                    lineNumber: 410,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/bpmn.jsx",
                            lineNumber: 337,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/bpmn.jsx",
                    lineNumber: 303,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/bpmn.jsx",
                lineNumber: 295,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex-grow relative w-full h-full overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    ref: containerRef,
                    className: "w-full h-full canvas-container"
                }, void 0, false, {
                    fileName: "[project]/src/pages/bpmn.jsx",
                    lineNumber: 417,
                    columnNumber: 18
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/bpmn.jsx",
                lineNumber: 416,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            notification && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed bottom-6 right-6 z-50 animate-fade-in-up",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-[#1e1e1e] text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-[#333]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                            className: "fas fa-info-circle text-orange-500"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/bpmn.jsx",
                            lineNumber: 424,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            className: "font-medium",
                            children: notification
                        }, void 0, false, {
                            fileName: "[project]/src/pages/bpmn.jsx",
                            lineNumber: 425,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/bpmn.jsx",
                    lineNumber: 423,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/bpmn.jsx",
                lineNumber: 422,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/bpmn.jsx",
        lineNumber: 293,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = BPMNPage;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__50ce3a66._.js.map