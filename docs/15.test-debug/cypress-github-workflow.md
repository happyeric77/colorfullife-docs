---
title: Setup cypress & github CI
tags: [e2e, test, cypress]
---

e2e test is a very important part of the frontend development. It can help us to find bugs and prevent them from happening again. In this article, we are going to talk about how to setup cypress and github CI.

We are going to use real world example to demonstrate how to

1. Test a react component locally by using **cypress component test**
2. Create a Github workflow CI to test the component automatically when there is any push to the repo.

[notifi-react-card](https://www.npmjs.com/package/@notifi-network/notifi-react-card?activeTab=readme) is a react component library that we are going to use as an example.

## Setup cypress component test environment

Install cypress by `npm install --save-dev cypress`.

Use `npx cypress open` to open the cypress app and select component testing.

It will create a `cypress/component` folder and a test file `cypress/component/<custom-name>.cy.tsx` after selecting "Component Testing".

In this case, name it as `NotifiSubscriptionCard.cy.tsx`.

## Write test

We can replace the dummy generated test code with the following.

```tsx title="./cypress/component/NotifiSubscriptionCard.cy.tsx"
import { arrayify } from "@ethersproject/bytes";
import {
  NotifiContext,
  NotifiSubscriptionCard,
} from "@notifi-network/notifi-react-card";
import "@notifi-network/notifi-react-card/dist/index.css";
import { ethers } from "ethers";

describe("NotifiSubscriptionCard.cy.tsx", () => {
  beforeEach(() => {
    // Workaround (cypress webpack not able to polyfill buffer)
    window.Buffer = require("buffer").Buffer;
    indexedDB.deleteDatabase("notifi");
    const seedPhrase = "Your-test-evm-wallet-seed-phrase";
    const provider = new ethers.providers.JsonRpcProvider(
      "Your-test-evm-rpc-url"
    );
    const wallet = ethers.Wallet.fromMnemonic(seedPhrase);
    const signer = wallet.connect(provider);
    cy.mount(
      <NotifiContext
        dappAddress="junitest.xyz"
        walletBlockchain="ETHEREUM"
        env="Development"
        walletPublicKey={signer.address}
        signMessage={async (message: Uint8Array) => {
          const signature = await signer.signMessage(message);
          return arrayify(signature);
        }}
      >
        <NotifiSubscriptionCard
          darkMode
          cardId="d8859ea72ff4449fa8f7f293ebd333c9"
        />
        ,
      </NotifiContext>
    );
  });

  it("Mount Card", () => {
    cy.get(".NotifiSubscriptionCard__container").should("exist");
  });

  it("Signup", () => {
    cy.get(".NotifiEmailInput__input").type("tester@notifi.network");
    cy.get(".NotifiPreviewCard__container").should("not.exist");
    cy.get(".NotifiSubscribeButton__button").click();
    cy.get(".NotifiPreviewCard__container").should("exist");
  });
});
```

## Run test locally

We can run the test locally by using

```bash
cypress run --component --spec 'cypress/component/NotifiSubscriptionCard.cy.tsx' --headed
```

> - `--component`: run component test
> - `--spec`: specify the test file
> - `--headed`: run the test in headed mode (open the browser)

Than we can see the test result in the terminal.

## Implement cypress github workflow

We can create a `.github/workflows/cypress.yml` file to implement the github workflow.

```yml title=".github/workflows/cypress.yml"
# name of the workflow (you can name it whatever you want)
name: Cypress Tests

# on directive to let github know to trigger the workflow anytime there is a push to the repo. more detail see: https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#using-event-activity-types
on: [push, pull_request]

jobs:
  # name of the job (you can name it whatever you want)
  cypress-run:
    runs-on: ubuntu-latest
    steps: # step directive describes what the action is doing
      # first action is github checkout action. It can be called without any git config. This action checks out our repo and pulls out to the pipeline so that our workflow can access it.
      - name: Checkout
        uses: actions/checkout@v4.1.0
      # Then use the cypress github action which is maintained by cypress team. This will install all the dependencies and run the test.
      - name: Cypress test
        uses: cypress-io/github-action@v4.1.0
        # Finally we are using the "with directive" to tell the cypress action to start our build and run the npm scripts
        with:
          config-file: cypress.config.ts
          browser: chrome
          headless: true
          command: npm run test
```

In this case, cypress action runs the `npm run test` command. So we need to add the following script in `package.json`.

Well done. 🎉.

You can check out the overall flow in [the source code repo here](https://github.com/eric-notifi/notifi-react-example-metamask)

## Reference

- [Manimulate webpack config for cypress](https://docs.cypress.io/api/plugins/preprocessors-api)

- [Cypress returns "browserslist" error in Create React App](https://stackoverflow.com/questions/72047299/cypress-returns-browserslist-error-in-create-react-app)

- [Cannot use JSX unless the '--jsx' flag is provided](https://stackoverflow.com/questions/50432556/cannot-use-jsx-unless-the-jsx-flag-is-provided)

- [Triggering a Github workflow](https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#using-event-activity-types)

- [Cypress tutorial video for beginner](https://www.youtube.com/watch?v=u8vMu7viCm8&t=8820s)

- [Cypress command list](https://docs.cypress.io/guides/guides/command-line)

- [Github action with cypress (videos included)](https://docs.cypress.io/guides/continuous-integration/github-actions)
