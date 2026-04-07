// Deployed at: https://oil.fixthestrait.com
// This file is a reference copy of the Cloudflare Worker source.
// The live deployment must be updated manually via the Cloudflare dashboard
// (or `wrangler deploy`) — editing this file does NOT redeploy anything.
//
// Returns a primary asset (WTI crude, with full intraday points) plus a list
// of secondary assets (price + change only). The primary's fields are also
// spread onto the root of the response so older clients that expect the
// single-asset shape continue to work without changes.

const PRIMARY = { symbol: 'CL=F', name: 'WTI Crude' };

const OTHERS = [
  { symbol: 'BZ=F', name: 'Brent Crude' },
  { symbol: 'NG=F', name: 'Natural Gas' },
  { symbol: 'GC=F', name: 'Gold' },
  { symbol: '^VIX', name: 'Volatility (VIX)' },
];

async function fetchSymbol(sym, withPoints) {
  const url =
    'https://query1.finance.yahoo.com/v8/finance/chart/' +
    encodeURIComponent(sym) +
    '?interval=5m&range=1d&includePrePost=false';

  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; research/1.0)',
      'Accept': 'application/json',
    },
  });
  if (!resp.ok) throw new Error('upstream ' + sym + ' ' + resp.status);

  const raw = await resp.json();
  const result = raw.chart.result[0];
  const meta = result.meta;
  const timestamps = result.timestamp || [];
  const quote = (result.indicators && result.indicators.quote && result.indicators.quote[0]) || {};

  const points = [];
  if (withPoints && quote.close) {
    for (let i = 0; i < timestamps.length; i++) {
      if (quote.close[i] != null) {
        points.push({
          t: timestamps[i] * 1000,
          c: Math.round(quote.close[i] * 100) / 100,
          v: quote.volume ? quote.volume[i] || 0 : 0,
        });
      }
    }
  }

  const price = meta.regularMarketPrice;
  const prevClose = meta.chartPreviousClose || meta.previousClose;
  const change = Math.round((price - prevClose) * 100) / 100;
  const changePct = Math.round((change / prevClose) * 10000) / 100;
  const totalVolume = points.reduce((s, p) => s + p.v, 0);

  return {
    symbol: sym,
    price,
    prevClose,
    change,
    changePct,
    totalVolume,
    currency: meta.currency || 'USD',
    points,
  };
}

export default {
  async fetch(request, env, ctx) {
    const sharedHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://fixthestrait.com',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Vary': '*',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': 'https://fixthestrait.com',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        },
      });
    }

    // Bumped cache key version since the response shape changed
    const cacheKey = new Request('https://oil-cache.internal/wti-v2');
    const cache = caches.default;

    const cached = await cache.match(cacheKey);
    if (cached) {
      return new Response(cached.body, {
        headers: { ...sharedHeaders, 'X-Cache': 'HIT' },
      });
    }

    try {
      // Fetch primary (with points) and others (lightweight) in parallel.
      // Failures on secondary symbols must not break the whole response —
      // we degrade gracefully by dropping any that fail.
      const primaryPromise = fetchSymbol(PRIMARY.symbol, true);
      const othersPromises = OTHERS.map((o) =>
        fetchSymbol(o.symbol, false)
          .then((d) => ({ ...d, name: o.name }))
          .catch(() => null)
      );

      const [primary, ...others] = await Promise.all([primaryPromise, ...othersPromises]);
      const assets = others.filter(Boolean);

      const data = {
        // Primary fields spread onto root for backwards compatibility with
        // the original single-asset response shape. Existing clients that
        // only know about WTI will keep working unchanged.
        ...primary,
        name: PRIMARY.name,
        // New shape: explicit primary + list of secondary assets.
        primary: { ...primary, name: PRIMARY.name },
        assets,
        updated: Date.now(),
      };

      const body = JSON.stringify(data);

      const cacheResponse = new Response(body, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=900',
        },
      });
      ctx.waitUntil(cache.put(cacheKey, cacheResponse));

      return new Response(body, {
        headers: { ...sharedHeaders, 'X-Cache': 'MISS' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: sharedHeaders,
      });
    }
  },
};
