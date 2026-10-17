/**
 * Recurr.ai — Core Application & Nag Engine (v1.0.2)
 * Mobile-ready, persistent notifications & audio nag engine for daily recurring tasks.
 * Includes Anti-Circumvention Safeguards, Reflection Reports, 8am Due-Time Schedulers,
 * and Native Mobile Alarm (.ics) Sync.
 */

// Initial Default Tasks tailored to user request
const DEFAULT_TASKS = [
  {
    id: 'task-quran',
    title: 'Read 2 pages of Quran',
    emoji: '📖',
    category: 'Spiritual',
    url: 'https://quran.com',
    targetCount: 2,
    currentCount: 0,
    dueTime: '08:00',
    safeguard: 'strict-report',
    completed: false,
    completedDate: null,
    nagIntervalMinutes: 15,
    nagSound: 'urgentRadar',
    voiceNag: true,
    streak: 12,
    lastNaggedTime: 0,
    snoozedUntil: 0,
    createdAt: Date.now()
  },
  {
    id: 'task-poe',
    title: 'Visit poe.com',
    emoji: '🤖',
    category: 'AI & Learning',
    url: 'https://poe.com',
    targetCount: 1,
    currentCount: 0,
    dueTime: '08:00',
    safeguard: 'strict-report',
    completed: false,
    completedDate: null,
    nagIntervalMinutes: 15,
    nagSound: 'pleasantChime',
    voiceNag: true,
    streak: 7,
    lastNaggedTime: 0,
    snoozedUntil: 0,
    createdAt: Date.now()
  }
];

// Presets for Quick Add
const PRESETS = {
  quran: {
    title: 'Read 2 pages of Quran',
    emoji: '📖',
    url: 'https://quran.com',
    targetCount: 2,
    dueTime: '08:00',
    safeguard: 'strict-report',
    nagIntervalMinutes: 15,
    nagSound: 'urgentRadar',
    voiceNag: true
  },
  poe: {
    title: 'Visit poe.com',
    emoji: '🤖',
    url: 'https://poe.com',
    targetCount: 1,
    dueTime: '08:00',
    safeguard: 'strict-report',
    nagIntervalMinutes: 15,
    nagSound: 'pleasantChime',
    voiceNag: true
  },
  water: {
    title: 'Drink 2L Water',
    emoji: '💧',
    url: '',
    targetCount: 8,
    dueTime: '09:00',
    safeguard: 'simple',
    nagIntervalMinutes: 30,
    nagSound: 'pleasantChime',
    voiceNag: false
  },
  workout: {
    title: '20 Daily Pushups',
    emoji: '🏃',
    url: '',
    targetCount: 20,
    dueTime: '08:00',
    safeguard: 'strict-report',
    nagIntervalMinutes: 30,
    nagSound: 'urgentRadar',
    voiceNag: true
  },
  journal: {
    title: 'Evening Gratitude',
    emoji: '✍️',
    url: '',
    targetCount: 1,
    dueTime: '21:00',
    safeguard: 'strict-report',
    nagIntervalMinutes: 60,
    nagSound: 'zenBell',
    voiceNag: false
  }
};

class RecurrApp {
  constructor() {
    this.tasks = [];
    this.reports = [];
    this.settings = {
      soundEnabled: true,
      voiceEnabled: true,
      globalSnoozeUntil: 0,
      lastActiveDate: this.getTodayDateString()
    };
    this.currentFilter = 'all';
    this.audioCtx = null;
    this.swRegistration = null;
    this.blinkInterval = null;
    this.originalTitle = document.title;
    this.nextNagCountdownSec = 0;
    
    // Focus Timer state
    this.focusTimerInterval = null;
    this.focusTimerTotalSec = 120; // 2 minutes
    this.focusTimerRemainingSec = 120;

    this.init();
  }

  getTodayDateString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  init() {
    this.loadState();
    this.checkDailyReset();
    this.initAudioContext();
    this.initServiceWorker();
    this.bindEvents();
    this.render();
    this.startNagTicker();
    this.updateHeaderDate();
  }

  // Load from LocalStorage
  loadState() {
    try {
      const storedTasks = localStorage.getItem('recurr_tasks');
      if (storedTasks) {
        this.tasks = JSON.parse(storedTasks);
      } else {
        this.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
        this.saveState();
      }

      const storedReports = localStorage.getItem('recurr_reports');
      if (storedReports) {
        this.reports = JSON.parse(storedReports);
      } else {
        // Sample baseline report
        this.reports = [
          {
            id: 'rep-init-1',
            taskId: 'task-quran',
            taskTitle: 'Read 2 pages of Quran',
            taskEmoji: '📖',
            date: this.getTodayDateString(),
            timestamp: 'Yesterday 08:32 AM',
            details: 'Surah Al-Baqarah, Pages 12–13',
            reflection: 'Completed 2 pages. Reflected on Ayat 75-82 regarding truthfulness and steadfastness.'
          }
        ];
        this.saveReports();
      }

      const storedSettings = localStorage.getItem('recurr_settings');
      if (storedSettings) {
        this.settings = Object.assign(this.settings, JSON.parse(storedSettings));
      }
    } catch (err) {
      console.error('Failed to load state from localStorage:', err);
      this.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
      this.reports = [];
    }
  }

  saveState() {
    try {
      localStorage.setItem('recurr_tasks', JSON.stringify(this.tasks));
      localStorage.setItem('recurr_settings', JSON.stringify(this.settings));
    } catch (err) {
      console.error('Failed to save state:', err);
    }
  }

  saveReports() {
    try {
      localStorage.setItem('recurr_reports', JSON.stringify(this.reports));
    } catch (err) {
      console.error('Failed to save reports:', err);
    }
  }

  // Check if calendar date changed to reset daily tasks and maintain streaks
  checkDailyReset() {
    const today = this.getTodayDateString();
    if (this.settings.lastActiveDate !== today) {
      this.tasks.forEach(task => {
        if (task.completed) {
          task.streak = (task.streak || 0) + 1;
        } else {
          if (task.lastCompletedDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yestStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
            if (task.lastCompletedDate !== yestStr) {
              task.streak = 0;
            }
          }
        }
        task.completed = false;
        task.currentCount = 0;
        task.lastNaggedTime = 0;
        task.snoozedUntil = 0;
      });

      this.settings.lastActiveDate = today;
      this.saveState();
      this.showToast('🌅 Good morning! Daily tasks have been reset for today.', 'toast-success');
    }
  }

  // Determine whether current local time is at or past task's due time (e.g. 08:00 AM)
  isTaskDueNow(task) {
    if (!task.dueTime) return true; // All day
    const [hours, minutes] = task.dueTime.split(':').map(Number);
    const now = new Date();
    const due = new Date(now);
    due.setHours(hours, minutes, 0, 0);
    return now >= due;
  }

  formatDueTimeDisplay(timeStr) {
    if (!timeStr) return 'All Day';
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${String(m).padStart(2, '0')} ${ampm}`;
  }

  // Web Audio Synthesizer (No external MP3 files needed!)
  initAudioContext() {
    const unlockAudio = () => {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
  }

  playSynthesizedSound(type) {
    if (!this.settings.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      if (type === 'urgentRadar') {
        // High-attention dual frequency radar chirp
        [0, 0.22, 0.44].forEach((offset) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, now + offset);
          osc.frequency.exponentialRampToValueAtTime(440, now + offset + 0.15);
          
          gain.gain.setValueAtTime(0.2, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.18);
          
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          
          osc.start(now + offset);
          osc.stop(now + offset + 0.2);
        });

      } else if (type === 'pleasantChime') {
        // Warm two-tone melodic chime
        const notes = [659.25, 880]; // E5, A5
        notes.forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.16);

          gain.gain.setValueAtTime(0.25, now + idx * 0.16);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.8);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now + idx * 0.16);
          osc.stop(now + idx * 0.16 + 0.85);
        });

      } else if (type === 'zenBell') {
        // Calming singing bowl
        [216, 432, 864].forEach((freq, i) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.2 / (i + 1), now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now);
          osc.stop(now + 2.3);
        });

      } else if (type === 'retroPing') {
        // 8-bit game blip
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880, now + 0.08);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.26);

      } else if (type === 'celebrate') {
        // Ascending major victory chords
        const chord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        chord.forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);

          gain.gain.setValueAtTime(0.3, now + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.5);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.6);
        });
      }
    } catch (e) {
      console.warn('Audio playback not allowed or failed:', e);
    }
  }

  // Voice speech synthesis nag
  speakVoiceNudge(text) {
    if (!this.settings.voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
    }
  }

  // Web Notification & Service Worker Registration
  async initServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('./sw.js');
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'MARK_DONE') {
            const task = this.tasks.find(t => t.id === event.data.taskId);
            if (task) {
              if (task.safeguard && task.safeguard !== 'simple') {
                this.openVerificationModal(task);
              } else {
                this.toggleTaskCompletion(task.id, true);
              }
            }
          }
        });
      } catch (err) {
        console.warn('Service worker registration failed:', err);
      }
    }
    this.updatePermissionUI();
  }

  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      this.showToast('⚠️ Notifications are not supported by this browser.', 'toast-nag');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.updatePermissionUI();
      if (permission === 'granted') {
        this.showToast('✅ Push Notifications enabled! Recurr will nag you on time.', 'toast-success');
        this.dispatchSystemNotification(
          'Recurr.ai Alerts Active!',
          'You will be reminded until daily tasks like your Quran reading & Poe.com are verified.'
        );
        return true;
      } else {
        this.showToast('❌ Notification permission was denied. Alerts will sound inside this tab.', 'toast-nag');
        return false;
      }
    } catch (e) {
      console.error('Error requesting notification permission:', e);
      return false;
    }
  }

  updatePermissionUI() {
    const indicator = document.getElementById('notif-indicator');
    const statusText = document.getElementById('permission-status-text');
    if (!('Notification' in window)) {
      if (indicator) indicator.className = 'status-indicator denied';
      if (statusText) statusText.textContent = 'Status: Not Supported in this browser';
      return;
    }

    const perm = Notification.permission;
    if (indicator) {
      indicator.className = `status-indicator ${perm === 'granted' ? 'allowed' : perm === 'denied' ? 'denied' : ''}`;
    }
    if (statusText) {
      statusText.textContent = perm === 'granted' 
        ? 'Status: Allowed (Push notifications active)' 
        : perm === 'denied' 
        ? 'Status: Denied in browser settings' 
        : 'Status: Default (Needs permission to alert outside tab)';
    }
  }

  dispatchSystemNotification(title, body, taskId = null, actionUrl = null) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const options = {
      body: body,
      icon: 'icons/icon-192.png',
      badge: 'icons/icon-192.png',
      vibrate: [200, 100, 200, 100, 200],
      tag: taskId ? `nag-${taskId}` : 'recurr-nag',
      renotify: true,
      data: { taskId, actionUrl },
      actions: [
        { action: 'mark-done', title: '✓ Submit Report' },
        ...(actionUrl ? [{ action: 'open-link', title: '🚀 Open Link' }] : [])
      ]
    };

    if (this.swRegistration && this.swRegistration.showNotification) {
      this.swRegistration.showNotification(title, options).catch(() => {
        try { new Notification(title, options); } catch(e) {}
      });
    } else {
      try { new Notification(title, options); } catch(e) {}
    }
  }

  // Master Nag Ticker: Evaluates active tasks every second
  startNagTicker() {
    setInterval(() => {
      this.checkDailyReset();
      this.tickNagLogic();
    }, 1000);
  }

  tickNagLogic() {
    const now = Date.now();
    const isGlobalSnoozed = this.settings.globalSnoozeUntil > now;

    // Filter incomplete tasks that ARE DUE NOW (e.g. at or after 08:00 AM)
    const incompleteTasks = this.tasks.filter(t => !t.completed);
    const activeDueTasks = incompleteTasks.filter(t => this.isTaskDueNow(t));
    
    if (activeDueTasks.length === 0) {
      this.stopTabBlink();
      this.updateNagBanner(incompleteTasks.length, 0, activeDueTasks.length);
      return;
    }

    let minRemainingSec = Infinity;
    let tasksToNag = [];

    activeDueTasks.forEach(task => {
      const isTaskSnoozed = task.snoozedUntil > now;
      if (isGlobalSnoozed || isTaskSnoozed) {
        const snoozeRemain = Math.ceil(((isGlobalSnoozed ? this.settings.globalSnoozeUntil : task.snoozedUntil) - now) / 1000);
        if (snoozeRemain < minRemainingSec) minRemainingSec = snoozeRemain;
        return;
      }

      const intervalMs = (task.nagIntervalMinutes || 15) * 60 * 1000;
      const elapsed = now - (task.lastNaggedTime || 0);

      if (elapsed >= intervalMs) {
        tasksToNag.push(task);
      } else {
        const remainingSec = Math.ceil((intervalMs - elapsed) / 1000);
        if (remainingSec < minRemainingSec) {
          minRemainingSec = remainingSec;
        }
      }
    });

    // Execute Nag Event if any task reached its interval
    if (tasksToNag.length > 0) {
      tasksToNag.forEach(task => {
        task.lastNaggedTime = now;
        this.triggerTaskNag(task);
      });
      this.saveState();
      this.renderTasks();
    }

    const nextSec = minRemainingSec === Infinity ? 0 : minRemainingSec;
    this.updateNagBanner(incompleteTasks.length, nextSec, activeDueTasks.length);
  }

  triggerTaskNag(task) {
    this.playSynthesizedSound(task.nagSound || 'urgentRadar');

    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 250]);
    }

    if (task.voiceNag) {
      const voiceText = `Reminder! It is time to complete your ${task.title}. Submit your report when done.`;
      this.speakVoiceNudge(voiceText);
    }

    const notifTitle = `⚡ NAG ALERT: ${task.emoji} ${task.title}`;
    const notifBody = task.safeguard && task.safeguard !== 'simple'
      ? `Due since ${this.formatDueTimeDisplay(task.dueTime)}! Open Recurr to submit your completion report.`
      : `Due since ${this.formatDueTimeDisplay(task.dueTime)}! Keep your ${task.streak}-day streak alive!`;

    this.dispatchSystemNotification(notifTitle, notifBody, task.id, task.url);
    this.showToast(`⚡ NAG ALERT: ${task.emoji} ${task.title}! Time to do it!`, 'toast-nag');
    this.startTabBlink(`⚡ NAG: ${task.title}`);
  }

  startTabBlink(message) {
    if (this.blinkInterval) clearInterval(this.blinkInterval);
    let toggle = false;
    this.blinkInterval = setInterval(() => {
      document.title = toggle ? message : this.originalTitle;
      toggle = !toggle;
    }, 1200);

    window.addEventListener('focus', () => this.stopTabBlink(), { once: true });
  }

  stopTabBlink() {
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval);
      this.blinkInterval = null;
    }
    document.title = this.originalTitle;
  }

  // UI Event Handlers
  bindEvents() {
    // Notification permission button in header
    const notifBtn = document.getElementById('notif-perm-btn');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        if (Notification.permission !== 'granted') {
          this.requestNotificationPermission();
        } else {
          this.openModal('settings-modal');
        }
      });
    }

    // Sound toggle in header
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.settings.soundEnabled = !this.settings.soundEnabled;
        this.saveState();
        this.updateSoundIcon();
        this.showToast(this.settings.soundEnabled ? '🔊 Sound alerts enabled' : '🔇 Sound alerts muted', 'toast-success');
      });
    }

    // Reports History open button
    const historyBtn = document.getElementById('history-open-btn');
    if (historyBtn) {
      historyBtn.addEventListener('click', () => {
        this.renderReportsHistory();
        this.openModal('history-modal');
      });
    }

    // Settings modal open
    const settingsBtn = document.getElementById('settings-open-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.openModal('settings-modal'));
    }

    // Request perm in settings
    const reqPermBtn = document.getElementById('request-permission-btn');
    if (reqPermBtn) {
      reqPermBtn.addEventListener('click', () => this.requestNotificationPermission());
    }

    // Test alert button in settings
    const testAlertBtn = document.getElementById('test-alert-btn');
    if (testAlertBtn) {
      testAlertBtn.addEventListener('click', () => {
        this.playSynthesizedSound('urgentRadar');
        this.dispatchSystemNotification(
          '🔔 Test Nag Alert from Recurr.ai',
          'This is how you will be nagged until your daily tasks are verified done!'
        );
        this.showToast('🚨 Test alert triggered with audio & push notification!', 'toast-nag');
      });
    }

    // Calendar .ics export button in settings & toolbar
    const exportIcsBtn = document.getElementById('export-ics-btn');
    if (exportIcsBtn) {
      exportIcsBtn.addEventListener('click', () => this.exportCalendarICS());
    }

    const syncCalBtn = document.getElementById('sync-calendar-btn');
    if (syncCalBtn) {
      syncCalBtn.addEventListener('click', () => this.exportCalendarICS());
    }

    // Immediate "Nag Me Now" button in banner
    const nagNowBtn = document.getElementById('trigger-nag-now-btn');
    if (nagNowBtn) {
      nagNowBtn.addEventListener('click', () => {
        const incomplete = this.tasks.filter(t => !t.completed);
        if (incomplete.length > 0) {
          this.triggerTaskNag(incomplete[0]);
        } else {
          this.playSynthesizedSound('celebrate');
          this.showToast('🎉 All daily tasks are already completed! Great job!', 'toast-success');
        }
      });
    }

    // Snooze All 15m button in banner
    const snoozeAllBtn = document.getElementById('snooze-all-btn');
    if (snoozeAllBtn) {
      snoozeAllBtn.addEventListener('click', () => {
        const snoozeDurationMs = 15 * 60 * 1000;
        this.settings.globalSnoozeUntil = Date.now() + snoozeDurationMs;
        this.saveState();
        this.showToast('💤 All nagging snoozed for 15 minutes.', 'toast-success');
        this.render();
      });
    }

    // Filter tabs
    const filterTabs = document.querySelectorAll('.tab-btn');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        this.currentFilter = tab.dataset.filter;
        this.renderTasks();
      });
    });

    // Add Task Modal Open
    const addBtn = document.getElementById('open-add-modal-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.resetTaskForm();
        this.openModal('task-modal');
      });
    }

    // Modal Cancel Button
    const cancelBtn = document.getElementById('modal-cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.closeModal('task-modal');
      });
    }

    // Task Form Submit
    const taskForm = document.getElementById('task-form');
    if (taskForm) {
      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleTaskFormSubmit();
      });
    }

    // Verification Form Submit (Anti-Circumvention Safeguard)
    const verifyForm = document.getElementById('verification-form');
    if (verifyForm) {
      verifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleVerificationSubmit();
      });
    }

    // Verification Cancel Button
    const verifyCancelBtn = document.getElementById('verify-cancel-btn');
    if (verifyCancelBtn) {
      verifyCancelBtn.addEventListener('click', () => {
        this.stopFocusTimer();
        this.closeModal('verification-modal');
        this.showToast('Acknowledged: Keep going and submit report when genuinely finished.', 'toast-nag');
      });
    }

    // Real-time character count on reflection textarea
    const reflectionText = document.getElementById('verify-reflection-text');
    const charCountText = document.getElementById('char-count-text');
    if (reflectionText && charCountText) {
      reflectionText.addEventListener('input', () => {
        const len = reflectionText.value.trim().length;
        charCountText.textContent = `${len} / 15 chars`;
        if (len >= 15) {
          charCountText.style.color = 'var(--done-success)';
        } else {
          charCountText.style.color = 'var(--text-dim)';
        }
      });
    }

    // Focus Timer Button in Verification Modal
    const startTimerBtn = document.getElementById('start-focus-timer-btn');
    if (startTimerBtn) {
      startTimerBtn.addEventListener('click', () => {
        if (this.focusTimerInterval) {
          this.stopFocusTimer();
        } else {
          this.startFocusTimer();
        }
      });
    }

    // Preset Chips
    const presetChips = document.querySelectorAll('.chip-btn');
    presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const presetKey = chip.dataset.preset;
        if (PRESETS[presetKey]) {
          this.applyPreset(PRESETS[presetKey]);
        }
      });
    });

    // Data Export & Reset in Settings
    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportData());
    }

    const resetBtn = document.getElementById('reset-defaults-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset habits back to default Quran & Poe.com tasks?')) {
          this.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
          this.saveState();
          this.render();
          this.closeModal('settings-modal');
          this.showToast('🔄 Restored default tasks.', 'toast-success');
        }
      });
    }
  }

  updateHeaderDate() {
    const el = document.getElementById('current-date-text');
    if (el) {
      const options = { weekday: 'long', month: 'short', day: 'numeric' };
      el.textContent = new Date().toLocaleDateString(undefined, options);
    }
  }

  updateSoundIcon() {
    const soundIcon = document.getElementById('sound-icon');
    if (!soundIcon) return;
    if (this.settings.soundEnabled) {
      soundIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      `;
    } else {
      soundIcon.innerHTML = `
        <line x1="1" y1="1" x2="23" y2="23"></line>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M23 9l-6 6M17 9l6 6"></path>
      `;
    }
  }

  // Render Core UI
  render() {
    this.updateSoundIcon();
    this.updatePermissionUI();
    this.renderTasks();
    this.renderHeroStats();
  }

  renderHeroStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const circle = document.getElementById('progress-circle');
    const percentVal = document.getElementById('progress-percent-val');
    const headingText = document.getElementById('progress-heading-text');
    const summaryText = document.getElementById('progress-summary-text');
    const countAll = document.getElementById('count-all');
    const countNag = document.getElementById('count-nag');
    const countDone = document.getElementById('count-done');

    if (circle) {
      const circumference = 2 * Math.PI * 50; // r=50 -> 314.16
      const offset = circumference - (percent / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    }

    if (percentVal) percentVal.textContent = `${percent}%`;

    if (headingText && summaryText) {
      if (percent === 100) {
        headingText.textContent = 'All Done Honestly! 🎉';
        summaryText.textContent = `All ${total} daily tasks verified & completed!`;
      } else if (percent > 0) {
        headingText.textContent = 'Keep Going! 🔥';
        summaryText.textContent = `${completed} of ${total} tasks verified today`;
      } else {
        headingText.textContent = 'Daily Accountability ⚡';
        summaryText.textContent = `0 of ${total} tasks completed today`;
      }
    }

    if (countAll) countAll.textContent = total;
    if (countNag) countNag.textContent = total - completed;
    if (countDone) countDone.textContent = completed;

    this.updateMidnightCountdown();
  }

  updateMidnightCountdown() {
    const timerTag = document.getElementById('day-reset-tag');
    if (!timerTag) return;
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diffMs = midnight - now;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    timerTag.textContent = `⏳ Reset in ${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`;
  }

  updateNagBanner(totalIncomplete, nextSec, activeDueCount) {
    const banner = document.getElementById('nag-banner');
    const badgeText = document.getElementById('nag-badge-text');
    const headlineText = document.getElementById('nag-headline-text');
    const countdownVal = document.querySelector('.countdown-val');
    const nagNowBtn = document.getElementById('trigger-nag-now-btn');

    if (!banner) return;

    if (totalIncomplete === 0) {
      banner.classList.add('all-done');
      if (badgeText) badgeText.textContent = '✅ ALL TASKS VERIFIED';
      if (headlineText) headlineText.textContent = 'All daily commitments completed honestly.';
      if (countdownVal) countdownVal.textContent = 'Done!';
      if (nagNowBtn) nagNowBtn.style.display = 'none';
    } else if (activeDueCount === 0) {
      // Incomplete tasks exist, but their scheduled time has not arrived yet!
      banner.classList.remove('all-done');
      if (badgeText) badgeText.textContent = '⏰ SCHEDULED (WAITING)';
      if (headlineText) headlineText.textContent = `${totalIncomplete} daily task${totalIncomplete > 1 ? 's' : ''} scheduled for later today.`;
      if (countdownVal) countdownVal.textContent = 'Quiet';
      if (nagNowBtn) nagNowBtn.style.display = 'inline-flex';
    } else {
      banner.classList.remove('all-done');
      if (badgeText) badgeText.textContent = '⚡ NAG MODE ACTIVE';
      if (headlineText) headlineText.textContent = `${activeDueCount} daily commitment${activeDueCount > 1 ? 's' : ''} overdue & nagging!`;
      if (nagNowBtn) nagNowBtn.style.display = 'inline-flex';

      const mins = Math.floor(nextSec / 60);
      const secs = nextSec % 60;
      if (countdownVal) {
        countdownVal.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }
    }
  }

  renderTasks() {
    const container = document.getElementById('task-list-container');
    if (!container) return;

    const filtered = this.tasks.filter(task => {
      if (this.currentFilter === 'nagging') return !task.completed && this.isTaskDueNow(task);
      if (this.currentFilter === 'completed') return task.completed;
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
          <p style="font-size: 1.5rem; margin-bottom: 0.5rem;">✨</p>
          <p style="font-weight: 600;">No tasks found for this view.</p>
          <p style="font-size: 0.8rem; margin-top: 0.25rem;">Tap "+ Add Habit" or select a preset below to get started.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(task => this.renderTaskCardHTML(task)).join('');

    // Attach card event listeners
    filtered.forEach(task => {
      const cardEl = container.querySelector(`[data-id="${task.id}"]`);
      if (!cardEl) return;

      // Check button (Anti-Circumvention Interceptor)
      const checkBtn = cardEl.querySelector('.task-check-btn');
      if (checkBtn) {
        checkBtn.addEventListener('click', () => this.handleTaskCheckClick(task.id));
      }

      // Snooze button
      const snoozeBtn = cardEl.querySelector('.snooze-task-btn');
      if (snoozeBtn) {
        snoozeBtn.addEventListener('click', () => this.snoozeTask(task.id, 15));
      }

      // Edit button
      const editBtn = cardEl.querySelector('.edit-task-btn');
      if (editBtn) {
        editBtn.addEventListener('click', () => this.openEditModal(task.id));
      }

      // Delete button
      const deleteBtn = cardEl.querySelector('.delete-task-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
      }

      // Multi-step counter buttons
      const countIncBtn = cardEl.querySelector('.counter-inc-btn');
      if (countIncBtn) {
        countIncBtn.addEventListener('click', () => this.adjustTaskCount(task.id, 1));
      }
      const countDecBtn = cardEl.querySelector('.counter-dec-btn');
      if (countDecBtn) {
        countDecBtn.addEventListener('click', () => this.adjustTaskCount(task.id, -1));
      }
    });
  }

  renderTaskCardHTML(task) {
    const isDue = this.isTaskDueNow(task);
    const isNagging = !task.completed && isDue;
    const isCompleted = task.completed;
    const hasCounter = (task.targetCount || 1) > 1;

    let nagStatusPill = '';
    if (isCompleted) {
      nagStatusPill = `<span class="nag-status-pill done">✓ Verified Done</span>`;
    } else if (task.snoozedUntil > Date.now()) {
      const minsLeft = Math.ceil((task.snoozedUntil - Date.now()) / (60 * 1000));
      nagStatusPill = `<span class="nag-status-pill snoozed">💤 Snoozed (${minsLeft}m left)</span>`;
    } else if (!isDue) {
      nagStatusPill = `<span class="due-pill">⏳ Starts at ${this.formatDueTimeDisplay(task.dueTime)}</span>`;
    } else {
      nagStatusPill = `<span class="nag-status-pill nagging">⚡ Nagging (every ${task.nagIntervalMinutes || 15}m)</span>`;
    }

    const duePill = task.dueTime 
      ? `<span class="due-pill ${isDue && !isCompleted ? 'overdue' : ''}">⏰ ${this.formatDueTimeDisplay(task.dueTime)}</span>`
      : '';

    const safeguardPill = task.safeguard && task.safeguard !== 'simple'
      ? `<span class="safeguard-pill">🛡️ Report Required</span>`
      : '';

    return `
      <article class="task-card ${isNagging ? 'is-nagging' : ''} ${isCompleted ? 'is-completed' : ''}" data-id="${task.id}">
        <div class="task-card-top">
          <button type="button" class="task-check-btn" aria-label="${isCompleted ? 'Mark uncompleted' : 'Submit verification report'}" title="${isCompleted ? 'Completed (Click to unmark)' : 'Click to submit verification report'}">
            <svg class="task-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>

          <div class="task-details">
            <div class="task-title-row">
              <span class="task-emoji">${task.emoji || '⚡'}</span>
              <h3 class="task-title">${this.escapeHTML(task.title)}</h3>
            </div>

            <div class="task-status-row">
              ${nagStatusPill}
              ${duePill}
              ${safeguardPill}
              <span class="streak-pill">🔥 ${task.streak || 0} day streak</span>
            </div>
          </div>
        </div>

        <div class="task-card-actions">
          <div class="task-left-actions">
            ${task.url ? `
              <a href="${task.url}" target="_blank" rel="noopener noreferrer" class="action-link-btn" title="Open website in new tab">
                <span>Launch ${this.getDomainName(task.url)}</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            ` : ''}

            ${hasCounter ? `
              <div class="counter-box" title="Pages completed today">
                <button type="button" class="counter-btn counter-dec-btn" aria-label="Decrement pages">-</button>
                <span class="counter-text">${task.currentCount || 0} / ${task.targetCount} pages</span>
                <button type="button" class="counter-btn counter-inc-btn" aria-label="Increment pages">+</button>
              </div>
            ` : ''}
          </div>

          <div class="task-right-actions">
            ${!isCompleted ? `
              <button type="button" class="icon-subtle-btn snooze-task-btn" aria-label="Snooze 15 minutes" title="Snooze for 15 minutes">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </button>
            ` : ''}

            <button type="button" class="icon-subtle-btn edit-task-btn" aria-label="Edit Habit" title="Edit this habit">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>

            <button type="button" class="icon-subtle-btn delete-btn delete-task-btn" aria-label="Delete Habit" title="Delete habit">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  // Anti-Circumvention Interceptor on Checkmark Click
  handleTaskCheckClick(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.completed) {
      if (confirm(`Unmark "${task.title}" as completed? This will reopen today's nag alarms.`)) {
        this.toggleTaskCompletion(taskId, false);
      }
      return;
    }

    // Safeguard verification check
    if (task.safeguard && task.safeguard !== 'simple') {
      this.openVerificationModal(task);
    } else {
      this.toggleTaskCompletion(taskId, true);
    }
  }

  openVerificationModal(task) {
    document.getElementById('verify-task-id').value = task.id;
    const isQuran = task.id === 'task-quran' || task.title.toLowerCase().includes('quran');
    const isPoe = task.id === 'task-poe' || task.title.toLowerCase().includes('poe');

    const quranGroup = document.getElementById('verify-field-quran-group');
    const reflectionLabel = document.getElementById('verify-reflection-label');
    const reflectionInput = document.getElementById('verify-reflection-text');
    const charCount = document.getElementById('char-count-text');
    const pledge = document.getElementById('verify-pledge-checkbox');
    const timerCard = document.getElementById('focus-timer-card');

    // Contextual form fields
    if (isQuran) {
      quranGroup.style.display = 'flex';
      reflectionLabel.textContent = "📖 Reflection on Today's 2 Pages *";
      reflectionInput.placeholder = "Which ayah or theme resonated with you? Share at least one thoughtful takeaway...";
      timerCard.style.display = 'flex';
    } else if (isPoe) {
      quranGroup.style.display = 'none';
      reflectionLabel.textContent = "🤖 What Prompt or AI Bot Did You Consult on Poe.com? *";
      reflectionInput.placeholder = "Describe the prompt, conversation, or AI bot (e.g. Claude 3.5, ChatGPT) you interacted with...";
      timerCard.style.display = 'none';
    } else {
      quranGroup.style.display = 'none';
      reflectionLabel.textContent = "🛡️ Accountability Proof: What Did You Accomplish? *";
      reflectionInput.placeholder = "Summarize what you completed today with honest details...";
      timerCard.style.display = task.safeguard === 'timed-focus' ? 'flex' : 'none';
    }

    // Reset inputs
    reflectionInput.value = '';
    charCount.textContent = '0 / 15 chars';
    charCount.style.color = 'var(--text-dim)';
    pledge.checked = false;
    document.getElementById('verify-quran-surah').value = '';

    this.stopFocusTimer();
    this.openModal('verification-modal');
  }

  // Anti-Circumvention Verification Submission
  handleVerificationSubmit() {
    const taskId = document.getElementById('verify-task-id').value;
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    const isQuran = task.id === 'task-quran' || task.title.toLowerCase().includes('quran');
    const surahText = document.getElementById('verify-quran-surah').value.trim();
    const reflection = document.getElementById('verify-reflection-text').value.trim();
    const pledge = document.getElementById('verify-pledge-checkbox').checked;

    // Strict Anti-Cheat Validations
    if (!pledge) {
      this.showToast('⚠️ You must check the Honesty Pledge before submitting.', 'toast-nag');
      return;
    }

    if (isQuran && !surahText) {
      this.showToast('⚠️ Please specify the Surah & Pages read today.', 'toast-nag');
      document.getElementById('verify-quran-surah').focus();
      return;
    }

    if (reflection.length < 15) {
      this.showToast('⚠️ Reflection is too short. Minimum 15 characters of real reflection required.', 'toast-nag');
      document.getElementById('verify-reflection-text').focus();
      return;
    }

    // Filter out low-effort dummy bypass spam
    const lower = reflection.toLowerCase();
    const bannedBypasses = ['done', 'yes', 'asdf', 'test', 'completed', 'ok', 'did it', 'read it'];
    if (bannedBypasses.some(b => lower === b || lower === b.repeat(3))) {
      this.showToast('🛡️ Safeguard Alert: Meaningful report required. Generic words are not accepted.', 'toast-nag');
      return;
    }

    // Record verified report in audit history
    const newReport = {
      id: 'rep-' + Date.now(),
      taskId: task.id,
      taskTitle: task.title,
      taskEmoji: task.emoji,
      date: this.getTodayDateString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details: isQuran ? surahText : (task.url || ''),
      reflection: reflection
    };

    this.reports.unshift(newReport);
    this.saveReports();

    // Mark task completed
    this.toggleTaskCompletion(task.id, true);
    this.closeModal('verification-modal');
    this.stopFocusTimer();

    this.showToast(`🛡️ Verified & Logged: "${task.title}" completed honestly!`, 'toast-success');
  }

  // Focus Reading Timer (2-Minute Stopwatch)
  startFocusTimer() {
    this.focusTimerRemainingSec = 120;
    const display = document.getElementById('timer-digits-display');
    const bar = document.getElementById('timer-progress-bar');
    const btn = document.getElementById('start-focus-timer-btn');
    if (btn) btn.textContent = '⏸ Pause Reading Timer';

    this.focusTimerInterval = setInterval(() => {
      this.focusTimerRemainingSec--;
      const m = Math.floor(this.focusTimerRemainingSec / 60);
      const s = this.focusTimerRemainingSec % 60;
      if (display) display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      if (bar) {
        const percent = ((120 - this.focusTimerRemainingSec) / 120) * 100;
        bar.style.width = `${percent}%`;
      }

      if (this.focusTimerRemainingSec <= 0) {
        this.stopFocusTimer();
        this.playSynthesizedSound('zenBell');
        this.showToast('🔔 2-Minute Reading Focus Complete! Write your reflection below.', 'toast-success');
        const textarea = document.getElementById('verify-reflection-text');
        if (textarea) textarea.focus();
      }
    }, 1000);
  }

  stopFocusTimer() {
    if (this.focusTimerInterval) {
      clearInterval(this.focusTimerInterval);
      this.focusTimerInterval = null;
    }
    const btn = document.getElementById('start-focus-timer-btn');
    if (btn) btn.textContent = '▶ Start 2-Minute Reading Timer';
  }

  // Render History Modal
  renderReportsHistory() {
    const list = document.getElementById('history-list-container');
    if (!list) return;

    if (this.reports.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          <p style="font-size: 1.8rem; margin-bottom: 0.5rem;">📜</p>
          <p>No verified reports logged yet.</p>
          <p style="font-size: 0.8rem; margin-top: 0.25rem;">Complete your daily commitments with safeguards to build your audit log!</p>
        </div>
      `;
      return;
    }

    list.innerHTML = this.reports.map(rep => `
      <article class="history-card">
        <div class="history-card-header">
          <span class="history-task-title">${rep.taskEmoji || '⚡'} ${this.escapeHTML(rep.taskTitle)}</span>
          <span class="history-timestamp">${rep.date} at ${rep.timestamp}</span>
        </div>
        ${rep.details ? `<div class="history-meta">📍 ${this.escapeHTML(rep.details)}</div>` : ''}
        <div class="history-reflection">"${this.escapeHTML(rep.reflection)}"</div>
      </article>
    `).join('');
  }

  // Toggle Completion
  toggleTaskCompletion(taskId, forceState = null) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    const newState = forceState !== null ? forceState : !task.completed;
    task.completed = newState;

    if (newState) {
      task.currentCount = task.targetCount || 1;
      task.completedDate = this.getTodayDateString();
      task.lastCompletedDate = task.completedDate;
      this.playSynthesizedSound('celebrate');
      this.launchConfetti();
      this.stopTabBlink();
    } else {
      task.currentCount = 0;
      task.completedDate = null;
      this.showToast(`Restored "${task.title}" to active list.`, 'toast-nag');
    }

    this.saveState();
    this.render();
  }

  adjustTaskCount(taskId, delta) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.currentCount = Math.max(0, Math.min(task.targetCount || 1, (task.currentCount || 0) + delta));
    if (task.currentCount >= task.targetCount) {
      if (!task.completed) {
        if (task.safeguard && task.safeguard !== 'simple') {
          this.openVerificationModal(task);
        } else {
          this.toggleTaskCompletion(taskId, true);
        }
        return;
      }
    } else {
      if (task.completed) {
        task.completed = false;
        task.completedDate = null;
      }
    }

    this.saveState();
    this.render();
  }

  snoozeTask(taskId, minutes = 15) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.snoozedUntil = Date.now() + minutes * 60 * 1000;
    this.saveState();
    this.showToast(`💤 "${task.title}" snoozed for ${minutes} minutes.`, 'toast-success');
    this.render();
  }

  deleteTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.tasks = this.tasks.filter(t => t.id !== taskId);
      this.saveState();
      this.render();
      this.showToast(`Deleted "${task.title}".`, 'toast-nag');
    }
  }

  // Export Native Calendar (.ics) with Recurring Daily Alarms
  exportCalendarICS() {
    const pad = (n) => String(n).padStart(2, '0');
    const now = new Date();
    const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}T${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}Z`;

    let icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Recurr.ai//Habit Nag Engine//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    this.tasks.forEach(task => {
      const time = task.dueTime || '08:00';
      const [hh, mm] = time.split(':');
      const dtstart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}T${hh}${mm}00`;

      icsLines.push(
        'BEGIN:VEVENT',
        `UID:recurr-${task.id}-${Date.now()}@recurr.ai`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${dtstart}`,
        'RRULE:FREQ=DAILY',
        `SUMMARY:⚡ Recurr: ${task.emoji} ${task.title}`,
        `DESCRIPTION:Daily commitment scheduled at ${this.formatDueTimeDisplay(task.dueTime)}. Open Recurr.ai to submit your verification report. ${task.url || ''}`,
        'BEGIN:VALARM',
        'TRIGGER:-PT0M',
        'ACTION:DISPLAY',
        `DESCRIPTION:⚡ Nag Alarm: Time for ${task.title}!`,
        'END:VALARM',
        'END:VEVENT'
      );
    });

    icsLines.push('END:VCALENDAR');

    const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recurr_daily_8am_alarms.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);

    this.showToast('📅 Downloaded alarms! Tap the file to add 8:00 AM recurring alarms to your iPhone/Android calendar.', 'toast-success');
  }

  // Modal Dialog Controllers
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && typeof modal.showModal === 'function') {
      modal.showModal();
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && typeof modal.close === 'function') {
      modal.close();
    }
  }

  resetTaskForm() {
    document.getElementById('modal-title-text').textContent = 'Add Daily Habit';
    document.getElementById('task-id-input').value = '';
    document.getElementById('task-title-input').value = '';
    document.getElementById('task-emoji-input').value = '📖';
    document.getElementById('task-due-time-input').value = '08:00';
    document.getElementById('task-safeguard-input').value = 'strict-report';
    document.getElementById('task-nag-interval-input').value = '15';
    document.getElementById('task-url-input').value = '';
    document.getElementById('task-sound-input').value = 'pleasantChime';
    document.getElementById('task-voice-toggle').checked = true;
    document.getElementById('task-target-count-input').value = '1';
  }

  openEditModal(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById('modal-title-text').textContent = 'Edit Daily Habit';
    document.getElementById('task-id-input').value = task.id;
    document.getElementById('task-title-input').value = task.title;
    document.getElementById('task-emoji-input').value = task.emoji || '⚡';
    document.getElementById('task-due-time-input').value = task.dueTime || '08:00';
    document.getElementById('task-safeguard-input').value = task.safeguard || 'strict-report';
    document.getElementById('task-nag-interval-input').value = String(task.nagIntervalMinutes || 15);
    document.getElementById('task-url-input').value = task.url || '';
    document.getElementById('task-sound-input').value = task.nagSound || 'pleasantChime';
    document.getElementById('task-voice-toggle').checked = !!task.voiceNag;
    document.getElementById('task-target-count-input').value = task.targetCount || 1;

    this.openModal('task-modal');
  }

  applyPreset(preset) {
    this.resetTaskForm();
    document.getElementById('task-title-input').value = preset.title;
    document.getElementById('task-emoji-input').value = preset.emoji;
    document.getElementById('task-url-input').value = preset.url || '';
    document.getElementById('task-due-time-input').value = preset.dueTime || '08:00';
    document.getElementById('task-safeguard-input').value = preset.safeguard || 'strict-report';
    document.getElementById('task-nag-interval-input').value = String(preset.nagIntervalMinutes || 15);
    document.getElementById('task-sound-input').value = preset.nagSound || 'pleasantChime';
    document.getElementById('task-voice-toggle').checked = !!preset.voiceNag;
    document.getElementById('task-target-count-input').value = preset.targetCount || 1;

    this.openModal('task-modal');
  }

  handleTaskFormSubmit() {
    const id = document.getElementById('task-id-input').value;
    const title = document.getElementById('task-title-input').value.trim();
    const emoji = document.getElementById('task-emoji-input').value;
    const dueTime = document.getElementById('task-due-time-input').value || '08:00';
    const safeguard = document.getElementById('task-safeguard-input').value || 'strict-report';
    const interval = parseInt(document.getElementById('task-nag-interval-input').value, 10) || 15;
    const url = document.getElementById('task-url-input').value.trim();
    const sound = document.getElementById('task-sound-input').value;
    const voiceNag = document.getElementById('task-voice-toggle').checked;
    const targetCount = parseInt(document.getElementById('task-target-count-input').value, 10) || 1;

    if (!title) return;

    if (id) {
      const task = this.tasks.find(t => t.id === id);
      if (task) {
        task.title = title;
        task.emoji = emoji;
        task.dueTime = dueTime;
        task.safeguard = safeguard;
        task.nagIntervalMinutes = interval;
        task.url = url;
        task.nagSound = sound;
        task.voiceNag = voiceNag;
        task.targetCount = targetCount;
      }
    } else {
      const newTask = {
        id: 'task-' + Date.now(),
        title,
        emoji,
        url,
        dueTime,
        safeguard,
        targetCount,
        currentCount: 0,
        completed: false,
        completedDate: null,
        nagIntervalMinutes: interval,
        nagSound: sound,
        voiceNag,
        streak: 0,
        lastNaggedTime: 0,
        snoozedUntil: 0,
        createdAt: Date.now()
      };
      this.tasks.push(newTask);
    }

    this.saveState();
    this.closeModal('task-modal');
    this.render();
    this.showToast(`Saved habit "${title}" (Due: ${this.formatDueTimeDisplay(dueTime)})!`, 'toast-success');
  }

  // Confetti Particle Explosion
  launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1'];
    const particles = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 60,
        y: canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.9) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        alpha: 1
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.42;
        p.rotation += p.vRot;
        p.alpha -= 0.012;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      frame++;
      if (frame < 95) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    requestAnimationFrame(animate);
  }

  // Toast System
  showToast(message, type = 'toast-nag') {
    const hub = document.getElementById('toast-hub');
    if (!hub) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span>${this.escapeHTML(message)}</span>
      <button type="button" style="color: rgba(255,255,255,0.7); font-size: 1.1rem; padding: 0 4px;" aria-label="Close notification">&times;</button>
    `;

    toast.querySelector('button').addEventListener('click', () => toast.remove());
    hub.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      tasks: this.tasks,
      reports: this.reports,
      settings: this.settings,
      exportedAt: new Date().toISOString()
    }, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `recurr_backup_${this.getTodayDateString()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  }

  // Utilities
  getDomainName(url) {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, '');
    } catch (e) {
      return url;
    }
  }

  escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.recurrApp = new RecurrApp();
});
