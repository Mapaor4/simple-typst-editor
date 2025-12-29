# Typst Online Editor

A lightweight web-based Typst editor that compiles documents directly in your browser using WebAssembly. No servers, everything client-side.

## Tech used

This website is built with NextJS (React), Typst.ts (Typst for the javascript world, ported to WASM by @myriaddreamin) and PDFjs.

### Key files
- `TypstCompilerService` - Manages compilation with event-based API
- `TypstWorkerClient` - Web Worker client for background compilation
- `typst.worker.ts` - WASM compiler running in worker thread

## Great things about the website

- Everything client-side thanks to typst.ts
- Minimal simple demo with compile button and debounce auto-compilation (it compiles as you type)
- Portable. Structured to be as framework-agnostic as possible. This is the NextJS version. You can find a Vite+Svelte version [here](https://github.com/Mapaor/typst-online-vite).

## Credits

Credits to @cosformula (creator of [mdxport](https://github.com/cosformula/mdxport)) for the creation of the typst worker and client (not easy stuff). Also thanks to @Myriad-Dreamin for the creation of [typst.ts](https://github.com/Myriad-Dreamin/typst.ts), and obviously also thanks to Martin Haug and Laurenz Mädje for the creation of Typst.

## License

MIT License.

