export interface Quote {
  price: number;
}

/**
 * Fetches a real-time quote from Finnhub's free-tier API directly from the
 * browser (no backend). The API key travels in the URL and is visible to
 * anyone inspecting network requests on this site — that's the accepted
 * trade-off of live prices without a server (see README). Each visitor
 * enters their own free key and it's stored only in their own browser; it
 * is never bundled into the built site or committed to source control.
 *
 * Uses a plain GET with no custom headers — Finnhub's CORS config rejects
 * preflighted requests (e.g. ones that set a Content-Type header), so this
 * intentionally avoids anything that would trigger a preflight.
 */
export async function fetchQuote(ticker: string, apiKey: string): Promise<Quote> {
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Finnhub request failed (${res.status})`);
  }
  const data = await res.json();
  if (typeof data.c !== 'number' || data.c === 0) {
    throw new Error(`No price data returned for ${ticker}`);
  }
  return { price: data.c };
}
