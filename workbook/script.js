/* ═══════════════════════════════════════════
   THE EMPTY NEST CHECK-IN LOOP RESET
   Optimized Script v2.0
   ═══════════════════════════════════════════ */

(function() {
  'use strict';

  /* ── CONSTANTS ── */
  var STORAGE_KEY = 'enr_workbook_v2';
  var ORDER = ['welcome','baseline','contents','day1','day2','day3','day4','day5','day6','day7','final'];
  var NAV_LABELS = {
    welcome: 'Welcome',
    baseline: 'Your Starting Point',
    contents: 'Contents',
    day1: 'Day 1: The Trigger Map',
    day2: 'Day 2: The Reassurance Reset',
    day3: 'Day 3: The Belonging Reset',
    day4: 'Day 4: The Needed Reset',
    day5: 'Day 5: The Closeness Reset',
    day6: 'Day 6: The Weekend Anchor Map',
    day7: 'Day 7: Weekly Rhythm + Backslide Plan',
    final: 'Your Journey Complete'
  };

  var URGE_STATES = [
    { min: 1, max: 1, label: 'Completely calm', desc: 'The phone is not pulling at you right now.' },
    { min: 2, max: 3, label: 'Steady', desc: 'You notice the urge but it is manageable.' },
    { min: 4, max: 5, label: 'Pulled', desc: 'The urge is there. You are thinking about texting.' },
    { min: 6, max: 7, label: 'Spiraling', desc: 'The urge feels strong. Your hand is reaching for the phone.' },
    { min: 8, max: 9, label: 'Phone in hand', desc: 'You are about to text. The loop is running.' },
    { min: 10, max: 10, label: 'Full spiral', desc: 'You are in the loop. It feels urgent and necessary.' }
  ];

  var DAY_CELEBRATIONS = {
    day1: { title: 'Day 1 complete', sub: 'You just mapped your trigger windows and named what you are actually needing. Most people never get that far. You are already ahead.' },
    day2: { title: 'Day 2 complete', sub: 'You reminded yourself that you matter beyond being a mom. That took courage. And yes, you really do matter.' },
    day3: { title: 'Day 3 complete', sub: 'You reached for connection beyond your kids tonight. One thread of adult connection changes everything.' },
    day4: { title: 'Day 4 complete', sub: 'You chose how to show up today, on your terms. That is a real shift in how you move through this season.' },
    day5: { title: 'Day 5 complete', sub: 'You connected from a calm, steady place tonight. Not from anxiety, but from love. That is the whole goal.' },
    day6: { title: 'Day 6 complete', sub: 'Your weekend has an anchor now. Structure without rigidity. Freedom without emptiness.' },
    day7: { title: 'All 7 days complete', sub: 'You showed up for yourself every night this week. You built a framework you can use forever. This is not the end, it is the beginning.' }
  };

  var current = 0;
  var saveTimeout;
  var completedDays = {};

  /* ── NAVIGATION ── */
  function showPage(id) {
    document.getElementById('cover').style.display = 'none';
    document.getElementById('pages-wrapper').style.display = 'block';
    ORDER.forEach(function(p) {
      var el = document.getElementById('page-' + p);
      if (el) el.classList.toggle('active', p === id);
    });
    current = ORDER.indexOf(id);
    updateProgress();
    updateDots();
    updateNavLabel();
    updateNavButtons();
    updateContentsBadges();
    window.scrollTo(0, 0);
    saveData();
  }
  window.showPage = showPage;

  function nextPage() {
    var currentPage = ORDER[current];
    if (DAY_CELEBRATIONS[currentPage]) {
      markDayCompleted(currentPage);
      showCelebration(currentPage);
    } else if (current < ORDER.length - 1) {
      showPage(ORDER[current + 1]);
    }
  }
  window.nextPage = nextPage;

  function prevPage() {
    if (current > 0) {
      showPage(ORDER[current - 1]);
    } else {
      document.getElementById('cover').style.display = 'flex';
      document.getElementById('pages-wrapper').style.display = 'none';
    }
  }
  window.prevPage = prevPage;

  function goToDay(n) { showPage('day' + n); }
  window.goToDay = goToDay;

  function markDayCompleted(dayId) {
    completedDays[dayId] = true;
    updateContentsBadges();
  }

  /* ── CELEBRATION ── */
  function showCelebration(dayId) {
    var c = DAY_CELEBRATIONS[dayId];
    var dayNum = dayId.replace('day', '');
    document.getElementById('celebrationDay').textContent = 'Day ' + dayNum + ' of 7';
    document.getElementById('celebrationTitle').textContent = c.title;
    document.getElementById('celebrationSub').textContent = c.sub;
    var nextIdx = ORDER.indexOf(dayId) + 1;
    var nextId = ORDER[nextIdx];
    document.getElementById('celebrationNextBtn').onclick = function() {
      dismissCelebration();
      if (nextId) showPage(nextId);
    };
    if (nextId === 'final') {
      document.getElementById('celebrationNextBtn').textContent = 'See your results \u2192';
    } else if (nextId) {
      document.getElementById('celebrationNextBtn').textContent = 'Continue to Day ' + nextId.replace('day', '') + ' \u2192';
    }
    document.getElementById('celebrationOverlay').classList.add('show');
    document.getElementById('celebrationNextBtn').focus();
  }

  function dismissCelebration() {
    document.getElementById('celebrationOverlay').classList.remove('show');
  }
  window.dismissCelebration = dismissCelebration;

  /* ── PROGRESS & UI ── */
  function updateProgress() {
    var pct = (current / (ORDER.length - 1)) * 100;
    var bar = document.getElementById('progressBar');
    bar.style.width = pct + '%';
    bar.parentElement.setAttribute('aria-valuenow', Math.round(pct));
  }

  function updateDots() {
    document.querySelectorAll('.day-dot').forEach(function(d, i) {
      d.classList.remove('active', 'done');
      var dayIdx = ORDER.indexOf('day' + (i + 1));
      if (current === dayIdx) d.classList.add('active');
      else if (completedDays['day' + (i + 1)]) d.classList.add('done');
    });
  }

  function updateNavLabel() {
    document.getElementById('navLabel').textContent = NAV_LABELS[ORDER[current]] || '';
  }

  function updateNavButtons() {
    document.getElementById('prevBtn').disabled = current === 0;
    document.getElementById('nextBtn').disabled = current === ORDER.length - 1;
  }

  function updateContentsBadges() {
    for (var i = 1; i <= 7; i++) {
      var badge = document.getElementById('badge-day' + i);
      if (badge) {
        if (completedDays['day' + i]) {
          badge.classList.add('completed');
          badge.innerHTML = '\u2713';
        }
      }
    }
  }

  /* ── URGE SCALE ── */
  function getUrgeState(val) {
    for (var i = 0; i < URGE_STATES.length; i++) {
      if (val >= URGE_STATES[i].min && val <= URGE_STATES[i].max) {
        return URGE_STATES[i];
      }
    }
    return URGE_STATES[2];
  }

  function updateUrgeDisplay(sliderId, displayId) {
    var slider = document.getElementById(sliderId);
    var display = document.getElementById(displayId);
    if (!slider || !display) return;
    var val = parseInt(slider.value, 10);
    var state = getUrgeState(val);
    display.querySelector('.urge-number').textContent = val;
    display.querySelector('.urge-state').textContent = state.label;
    display.querySelector('.urge-desc').textContent = state.desc;
  }

  var baselineSlider = document.getElementById('urgeSliderBaseline');
  if (baselineSlider) {
    baselineSlider.addEventListener('input', function() {
      updateUrgeDisplay('urgeSliderBaseline', 'urgeDisplayBaseline');
      saveData();
    });
  }

  /* ── COLLAPSIBLE STEPS ── */
  function initCollapsibles() {
    document.querySelectorAll('.step-trigger').forEach(function(trigger) {
      trigger.addEventListener('click', function() {
        var block = this.closest('.step-block');
        var wasOpen = block.classList.contains('open');
        block.classList.toggle('open', !wasOpen);
      });
    });
    // Open first step of each day by default
    document.querySelectorAll('.page[data-day]').forEach(function(page) {
      var first = page.querySelector('.step-block');
      if (first) first.classList.add('open');
    });
  }

  /* ── CHECKBOX TOGGLE ── */
  document.addEventListener('change', function(e) {
    if (e.target.type === 'checkbox' && e.target.hasAttribute('data-field')) {
      var label = e.target.closest('.check-item');
      if (label) {
        var isSage = label.classList.contains('sage-check');
        label.classList.toggle('checked', e.target.checked);
        if (isSage) {
          label.classList.toggle('sage', e.target.checked);
        } else {
          label.classList.toggle('terra', e.target.checked);
        }
        saveData();
        checkStepCompletion(e.target);
      }
    }
  });

  function checkStepCompletion(el) {
    var block = el.closest('.step-block');
    if (!block) return;
    var fields = block.querySelectorAll('[data-field]');
    var filled = 0;
    fields.forEach(function(f) {
      if (f.type === 'checkbox' && f.checked) filled++;
      else if (f.type !== 'checkbox' && f.value.trim()) filled++;
    });
    block.classList.toggle('completed', filled > 0 && filled >= Math.ceil(fields.length * 0.5));
  }

  /* ── LOCAL STORAGE ── */
  function saveData() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(function() {
      var data = {};
      document.querySelectorAll('[data-field]').forEach(function(el) {
        var key = el.getAttribute('data-field');
        if (el.type === 'checkbox') {
          data[key] = el.checked;
        } else if (el.type === 'range') {
          data[key] = el.value;
        } else {
          data[key] = el.value;
        }
      });
      data._page = ORDER[current];
      data._timestamp = Date.now();
      data._completedDays = completedDays;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        showSaveIndicator();
      } catch (e) { /* storage full */ }
    }, 500);
  }

  function loadData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      document.querySelectorAll('[data-field]').forEach(function(el) {
        var key = el.getAttribute('data-field');
        if (data[key] !== undefined) {
          if (el.type === 'checkbox') {
            el.checked = data[key];
            if (data[key]) {
              var label = el.closest('.check-item');
              if (label) {
                label.classList.add('checked');
                label.classList.add(label.classList.contains('sage-check') ? 'sage' : 'terra');
              }
            }
          } else if (el.type === 'range') {
            el.value = data[key];
          } else {
            el.value = data[key];
          }
        }
      });
      if (data._completedDays) {
        completedDays = data._completedDays;
        updateContentsBadges();
      }
      // Update urge displays
      updateUrgeDisplay('urgeSliderBaseline', 'urgeDisplayBaseline');
      // Resume page
      if (data._page && ORDER.indexOf(data._page) > -1) {
        showPage(data._page);
      }
    } catch (e) { /* corrupted */ }
  }

  function showSaveIndicator() {
    var ind = document.getElementById('saveIndicator');
    ind.classList.add('show');
    setTimeout(function() { ind.classList.remove('show'); }, 1200);
  }

  document.addEventListener('input', function(e) {
    if (e.target.matches('[data-field]')) {
      saveData();
      if (e.target.type !== 'range') {
        checkStepCompletion(e.target);
      }
    }
  });

  /* ── SHARE FUNCTIONALITY ── */
  function shareQuote(btn) {
    var card = btn.closest('.share-card');
    var quote = card.querySelector('.share-quote').textContent;
    var byline = card.querySelector('.share-byline').textContent;
    var text = quote + ' ' + byline;

    if (navigator.share) {
      navigator.share({ text: text }).catch(function() {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function() {
        btn.classList.add('copied');
        btn.textContent = 'Copied!';
        setTimeout(function() {
          btn.classList.remove('copied');
          btn.innerHTML = '\u{1F4CB} Copy quote';
        }, 2000);
      });
    }
  }
  window.shareQuote = shareQuote;

  /* ── EMAIL CAPTURE TOGGLE ── */
  function toggleEmailCapture() {
    var el = document.querySelector('.email-capture');
    if (el) el.classList.toggle('open');
  }
  window.toggleEmailCapture = toggleEmailCapture;

  /* ── FINAL PAGE: BUILD SUMMARY ── */
  function buildFinalSummary() {
    var summaryEl = document.getElementById('finalSummary');
    if (!summaryEl) return;

    var baselineVal = document.getElementById('urgeSliderBaseline');
    var baseline = baselineVal ? parseInt(baselineVal.value, 10) : 5;

    // Build comparison card
    var beforeEl = document.getElementById('beforeScore');
    if (beforeEl) beforeEl.textContent = baseline;
    var beforeState = document.getElementById('beforeState');
    if (beforeState) beforeState.textContent = getUrgeState(baseline).label;

    // Collect summary data
    var items = [];
    var d1Triggers = [];
    document.querySelectorAll('[data-field^="d1-trig-"]').forEach(function(el) {
      if (el.type === 'checkbox' && el.checked) {
        var span = el.nextElementSibling;
        if (span) d1Triggers.push(span.textContent);
      }
    });
    if (d1Triggers.length > 0) {
      items.push({ label: 'Your triggers', value: d1Triggers.join(', ') });
    }

    var d1Need = '';
    ['reassurance', 'belonging', 'needed', 'closeness'].forEach(function(n) {
      var el = document.querySelector('[data-field="d1-need-' + n + '"]');
      if (el && el.checked) d1Need = n;
    });
    if (d1Need) {
      items.push({ label: 'Your core need', value: d1Need.charAt(0).toUpperCase() + d1Need.slice(1) });
    }

    var d7Reminder = document.querySelector('[data-field="d7-reminder"]');
    if (d7Reminder && d7Reminder.value) {
      items.push({ label: 'Your reminder phrase', value: d7Reminder.value });
    }

    var d7Emergency = document.querySelector('[data-field="d7-emergency"]');
    if (d7Emergency && d7Emergency.value) {
      items.push({ label: 'Your emergency reset', value: d7Emergency.value });
    }

    var html = '';
    items.forEach(function(item) {
      html += '<div class="summary-item">' +
        '<div class="summary-item-label">' + item.label + '</div>' +
        '<div class="summary-item-value">' + item.value + '</div>' +
        '</div>';
    });
    summaryEl.innerHTML = html;
  }

  function printSummary() {
    window.print();
  }
  window.printSummary = printSummary;

  /* ── KEYBOARD NAV ── */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') dismissCelebration();
  });

  /* ── INIT ── */
  initCollapsibles();
  loadData();

  // If returning to final page, build summary
  var observer = new MutationObserver(function() {
    if (document.getElementById('page-final') &&
        document.getElementById('page-final').classList.contains('active')) {
      buildFinalSummary();
    }
  });
  observer.observe(document.getElementById('pages-wrapper') || document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ['class']
  });

})();
