/* ============================================
   THE QUIET NIGHT RESET - Lead Magnet
   The Second Bloom · Susan
   ============================================ */
(function() {
  'use strict';

  // --- State ---
  var selectedUrge = null;
  var selectedMove = null;
  var breathingActive = false;

  // --- Urge labels map ---
  var urgeLabels = {
    lonely: 'lonely',
    worried: 'worried',
    missing: 'like you miss them',
    needed: 'like you need to be needed',
    bored: 'bored',
    checking: 'the pull to check in'
  };

  // --- Page Navigation ---
  window.goTo = function(pageId) {
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) {
      pages[i].classList.remove('active');
    }
    var target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active');
      window.scrollTo(0, 0);
    }
    // Trigger celebration on complete
    if (pageId === 'complete') {
      celebrate();
    }
  };

  // --- Urge Selection ---
  function initUrgeButtons() {
    var btns = document.querySelectorAll('.urge-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function() {
        // Deselect all
        for (var j = 0; j < btns.length; j++) {
          btns[j].classList.remove('selected');
          btns[j].setAttribute('aria-checked', 'false');
        }
        // Select this one
        this.classList.add('selected');
        this.setAttribute('aria-checked', 'true');
        selectedUrge = this.getAttribute('data-urge');

        // Show response
        var response = document.getElementById('urge-response');
        var urgeName = document.getElementById('urge-name');
        urgeName.textContent = urgeLabels[selectedUrge] || selectedUrge;
        response.classList.remove('hidden');
      });
    }
  }

  // --- Breathing Exercise ---
  var breathTimer = null;
  var breathPhase = 0;
  var breathRound = 0;
  var totalBreaths = 6;

  window.startBreathing = function() {
    if (breathingActive) return;
    breathingActive = true;

    var circle = document.getElementById('breath-circle');
    var text = document.getElementById('breath-text');
    var count = document.getElementById('breath-count');
    var startBtn = document.getElementById('breath-start');
    var instruction = document.querySelector('.breath-instruction');

    startBtn.classList.add('hidden');
    instruction.textContent = 'Breathe with the circle.';
    breathRound = 0;
    breathPhase = 0;

    function nextPhase() {
      if (breathRound >= totalBreaths) {
        // Done
        breathingActive = false;
        circle.classList.remove('inhale', 'exhale');
        text.textContent = 'Done';
        count.textContent = '';
        instruction.classList.add('hidden');

        var doneEl = document.getElementById('breath-done');
        doneEl.classList.remove('hidden');
        return;
      }

      if (breathPhase === 0) {
        // Inhale
        circle.classList.remove('exhale');
        circle.classList.add('inhale');
        text.textContent = 'Breathe in';
        count.textContent = (breathRound + 1) + ' of ' + totalBreaths;
        breathPhase = 1;
        breathTimer = setTimeout(nextPhase, 4000);
      } else {
        // Exhale
        circle.classList.remove('inhale');
        circle.classList.add('exhale');
        text.textContent = 'Breathe out';
        breathPhase = 0;
        breathRound++;
        breathTimer = setTimeout(nextPhase, 4000);
      }
    }

    nextPhase();
  };

  // --- Move Selection ---
  function initMoveCards() {
    var cards = document.querySelectorAll('.move-card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', function() {
        // Deselect all
        for (var j = 0; j < cards.length; j++) {
          cards[j].classList.remove('selected');
        }
        // Select this one
        this.classList.add('selected');
        selectedMove = this.getAttribute('data-move');

        // Show response
        var response = document.getElementById('move-response');
        response.classList.remove('hidden');
      });
    }
  }

  // --- Restart ---
  window.restart = function() {
    // Reset state
    selectedUrge = null;
    selectedMove = null;
    breathingActive = false;
    breathPhase = 0;
    breathRound = 0;
    if (breathTimer) clearTimeout(breathTimer);

    // Reset UI elements
    var urgebtns = document.querySelectorAll('.urge-btn');
    for (var i = 0; i < urgebtns.length; i++) {
      urgebtns[i].classList.remove('selected');
      urgebtns[i].setAttribute('aria-checked', 'false');
    }
    document.getElementById('urge-response').classList.add('hidden');

    var circle = document.getElementById('breath-circle');
    circle.classList.remove('inhale', 'exhale');
    document.getElementById('breath-text').textContent = 'Tap to start';
    document.getElementById('breath-count').textContent = '';
    document.getElementById('breath-start').classList.remove('hidden');
    document.getElementById('breath-done').classList.add('hidden');
    var instruction = document.querySelector('.breath-instruction');
    instruction.textContent = 'Take 6 slow breaths with me.';
    instruction.classList.remove('hidden');

    var movecards = document.querySelectorAll('.move-card');
    for (var j = 0; j < movecards.length; j++) {
      movecards[j].classList.remove('selected');
    }
    document.getElementById('move-response').classList.add('hidden');

    // Go to cover
    goTo('cover');
  };

  // --- Celebration ---
  function celebrate() {
    var overlay = document.createElement('div');
    overlay.className = 'celebration-overlay';
    document.body.appendChild(overlay);

    var colors = ['#B8874A', '#8A9E7A', '#D4A96A', '#A8BC9A', '#E8DFD0'];
    for (var i = 0; i < 30; i++) {
      var dot = document.createElement('div');
      dot.className = 'confetti';
      dot.style.left = Math.random() * 100 + '%';
      dot.style.top = '-10px';
      dot.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      dot.style.animationDelay = Math.random() * 1 + 's';
      dot.style.width = (Math.random() * 6 + 4) + 'px';
      dot.style.height = dot.style.width;
      overlay.appendChild(dot);
    }

    setTimeout(function() {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 3500);
  }

  // --- Init ---
  function init() {
    initUrgeButtons();
    initMoveCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
