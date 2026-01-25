self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/bpmn": [
    "static/chunks/pages/bpmn.js"
  ],
  "/pdf-tools": [
    "static/chunks/pages/pdf-tools.js"
  ],
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/_app",
    "/_error",
    "/api/process-pdf",
    "/bpmn",
    "/pdf-tools",
    "/text-editor"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()