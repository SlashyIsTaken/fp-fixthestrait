(function () {
  var WORKER_URL = 'https://oil.fixthestrait.com';
  var CACHE_KEY = 'oildata_v2';
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
    var W = canvas.offsetWidth;
    var H = parseInt(canvas.getAttribute('height'));
    // Pin CSS size before changing internal resolution — prevents canvas from
    // visually expanding on HiDPI/mobile when canvas.height = H * dpr is set
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
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
    var W = canvas.offsetWidth;
    var H = parseInt(canvas.getAttribute('height'));
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
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

  // Re-draw charts on resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      try {
        var raw = sessionStorage.getItem(CACHE_KEY);
        if (raw) render(JSON.parse(raw));
      } catch (e) { /* ignore */ }
    }, 150);
  });

  document.addEventListener('DOMContentLoaded', load);
})();
