/**
 * OpenTelemetry Initialization
 * Configures distributed tracing for the application
 */

import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { createResource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

/**
 * Initialize OpenTelemetry tracing
 * This is called early in the application lifecycle
 */
export function initTelemetry() {
  const resource = createResource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'shinmen-takezo',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  })

  const tracerProvider = new NodeTracerProvider({
    resource: resource,
  })

  // Only export traces in production
  if (process.env.NODE_ENV === 'production' && process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
    const exporter = new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
      headers: process.env.OTEL_EXPORTER_OTLP_HEADERS
        ? JSON.parse(process.env.OTEL_EXPORTER_OTLP_HEADERS)
        : undefined,
    })

    ;(tracerProvider as any).addSpanProcessor(new SimpleSpanProcessor(exporter))
  }

  // Register HTTP instrumentation
  registerInstrumentations({
    instrumentations: [new HttpInstrumentation()],
  })

  tracerProvider.register()

  return tracerProvider
}

/**
 * Get the global tracer instance
 */
export function getTracer(name: string, version?: string) {
  const { trace } = require('@opentelemetry/api')
  return trace.getTracer(name, version)
}

/**
 * Create a span for manual tracing
 */
export async function withSpan<T>(spanName: string, fn: (tracer: any) => Promise<T>): Promise<T> {
  const tracer = getTracer('shinmen-takezo')
  const span = tracer.startSpan(spanName)

  try {
    const result = await fn(tracer)
    span.setStatus({ code: 0 }) // OK
    return result
  } catch (error) {
    span.recordException(error as Error)
    span.setStatus({ code: 2 }) // ERROR
    throw error
  } finally {
    span.end()
  }
}
