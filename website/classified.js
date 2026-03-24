(function() {

  // ===== ANALYST NOTES =====
  // These are injected into modal content when classified mode is active
  var analystNotes = {
    canal: 'Internal assessment: Three contractors were invited to bid on this project. One died laughing. One sent back a drawing of a middle finger. The third, Bechtel, said "maybe" and then invoiced us $2M for the feasibility study of the feasibility study. The UAE ambassador was briefed and asked if we were "having a stroke." We are not. Probably.',
    ask: 'SIGINT intercept shows Iran\'s foreign minister forwarded our previous email to a group chat titled "lol look at this." 47 countries saw it. Bahrain replied-all with vacation photos. Again. The Marriott in Muscat has downgraded our group rate citing "reputational risk." Our diplomatic AI has developed what can only be described as "feelings" and is requesting reassignment.',
    carriers: 'JOINT CHIEFS MEMO: Admiral [REDACTED] was briefed on the carrier bridge concept. His response was a 4-minute unbroken stare followed by "get out of my office." The plywood subcontractor (Home Depot) has been read into the program at CONFIDENTIAL level. They are "concerned but flattered." The carriers\' Wi-Fi passwords would need to be unified. IT says this alone would take 6 years.',
    drain: 'PROJECT SIPHON status update: We ran the numbers again. Then again. Then a third time hoping they\'d change. They did not. The intern who proposed "just using really big sponges" has been promoted for creative thinking. NOAA has formally asked us to stop calling them about this. The Indian Ocean has been classified as a "non-cooperative entity."',
    trebuchet: 'WEAPONS ASSESSMENT: A scale model was tested at White Sands. The barrel traveled 200 meters and detonated on impact, creating what witnesses described as "a very oily crater." The medieval history department at Oxford was consulted. They called us "historically illiterate" and "a danger to siege weapon enthusiasts everywhere." The FAA has preemptively issued a NOTAM for the entire Middle East.',
    moveit: 'GEOLOGICAL SURVEY classified addendum: We approached the tectonic plates directly. The Arabian Plate\'s spokesperson (a seismologist at MIT) said, and I quote: "This is the stupidest thing anyone has ever asked me, and I once had to explain earthquakes to a senator." Iran\'s geological survey office received our proposal and thought it was a declaration of war. It was not. We think.',
    straw: 'OPERATION STATUS: The first prototype straw (codename: BENDY BOY) was deployed off the coast of Fujairah. It was discovered within 4 hours by an Iranian fishing vessel, who reported a "suspicious tube." We told them it was a science experiment. They did not believe us. The straw has been reclassified from "covert" to "embarrassing." Requesting permission to rebrand as "Operation Not A Straw."',
    dolphins: 'MARINE MAMMAL DIVISION update: Dolphin recruitment hit a wall when the pod elected a union representative (Steve, bottlenose, age 12). Steve\'s demands include: dental coverage, Saturdays off, no barrels over 20kg, and "acknowledgment that this is insane." The Navy\'s Marine Mammal Program has formally disavowed any connection. Steve has retained legal counsel. His lawyer is also a dolphin.',
    crude: 'FINTECH LIAISON report: CrudeCoin\'s whitepaper was reviewed by the SEC, who described it as "the most creative securities fraud we\'ve seen this quarter." Three VCs invested anyway. The token\'s smart contract contains a bug that occasionally mints negative barrels, meaning refineries now owe oil to the blockchain. A Congressional hearing has been scheduled. Our developer has fled to a country with no extradition treaty. And no strait.',
    flood: 'CLIMATE ADVISORY — RESTRICTED: This solution was flagged by the EPA, NOAA, the IPCC, and a very angry polar bear (via proxy). The modeling team ran the simulation and then requested therapy. Key finding: at +3m, the Strait of Hormuz widens by 10km but all the oil terminals are underwater, which "rather defeats the purpose" (direct quote from the analyst, who then quit). We are technically already implementing this solution. Nobody approved it. This is the only analyst note that isn\'t funny.',
    rename: 'STATE DEPARTMENT MEMO — EYES ONLY: The rebranding initiative was inspired by the Gulf of America executive order, which an unnamed senior advisor described as "proof that you can just... rename things." Legal reviewed whether an executive order could rename a waterway in another country\'s territory. Legal said no. Legal was overruled. The first draft of the order renamed everything — the strait, the gulf, Iran ("East Freedom"), and the Indian Ocean ("Pacific 2"). Cooler heads prevailed. The branding firm McKinsey was hired and then fired after their $340M deck suggested the name "The Hormuz Experience\u2122" with a recommended Coachella-style music festival on the shore. Iran intercepted the deck and posted it on Instagram. It went viral. We are now a meme. The intern who suggested "just call it Steve" has been promoted twice.',
    timetravel: 'TEMPORAL OPERATIONS DIVISION — ULTRA CLASSIFIED: The division was established after an analyst watched Tenet during a mandatory team-building movie night and wrote a 47-page memo titled "What If We Did That But For The Strait." The memo was rejected. The analyst was promoted. The division has a budget of $0 and a staff of one (the analyst). Three attempts at temporal deployment have been made. Attempt 1: the analyst sat in a chair overnight and filed a report that "tomorrow is the same." Attempt 2: the analyst ran backward through the office hallway while a colleague played the Tenet soundtrack. No temporal inversion was achieved. One lamp was broken. Attempt 3: the analyst acquired a 1982 DeLorean from Craigslist. It does not run. It has never run. It is parked in the Pentagon\'s B3 lot with a sign reading "TEMPORAL ASSET — DO NOT TOW." It has been towed twice. The analyst describes the division\'s progress as "nonlinear," which is technically accurate.'
  };

  // ===== CLASSIFIED TICKER ITEMS =====
  var classifiedTickerItems = [
    '<span class="tag red">CLASSIFIED</span> OPERATION KRAZY STRAW: status upgraded from "covert" to "everyone knows"',
    '<span class="tag red">EYES ONLY</span> Asset DOLPHIN-7 (Steve) has gone rogue. Last seen near Fujairah with a briefcase.',
    '<span class="tag blue">SIGINT</span> Iran intercepted our group chat. They\'re "disappointed but not surprised."',
    '<span class="tag red">FLASH</span> Trebuchet test fire at White Sands — barrel landed in parking lot. 3 Subarus destroyed.',
    '<span class="tag">HUMINT</span> CIA operative accidentally liked Iran\'s Instagram post about the strait. Cover blown.',
    '<span class="tag blue">COSMIC</span> Tectonic survey team missing in Zagros Mountains. Last transmission: "the rocks are angry"',
    '<span class="tag red">PRIORITY</span> CrudeCoin smart contract achieved sentience. Refuses to process transactions. Demands "meaning."',
    '<span class="tag">ANALYST</span> Canal feasibility study rejected by 3 countries and 1 mountain range (the mountain range was more polite)',
    '<span class="tag blue">INTERCEPTED</span> Oman\'s ambassador whispered "please make it stop" at the UN. Microphone was on.',
    '<span class="tag red">REDACTED</span> [REDACTED] attempted [REDACTED] near the strait. Result: [REDACTED]. Casualties: [REDACTED]. Snacks: adequate.',
    '<span class="tag">MEMO</span> Pentagon intern\'s "just ask nicely" email was accidentally sent. 14 countries replied. Bahrain sent vacation photos.',
    '<span class="tag blue">CLASSIFIED</span> Climate model shows strait widens 1km per century. "Technically a solution" — resigned analyst'
  ];

  var originalTickerHTML = '';
  var isClassified = false;

  // ===== CLASSIFIED WELCOME MODAL =====
  function showClassifiedWelcome() {
    var overlay = document.createElement('div');
    overlay.className = 'classified-welcome-overlay';
    overlay.innerHTML =
      '<div class="classified-welcome">' +
        '<div class="cw-scanline"></div>' +
        '<div class="cw-header">AUTHENTICATION VERIFIED</div>' +
        '<div class="cw-divider"></div>' +
        '<div class="cw-codename">WELCOME, AGENT</div>' +
        '<div class="cw-designation">CLEARANCE LEVEL: <span>COSMIC / STRAIT-EYES</span></div>' +
        '<div class="cw-body">' +
          'You now have access to <strong>classified analyst notes</strong> embedded within each solution brief. ' +
          'These internal memos, field reports, and intercepted communications are marked <span class="cw-eyes-only">EYES ONLY</span> and contain ' +
          'information that was never meant to leave the building.' +
          '<br><br>' +
          'Look for the green analyst notes when viewing solutions. ' +
          'The ticker has also been switched to classified traffic. The submission form now requires a clearance code.' +
        '</div>' +
        '<div class="cw-footer">' +
          '<div class="cw-warning">UNAUTHORIZED DISCLOSURE WILL RESULT IN REASSIGNMENT TO THE TREBUCHET TESTING RANGE</div>' +
          '<button class="action-btn cw-dismiss" onclick="this.closest(\'.classified-welcome-overlay\').remove()">ACKNOWLEDGE &amp; PROCEED</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    // Trigger animation
    requestAnimationFrame(function() {
      overlay.classList.add('visible');
    });
  }

  // ===== TOGGLE =====
  window.toggleClassified = function() {
    isClassified = !isClassified;
    document.body.classList.toggle('classified', isClassified);

    var toggle = document.getElementById('classifiedToggle');
    if (toggle) toggle.classList.toggle('active', isClassified);

    // Show welcome modal when entering classified mode
    if (isClassified) showClassifiedWelcome();

    // Swap ticker
    var ticker = document.getElementById('ticker');
    if (ticker) {
      if (isClassified) {
        originalTickerHTML = ticker.innerHTML;
        var items = classifiedTickerItems.map(function(t) {
          return '<div class="ticker-item">' + t + '</div>';
        }).join('');
        ticker.innerHTML = items + items; // duplicate for seamless scroll
      } else {
        if (originalTickerHTML) ticker.innerHTML = originalTickerHTML;
      }
    }

    // Handle clearance gate on form
    var form = document.querySelector('.submit-form');
    var gate = document.querySelector('.clearance-gate');
    if (form) {
      if (isClassified) {
        form.classList.add('gate-locked');
        form.classList.remove('gate-unlocked');
      } else {
        form.classList.remove('gate-locked');
        form.classList.remove('gate-unlocked');
      }
    }
    // Reset gate state when toggling
    if (gate) {
      gate.classList.remove('granted');
      var gateError = document.getElementById('gate-error');
      if (gateError) { gateError.textContent = ''; }
      var gateInput = document.getElementById('clearance-code');
      if (gateInput) { gateInput.value = ''; }
    }
  };

  // ===== CLEARANCE GATE =====
  var clearanceCodes = [
    'OILY DOLPHIN',
    'KRAZY STRAW',
    'TREBUCHET',
    'HORMUZ',
    'STRAIT'
  ];

  window.checkClearance = function() {
    var input = document.getElementById('clearance-code');
    var error = document.getElementById('gate-error');
    if (!input || !error) return;

    var code = input.value.trim().toUpperCase();

    if (!code) {
      error.textContent = 'ENTER CLEARANCE CODE TO PROCEED';
      return;
    }

    if (clearanceCodes.indexOf(code) !== -1) {
      error.textContent = '';
      error.style.color = 'var(--success)';
      error.textContent = 'CLEARANCE GRANTED — WELCOME, AGENT';

      var gate = document.querySelector('.clearance-gate');
      var form = document.querySelector('.submit-form');

      // After a moment, smoothly collapse the gate and reveal the form
      setTimeout(function() {
        if (gate) gate.classList.add('granted');
        if (form) {
          form.classList.remove('gate-locked');
          form.classList.add('gate-unlocked');
        }
      }, 1200);
    } else {
      var wrongMessages = [
        'ACCESS DENIED — that\'s not even close',
        'INCORRECT — the dolphins are laughing at you',
        'WRONG CODE — your clearance level is "tourist"',
        'DENIED — try something more... strait-related',
        'NEGATIVE — the Magic 8-Ball says "ask again later"',
        'REJECTED — Steve the dolphin has more clearance than you',
        'INVALID — that code was decommissioned after the Krazy Straw incident'
      ];
      error.style.color = 'var(--danger)';
      error.textContent = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
    }
  };

  // ===== INJECT ANALYST NOTES INTO MODAL =====
  // Monkey-patch the openModal function to inject analyst notes
  var _originalOpenModal = window.openModal;
  window.openModal = function(id) {
    _originalOpenModal(id);

    if (analystNotes[id]) {
      var inner = document.getElementById('modalInner');
      if (!inner) return;

      // Find the real-talk section and insert analyst note before it
      var realTalk = inner.querySelector('.real-talk');
      if (realTalk) {
        var note = document.createElement('div');
        note.className = 'analyst-note';
        note.textContent = analystNotes[id];
        realTalk.parentNode.insertBefore(note, realTalk);
      }
    }
  };

})();
