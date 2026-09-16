# Lucid — Server

A server template built on [Express](https://expressjs.com/) with testing, api documentation, and application telemetry out-of-the-box.


## Project structure and organization

The file structure is inspired by popular React frameworks, [Expo](https://docs.expo.dev/get-started/start-developing/#file-structure) and [Next](https://nextjs.org/docs/app/getting-started/project-structure) to make switching between frontend and backend development contexts completely seamless, while also taking advantage of the foundational loose-coupling of well-defined modules that create a better development experience and allow for easy maintainability and scalability.


## Validation, testing, API Docs, and telemetry

These features are included as first-class citizens in your project to facilitate progressively building on top of them as development advances, reducing the friction that typically comes with having to integrate them after the fact.

Here's how the features are pre-configured:

- [`yup`](https://github.com/jquense/yup) is used for **input validation**.
- **Unit tests** are included in each module's `./*.unit.test.ts` and are powered by [`vitest`](https://vitest.dev/).
- **Integration tests** that are defined in `./*.i9n.test.ts` also use `vitest` along wuth [`supertest`](https://github.com/forwardemail/supertest#readme).
- **End-to-end testing**, on the other hand, is enabled by [`playwright`](https://playwright.dev/docs/intro).
- [`swagger-jsdoc`](https://github.com/Surnet/swagger-jsdoc) reads the modules' `./*.docs.yml` files to generate `openapi` specifications that [`swagger-ui-express`](https://github.com/scottie1984/swagger-ui-express) uses to serve the documentation UI.
- `telemetry/index.ts` runs before your application starts to collect its telemetry data using [`@opentelemetry`](https://opentelemetry.io/).

These files and packages are included in the standard boilerplate. You can use the CLI to curate your scaffolding according to your specific needs . The project's loose coupling also ensures that replacing or removing them manually from the boilerplate is incredibly easy.


## Getting started

Create a new project by running the following command and selecting `server` in the interactive terminal.

```bash
npx @lucidjs/cli init [project-name] [options]
```

The following options are available:

```bash
--tests [on|off]            Include test suite
--test-scope [unit i9n e2e] Specify test scopes (unit, integration, end-to-end)
--docs [on|off]             Include Swagger docs
--telemetry [on|off]        Include observability with Opentelemetry
```

Remember that these options are all inclusive by default, and you will have to remove them manually by toggling them off, or selecting the options you want to keep to filter out the rest.

---
# ✌️
