(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/src/pages/text-editor.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.es.min.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/docx/dist/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$file$2d$saver$2f$dist$2f$FileSaver$2e$min$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/file-saver/dist/FileSaver.min.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const TextTools = ()=>{
    _s();
    const [text, setText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([
        ''
    ]);
    const [historyIndex, setHistoryIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        words: 0,
        chars: 0
    });
    const [notification, setNotification] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const showNotification = (msg)=>{
        setNotification(msg);
        setTimeout(()=>setNotification(null), 3000);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TextTools.useEffect": ()=>{
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
        }
    }["TextTools.useEffect"], []);
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
        const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["Document"]({
            sections: [
                {
                    properties: {},
                    children: text.split('\n').map((line)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["Paragraph"]({
                            children: [
                                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["TextRun"](line)
                            ]
                        }))
                }
            ]
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$docx$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["Packer"].toBlob(doc).then((blob)=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$file$2d$saver$2f$dist$2f$FileSaver$2e$min$2e$js__$5b$client$5d$__$28$ecmascript$29$__["saveAs"])(blob, "documento.docx");
        });
    };
    const downloadPDF = ()=>{
        const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsPDF"]();
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-[calc(100vh-64px)] w-full py-6 px-4",
        style: {
            backgroundColor: 'var(--bg-page)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-[95vw] mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl font-bold mb-1",
                                    style: {
                                        color: 'var(--text-main)'
                                    },
                                    children: "Editor de Texto"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/text-editor.jsx",
                                    lineNumber: 245,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm opacity-80",
                                    style: {
                                        color: 'var(--text-muted)'
                                    },
                                    children: "Ferramentas rápidas para formatação, limpeza e conversão de textos."
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/text-editor.jsx",
                                    lineNumber: 246,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/text-editor.jsx",
                            lineNumber: 244,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        notification && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg text-sm font-medium animate-fade-in shadow-sm border border-green-200 dark:border-green-800",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fas fa-check-circle mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/text-editor.jsx",
                                    lineNumber: 252,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                notification
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/text-editor.jsx",
                            lineNumber: 251,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/text-editor.jsx",
                    lineNumber: 243,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-xl shadow-lg border overflow-hidden flex flex-col relative",
                    style: {
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-card)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 border-b flex flex-col xl:flex-row flex-wrap gap-x-6 gap-y-3 items-center justify-between",
                            style: {
                                backgroundColor: 'var(--bg-card-hover)',
                                borderColor: 'var(--border-card)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: undo,
                                            disabled: historyIndex <= 0,
                                            className: "w-9 h-9 rounded-lg flex items-center justify-center border hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm",
                                            style: {
                                                backgroundColor: 'var(--bg-card)',
                                                borderColor: 'var(--border-card)',
                                                color: 'var(--text-main)'
                                            },
                                            title: "Desfazer (Ctrl+Z)",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fas fa-undo text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/text-editor.jsx",
                                                lineNumber: 278,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 271,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: redo,
                                            disabled: historyIndex >= history.length - 1,
                                            className: "w-9 h-9 rounded-lg flex items-center justify-center border hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm",
                                            style: {
                                                backgroundColor: 'var(--bg-card)',
                                                borderColor: 'var(--border-card)',
                                                color: 'var(--text-main)'
                                            },
                                            title: "Refazer (Ctrl+Y)",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fas fa-redo text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/text-editor.jsx",
                                                lineNumber: 287,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 280,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 289,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-bold uppercase tracking-wider hidden sm:inline-block",
                                            style: {
                                                color: 'var(--text-muted)'
                                            },
                                            children: "Ferramentas:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 290,
                                            columnNumber: 30
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/text-editor.jsx",
                                    lineNumber: 270,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-2 items-center flex-1 justify-end",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2 text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>transform('upper'),
                                                    className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card)',
                                                        borderColor: 'var(--border-card)',
                                                        color: 'var(--text-main)'
                                                    },
                                                    title: "Tudo para maiúsculas",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-arrow-up text-xs opacity-70"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/text-editor.jsx",
                                                            lineNumber: 304,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "MAIÚSCULAS"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 298,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>transform('lower'),
                                                    className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card)',
                                                        borderColor: 'var(--border-card)',
                                                        color: 'var(--text-main)'
                                                    },
                                                    title: "Tudo para minúsculas",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-arrow-down text-xs opacity-70"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/text-editor.jsx",
                                                            lineNumber: 313,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "minúsculas"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 307,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>transform('title'),
                                                    className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card)',
                                                        borderColor: 'var(--border-card)',
                                                        color: 'var(--text-main)'
                                                    },
                                                    title: "Primeira Letra Maiúscula",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-heading text-xs opacity-70"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/text-editor.jsx",
                                                            lineNumber: 322,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "Título"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 316,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>transform('sentence'),
                                                    className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card)',
                                                        borderColor: 'var(--border-card)',
                                                        color: 'var(--text-main)'
                                                    },
                                                    title: "Primeira letra da frase maiúscula",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-align-left text-xs opacity-70"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/text-editor.jsx",
                                                            lineNumber: 331,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "Frase"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 325,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 297,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2 hidden xl:block"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 336,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2 text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>transform('nolinebreak'),
                                                    className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card)',
                                                        borderColor: 'var(--border-card)',
                                                        color: 'var(--text-main)'
                                                    },
                                                    title: "Remover quebras de linha",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-level-up-alt rotate-90 text-xs opacity-70 text-blue-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/text-editor.jsx",
                                                            lineNumber: 346,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "Remover Quebras"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 340,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>transform('removeExtraSpaces'),
                                                    className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card)',
                                                        borderColor: 'var(--border-card)',
                                                        color: 'var(--text-main)'
                                                    },
                                                    title: "Remover múltiplos espaços",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-compress-arrows-alt text-xs opacity-70 text-blue-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/text-editor.jsx",
                                                            lineNumber: 355,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "Remover Espaços"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 349,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>transform('cnj'),
                                                    className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                                    style: {
                                                        backgroundColor: 'var(--bg-card)',
                                                        borderColor: 'var(--border-card)',
                                                        color: 'var(--text-main)'
                                                    },
                                                    title: "Formatar numeração CNJ",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-balance-scale text-xs opacity-70 text-orange-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/text-editor.jsx",
                                                            lineNumber: 364,
                                                            columnNumber: 37
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "CNJ"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 358,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 339,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/text-editor.jsx",
                                    lineNumber: 294,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/text-editor.jsx",
                            lineNumber: 267,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-grow relative",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                                lineNumber: 373,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/text-editor.jsx",
                            lineNumber: 372,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "py-2 px-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm",
                            style: {
                                backgroundColor: 'var(--bg-card)',
                                borderColor: 'var(--border-card)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-6 font-medium",
                                    style: {
                                        color: 'var(--text-muted)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    className: "text-orange-500",
                                                    children: stats.words
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 390,
                                                    columnNumber: 35
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Palavras"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 390,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    className: "text-orange-500",
                                                    children: stats.chars
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 391,
                                                    columnNumber: 35
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Caracteres"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 391,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/text-editor.jsx",
                                    lineNumber: 389,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "far fa-copy text-xs opacity-70"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 400,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "Copiar"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 395,
                                            columnNumber: 30
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 404,
                                            columnNumber: 30
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>downloadFile(text, 'texto.txt', 'text/plain'),
                                            className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                            style: {
                                                backgroundColor: 'var(--bg-card)',
                                                borderColor: 'var(--border-card)',
                                                color: 'var(--text-main)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "far fa-file-alt text-xs opacity-70"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 411,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                ".TXT"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 406,
                                            columnNumber: 30
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "far fa-file-code text-xs opacity-70"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 419,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                ".JSON"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 414,
                                            columnNumber: 30
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: downloadDocx,
                                            className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                            style: {
                                                backgroundColor: 'var(--bg-card)',
                                                borderColor: 'var(--border-card)',
                                                color: 'var(--text-main)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fas fa-file-word text-xs opacity-70 text-blue-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 427,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "DOCX"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 422,
                                            columnNumber: 30
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: downloadPDF,
                                            className: "px-3 py-1.5 rounded-lg border font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm",
                                            style: {
                                                backgroundColor: 'var(--bg-card)',
                                                borderColor: 'var(--border-card)',
                                                color: 'var(--text-main)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fas fa-file-pdf text-xs opacity-70 text-red-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/text-editor.jsx",
                                                    lineNumber: 435,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "PDF"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/text-editor.jsx",
                                            lineNumber: 430,
                                            columnNumber: 30
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/text-editor.jsx",
                                    lineNumber: 394,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/text-editor.jsx",
                            lineNumber: 385,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/text-editor.jsx",
                    lineNumber: 259,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/text-editor.jsx",
            lineNumber: 241,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/pages/text-editor.jsx",
        lineNumber: 240,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(TextTools, "/iTn23j/av17S0hgerEuYMhvjEs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = TextTools;
const __TURBOPACK__default__export__ = TextTools;
var _c;
__turbopack_context__.k.register(_c, "TextTools");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/text-editor.jsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/text-editor";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/text-editor.jsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/text-editor\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/text-editor.jsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__d8bdf034._.js.map