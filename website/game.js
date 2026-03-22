(function() {
  var canvas, ctx;
  var W = 700, H = 400;
  var running = false;
  var gameOver = false;
  var score = 0;
  var barrels = 0;
  var incidents = 0;
  var distance = 0;
  var speed = 2;
  var frameCount = 0;

  // Tanker
  var tanker = { x: 100, y: H / 2, w: 60, h: 20, vy: 0 };

  // Obstacles
  var obstacles = [];
  var particles = [];

  // Land boundaries (strait narrows and widens)
  var landTop = [];
  var landBot = [];

  // Barrel pickups
  var pickups = [];

  var obstacleTypes = [
    { label: 'ANGRY TWEET', color: '#1DA1F2', emoji: '\uD83D\uDCAC', w: 25, h: 25 },
    { label: 'ROGUE DOLPHIN', color: '#22c55e', emoji: '\uD83D\uDC2C', w: 28, h: 22 },
    { label: 'FLOATING NFT', color: '#eab308', emoji: '\uD83D\uDDBC\uFE0F', w: 24, h: 24 },
    { label: 'TREBUCHET BARREL', color: '#ff6b2b', emoji: '\uD83D\uDCA5', w: 22, h: 22 },
    { label: 'DIPLOMATIC INCIDENT', color: '#ef4444', emoji: '\uD83D\uDCE8', w: 26, h: 22 },
    { label: 'CARRIER CHUNK', color: '#7a756e', emoji: '\u2693', w: 30, h: 20 },
    { label: 'KRAZY STRAW', color: '#3b82f6', emoji: '\uD83E\uDD64', w: 20, h: 30 },
    { label: 'CRUDE COIN MINER', color: '#f59e0b', emoji: '\u26CF\uFE0F', w: 24, h: 24 },
    { label: 'SEA MINE', color: '#6b7280', emoji: '', w: 24, h: 24, behavior: 'mine', customDraw: 'mine' },
    { label: 'SEA MINE', color: '#6b7280', emoji: '', w: 24, h: 24, behavior: 'mine', customDraw: 'mine' },
    { label: 'FIGHTER JET', color: '#a855f7', emoji: '', w: 36, h: 18, behavior: 'jet', customDraw: 'jet' }
  ];

  // Generate initial terrain
  function initTerrain() {
    landTop = [];
    landBot = [];
    for (var i = 0; i < W + 200; i += 4) {
      var narrowing = Math.sin(i * 0.003) * 40 + Math.sin(i * 0.007) * 20;
      landTop.push(60 + narrowing + Math.sin(i * 0.02) * 8);
      landBot.push(H - 60 - narrowing + Math.sin(i * 0.02 + 1) * 8);
    }
  }

  function scrollTerrain() {
    landTop.shift();
    landBot.shift();
    var i = landTop.length * 4 + distance * 4;
    var narrowing = Math.sin(i * 0.003) * 40 + Math.sin(i * 0.007) * 20;
    // Gets harder over time
    var squeeze = Math.min(distance * 0.01, 30);
    landTop.push(60 + squeeze + narrowing + Math.sin(i * 0.02) * 8);
    landBot.push(H - 60 + squeeze - narrowing + Math.sin(i * 0.02 + 1) * 8);
  }

  function spawnObstacle() {
    var type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    var safeTop = landTop[landTop.length - 1] + 20;
    var safeBot = landBot[landBot.length - 1] - 20;
    var y = safeTop + Math.random() * (safeBot - safeTop - type.h);
    var ob = {
      x: W + 10,
      y: y,
      w: type.w,
      h: type.h,
      color: type.color,
      emoji: type.emoji,
      label: type.label,
      bobOffset: Math.random() * Math.PI * 2,
      behavior: type.behavior || 'normal',
      customDraw: type.customDraw || null,
      vy: 0
    };

    if (ob.behavior === 'mine') {
      // Mines drift slowly with current, feel stationary in water
      ob.driftSpeed = 0.3 + Math.random() * 0.3;
    } else if (ob.behavior === 'jet') {
      // Jets strafe vertically across the strait from top or bottom
      var fromTop = Math.random() > 0.5;
      ob.y = fromTop ? safeTop : safeBot - type.h;
      ob.vy = fromTop ? (2.5 + Math.random() * 2) : -(2.5 + Math.random() * 2);
      ob.x = W + 30 + Math.random() * 100;
    }

    obstacles.push(ob);
  }

  function spawnPickup() {
    var safeTop = landTop[landTop.length - 1] + 30;
    var safeBot = landBot[landBot.length - 1] - 30;
    var y = safeTop + Math.random() * (safeBot - safeTop);
    pickups.push({ x: W + 10, y: y, r: 8, collected: false });
  }

  function addParticles(x, y, color, count) {
    for (var i = 0; i < count; i++) {
      particles.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 30 + Math.random() * 20,
        color: color,
        r: 2 + Math.random() * 3
      });
    }
  }

  function collides(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function update() {
    frameCount++;
    distance += speed * 0.01;
    speed = 2 + distance * 0.05;

    // Input: tanker drifts toward mouse/touch or keyboard
    tanker.y += tanker.vy;
    tanker.vy *= 0.92;

    // Clamp tanker within strait
    var idx = Math.floor(tanker.x);
    var topBound = (idx < landTop.length ? landTop[idx] : 80) + 5;
    var botBound = (idx < landBot.length ? landBot[idx] : H - 80) - tanker.h - 5;

    if (tanker.y < topBound) { tanker.y = topBound; endGame('CRASHED INTO IRAN — diplomatic incident'); return; }
    if (tanker.y + tanker.h > botBound + tanker.h) { tanker.y = botBound; endGame('CRASHED INTO OMAN — tourism disrupted'); return; }

    // Scroll terrain
    for (var s = 0; s < Math.ceil(speed); s++) scrollTerrain();

    // Move obstacles
    for (var i = obstacles.length - 1; i >= 0; i--) {
      var ob = obstacles[i];
      if (ob.behavior === 'mine') {
        // Mines are anchored — scroll with the world
        ob.x -= speed;
      } else if (ob.behavior === 'jet') {
        // Jets move fast horizontally and strafe vertically
        ob.x -= speed * 1.8;
        ob.y += ob.vy;
        // Remove if jet leaves vertically
        if (ob.y < -40 || ob.y > H + 40) { obstacles.splice(i, 1); continue; }
      } else {
        ob.x -= speed;
      }
      if (ob.x < -40) { obstacles.splice(i, 1); continue; }
      if (collides(tanker, ob)) {
        addParticles(ob.x, ob.y, ob.color, 8);
        endGame('HIT BY ' + ob.label);
        return;
      }
    }

    // Move pickups
    for (var j = pickups.length - 1; j >= 0; j--) {
      pickups[j].x -= speed;
      if (pickups[j].x < -20) { pickups.splice(j, 1); continue; }
      if (!pickups[j].collected) {
        var dx = (tanker.x + tanker.w / 2) - pickups[j].x;
        var dy = (tanker.y + tanker.h / 2) - pickups[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < 25) {
          pickups[j].collected = true;
          barrels++;
          score += 100;
          addParticles(pickups[j].x, pickups[j].y, '#ff6b2b', 5);
          pickups.splice(j, 1);
        }
      }
    }

    // Particles
    for (var k = particles.length - 1; k >= 0; k--) {
      particles[k].x += particles[k].vx;
      particles[k].y += particles[k].vy;
      particles[k].life--;
      if (particles[k].life <= 0) particles.splice(k, 1);
    }

    // Spawn
    if (frameCount % Math.max(40, 80 - Math.floor(distance * 2)) === 0) spawnObstacle();
    if (frameCount % 90 === 0) spawnPickup();

    // Score
    score += Math.floor(speed * 0.5);
  }

  function draw() {
    ctx.fillStyle = '#0a0f1a';
    ctx.fillRect(0, 0, W, H);

    // Water
    ctx.fillStyle = '#0c192966';
    ctx.fillRect(0, 0, W, H);

    // Draw land masses
    ctx.fillStyle = '#1a1a14';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (var i = 0; i < Math.min(landTop.length, Math.ceil(W / 4) + 1); i++) {
      ctx.lineTo(i * 4, landTop[i]);
    }
    ctx.lineTo(W, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#22221e';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (var ii = 0; ii < Math.min(landTop.length, Math.ceil(W / 4) + 1); ii++) {
      ctx.lineTo(ii * 4, landTop[ii] - 3);
    }
    ctx.lineTo(W, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1a1a14';
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (var j = 0; j < Math.min(landBot.length, Math.ceil(W / 4) + 1); j++) {
      ctx.lineTo(j * 4, landBot[j]);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#22221e';
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (var jj = 0; jj < Math.min(landBot.length, Math.ceil(W / 4) + 1); jj++) {
      ctx.lineTo(jj * 4, landBot[jj] + 3);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();

    // Land labels
    ctx.font = '9px monospace';
    ctx.fillStyle = '#4a464066';
    ctx.fillText('IRAN', 20, 25);
    ctx.fillText('OMAN', 20, H - 15);

    // Water shimmer
    ctx.strokeStyle = '#3b82f611';
    ctx.lineWidth = 1;
    for (var w = 0; w < 8; w++) {
      var wy = 100 + w * 35 + Math.sin(frameCount * 0.03 + w) * 5;
      ctx.beginPath();
      ctx.moveTo(0, wy);
      for (var wx = 0; wx < W; wx += 20) {
        ctx.lineTo(wx, wy + Math.sin((wx + frameCount * 2) * 0.02) * 3);
      }
      ctx.stroke();
    }

    // Pickups (oil barrels)
    pickups.forEach(function(p) {
      ctx.fillStyle = '#ff6b2b';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#cc5520';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#cc5520';
      ctx.fillRect(p.x - 5, p.y - 1, 10, 2);
    });

    // Obstacles
    obstacles.forEach(function(o) {
      ctx.save();
      var bob = o.behavior === 'jet' ? 0 : Math.sin(frameCount * 0.05 + o.bobOffset) * 3;

      if (o.customDraw === 'mine') {
        var cx = o.x + o.w / 2;
        var cy = o.y + o.h / 2 + bob;
        var r = o.w / 2;
        // Chain/tether
        ctx.strokeStyle = '#4a464066';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy + r);
        var chainEnd = cy + r + 22;
        for (var cl = 0; cl < 4; cl++) {
          ctx.lineTo(cx + (cl % 2 === 0 ? 2 : -2), cy + r + cl * 6);
        }
        ctx.lineTo(cx, chainEnd);
        ctx.stroke();
        // Anchor weight
        ctx.fillStyle = '#4a464044';
        ctx.fillRect(cx - 3, chainEnd, 6, 4);
        // Mine body — dark sphere with glow
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 6 + Math.sin(frameCount * 0.1 + o.bobOffset) * 4;
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        // Darker hemisphere
        ctx.fillStyle = '#1f2937';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0.3, Math.PI + 0.3);
        ctx.fill();
        // Contact horns (the spiky detonators)
        var horns = [
          [-r - 3, -2], [r + 3, -2],   // left, right
          [-2, -r - 3], [-2, r + 3],   // top, bottom
          [-r * 0.7 - 2, -r * 0.7 - 2], [r * 0.7 + 2, -r * 0.7 - 2], // diagonals
          [-r * 0.7 - 2, r * 0.7 + 2], [r * 0.7 + 2, r * 0.7 + 2]
        ];
        ctx.fillStyle = '#6b7280';
        horns.forEach(function(h) {
          ctx.beginPath();
          ctx.arc(cx + h[0], cy + h[1], 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
        // Highlight
        ctx.fillStyle = '#ffffff15';
        ctx.beginPath();
        ctx.arc(cx - r * 0.3, cy - r * 0.3, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
        // Blinking indicator
        if (Math.sin(frameCount * 0.15 + o.bobOffset) > 0.5) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(cx, cy - r * 0.1, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (o.customDraw === 'jet') {
        var jx = o.x;
        var jy = o.y + o.h / 2;
        var dir = o.vy > 0 ? 1 : -1;
        // Exhaust trail
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#a855f7';
        for (var t = 1; t <= 4; t++) {
          ctx.beginPath();
          ctx.ellipse(jx + o.w + t * 10, jy - dir * t * 2, 6 - t, 2, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.ellipse(jx + o.w + 4, jy, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        // Fuselage
        ctx.fillStyle = '#6b7280';
        ctx.beginPath();
        ctx.moveTo(jx, jy);
        ctx.lineTo(jx + o.w * 0.8, jy - 2);
        ctx.lineTo(jx + o.w, jy);
        ctx.lineTo(jx + o.w * 0.8, jy + 2);
        ctx.closePath();
        ctx.fill();
        // Cockpit
        ctx.fillStyle = '#93c5fd';
        ctx.beginPath();
        ctx.ellipse(jx + o.w * 0.85, jy, 3, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Main wings (swept back)
        ctx.fillStyle = '#4b5563';
        ctx.beginPath();
        ctx.moveTo(jx + o.w * 0.4, jy - 1);
        ctx.lineTo(jx + o.w * 0.15, jy - 12);
        ctx.lineTo(jx + o.w * 0.3, jy - 1);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(jx + o.w * 0.4, jy + 1);
        ctx.lineTo(jx + o.w * 0.15, jy + 12);
        ctx.lineTo(jx + o.w * 0.3, jy + 1);
        ctx.closePath();
        ctx.fill();
        // Tail fins
        ctx.fillStyle = '#4b5563';
        ctx.beginPath();
        ctx.moveTo(jx + 4, jy - 1);
        ctx.lineTo(jx - 2, jy - 6);
        ctx.lineTo(jx + 8, jy - 1);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(jx + 4, jy + 1);
        ctx.lineTo(jx - 2, jy + 6);
        ctx.lineTo(jx + 8, jy + 1);
        ctx.closePath();
        ctx.fill();
        // Nose highlight
        ctx.fillStyle = '#9ca3af';
        ctx.beginPath();
        ctx.ellipse(jx + o.w * 0.92, jy - 0.5, 2, 1, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.font = Math.max(o.w, o.h) + 'px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(o.emoji, o.x + o.w / 2, o.y + o.h / 2 + bob);
      }
      ctx.restore();
    });

    // Tanker
    ctx.fillStyle = '#e8e4df';
    // Hull
    ctx.beginPath();
    ctx.moveTo(tanker.x, tanker.y + 4);
    ctx.lineTo(tanker.x + tanker.w - 8, tanker.y + 4);
    ctx.lineTo(tanker.x + tanker.w, tanker.y + tanker.h / 2);
    ctx.lineTo(tanker.x + tanker.w - 8, tanker.y + tanker.h - 4);
    ctx.lineTo(tanker.x, tanker.y + tanker.h - 4);
    ctx.closePath();
    ctx.fill();
    // Deck
    ctx.fillStyle = '#334155';
    ctx.fillRect(tanker.x + 4, tanker.y + 6, tanker.w - 20, tanker.h - 12);
    // Bridge
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(tanker.x + 2, tanker.y + 2, 10, tanker.h - 4);
    // Window
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(tanker.x + 4, tanker.y + 5, 5, 4);

    // Wake
    ctx.strokeStyle = '#ffffff11';
    ctx.lineWidth = 1;
    for (var wk = 1; wk <= 3; wk++) {
      ctx.beginPath();
      ctx.moveTo(tanker.x - 2, tanker.y + tanker.h / 2);
      ctx.lineTo(tanker.x - 10 - wk * 8, tanker.y + tanker.h / 2 + wk * 4 + Math.sin(frameCount * 0.1) * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tanker.x - 2, tanker.y + tanker.h / 2);
      ctx.lineTo(tanker.x - 10 - wk * 8, tanker.y + tanker.h / 2 - wk * 4 - Math.sin(frameCount * 0.1) * 2);
      ctx.stroke();
    }

    // Particles
    particles.forEach(function(p) {
      ctx.globalAlpha = p.life / 50;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (p.life / 50), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function updateHUD() {
    var distEl = document.getElementById('game-dist');
    var barrelEl = document.getElementById('game-barrels');
    var scoreEl = document.getElementById('game-score');
    var speedEl = document.getElementById('game-speed');
    if (distEl) distEl.textContent = distance.toFixed(1) + ' km';
    if (barrelEl) barrelEl.textContent = barrels;
    if (scoreEl) scoreEl.textContent = score.toLocaleString();
    if (speedEl) speedEl.textContent = speed.toFixed(1) + ' kn';
  }

  function gameLoop() {
    if (!running) return;
    update();
    draw();
    updateHUD();
    requestAnimationFrame(gameLoop);
  }

  function endGame(reason) {
    running = false;
    gameOver = true;

    var overlay = document.getElementById('gameOverlay');
    overlay.classList.remove('hidden');

    var title = overlay.querySelector('.game-title');
    var subtitle = overlay.querySelector('.game-subtitle');
    var scoreFinal = overlay.querySelector('.game-score-final');
    var btn = overlay.querySelector('.action-btn');

    title.textContent = 'VOYAGE ENDED';
    subtitle.textContent = reason;
    scoreFinal.textContent = 'Score: ' + score.toLocaleString() + ' | ' + barrels + ' barrels | ' + distance.toFixed(1) + ' km';
    btn.textContent = 'TRY AGAIN';
    btn.onclick = startGame;
  }

  function startGame() {
    score = 0;
    barrels = 0;
    incidents = 0;
    distance = 0;
    speed = 2;
    frameCount = 0;
    tanker.y = H / 2;
    tanker.vy = 0;
    obstacles = [];
    pickups = [];
    particles = [];
    gameOver = false;

    initTerrain();

    var overlay = document.getElementById('gameOverlay');
    overlay.classList.add('hidden');

    running = true;
    gameLoop();
  }

  function init() {
    canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width = W;
    canvas.height = H;

    initTerrain();
    draw();

    // Controls
    document.addEventListener('keydown', function(e) {
      if (!running) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); startGame(); }
        return;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { tanker.vy = -4; e.preventDefault(); }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { tanker.vy = 4; e.preventDefault(); }
    });

    // Touch / mouse control for mobile
    var gameWrap = canvas.parentElement;
    function handlePointerMove(clientY) {
      if (!running) return;
      var rect = canvas.getBoundingClientRect();
      var scaleY = H / rect.height;
      var targetY = (clientY - rect.top) * scaleY;
      tanker.vy = (targetY - tanker.y - tanker.h / 2) * 0.15;
    }

    gameWrap.addEventListener('mousemove', function(e) { handlePointerMove(e.clientY); });
    gameWrap.addEventListener('touchmove', function(e) { e.preventDefault(); handlePointerMove(e.touches[0].clientY); }, { passive: false });
    gameWrap.addEventListener('click', function() { if (!running && gameOver) startGame(); });

    // Start button
    var startBtn = document.getElementById('gameStartBtn');
    if (startBtn) startBtn.onclick = startGame;
  }

  // Init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
