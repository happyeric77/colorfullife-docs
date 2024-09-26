---
title: Use Cypress reporter
tags: [e2e, test, cypress]
---

The result of each Cypress test is a STDOUT log on terminal. It is hard to track while running tests multiple times if we Cypress cloud is not adopted especially in local test env.

In this article, we are going to use the cypress `reporter` feature to generate a json report with custom format and store it at local data structure (`./reporter/report.json`).

## prerequisites

1. Ensure cypress env is ready in the project
2. Ensure the test script is ready.

## Config cypress.config.ts

Add the following content to the `cypress.config.ts` file

```ts title="./cypress.config.ts"
export default defineConfig({
  // Others ....
  reporter: "reporters/custom.js", // we use this dir as an example. Feel free to change the dir to your preferred location
});
```

## Setup cypress reporter

create a new file `custom.js` in the `reporters` folder with the following content. This file will be used to generate the custom report.

:::tip
This dir `reporters/custom.js` is just an example. You can change the dir to your preferred location. But please make sure the path is correct in the `cypress.config.ts` file.
:::

```js title="./reporters/custom.js"
const fs = require("node:fs");

const mocha = require("mocha");
module.exports = class CustomReporter extends mocha.reporters.Base {
  constructor(runner) {
    super(runner);
    const stats = runner.stats;
    runner.on("end", async () => {
      // Read the current result
      const currentResult = await fs.readFileSync("./reporter/report.json");
      const failures = stats.failures;
      // Write the result to the file
      await fs.writeFileSync(
        "./reporter/report.json",
        `${currentResult.toString()}\n${JSON.stringify({
          result: failures === 0 ? "PASS" : "FAIL",
          ...stats,
        })}`
      );
      console.log(
        "Test suite finished, result has been written to ./reporter/report.json"
      );
    });
  }
};
```

:::tip

You can customize the report format by changing the content in the `fs.writeFileSync` function by consuming the `stats` and `test` objects. See the detail from the [official mocha doc](https://mochajs.org/api/tutorial-custom-reporter)

:::

## Run the test

Run the test by using the following command

1. Single time

```bash
cypress run  --reporter reporter/custom.js # or the path you set in the cypress.config.ts
```

2. Multiple times

```bash
# Run 10 times test
for i in {1..10}; do cypress run  --reporter reporter/custom.js; done
```

Then you can see the test result in the `./reporter/report.json` file like below:

```json t

{"result":"PASS","suites":2,"tests":6,"passes":6,"pending":0,"failures":0,"start":"2024-07-16T09:12:08.898Z","end":"2024-07-16T09:12:34.966Z","duration":26068}
{"result":"PASS","suites":2,"tests":6,"passes":6,"pending":0,"failures":0,"start":"2024-07-16T09:12:42.041Z","end":"2024-07-16T09:13:07.024Z","duration":24983}
{"result":"PASS","suites":2,"tests":6,"passes":6,"pending":0,"failures":0,"start":"2024-07-16T09:13:14.748Z","end":"2024-07-16T09:13:40.308Z","duration":25560}
{"result":"PASS","suites":2,"tests":6,"passes":6,"pending":0,"failures":0,"start":"2024-07-16T09:13:49.810Z","end":"2024-07-16T09:14:15.150Z","duration":25340}
{"result":"PASS","suites":2,"tests":6,"passes":6,"pending":0,"failures":0,"start":"2024-07-16T09:14:22.984Z","end":"2024-07-16T09:14:48.020Z","duration":25036}
{"result":"PASS","suites":2,"tests":6,"passes":6,"pending":0,"failures":0,"start":"2024-07-16T09:14:55.330Z","end":"2024-07-16T09:15:20.114Z","duration":24784}
{"result":"PASS","suites":2,"tests":6,"passes":6,"pending":0,"failures":0,"start":"2024-07-16T09:15:27.781Z","end":"2024-07-16T09:15:52.927Z","duration":25146}
{"result":"PASS","suites":2,"tests":6,"passes":6,"pending":0,"failures":0,"start":"2024-07-16T09:16:00.497Z","end":"2024-07-16T09:16:25.566Z","duration":25069}
{"result":"PASS","suites":2,"tests":6,"passes":6,"pending":0,"failures":0,"start":"2024-07-16T09:16:32.568Z","end":"2024-07-16T09:16:57.215Z","duration":24647}
{"result":"PASS","suites":2,"tests":6,"passes":6,"pending":0,"failures":0,"start":"2024-07-16T09:17:04.534Z","end":"2024-07-16T09:17:29.758Z","duration":25224}


```

## Reference

- [Mocha custom reporter](https://mochajs.org/api/tutorial-custom-reporter)
- [Cypress reporter](https://docs.cypress.io/guides/tooling/reporters#Installed-locally)
