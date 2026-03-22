(function() {
  var submitCount = 47283;
  var validating = false;

  var errorMessages = [
    'ERROR: Solution must violate at least 2 laws of physics. Yours only violates 1.',
    'ERROR: Our AI reviewer says this is "too reasonable." Please make it worse.',
    'ERROR: Similar solution already submitted by a dolphin. Dolphins have priority.',
    'ERROR: Cost estimate too low. Nothing that fixes the strait costs less than $1 trillion.',
    'ERROR: Solution does not sufficiently anger Iran. Please add more provocation.',
    'ERROR: The word "pipeline" triggered our trauma response. The Krazy Straw team is in therapy.',
    'ERROR: Your solution accidentally solves climate change too. That\'s out of scope.',
    'ERROR: The trebuchet team has filed a patent troll lawsuit against your idea preemptively.',
    'ERROR: Feasibility score too high. We only accept solutions rated "Geological Fantasy" or worse.',
    'ERROR: Our server is located in the Strait of Hormuz and is currently being blockaded.',
    'ERROR: Solution requires consent from Iran. Iran has left the group chat.',
    'ERROR: Estimated completion date is before the heat death of the universe. Please be more realistic.',
    'ERROR: Your solution was reviewed by 3 dolphins, 1 trebuchet, and a blockchain. All said no.',
    'ERROR: The CIA flagged your submission as "too good." You are now on a list. Congrats.',
    'ERROR: Budget exceeds global GDP. Please reduce to merely "most of global GDP."',
    'ERROR: Submission requires Adobe Flash Player, which is no longer supported. Like your idea.',
    'ERROR: Solution already attempted by an intern in 2019. The intern is no longer with us (they quit).',
    'ERROR: Your idea made the AI reviewer laugh, which crashed the server. Rebooting with less humor.',
    'ERROR: Cannot process: your solution is somehow LESS practical than the dolphin one.',
    'ERROR: Submission flagged by SpamAssassin. Even spam filters think this is a joke.'
  ];

  var successMessages = [
    { stamp: 'REJECTED', text: 'Your solution was reviewed by our panel of zero experts and unanimously rejected. It has been filed under "Ideas That Made Us Uncomfortable" alongside 47,000 other submissions. The review committee (a Magic 8-Ball and a rubber duck) found your proposal "ambitious but fundamentally cursed." You will not be contacted.' },
    { stamp: 'UNDER REVIEW', text: 'Your solution has been forwarded to the Department of Bad Ideas, Sub-Division of Strait-Related Proposals, Office of Things That Will Never Happen. Current queue position: 47,284. Estimated review time: 300-400 years. A carrier pigeon has been dispatched with your confirmation. The pigeon has also been rejected.' },
    { stamp: 'CLASSIFIED', text: 'Your solution has been intercepted by [REDACTED] and classified at the highest level. Three intelligence agencies are now arguing over who has to read it. A black helicopter has been dispatched to your location. This is unrelated (it\'s a coincidence) (it is not a coincidence). Please do not submit further ideas. We are watching. We are also laughing.' },
    { stamp: 'SENT TO IRAN', text: 'Through a routing error, your solution was accidentally forwarded directly to Iran\'s Ministry of Foreign Affairs. They responded with a single emoji: \uD83D\uDE10. We are treating this as diplomatic progress. This is the most engagement we\'ve gotten from Iran since the group chat incident. Congratulations, you are now technically a diplomat.' },
    { stamp: 'ERROR 418', text: 'HTTP 418: I\'m a teapot. The server refuses to brew coffee because it is, permanently and fundamentally, a teapot. Similarly, the Strait of Hormuz refuses to be fixed because it is, permanently and fundamentally, a chokepoint. Your solution has been composted. The compost has also been rejected.' }
  ];

  var errorIndex = 0;
  var attempts = 0;

  window.submitSolution = function(e) {
    e.preventDefault();
    if (validating) return;

    var name = document.getElementById('sol-name').value.trim();
    var desc = document.getElementById('sol-desc').value.trim();
    var cost = document.getElementById('sol-cost').value;
    var feasibility = document.getElementById('sol-feasibility').value;

    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(function(el) { el.classList.remove('visible'); });

    // Basic "validation"
    if (!name) {
      showError('sol-name-error', 'ERROR: Solution needs a name. Even "Plan Z" counts. Especially "Plan Z."');
      return;
    }
    if (!desc || desc.length < 10) {
      showError('sol-desc-error', 'ERROR: Description too short. We need at least enough text to laugh at.');
      return;
    }
    if (!cost) {
      showError('sol-cost-error', 'ERROR: Everything has a cost. Even doing nothing costs $21M/day in anxiety.');
      return;
    }
    if (!feasibility) {
      showError('sol-feas-error', 'ERROR: Please rate the feasibility. We need to know how delusional you are.');
      return;
    }

    attempts++;
    validating = true;

    var btn = document.getElementById('sol-submit-btn');
    var origText = btn.textContent;
    btn.textContent = 'PROCESSING...';
    btn.style.opacity = '0.5';

    // Show a random satirical error for the first few attempts
    if (attempts <= 3) {
      setTimeout(function() {
        var msg = errorMessages[errorIndex % errorMessages.length];
        errorIndex++;
        showError('sol-global-error', msg);
        btn.textContent = origText;
        btn.style.opacity = '1';
        validating = false;
      }, 1500 + Math.random() * 1000);
      return;
    }

    // After enough attempts, show the "success" (rejection)
    setTimeout(function() {
      var result = successMessages[Math.floor(Math.random() * successMessages.length)];
      submitCount++;

      var resultEl = document.getElementById('submitResult');
      document.getElementById('result-stamp').textContent = result.stamp;
      document.getElementById('result-text').textContent = result.text;
      document.getElementById('result-id').textContent = 'Submission #' + submitCount.toLocaleString() + ' \u2014 Filed: ' + new Date().toISOString().split('T')[0] + ' \u2014 Status: ' + result.stamp;

      resultEl.classList.add('visible');
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      btn.textContent = 'SUBMIT ANOTHER (WHY)';
      btn.style.opacity = '1';
      validating = false;
      attempts = 0; // reset so they get more errors next time
    }, 2000 + Math.random() * 1500);
  };

  function showError(id, msg) {
    var el = document.getElementById(id);
    if (el) {
      el.textContent = msg;
      el.classList.add('visible');
    }
  }
})();
