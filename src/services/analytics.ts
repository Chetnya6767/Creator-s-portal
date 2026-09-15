type AnalyticsEventName =
  | 'service_view'
  | 'start_project'
  | 'project_submitted'
  | 'payment_started'
  | 'payment_completed'
  | 'contact_submitted'
  | 'team_application_submitted'
  | 'page_view';

export function trackEvent(eventName: AnalyticsEventName, properties?: Record<string, unknown>): void {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
  const analyticsId = metaEnv?.VITE_ANALYTICS_ID || metaEnv?.ANALYTICS_ID;

  // Log in development or when analytics ID is configured
  if (metaEnv?.DEV || !analyticsId) {
    console.info(`[Analytics Event: ${eventName}]`, properties || {});
  }

  if (typeof window !== 'undefined' && (window as any).gtag && analyticsId) {
    (window as any).gtag('event', eventName, {
      ...properties,
      send_to: analyticsId,
    });
  }
}

export function trackPageView(pagePath: string): void {
  trackEvent('page_view', { page: pagePath });
}
