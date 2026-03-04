export function trackServerEvent(
  eventName: string,
  payload: Record<string, unknown> = {}
) {
  try {
    // Placeholder: wire this to your analytics provider (Datadog, Segment, etc.)
    console.info(`[telemetry] ${eventName}`, payload)
  } catch (e) {
    console.error('Telemetry server event failed', e)
  }
}

export function trackClientEvent(
  eventName: string,
  payload: Record<string, unknown> = {}
) {
  try {
    // Client-side telemetry can use navigator.sendBeacon or window.analytics if present.
    if (typeof window !== 'undefined' && (window as any).analytics?.track) {
      ;(window as any).analytics.track(eventName, payload)
    } else {
      // Fallback to console for local debugging
      // eslint-disable-next-line no-console
      console.info(`[telemetry-client] ${eventName}`, payload)
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Telemetry client event failed', e)
  }
}

const telemetry = { trackServerEvent, trackClientEvent }
export default telemetry
