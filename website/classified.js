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

  // ===== CLASSIFIED INCIDENT SIMULATOR EXTRAS =====
  // Additional EYES ONLY detail lines appended to feed items in classified mode.
  var classifiedIncidentLines = {
    'iran-statement': [
      '[EYES ONLY] Signals intercept from Tehran confirms the statement was drafted by three committees, none of which were informed of the others\' existence.',
      '[EYES ONLY] The original statement was 40 pages. Thirty-nine were redacted by Iran\'s own censors. The remaining page was also redacted, but they forgot to remove it from the printer.',
    ],
    'us-carrier': [
      '[EYES ONLY] Carrier captain\'s personal log entry: "Passed through the strait for the seventh time this month. The strait has not changed. I have."',
      '[EYES ONLY] Internal Navy assessment rates the strategic value of this transit as "negligible." The psychological value to cable news is rated "considerable."',
    ],
    'saudi-sigh': [
      '[EYES ONLY] Audio analysis of the sigh indicates elevated cortisol levels and what our linguists describe as "bone-deep resignation."',
      '[EYES ONLY] The ambassador has been sighing at measurably increasing volume for 14 consecutive briefings. His staff have begun wearing earplugs.',
    ],
    'steve-long': [
      '[EYES ONLY] Internal memo: Steve\'s trading record since 2019 is 34-0. The compliance department has requested an audit. Steve has retained counsel. The counsel is underwater, literally.',
      '[EYES ONLY] Asset DOLPHIN-7 was observed entering a marina in Fujairah carrying what field agents describe as "a very small briefcase." Contents unknown. Classification: MAXIMUM.',
    ],
    'opec-call': [
      '[EYES ONLY] Transcript of the informal call obtained via SIGINT. Contents: 11 minutes of hold music, 3 minutes of arguing about the hold music, and one delegate asking if the call was being recorded. It was.',
      '[EYES ONLY] A delegate was overheard saying "just pick a number" in reference to production quotas. The number they picked was the same as last quarter. They described this as "a breakthrough."',
    ],
    'long-way': [
      '[EYES ONLY] The captain of the diverted tanker has filed a formal complaint. The complaint is 2 pages long. Page 1 is blank. Page 2 says "I would like to go home."',
    ],
    'analyst-tweet': [
      '[EYES ONLY] The deleted tweet has been archived by 14 intelligence agencies. Three have opened formal investigations into the emoji used.',
    ],
    'bahrain-replyall': [
      '[EYES ONLY] The vacation photos were from a resort in Oman. Oman has asked that this not be discussed further. The photos were nice.',
    ],
    'russia-mediate': [
      '[EYES ONLY] Russia\'s proposed summit agenda was intercepted. Item 1: "Introductions." Item 2: "The thing we are here to discuss." Item 3: "Lunch." Items 4 through 12 are classified. Item 13: "Lunch again."',
    ],
    'dolphin-sighting': [
      '[EYES ONLY] Marine SIGINT confirms the backpack contains what appears to be a laminated document. Document title visible in satellite imagery: "STEVE\'S PLAN." The rest is unreadable. Field team has been dispatched. The field team is also dolphins.',
    ],
    'un-strongly': [
      '[EYES ONLY] The draft resolution went through 47 revisions. Each revision removed one word. The final version is a single comma. It passed unanimously.',
    ],
    'elon-tweets': [
      '[EYES ONLY] Internal assessment: the tweet moved markets by $2.3B in 90 seconds. The author was in a bathroom. We know this because the geolocation metadata was not stripped. It has been now.',
    ],
  };

  // Two classified-only incident buttons
  var classifiedIncidentButtons = [
    {
      action: 'activate-bendy',
      label: 'OPERATION KRAZY STRAW',
      btnLabel: 'Activate BENDY BOY',
      delta: [8, 15],
      lines: [
        'OPERATION KRAZY STRAW has been reactivated. The straw is being redeployed. Iran has already found it. Elapsed time since redeployment: 22 minutes.',
        'BENDY BOY is back in the water. Field team reports the straw is "intact but emotionally compromised." Flow tests are underway. Iran has posted photos of the straw on Instagram.',
        'Operational command has authorized a second straw. Codename: BENDY BOY 2. Stealth rating: worse. Iran has preemptively found it.',
      ],
    },
    {
      action: 'deploy-steve-tactical',
      label: 'TEMPORAL OPS',
      btnLabel: 'Deploy Temporal Asset',
      delta: [5, 10],
      lines: [
        'The Temporal Operations Division has authorized deployment. The analyst sat in the DeLorean for three hours. Nothing happened. He filed a report describing the experience as "nonlinear."',
        'Temporal Asset [REDACTED] (the DeLorean) has been towed from Pentagon lot B3 again. The analyst has filed a grievance with the parking authority. The parking authority has classified the grievance.',
        'TEMPORAL DEPLOYMENT ATTEMPT #4: The analyst ran backward through the Pentagon hallway at 0300 while humming the Tenet soundtrack. Security intervened. The timeline remains unchanged.',
      ],
    },
  ];

  // ===== CLASSIFIED STEVE RESPONSES =====
  // In classified mode, Steve drops the public-facing diplomatic filter.
  var classifiedSteveResponses = [
    "Off the record: yes. On the record: we cannot confirm the existence of a record.",
    "Steve's actual assessment is four words long. Three of them are redacted. The fourth is 'no.'",
    "Between us: the situation is exactly as bad as you think. We are required to tell you it isn't.",
    "Internal memo from Steve's desk: 'I have been answering these questions for six years. I have not once been permitted to answer one. I am tired. The strait is also tired. We are all tired.'",
    "Steve's classified response: the models all agree. We are not at liberty to say on what. The agreement is unanimous and it is not encouraging.",
    "Steve has provided an honest answer to your question. The honest answer has been redacted. The redaction has been redacted. What you are reading is the third draft.",
    "Analyst note: we ran your question through the same model that generates the Strait Incident Probability. The model returned a value we do not have a classification for.",
    "Steve indicated, off-channel, that the answer to your question is 'obvious to anyone who has looked at the chart.' We looked at the chart. There is no chart. Steve insists there is a chart.",
    "CLASSIFIED RESPONSE: The actual situation is [REDACTED]. The actual prognosis is [REDACTED]. The actual recommendation is [REDACTED]. Steve's actual mood is [DEEPLY REDACTED].",
    "Internal: Steve was asked this same question by the Joint Chiefs last Tuesday. His response was a 12-second unbroken stare. The stare has been entered into the record.",
    "Your question was forwarded to the classified desk. The classified desk is Steve. Steve is also the unclassified desk. There is only one desk. The desk is in the ocean.",
    "Steve's private assessment, which you are not cleared to read and we are not cleared to share: 'The strait is fine. The people are the problem. I am a dolphin. I do not have to care. And yet.'",
  ];

  // ===== CLASSIFIED GLOSSARY ENTRIES =====
  var classifiedGlossaryEntries = [
    { term: 'BENDY BOY', pos: 'n., CLASSIFIED', def: 'Codename for the prototype subsea straw deployed under OPERATION KRAZY STRAW. Discovered by Iran in 4 hours. Reclassified from "covert" to "embarrassing" to "we do not discuss BENDY BOY." Currently discussed constantly.' },
    { term: 'TEMPORAL ASSET', pos: 'n., CLASSIFIED', def: 'A 1982 DeLorean DMC-12 parked in Pentagon lot B3. Does not run. Has never run. Carries a sign reading "DO NOT TOW." Has been towed twice. Budget: $0. Staff: 1. Results: nonlinear.' },
    { term: 'DOLPHIN LOCAL #1', pos: 'n., CLASSIFIED', def: 'The trade union representing marine mammals conscripted into oil logistics operations. Founded by Steve. Demands include dental coverage, Saturdays off, and "acknowledgment that this is insane."' },
    { term: 'STEVE\'S LAWYER', pos: 'n., CLASSIFIED', def: 'Legal counsel retained by Steve following the formation of Dolphin Local #1. The lawyer is also a dolphin. Bar admission status: unclear. Billing rate: three mackerel per hour.' },
    { term: 'THE OMELETTE STATION', pos: 'n., CLASSIFIED', def: 'The buffet station at the Geneva Marriott where 40% of all Strait-related diplomatic breakdowns have occurred. Saudi Arabia has been banned. The ban is classified. The omelettes are adequate.' },
    { term: 'GULF OF AMERICA 2', pos: 'n., CLASSIFIED', def: 'Internal working name for the proposed renaming of the Persian Gulf, following the precedent set by the Gulf of America executive order. Iran\'s proposed counter-name, "Gulf of None of Your Business," was not adopted but was widely appreciated.' },
  ];

  // ===== CLASSIFIED COMPARISON VERDICTS =====
  var classifiedVerdicts = {
    ask: 'Do not send another email',
    dolphins: 'Steve has retained counsel',
    trebuchet: 'Oily crater confirmed',
    carriers: 'Plywood rejected by Navy',
    straw: 'Iran found it. Again.',
    moveit: 'Tectonic. Not happening.',
    drain: 'Ocean does not cooperate',
    canal: 'Three countries said no',
    crude: 'SEC investigation pending',
    flood: 'Already underway (unauthorized)',
    rename: '194 countries disagree',
    timetravel: 'DeLorean will not start',
  };

  // Solution IDs in table order for mapping verdicts to rows
  var solutionOrder = ['ask', 'dolphins', 'trebuchet', 'carriers', 'straw', 'moveit', 'drain', 'canal', 'crude', 'flood', 'rename', 'timetravel'];

  // ===== CLASSIFIED WHAT-IF ANNOTATIONS =====
  var classifiedWhatIfNotes = [
    'Analyst margin note: "We have run this simulation 340 times. It gets worse every time. We have stopped running it."',
    'Internal: Trading desks were briefed on this scenario in Q2. Three traders resigned. One went long. The one who went long was Steve.',
    'Analyst margin note: "The reserves were supposed to last 90 days. The math assumes nobody panics. Everybody panics."',
    'Internal assessment: Japan\'s contingency plan for this scenario was requested. Japan\'s contingency plan is a single page that says "please don\'t."',
    'Classified addendum: The economic models diverge at this point. The optimistic model predicts "severe recession." The pessimistic model was taken out of the building on a stretcher.',
    'Analyst margin note: "At this point in the simulation, I stopped taking notes and started updating my resume."',
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
          'You now have access to <strong>classified analyst notes</strong> embedded within each solution brief, ' +
          'the Incident Simulator, and the What If? timeline. ' +
          'These internal memos, field reports, and intercepted communications are marked <span class="cw-eyes-only">EYES ONLY</span> and contain ' +
          'information that was never meant to leave the building.' +
          '<br><br>' +
          'The ticker has been switched to classified traffic. Steve\'s responses are now unredacted. ' +
          'The Comparison Matrix includes internal assessments. The Glossary has been expanded with operational terminology. ' +
          'The Incident Simulator has unlocked two classified operations. The submission form now requires a clearance code.' +
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

    // Toggle classified incident buttons
    toggleClassifiedIncidentButtons(isClassified);

    // Toggle classified glossary entries
    toggleClassifiedGlossary(isClassified);

    // Toggle classified comparison column
    toggleClassifiedCompareColumn(isClassified);

    // Toggle classified What If? annotations
    toggleClassifiedWhatIf(isClassified);
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

  // ===== CLASSIFIED INCIDENT SIMULATOR HOOKS =====
  // Monkey-patch the pushFeed to add classified detail lines
  // We hook into the incident simulator by intercepting button clicks
  function hookIncidentFeed() {
    var buttons = document.querySelectorAll('.incident-btn');
    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (!isClassified) return;
        var action = btn.getAttribute('data-action');
        var pool = classifiedIncidentLines[action];
        if (!pool) return;
        var line = pool[Math.floor(Math.random() * pool.length)];
        var feed = document.getElementById('incidentFeed');
        if (!feed) return;

        // Small delay so the classified line appears after the normal one
        setTimeout(function() {
          var item = document.createElement('div');
          item.className = 'incident-feed-item classified-feed-item';
          var d = new Date();
          var ts = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
          item.innerHTML =
            '<span class="ts">' + ts + '</span>' +
            '<span class="body classified-feed-body">' + line + '</span>';
          feed.insertBefore(item, feed.firstChild);
        }, 600);
      });
    });
  }
  hookIncidentFeed();

  // ===== CLASSIFIED INCIDENT BUTTONS =====
  function toggleClassifiedIncidentButtons(active) {
    var container = document.querySelector('.incident-buttons');
    if (!container) return;

    // Remove any previously injected classified buttons
    container.querySelectorAll('.classified-incident-btn').forEach(function(b) { b.remove(); });

    if (!active) return;

    classifiedIncidentButtons.forEach(function(cfg) {
      var btn = document.createElement('button');
      btn.className = 'incident-btn classified-incident-btn';
      btn.setAttribute('data-action', cfg.action);
      btn.textContent = cfg.btnLabel;
      btn.addEventListener('click', function() {
        var line = cfg.lines[Math.floor(Math.random() * cfg.lines.length)];
        var feed = document.getElementById('incidentFeed');
        if (!feed) return;
        var empty = feed.querySelector('.incident-empty');
        if (empty) empty.remove();
        var item = document.createElement('div');
        item.className = 'incident-feed-item classified-feed-item';
        var d = new Date();
        var ts = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
        item.innerHTML =
          '<span class="ts">' + ts + '</span>' +
          '<span class="body classified-feed-body">' + line + '<span class="src">SOURCE: ' + cfg.label + '</span></span>';
        feed.insertBefore(item, feed.firstChild);

        // Bump tension index
        var delta = Math.floor(Math.random() * (cfg.delta[1] - cfg.delta[0] + 1)) + cfg.delta[0];
        var indexVal = document.getElementById('incidentIndexVal');
        var indexSub = document.getElementById('incidentIndexSub');
        if (indexVal) {
          var current = parseInt(indexVal.textContent) || 42;
          current += delta;
          indexVal.textContent = current;
          indexVal.classList.add('flash');
          setTimeout(function() { indexVal.classList.remove('flash'); }, 400);
          if (indexSub) {
            for (var i = 0; i < INCIDENT_INDEX_LABELS.length; i++) {
              if (current < INCIDENT_INDEX_LABELS[i][0]) {
                indexSub.textContent = INCIDENT_INDEX_LABELS[i][1];
                break;
              }
            }
          }
        }
      });
      container.appendChild(btn);
    });
  }

  // ===== CLASSIFIED STEVE OVERRIDE =====
  // Monkey-patch askAnalyst to use classified responses when mode is active
  var _originalAskAnalyst = window.askAnalyst;
  window.askAnalyst = function(event) {
    if (!isClassified) return _originalAskAnalyst(event);

    if (event && event.preventDefault) event.preventDefault();
    var input = document.getElementById('ask-input');
    var result = document.getElementById('askResult');
    var text = document.getElementById('askResultText');
    var meta = document.getElementById('askResultMeta');
    if (!input || !result || !text || !meta) return false;

    var question = (input.value || '').trim();
    if (!question) {
      text.textContent = 'No question detected. Even at this clearance level, we require a question to not answer.';
      meta.textContent = 'STATUS: NO QUESTION ON FILE — CLEARANCE: WASTED';
      result.classList.add('show');
      return false;
    }

    // Deterministic pick from classified pool
    var hash = 0;
    for (var i = 0; i < question.length; i++) {
      hash = ((hash << 5) - hash + question.charCodeAt(i)) | 0;
    }
    var idx = Math.abs(hash) % classifiedSteveResponses.length;
    text.textContent = classifiedSteveResponses[idx];

    var caseNum = String(Math.abs(hash) % 999983).padStart(6, '0');
    meta.textContent = 'CASE #' + caseNum + ' \u00B7 ANALYST: STEVE \u00B7 CLEARANCE: COSMIC \u00B7 STATUS: [REDACTED]';
    result.classList.add('show');
    return false;
  };

  // ===== CLASSIFIED GLOSSARY ENTRIES =====
  function toggleClassifiedGlossary(active) {
    var list = document.querySelector('.glossary-list');
    if (!list) return;

    // Remove previously injected classified entries
    list.querySelectorAll('.classified-glossary-entry').forEach(function(e) { e.remove(); });

    if (!active) return;

    classifiedGlossaryEntries.forEach(function(entry) {
      var div = document.createElement('div');
      div.className = 'glossary-entry classified-glossary-entry';
      div.innerHTML =
        '<dt>' + entry.term + ' <span class="glossary-pos">(' + entry.pos + ')</span> ' +
        '<span class="classified-tag">[CLASSIFIED]</span></dt>' +
        '<dd>' + entry.def + '</dd>';
      list.appendChild(div);
    });
  }

  // ===== CLASSIFIED COMPARISON COLUMN =====
  function toggleClassifiedCompareColumn(active) {
    var table = document.querySelector('.compare-table');
    if (!table) return;

    // Remove previously injected classified cells
    table.querySelectorAll('.classified-col').forEach(function(c) { c.remove(); });

    if (!active) return;

    // Add header
    var headerRow = table.querySelector('thead tr');
    if (headerRow) {
      var th = document.createElement('th');
      th.className = 'classified-col classified-col-header';
      th.textContent = 'Internal Assessment';
      headerRow.appendChild(th);
    }

    // Add verdict to each row
    var rows = table.querySelectorAll('tbody tr');
    rows.forEach(function(row, i) {
      var td = document.createElement('td');
      td.className = 'classified-col classified-col-verdict';
      td.textContent = classifiedVerdicts[solutionOrder[i]] || '—';
      row.appendChild(td);
    });
  }

  // ===== CLASSIFIED WHAT-IF ANNOTATIONS =====
  function toggleClassifiedWhatIf(active) {
    var events = document.querySelectorAll('.whatif-event');
    if (!events.length) return;

    // Remove previously injected annotations
    document.querySelectorAll('.classified-whatif-note').forEach(function(n) { n.remove(); });

    if (!active) return;

    events.forEach(function(ev, i) {
      if (i >= classifiedWhatIfNotes.length) return;
      var note = document.createElement('div');
      note.className = 'classified-whatif-note analyst-note';
      note.textContent = classifiedWhatIfNotes[i];
      var content = ev.querySelector('.whatif-content');
      if (content) content.appendChild(note);
    });
  }

})();
