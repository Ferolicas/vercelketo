module.exports = {

"[externals]/@sanity/client [external] (@sanity/client, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("@sanity/client");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/@sanity/image-url [external] (@sanity/image-url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@sanity/image-url", () => require("@sanity/image-url"));

module.exports = mod;
}}),
"[project]/src/lib/sanityClient.tsx [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
// lib/sanityClient.ts
__turbopack_context__.s({
    "client": (()=>client),
    "urlFor": (()=>urlFor)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f40$sanity$2f$client__$5b$external$5d$__$2840$sanity$2f$client$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@sanity/client [external] (@sanity/client, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$sanity$2f$image$2d$url__$5b$external$5d$__$2840$sanity$2f$image$2d$url$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@sanity/image-url [external] (@sanity/image-url, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$sanity$2f$client__$5b$external$5d$__$2840$sanity$2f$client$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f40$sanity$2f$client__$5b$external$5d$__$2840$sanity$2f$client$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
const projectId = ("TURBOPACK compile-time value", "nfqa4osj");
const dataset = ("TURBOPACK compile-time value", "production");
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
}
const client = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$sanity$2f$client__$5b$external$5d$__$2840$sanity$2f$client$2c$__esm_import$29$__["createClient"])({
    projectId,
    dataset,
    apiVersion: '2025-06-09',
    useCdn: false
});
const builder = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$sanity$2f$image$2d$url__$5b$external$5d$__$2840$sanity$2f$image$2d$url$2c$__cjs$29$__["default"])(client);
function urlFor(source) {
    return builder.image(source);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/react-dom [external] (react-dom, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}}),
"[project]/src/pages/[category].tsx [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>CategoryPage),
    "getStaticPaths": (()=>getStaticPaths),
    "getStaticProps": (()=>getStaticProps)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanityClient$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sanityClient.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanityClient$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanityClient$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
function isSanityImage(img) {
    return typeof img === "object" && img !== null && "asset" in img;
}
function CategoryPage({ recetas, category }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex flex-col bg-[#ecf0f1]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                className: "sticky top-0 w-full text-white shadow-lg relative z-10 bg-[black]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "max-w-5xl mx-auto px-2 py-2 flex flex-row md:flex-row items-center md:items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "w-full md:w-[40%] flex justify-center md:justify-start items-center mb-4 md:mb-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "block w-[20vw] max-w-[40vw] md:w-full md:max-w-[30vw]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/logo.png",
                                    alt: "Planeta Keto Logo",
                                    width: 0,
                                    height: 0,
                                    sizes: "(max-width: 60vw), 180px",
                                    className: "w-full h-auto object-contain",
                                    priority: true
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/[category].tsx",
                                    lineNumber: 37,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/[category].tsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/pages/[category].tsx",
                            lineNumber: 35,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                            className: "w-full md:w-[60%] flex justify-center md:justify-end items-center gap-1 flex-col md:flex-row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        "  ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                            className: "text-[9vw] font-bold uppercase text-white flex justify-center",
                                            children: category.replace(/-/g, " ")
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/[category].tsx",
                                            lineNumber: 51,
                                            columnNumber: 16
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/[category].tsx",
                                    lineNumber: 51,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "w-full md:w-[60%] flex justify-center md:justify-end items-center gap-10 flex-row md:flex-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "https://youtube.com/@PLANETAKETO",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "flex items-center gap-2 font-bold text-white hover:text-yellow-300 transition text-[5vw] md:text-xl",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                                width: "28",
                                                height: "28" // Cambia aquí el tamaño del icono
                                                ,
                                                className: "w-8 h-8 md:w-8 md:h-8",
                                                fill: "#FF0000",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                    d: "M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.19 3.5 12 3.5 12 3.5s-7.19 0-9.391.569A2.994 2.994 0 0 0 .502 6.186C0 8.39 0 12 0 12s0 3.61.502 5.814a2.994 2.994 0 0 0 2.107 2.117C4.81 20.5 12 20.5 12 20.5s7.19 0 9.391-.569a2.994 2.994 0 0 0 2.107-2.117C24 15.61 24 12 24 12s0-3.61-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/[category].tsx",
                                                    lineNumber: 68,
                                                    columnNumber: 7
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/[category].tsx",
                                                lineNumber: 62,
                                                columnNumber: 5
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/[category].tsx",
                                            lineNumber: 56,
                                            columnNumber: 3
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "mailto:info@planetaketo.es",
                                            className: "flex items-center gap-2 font-bold text-white hover:text-yellow-300 transition text-[5vw] md:text-xl",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                                width: "28",
                                                height: "28",
                                                className: "w-8 h-8 md:w-8 md:h-8",
                                                fill: "#fff",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                    d: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/[category].tsx",
                                                    lineNumber: 81,
                                                    columnNumber: 7
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/[category].tsx",
                                                lineNumber: 75,
                                                columnNumber: 5
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/[category].tsx",
                                            lineNumber: 71,
                                            columnNumber: 3
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/[category].tsx",
                                    lineNumber: 55,
                                    columnNumber: 9
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/[category].tsx",
                            lineNumber: 50,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/[category].tsx",
                    lineNumber: 33,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/[category].tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "w-full flex justify-center items-center py-12 md:py-20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl w-full px-4 justify-items-center",
                    children: [
                        recetas.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "col-span-full text-center text-gray-500 text-xl",
                            children: "No hay recetas en esta categoría."
                        }, void 0, false, {
                            fileName: "[project]/src/pages/[category].tsx",
                            lineNumber: 92,
                            columnNumber: 13
                        }, this),
                        recetas.map((receta)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: `/${receta.categoriaSlug}/${receta.slug}`,
                                className: "card bg-base-100 w-96 shadow-sm hover:shadow-lg transition-transform duration-200 hover:-translate-y-1 overflow-hidden text-inherit no-underline group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("figure", {
                                        className: "flex items-center justify-center w-full h-64 bg-gray-100 overflow-hidden relative",
                                        children: isSanityImage(receta.mainImage) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanityClient$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["urlFor"])(receta.mainImage).url(),
                                            alt: receta.title,
                                            fill: true,
                                            className: "object-contain w-[100%] h-[100%] m-auto",
                                            style: {
                                                maxWidth: "100%",
                                                maxHeight: "100%"
                                            },
                                            priority: false
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/[category].tsx",
                                            lineNumber: 102,
                                            columnNumber: 5
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                            src: "https://via.placeholder.com/400x250?text=Sin+Imagen",
                                            alt: receta.title,
                                            className: "object-contain w-[100%] h-[100%] m-auto",
                                            style: {
                                                maxWidth: "100%",
                                                maxHeight: "100%"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/[category].tsx",
                                            lineNumber: 111,
                                            columnNumber: 5
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/[category].tsx",
                                        lineNumber: 100,
                                        columnNumber: 5
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "card-body",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: "card-title text-[1.5rem]",
                                                children: [
                                                    receta.title,
                                                    new Date(receta.publishedAt) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "badge badge-secondary",
                                                        children: "NUEVO"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/[category].tsx",
                                                        lineNumber: 124,
                                                        columnNumber: 11
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/[category].tsx",
                                                lineNumber: 120,
                                                columnNumber: 7
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "text-gray-500 text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/[category].tsx",
                                                lineNumber: 127,
                                                columnNumber: 7
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "card-actions justify-end",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "badge badge-outline capitalize",
                                                        children: receta.preparationTime
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/[category].tsx",
                                                        lineNumber: 131,
                                                        columnNumber: 9
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "badge badge-outline capitalize",
                                                        children: receta.level
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/[category].tsx",
                                                        lineNumber: 132,
                                                        columnNumber: 9
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/[category].tsx",
                                                lineNumber: 130,
                                                columnNumber: 7
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/[category].tsx",
                                        lineNumber: 119,
                                        columnNumber: 5
                                    }, this)
                                ]
                            }, receta.slug, true, {
                                fileName: "[project]/src/pages/[category].tsx",
                                lineNumber: 95,
                                columnNumber: 3
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/[category].tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/[category].tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/[category].tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
const getStaticPaths = async ()=>{
    const categories = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanityClient$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["client"].fetch(`*[_type == "category"]{ "slug": slug }`);
    return {
        paths: categories.map((cat)=>({
                params: {
                    category: cat.slug.current
                }
            })),
        fallback: false
    };
};
const getStaticProps = async ({ params })=>{
    const category = params?.category;
    const recetas = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanityClient$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["client"].fetch(`*[_type == "post" && category->slug.current == $categoriaSlug] | order(publishedAt desc){
      title,
      "slug": slug.current,
      mainImage,
      publishedAt,
      "categoriaSlug": category->slug.current,
      level,
      preparationTime
    }`, {
        categoriaSlug: category
    });
    return {
        props: {
            recetas,
            category
        },
        revalidate: 60
    };
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__0e0107d7._.js.map