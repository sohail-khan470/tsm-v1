import {NodeSDK} from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

//create sdk instance
const sdk = new NodeSDK({
    serviceName: 'taskmanager',
    instrumentations: [getNodeAutoInstrumentations()],
});

//intialize tracing

export function startTracing() {
    sdk.start();
    console.log('Tracing initialized for task manager');
}

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});