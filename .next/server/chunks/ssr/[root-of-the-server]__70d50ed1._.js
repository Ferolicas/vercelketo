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
"[project]/src/pages/[category]/[slug].tsx [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>PostPage),
    "getStaticPaths": (()=>getStaticPaths),
    "getStaticProps": (()=>getStaticProps)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanityClient$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sanityClient.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanityClient$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanityClient$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
function PostPage({ post }) {
    if (!post) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "text-center py-20",
            children: "No se encontró la receta."
        }, void 0, false, {
            fileName: "[project]/src/pages/[category]/[slug].tsx",
            lineNumber: 45,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "max-w-3xl mx-auto py-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                className: "text-3xl font-bold mb-4",
                children: post.title
            }, void 0, false, {
                fileName: "[project]/src/pages/[category]/[slug].tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            post.mainImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanityClient$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["urlFor"])(post.mainImage).width(800).height(400).url(),
                alt: post.title,
                width: 800,
                height: 400,
                className: "rounded-lg mb-6"
            }, void 0, false, {
                fileName: "[project]/src/pages/[category]/[slug].tsx",
                lineNumber: 52,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-gray-500 mb-2",
                children: [
                    "Publicado: ",
                    new Date(post.publishedAt).toLocaleDateString()
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/[category]/[slug].tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            post.level && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "mb-2",
                children: [
                    "Nivel: ",
                    post.level
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/[category]/[slug].tsx",
                lineNumber: 61,
                columnNumber: 22
            }, this),
            post.preparationTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "mb-2",
                children: [
                    "Tiempo de preparación: ",
                    post.preparationTime
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/[category]/[slug].tsx",
                lineNumber: 62,
                columnNumber: 32
            }, this),
            post.youtubeUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                    href: post.youtubeUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-blue-600 underline",
                    children: "Ver video en YouTube"
                }, void 0, false, {
                    fileName: "[project]/src/pages/[category]/[slug].tsx",
                    lineNumber: 65,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/[category]/[slug].tsx",
                lineNumber: 64,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/[category]/[slug].tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
const getStaticPaths = async ()=>{
    const posts = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanityClient$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["client"].fetch(`*[_type == "post"]{ "slug": slug, category->{ "slug": slug } }`);
    return {
        paths: posts.map((post)=>({
                params: {
                    category: post.category?.slug.current,
                    slug: post.slug.current
                }
            })),
        fallback: false
    };
};
const getStaticProps = async ({ params })=>{
    const category = params?.category;
    const slug = params?.slug;
    const post = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanityClient$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["client"].fetch(`*[_type == "post" && slug.current == $slug && category->slug.current == $category][0]{ 
      title,
      slug,
      author,
      mainImage,
      category,
      publishedAt,
      body,
      youtubeUrl,
      level,
      preparationTime,
      ingredients
    }`, {
        slug,
        category
    });
    return {
        props: {
            post: post ?? null
        },
        revalidate: 60
    };
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__70d50ed1._.js.map