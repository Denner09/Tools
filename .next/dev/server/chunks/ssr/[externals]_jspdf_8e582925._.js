module.exports = [
"[externals]/jspdf [external] (jspdf, cjs, [project]/node_modules/jspdf, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/[externals]_jspdf_632ddf9a._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/jspdf [external] (jspdf, cjs, [project]/node_modules/jspdf)");
    });
});
}),
];