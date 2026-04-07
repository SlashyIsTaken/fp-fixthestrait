(function () {
  var WORKER_URL = 'https://oil.fixthestrait.com';
  // Bumped from v2 → v3 because the response shape now includes a secondary
  // `assets` array. Old cached entries would be missing it, so invalidate.
  var CACHE_KEY = 'oildata_v3';
  var CACHE_TTL = 14 * 60 * 1000; // 14 min client-side cache (worker caches 15 min)

  // ── Analyst notes ─────────────────────────────────────────────────────────
  var notes = {
    up: [
      'PRICE SURGE DETECTED — Goldman Sachs analyst seen googling "Strait of Hormuz width." Market responding accordingly.',
      'Sharp upward movement consistent with "someone definitely knows something" pattern. We do not know what.',
      'Oil rising. Three unnamed sources confirm this is either a supply shock, a hedge fund, or Steve (dolphin) going long. Possibly all three.',
      'ALERT: Price approaching level where oil executives start sending ominous group emails. We are monitoring.',
    ],
    down: [
      'PRICE DROP DETECTED — Iran celebrating. Our models classify this as bearish.',
      'Sell-off underway. Intelligence suggests either demand destruction or someone pressing the wrong button. Possibly both.',
      'Oil down. The trebuchet team has filed for liquidation. This is considered unrelated.',
      'Declining price could signal reduced tension or a bluff. Our analysts cannot tell the difference. This is normal.',
    ],
    flat: [
      'Market stability detected. Our threat models are confused. This is unprecedented and suspicious.',
      'Flat price means everyone is waiting for something to happen. Something will happen. It always does.',
      'No significant movement today. Intelligence agencies have gone quiet. This is worse than when they were loud.',
      'Stability is the market\'s way of saying it has no idea what is happening either.',
    ],
    highVolume: [
      'Trading volume is elevated today. This could mean many things. We are not allowed to say which thing.',
      'Volume spike detected. Our compliance team has asked us to note that correlation is not causation. Our compliance team has also started buying gold.',
      'Significant trading activity recorded. The people moving this volume are, we are sure, doing so for entirely routine reasons that have nothing to do with anything.',
      'Above-average contracts changing hands today. Whoever is on the other side of these trades is very confident about something. We would love to know what.',
      'High volume day. In our experience, when this many people are this certain, it is either a fire drill or an actual fire. We are monitoring for smoke.',
      'VOLUME NOTE: An unusually large number of traders appear to have formed the same opinion at the same time, independently, without communicating. Remarkable coincidence.',
      'Volume is up. We are not saying anyone knew anything in advance. We are simply noting that someone seems to have known something in advance.',
      'Elevated trading volume observed. This is either rational market behavior or the least subtle thing we have ever seen. Possibly both.',
    ],
    generic: [
      'Pattern analysis complete. Pattern: concerning. Confidence: high. Action taken: this website.',
      'Three hedge funds, one trebuchet operator, and Iran have all gone suspiciously quiet.',
      'Our AI model predicts $200/barrel by Q3. It also predicted dolphin diplomacy would work.',
      'Unusual options activity detected. Unusual for us. Not unusual for them.',
      'Compared to last week: worse. Compared to 2019: still worse. Trend: consistent.',
      'Data shows high correlation between Strait tensions and people building websites about the Strait. We are aware of the irony.',
      'CLASSIFIED: The real oil price was the friends we made along the way.',
      'Steve (dolphin) has been unavailable for comment. His agent says he is "on vacation." Steve does not take vacations.',
    ],
  };

  // ── Volume ratio ───────────────────────────────────────────────────────────
  // Compares the last ~30 min of candles against the earlier session baseline.
  // Returns a ratio (1.0 = same as earlier, 1.8 = 80% busier than earlier),
  // or null if there are not enough candles to split meaningfully.
  function calcVolumeRatio(points) {
    var active = points.filter(function (p) { return p.v > 0; });

    // Need at least 18 candles (90 min) to have both windows populated
    // Recent: last 6 candles (~30 min)
    // Baseline: the 12 candles before that (~60 min)
    // Using only the adjacent prior hour avoids flagging the natural
    // morning ramp-up or evening wind-down as anomalies.
    var recentCount = 6;
    var baselineCount = 12;
    if (active.length < recentCount + baselineCount) return null;

    var recent = active.slice(-recentCount);
    var baseline = active.slice(-(recentCount + baselineCount), -recentCount);

    var recentAvg = recent.reduce(function (s, p) { return s + p.v; }, 0) / recent.length;
    var baselineAvg = baseline.reduce(function (s, p) { return s + p.v; }, 0) / baseline.length;

    // If the baseline window is off-hours thin (< 15% of session average),
    // the comparison is noise — return null rather than a misleading ratio
    var sessionAvg = active.reduce(function (s, p) { return s + p.v; }, 0) / active.length;
    if (baselineAvg < sessionAvg * 0.15) return null;

    return baselineAvg > 0 ? recentAvg / baselineAvg : null;
  }

  function volumeLabel(ratio) {
    if (ratio === null) return 'Insufficient data for comparison (early session or off-hours)';
    if (ratio > 1.8) return 'Materially above prior hour (make of that what you will)';
    if (ratio > 1.2) return 'Stronger than prior hour (people are positioning. why? unclear.)';
    if (ratio > 0.8) return 'In line with prior hour (normal. for now.)';
    return 'Below prior hour (quieting down)';
  }

  function getNote(pct, ratio) {
    var elevated = ratio !== null && ratio > 1.2;
    var pool = pct > 2 ? notes.up : pct < -2 ? notes.down : notes.flat;
    if (elevated) pool = notes.highVolume.concat(pool);
    pool = pool.concat(notes.generic);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ── Probability calculation ────────────────────────────────────────────────
  function calcProbability(data) {
    var base = 47; // always elevated, we've been saying this since 2019
    var priceFactor = Math.min(Math.abs(data.changePct) * 4, 18);
    var ratio = calcVolumeRatio(data.points);
    var volumeFactor = ratio === null ? 2
      : ratio > 1.8 ? 12
      : ratio > 1.2 ? 7
      : ratio > 0.8 ? 3
      : 1;
    var iranFactor = (new Date().getDate() % 6) * 2; // 0–10, rotates daily
    var cosmicFactor = Math.round(Math.abs(Math.sin(Date.now() / 8640000)) * 5); // sunspot correlation (obviously)
    var total = Math.min(Math.round(base + priceFactor + volumeFactor + iranFactor + cosmicFactor), 99);
    // 100% certainty costs extra
    return {
      total: total,
      volume: data.totalVolume,
      items: [
        { label: 'Base tension (structural, chronic since 1979)', val: base },
        { label: 'Price movement volatility', val: Math.round(priceFactor) },
        { label: volumeLabel(ratio), val: volumeFactor },
        { label: 'Iran factor (day ' + new Date().getDate() + ' of month)', val: iranFactor },
        { label: 'Cosmic background correlation', val: cosmicFactor },
      ],
    };
  }

  // ── Canvas chart ──────────────────────────────────────────────────────────
  function drawPriceChart(canvas, points) {
    if (!canvas || !points || points.length < 2) return;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    // Read display size from the wrapper, not the canvas itself.
    // The canvas is absolutely positioned inside a fixed-height wrapper,
    // so we must NOT write inline width/height onto the canvas — CSS
    // governs the rendered box. We only set the bitmap resolution.
    var W = canvas.offsetWidth || (canvas.parentNode && canvas.parentNode.offsetWidth) || 0;
    var H = parseInt(canvas.getAttribute('height'));
    if (W <= 0) return;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    var prices = points.map(function (p) { return p.c; });
    var minP = Math.min.apply(null, prices);
    var maxP = Math.max.apply(null, prices);
    var range = maxP - minP || 0.01;
    var pad = { top: 14, bottom: 4, left: 0, right: 2 };
    var plotH = H - pad.top - pad.bottom;
    var plotW = W - pad.left - pad.right;

    function xOf(i) { return pad.left + (i / (prices.length - 1)) * plotW; }
    function yOf(p) { return pad.top + (1 - (p - minP) / range) * plotH; }

    var isUp = prices[prices.length - 1] >= prices[0];
    var lineColor = isUp ? '#22c55e' : '#ef4444';
    var fillColor = isUp ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)';

    // Subtle grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75].forEach(function (f) {
      var y = pad.top + (1 - f) * plotH;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    });

    // Previous close dashed line
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, yOf(prices[0]));
    ctx.lineTo(W, yOf(prices[0]));
    ctx.stroke();
    ctx.setLineDash([]);

    // Fill
    ctx.beginPath();
    prices.forEach(function (p, i) { i === 0 ? ctx.moveTo(xOf(i), yOf(p)) : ctx.lineTo(xOf(i), yOf(p)); });
    ctx.lineTo(xOf(prices.length - 1), H);
    ctx.lineTo(pad.left, H);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Price line
    ctx.beginPath();
    prices.forEach(function (p, i) { i === 0 ? ctx.moveTo(xOf(i), yOf(p)) : ctx.lineTo(xOf(i), yOf(p)); });
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // End dot
    ctx.beginPath();
    ctx.arc(xOf(prices.length - 1) - 1, yOf(prices[prices.length - 1]), 3, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();

    // Min / max labels
    ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.textAlign = 'left';
    ctx.fillText('$' + maxP.toFixed(2), 4, pad.top - 3);
    ctx.fillText('$' + minP.toFixed(2), 4, H - 1);
  }

  function drawVolumeChart(canvas, points) {
    if (!canvas || !points || points.length < 2) return;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var W = canvas.offsetWidth || (canvas.parentNode && canvas.parentNode.offsetWidth) || 0;
    var H = parseInt(canvas.getAttribute('height'));
    if (W <= 0) return;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    var vols = points.map(function (p) { return p.v || 0; });
    var maxV = Math.max.apply(null, vols);
    if (maxV === 0) return;
    var barW = Math.max(1, W / vols.length - 0.5);

    vols.forEach(function (v, i) {
      var x = (i / vols.length) * W;
      var h = Math.max(1, (v / maxV) * (H - 2));
      ctx.fillStyle = 'rgba(239,68,68,0.35)';
      ctx.fillRect(x, H - h, barW, h);
    });
  }

  // ── Secondary asset strip ──────────────────────────────────────────────────
  // Snarky one-liners keyed by symbol. Picked deterministically from the
  // change percent so the line is stable within a render but rotates as the
  // market moves. Up = first half, down = second half.
  var assetQuips = {
    'BZ=F': {
      up: [
        'Europeans noticing.',
        'Brent leading WTI is never a good sign.',
        'Brent up. North Sea fishermen suddenly very interested in geopolitics.',
        'Brent climbing. Refineries in Rotterdam doing the math face.',
        'Brent rising. Somewhere a tanker is taking the long way around Africa, just in case.',
        'Brent up. The phrase "supply concerns" being typed into 400 Bloomberg terminals at once.',
        'Brent green. OPEC+ scheduling an "informal" call about nothing in particular.',
        'Brent rallying. A Saudi prince just smiled. We do not know which one. We do not need to.',
        'Brent up. Diesel hauliers across Europe quietly updating their spreadsheets.',
      ],
      down: [
        'Brent calm. North Sea unbothered. For now.',
        'Brent down. Probably nothing.',
        'Brent slipping. Someone, somewhere, just exhaled.',
        'Brent red. The market has decided everything is fine. The market is often wrong.',
        'Brent down. Either demand collapsed or a trader fat-fingered a zero. Both are bad.',
        'Brent off. European energy ministers cautiously not celebrating in public.',
        'Brent down. The word "transitory" being dusted off in three central banks.',
        'Brent dropping. The shorts are dancing. The dance is brief. It always is.',
      ],
    },
    'NG=F': {
      up: [
        'Nat gas rallying. Someone is cold somewhere.',
        'Heating bills entering the chat.',
        'Nat gas up. Henry Hub vibrating at a frequency only utility CFOs can hear.',
        'Nat gas climbing. Your landlord just found religion about the thermostat.',
        'Nat gas surging. Germany checking the calendar with mounting concern.',
        'Nat gas up. The polar vortex has not arrived but the futures market has already invited it.',
        'Nat gas rising. LNG terminal operators slipping into something more comfortable. Like a yacht.',
        'Nat gas green. A pipeline somewhere just made a sound nobody wants to hear.',
        'Nat gas up. Texas frowning. Texas always frowns now.',
      ],
      down: [
        'Nat gas slipping. Mild winter cope.',
        'Nat gas down. Russia presumably annoyed.',
        'Nat gas red. Storage facilities full. Vibes: confusingly fine.',
        'Nat gas falling. Frackers in the Permian rediscovering the concept of "unprofitable."',
        'Nat gas down. Climate change doing the bears\' job for them again.',
        'Nat gas slipping. Someone in Qatar just stopped returning calls. Probably unrelated.',
        'Nat gas off. The phrase "demand destruction" being whispered in three time zones.',
        'Nat gas down. We checked. Winter is still happening. Market disagrees.',
      ],
    },
    'GC=F': {
      up: [
        'Gold up. The smart money is wearing tinfoil.',
        'Goldbugs vindicated, again, briefly.',
        'Gold rallying. Central banks buying like it\'s 1971. They know something. They always know something.',
        'Gold up. Your uncle who has been "stacking" since 2009 is finally insufferable for a reason.',
        'Gold climbing. Bond yields lying. Real yields lying. Gold not lying. Gold never lies.',
        'Gold green. Three Swiss vaults just hired more security. We are not allowed to say which.',
        'Gold up. The dollar is fine. The dollar is fine. The dollar is fine.',
        'Gold rising. ETF inflows suggesting a lot of people just remembered what a hedge is.',
        'Gold up. Shanghai premium widening. Make of that what you will. We have.',
      ],
      down: [
        'Gold down. Confidence detected. Suspicious.',
        'Gold slipping. Risk-on or denial — your call.',
        'Gold red. Crypto bros pointing and laughing. They will stop pointing soon.',
        'Gold off. Real yields up, faith intact, end times rescheduled to Q3.',
        'Gold down. Margin calls forcing somebody to sell the one thing they didn\'t want to.',
        'Gold falling. The bond market briefly remembering it exists.',
        'Gold down. Jewelry demand from India saving us all, as usual. Thanks India.',
        'Gold slipping. Either the world is fine or the world is so not fine that nobody can afford gold.',
      ],
    },
    '^VIX': {
      up: [
        'VIX up. Vibes: deteriorating.',
        'Fear index waking up. Pour another coffee.',
        'VIX rising. Options desks suddenly very busy and very quiet.',
        'VIX up. The phrase "risk management" briefly meaning something again.',
        'VIX climbing. CNBC graphics designers reaching for the red font.',
        'VIX surging. A hedge fund in Greenwich just discovered they were the exit liquidity.',
        'VIX up. Vol sellers learning the timeless lesson, again, on schedule.',
        'VIX rising. The market\'s smoke alarm. The market is full of smoke. The market is also a building.',
        'VIX up. Twitter finance accounts gaining 4,000 followers per hour. None will be there next week.',
      ],
      down: [
        'VIX calm. Suspiciously calm.',
        'Volatility napping. Do not trust the nap.',
        'VIX low. Vol sellers feeling galaxy-brained. History suggests otherwise. History always suggests otherwise.',
        'VIX down. The market has priced in eternal peace and good interest rates. Bold.',
        'VIX falling. Risk parity funds piling back in. What could go wrong. (Everything.)',
        'VIX off. The fear gauge measuring the absence of fear, which is the scariest reading there is.',
        'VIX down. We are in the part of the cycle where everyone forgets why VIX exists.',
        'VIX low. Complacency index pegged. The complacency index does not exist. We made it up. It is still pegged.',
      ],
    },
  };

  function quipFor(symbol, changePct) {
    var pool = assetQuips[symbol];
    if (!pool) return '';
    var arr = changePct >= 0 ? pool.up : pool.down;
    // Stable index based on the price (so it doesn't flicker every render
    // but does rotate as the market moves)
    var idx = Math.abs(Math.round(changePct * 100)) % arr.length;
    return arr[idx];
  }

  function renderAssetStrip(assets) {
    var strip = document.getElementById('oilAssetStrip');
    if (!strip) return;
    if (!assets || !assets.length) {
      strip.innerHTML = '';
      return;
    }
    strip.innerHTML = assets.map(function (a) {
      var isUp = a.change >= 0;
      var sign = isUp ? '+' : '';
      var cls = isUp ? 'green' : 'red';
      var arrow = isUp ? '&#9650;' : '&#9660;';
      var quip = quipFor(a.symbol, a.changePct);
      return (
        '<div class="oil-asset-card">' +
          '<div class="oil-asset-head">' +
            '<span class="oil-asset-sym">' + a.symbol + '</span>' +
            '<span class="oil-asset-name">' + (a.name || '') + '</span>' +
          '</div>' +
          '<div class="oil-asset-price">$' + a.price.toFixed(2) + '</div>' +
          '<div class="oil-asset-delta ' + cls + '">' + arrow + ' ' + sign +
            a.change.toFixed(2) + ' (' + sign + a.changePct.toFixed(2) + '%)</div>' +
          (quip ? '<div class="oil-asset-quip">' + quip + '</div>' : '') +
        '</div>'
      );
    }).join('');
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  function render(data) {
    var isUp = data.change >= 0;
    var sign = isUp ? '+' : '';
    var cls = isUp ? 'green' : 'red';

    // Price panel
    var ratio = calcVolumeRatio(data.points);
    var volTierWord = ratio === null ? 'EARLY SESSION'
      : ratio > 1.8 ? 'UNUSUAL'
      : ratio > 1.2 ? 'ELEVATED'
      : ratio > 0.8 ? 'NORMAL'
      : 'QUIET';
    var volTierCls = ratio === null ? ''
      : ratio > 1.8 ? 'red'
      : ratio > 1.2 ? 'warn'
      : '';
    var panel = document.getElementById('oilPricePanel');
    if (panel) {
      panel.innerHTML =
        '<div class="oil-price-main">' +
          '<div class="oil-price-ticker">WTI CRUDE OIL &mdash; CL=F</div>' +
          '<div class="oil-price-value ' + cls + '">$' + data.price.toFixed(2) + '</div>' +
          '<div class="oil-price-delta ' + cls + '">' + sign + data.change.toFixed(2) +
            ' (' + sign + data.changePct.toFixed(2) + '%) today</div>' +
        '</div>' +
        '<div class="oil-price-meta">' +
          '<div class="oil-meta-row"><span>PREV CLOSE</span><span>$' + data.prevClose.toFixed(2) + '</span></div>' +
          '<div class="oil-meta-row"><span>ACTIVITY</span><span class="' + volTierCls + '">' + volTierWord + '</span></div>' +
          '<div class="oil-meta-row"><span>CURRENCY</span><span>' + (data.currency || 'USD') + '</span></div>' +
          '<div class="oil-meta-row"><span>DIRECTION</span><span class="' + cls + '">' +
            (isUp ? '&#9650; BULLISH TENSION' : '&#9660; BEARISH RELIEF') +
          '</span></div>' +
        '</div>';
    }

    // Charts (need layout to be rendered first)
    requestAnimationFrame(function () {
      drawPriceChart(document.getElementById('oilChart'), data.points);
      drawVolumeChart(document.getElementById('oilVolChart'), data.points);
    });

    // Probability
    var prob = calcProbability(data);
    var fillEl = document.getElementById('oilProbFill');
    var pctEl = document.getElementById('oilProbPct');
    var bdEl = document.getElementById('oilProbBreakdown');

    if (fillEl) {
      fillEl.style.width = '0%'; // animate from 0
      requestAnimationFrame(function () {
        setTimeout(function () { fillEl.style.width = prob.total + '%'; }, 100);
      });
      fillEl.className = 'oil-prob-fill ' + (prob.total > 80 ? 'crit' : prob.total > 65 ? 'elev' : 'mod');
    }
    if (pctEl) pctEl.textContent = prob.total + '%';
    if (bdEl) {
      bdEl.innerHTML = prob.items.map(function (it) {
        return '<span class="prob-item"><span class="prob-item-label">' + it.label +
          '</span><span class="prob-item-val">+' + it.val + '%</span></span>';
      }).join('');
    }

    // Analyst note
    var noteEl = document.getElementById('oilAnalystText');
    if (noteEl) noteEl.textContent = getNote(data.changePct, calcVolumeRatio(data.points));

    // Secondary assets strip (Brent, Nat Gas, Gold, VIX...)
    renderAssetStrip(data.assets);

    // Updated timestamp
    var updEl = document.getElementById('oilUpdated');
    if (updEl) {
      var mins = Math.round((Date.now() - data.updated) / 60000);
      updEl.textContent = mins < 1 ? 'live' : 'data ~' + mins + ' min old';
    }
  }

  function showError() {
    var panel = document.getElementById('oilPricePanel');
    if (panel) {
      panel.innerHTML = '<div class="oil-error">MARKET DATA UNAVAILABLE<br>' +
        '<span>The CIA has intercepted our data feed, or the API is down.<br>Either way, assume prices are bad.</span></div>';
    }
  }

  // ── Fetch ──────────────────────────────────────────────────────────────────
  function load() {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        var cached = JSON.parse(raw);
        if (Date.now() - cached.updated < CACHE_TTL) {
          render(cached);
          return;
        }
      }
    } catch (e) { /* ignore */ }

    fetch(WORKER_URL)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        if (data.error) throw new Error(data.error);
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch (e) { /* quota */ }
        render(data);
      })
      .catch(function (err) {
        showError();
        console.warn('[oil tracker]', err.message);
      });
  }

  // Re-draw charts on resize — but ONLY when the chart's width actually
  // changes. iOS Safari fires `resize` constantly while you scroll, because
  // the URL bar collapses/expands and changes viewport height. Re-running
  // the full render() on every one of those events caused a feedback loop
  // that visually grew the chart "in chunks" while the user's finger was on
  // the screen. Width-only gating eliminates that entirely.
  var lastChartWidth = 0;
  var resizeTimer;
  function maybeRedraw() {
    var wrap = document.querySelector('.oil-canvas-wrap-price');
    var w = wrap ? wrap.offsetWidth : 0;
    if (w === lastChartWidth) return;
    lastChartWidth = w;
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      // Only redraw the canvases — no need to re-stamp the price panel HTML.
      drawPriceChart(document.getElementById('oilChart'), data.points);
      drawVolumeChart(document.getElementById('oilVolChart'), data.points);
    } catch (e) { /* ignore */ }
  }
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(maybeRedraw, 150);
  });

  document.addEventListener('DOMContentLoaded', load);
})();
