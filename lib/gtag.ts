declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function reportConversion() {
  const conversionId = process.env.NEXT_PUBLIC_GTAG_CONVERSION_LABEL;
  if (typeof window === 'undefined' || !window.gtag || !conversionId) return;
  window.gtag('event', 'conversion', { send_to: conversionId });
}
