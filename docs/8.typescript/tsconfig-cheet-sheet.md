---
title: tsconfig.json cheat sheet
tags: [typescript]
---

```json title="tsconfig.json"
{
  "compilerOptions": {
    /* Base Config */
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "es2022",
    "verbatimModuleSyntax": true, // If we have an commonjs module import, this needs to be disabled ESM syntax is not allowed in a CommonJS module when 'verbatimModuleSyntax' is enabled.ts
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,

    /* Strict Checks */
    "strict": true,
    "noUncheckedIndexedAccess": true,

    /*
     * If transpiling with TS (tsc)
     * This case, we need to import module with explicit extension (e.g. import { foo } from "./foo.js")
     * Reference - relevant article: https://www.totaltypescript.com/relative-import-paths-need-explicit-file-extensions-in-ecmascript-imports
     */
    "moduleResolution": "NodeNext",
    "module": "NodeNext",
    "outDir": "dist",
    "sourceMap": true,

    /*  If NOT transpiling with TS (tsc)  */

    "moduleResolution": "Bundler",
    "module": "ESNext",
    "noEmit": true,

    /* If the code runs in the DOM  */
    "lib": ["DOM", "DOM.Iterable", "ESNext"],

    /* If the code does NOT run in the DOM */
    "lib": ["ES2022"],

    /* If the code is a library */
    "declaration": true,

    /* If the code is a library in a monorepo */
    "composite": true,
    "declarationMap": true
  }
}
```
