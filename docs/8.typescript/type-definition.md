---
title: Extend npm package type with type definition
tags: [typescript]
---

# Extending TypeScript Types in External Modules

To extend or override types in other modules, you need to know the module name. Typically, these names can be found in the module's type definition files. Here are some common methods to determine the module name:

1. **Check the module's type definition files**:
   Most modules' type definition files are located in `node_modules/@types` or within the module's own `node_modules` directory. You can open these files to see the module name.

2. **Use TypeScript compiler options**:
   The TypeScript compiler option `--traceResolution` can help you understand how TypeScript resolves modules. You can add this option to your `tsconfig.json` and run the TypeScript compiler to see the resolution process.

3. **Check the module's official documentation**:
   Some modules' official documentation provides guides on extending types, which usually tell you the module name.

Here are some examples of common module names:

- **Express**: `'express-serve-static-core'`
- **Node.js**: `'node'`
- **React**: `'react'`
- **Jest**: `'jest'`

## Example: Extending express `Request` type

Suppose you want to extend express.js's `express` module to extend `Request` type with a custom property `__startTime`. You can do this:

1. **Create or update `types.d.ts` file**:

```ts
import { NextFunction, Request, Response } from 'express';
//Extend `express` (Or `express-serve-static-core`) to include a new property
declare module 'express' {
  interface Request {
    _startTime?: number;
  }
}
```

2. Use the extended type in your TypeScript file:

```ts
import express from 'express';
import { NextFunction, Request, Response } from 'express';
import winston from 'winston';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'query-history.log' })
  ],
});

app.use((req: Request, res: Response, next: NextFunction) => {
  req._startTime = Date.now();
  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      length: res.get('Content-Length') || 0,
      'response-time': `${Date.now() - req._startTime!} ms`,
    });
  });
  next();
});

app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    hello: 'world',
  });
});

const port = process.env.PORT || '8080';
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
```

In this example, we extended the `Request` type in the `express` module to include a new property `_startTime`. We then used this property to log the response time in the middleware.

3. Update your `tsconfig.json` to include the `types.d.ts` file:

```json
{
  "ts-node": {
    "files": true
  },
  "compilerOptions": {
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node", "express"],
    "typeRoots": ["./node_modules/@types", "."]
  },
  "include": ["types.d.ts", "src/**/*.ts"]
}
```

:::tip
The `ts-node` option is used to include the `types.d.ts` file when running TypeScript files with `ts-node`.
Refer to stackoverflow [question](https://stackoverflow.com/questions/51610583/ts-node-ignores-d-ts-files-while-tsc-successfully-compiles-the-project) for more details.
:::

## Conclusion

Extending TypeScript types in external modules can be useful when you need to add custom properties or methods to existing types. By understanding the module name and using the `declare module` syntax, you can easily extend types in external modules.
