import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { ConsoleMetricExporter, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';


const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
  metricReaders: [
    new PeriodicExportingMetricReader({
      exporter: new ConsoleMetricExporter(),
      exportIntervalMillis: 60000,
    }),
  ],
  instrumentations: [
    getNodeAutoInstrumentations(),  // auto instrumentations for built-in modules and common packages
    new PinoInstrumentation(),      // attach to and send pino logs to opentelemetry logging sdk
  ],
});


sdk.start();


const handleShutdown = () => {
  try {
    console.info('Shutting down telemetry');
    sdk.shutdown();
  } catch (error) {
    console.error('Error shutting down telemetry', error);
  }
}

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
