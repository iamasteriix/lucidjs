# Lucid - CLI

Yet another JavaScript framework.

## Server

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

These options are all inclusive by default, and you will have to remove them manually by toggling them off, or selecting the options you want to keep to filter out the rest.

---
# ✌️
