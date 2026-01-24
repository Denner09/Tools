module.exports = [
"[project]/node_modules/pdfjs-dist/build/pdf.mjs [ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/node_modules_pdfjs-dist_build_pdf_mjs_d7e52ad3._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/node_modules/pdfjs-dist/build/pdf.mjs [ssr] (ecmascript)");
    });
});
}),
"[externals]/pdf-lib [external] (pdf-lib, cjs, [project]/node_modules/pdf-lib, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/[externals]_pdf-lib_7edba4b7._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/pdf-lib [external] (pdf-lib, cjs, [project]/node_modules/pdf-lib)");
    });
});
}),
"[externals]/jszip [external] (jszip, cjs, [project]/node_modules/jszip, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/[externals]_jszip_ccb4de7c._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/jszip [external] (jszip, cjs, [project]/node_modules/jszip)");
    });
});
}),
"[externals]/docx [external] (docx, esm_import, [project]/node_modules/docx, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/[externals]_docx_c7ddedf4._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/docx [external] (docx, esm_import, [project]/node_modules/docx)");
    });
});
}),
];