/**
 * Recurr.ai — Core Application & Nag Engine (v1.0.7)
 * Mobile-ready, persistent notifications & audio nag engine for daily recurring tasks.
 * Includes Top 10 Major Improvements + Random Quranic Ayat Alarm Recitation Sound:
 * 1. Random Quranic Ayat Recitations (Mishary Rashid Alafasy) for Alarm Audio
 * 2. In-App 2-Page Quran Reader with Page Flipper
 * 3. Screen Wake Lock API (keeps mobile screen awake during focus & reading)
 * 4. 3-Tier Escalating Nag Urgency (Mild -> Insistent -> Drill Sergeant)
 * 5. Photo Proof & Screenshot Upload Safeguard
 * 6. 28-Day Consistency Matrix Heatmap
 * 7. Master Audio Center & Volume Slider
 * 8. Anti-Procrastination Snooze Limits (Max 3/day) with Reason Logging
 * 9. Accountability Partner Sharing via Web Share API
 * 10. PWA Mobile Home Screen Installation Prompt
 */

// Default Initial Tasks
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
    nagSound: 'quranAyah',
    voiceNag: false,
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
    nagSound: 'quranAyah',
    voiceNag: false
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

// Quran Surah Datasets for In-App Reader (2 Pages per selection)
const QURAN_DATA = {
  kahf: {
    name: 'Surah Al-Kahf (18:1–20)',
    page1: [
      { num: 1, ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا ۜ', en: '[All] praise is due to Allah, who has sent down upon His Servant the Book and has not made therein any deviance.' },
      { num: 2, ar: 'قَيِّمًا لِّيُنذِرَ بَأْسًا شَدِيدًا مِّن لَّدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا', en: '[He has made it] straight, to warn of severe punishment from Him and to give good tidings to the believers who do righteous deeds that they will have a good reward.' },
      { num: 3, ar: 'مَّاكِثِينَ فِيهِ أَبَدًا', en: 'In which they will remain forever.' },
      { num: 4, ar: 'وَيُنذِرَ الَّذِينَ قَالُوا اتَّخَذَ اللَّهُ وَلَدًا', en: 'And to warn those who say, "Allah has taken a son."' }
    ],
    page2: [
      { num: 10, ar: 'إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ فَقَالُوا رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا', en: '[Mention] when the youths retreated to the cave and said, "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance."' },
      { num: 13, ar: 'نَّحْنُ نَقُصُّ عَلَيْكَ نَبَأَهُم بِالْحَقِّ ۚ إِنَّهُمْ فِتْيَةٌ آمَنُوا بِرَبِّهِمْ وَزِدْنَاهُمْ هُدًى', en: 'It is We who relate to you their story in truth. Indeed, they were youths who believed in their Lord, and We increased them in guidance.' },
      { num: 14, ar: 'وَرَبَطْنَا عَلَىٰ قُلُوبِهِمْ إِذْ قَامُوا فَقَالُوا رَبُّنَا رَبُّ السَّمَاوَاتِ وَالْأَرْضِ لَن نَّدْعُوَ مِن دُونِهِ إِلَٰهًا', en: 'And We made firm their hearts when they stood up and said, "Our Lord is the Lord of the heavens and the earth. Never will we invoke besides Him any deity."' }
    ]
  },
  mulk: {
    name: 'Surah Al-Mulk (67:1–30)',
    page1: [
      { num: 1, ar: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', en: 'Blessed is He in whose hand is dominion, and He is over all things competent.' },
      { num: 2, ar: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ', en: '[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving.' },
      { num: 3, ar: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ', en: '[And] who created seven heavens in layers. You see no imperfection in the creation of the Most Merciful.' }
    ],
    page2: [
      { num: 12, ar: 'إِنَّ الَّذِينَ يَخْشَوْنَ رَبَّهُم بِالْغَيْبِ لَهُم مَّغْفِرَةٌ وَأَجْرٌ كَبِيرٌ', en: 'Indeed, those who fear their Lord unseen will have forgiveness and great reward.' },
      { num: 13, ar: 'وَأَسِرُّوا قَوْلَكُمْ أَوِ اجْهَرُوا بِهِ ۖ إِنَّهُ عَلِيمٌ بِذَاتِ الصُّدُورِ', en: 'And conceal your speech or publicize it; indeed, He is Knowing of that within the breasts.' },
      { num: 14, ar: 'أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ', en: 'Does He who created not know, while He is the Subtle, the Acquainted?' }
    ]
  },
  yasin: {
    name: 'Surah Ya-Sin (36:1–32)',
    page1: [
      { num: 1, ar: 'يس', en: 'Ya, Seen.' },
      { num: 2, ar: 'وَالْقُرْآنِ الْحَكِيمِ', en: 'By the wise Qur\'an.' },
      { num: 3, ar: 'إِنَّكَ لَمِنَ الْمُرْسَلِينَ', en: 'Indeed you, [O Muhammad], are from among the messengers,' },
      { num: 4, ar: 'عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ', en: 'On a straight path.' }
    ],
    page2: [
      { num: 12, ar: 'إِنَّا نَحْنُ نُحْيِي الْمَوْتَىٰ وَنَكْتُبُ مَا قَدَّمُوا وَآثَارَهُمْ ۚ وَكُلَّ شَيْءٍ أَحْصَيْنَاهُ فِي إِمَامٍ مُّبِينٍ', en: 'Indeed, it is We who bring the dead to life and record what they have put forth and what they left behind, and all things We have enumerated in a clear register.' },
      { num: 20, ar: 'وَجَاءَ مِنْ أَقْصَى الْمَدِينَةِ رَجُلٌ يَسْعَىٰ قَالَ يَا قَوْمِ اتَّبِعُوا الْمُرْسَلِينَ', en: 'And there came from the farthest end of the city a man, running. He said, "O my people, follow the messengers."' }
    ]
  },
  baqarah: {
    name: 'Surah Al-Baqarah (2:284–286)',
    page1: [
      { num: 284, ar: 'لِّلَّهِ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ وَإِن تُبْدُوا مَا فِي أَنفُسِكُمْ أَوْ تُخْفُوهُ يُحَاسِبْكُم بِهِ اللَّهُ', en: 'To Allah belongs whatever is in the heavens and whatever is in the earth. Whether you show what is within yourselves or conceal it, Allah will bring you to account for it.' },
      { num: 285, ar: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ', en: 'The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers.' }
    ],
    page2: [
      { num: 286, ar: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا', en: 'Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned. "Our Lord, do not impose blame upon us if we have forgotten or erred."' }
    ]
  }
};

// Curated Quranic Ayat for Random Alarm Recitations (Mishary Rashid Alafasy)
const QURAN_ALARM_AYAT = [
  {
    ref: 'Surah Ash-Sharh (94:5–6)',
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    english: 'For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6086.mp3'
  },
  {
    ref: 'Ayat Al-Kursi (2:255)',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    english: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3'
  },
  {
    ref: 'Surah Taha (20:114)',
    arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    english: 'And say, "My Lord, increase me in knowledge."',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2462.mp3'
  },
  {
    ref: 'Surah Al-Kahf (18:10)',
    arabic: 'رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا',
    english: 'Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2150.mp3'
  },
  {
    ref: 'Surah Al-Baqarah (2:286)',
    arabic: 'رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا',
    english: 'Our Lord, do not burden us with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/293.mp3'
  },
  {
    ref: 'Surah Az-Zumar (39:53)',
    arabic: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا',
    english: 'Say, "O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins."',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4111.mp3'
  },
  {
    ref: 'Surah Ali \'Imran (3:139)',
    arabic: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ',
    english: 'So do not weaken and do not grieve, and you will be superior if you are [true] believers.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/432.mp3'
  },
  {
    ref: 'Surah Ar-Ra\'d (13:28)',
    arabic: 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    english: 'Those who have believed and whose hearts are assured by the remembrance of Allah. Unquestionably, by the remembrance of Allah hearts are assured.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1735.mp3'
  },
  {
    ref: 'Surah Al-Mulk (67:1)',
    arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    english: 'Blessed is He in whose hand is dominion, and He is over all things competent.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5242.mp3'
  },
  {
    ref: 'Surah Al-Fatihah (1:1–2)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    english: 'In the name of Allah, the Entirely Merciful, the Especially Merciful. [All] praise is [due] to Allah, Lord of the worlds.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3'
  },
  {
    ref: 'Surah Ibrahim (14:7)',
    arabic: 'وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    english: 'And [remember] when your Lord proclaimed, "If you are grateful, I will surely increase you [in favor]."',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1757.mp3'
  },
  {
    ref: 'Surah Al-Anbiya (21:87)',
    arabic: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
    english: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2570.mp3'
  }
];

class RecurrApp {
  constructor() {
    this.tasks = [];
    this.reports = [];
    this.settings = {
      soundEnabled: true,
      voiceEnabled: true,
      masterVolume: 80,
      globalSnoozeUntil: 0,
      dailySnoozeCounts: {}, // taskId -> count
      lastActiveDate: this.getTodayDateString()
    };
    this.currentFilter = 'all';
    this.audioCtx = null;
    this.swRegistration = null;
    this.blinkInterval = null;
    this.originalTitle = document.title;
    this.nextNagCountdownSec = 0;
    
    // Wake Lock
    this.wakeLock = null;

    // Focus Timer
    this.focusTimerInterval = null;
    this.focusTimerRemainingSec = 120;

    // Quran Reader state
    this.readerState = {
      surah: 'kahf',
      currentPage: 1,
      fontSize: 1.45
    };

    // Stored photo for verification
    this.currentPhotoBase64 = null;

    // Quran Ayah Alarm Audio Player
    this.quranAudio = null;
    this.currentQuranAyah = null;

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
    this.bindKeyboardShortcuts();
    this.initQuranReader();
    this.initPwaInstallBanner();
    this.render();
    this.startNagTicker();
    this.updateHeaderDate();
  }

  loadState() {
    try {
      const storedTasks = localStorage.getItem('recurr_tasks');
      this.tasks = storedTasks ? JSON.parse(storedTasks) : JSON.parse(JSON.stringify(DEFAULT_TASKS));
      if (Array.isArray(this.tasks)) {
        this.tasks.forEach(t => {
          if (t.id === 'task-quran' && (t.nagSound === 'urgentRadar' || !t.nagSound)) {
            t.nagSound = 'quranAyah';
            t.voiceNag = false;
          }
        });
      }

      const storedReports = localStorage.getItem('recurr_reports');
      this.reports = storedReports ? JSON.parse(storedReports) : [
        {
          id: 'rep-init-1',
          taskId: 'task-quran',
          taskTitle: 'Read 2 pages of Quran',
          taskEmoji: '📖',
          date: this.getTodayDateString(),
          timestamp: '08:32 AM',
          details: 'Surah Al-Kahf, Pages 12–13',
          reflection: 'Completed 2 pages. Reflected on Ayat 75-82 regarding truthfulness and steadfastness.'
        }
      ];

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

      this.settings.dailySnoozeCounts = {};
      this.settings.lastActiveDate = today;
      this.saveState();
      this.showToast('🌅 Good morning! Daily tasks and snooze quotas have been reset for today.', 'toast-success');
    }
  }

  isTaskDueNow(task) {
    if (!task.dueTime) return true;
    const [hours, minutes] = task.dueTime.split(':').map(Number);
    const now = new Date();
    const due = new Date(now);
    due.setHours(hours, minutes, 0, 0);
    return now >= due;
  }

  getEscalatingNagTier(task) {
    if (!this.isTaskDueNow(task) || task.completed) return 0;
    const now = new Date();
    const [h, m] = (task.dueTime || '08:00').split(':').map(Number);
    const due = new Date(now);
    due.setHours(h, m, 0, 0);
    const overdueHours = (now - due) / (1000 * 60 * 60);

    if (overdueHours >= 2.5 || now.getHours() >= 19) {
      return 3; // Drill Sergeant / Critical Emergency
    } else if (overdueHours >= 0.5) {
      return 2; // Insistent
    }
    return 1; // Mild
  }

  formatDueTimeDisplay(timeStr) {
    if (!timeStr) return 'All Day';
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${String(m).padStart(2, '0')} ${ampm}`;
  }

  // Improvement 2: Screen Wake Lock API
  async acquireWakeLock() {
    if ('wakeLock' in navigator) {
      try {
        this.wakeLock = await navigator.wakeLock.request('screen');
        const statusEl = document.getElementById('wake-lock-status');
        if (statusEl) {
          statusEl.textContent = '🔆 Screen Kept Awake';
          statusEl.style.color = '#34d399';
        }
      } catch (err) {
        console.warn('Wake Lock request failed:', err);
      }
    }
  }

  releaseWakeLock() {
    if (this.wakeLock) {
      try {
        this.wakeLock.release();
        this.wakeLock = null;
      } catch (e) {}
    }
    const statusEl = document.getElementById('wake-lock-status');
    if (statusEl) {
      statusEl.textContent = '🔆 Keep-Awake Off';
      statusEl.style.color = '#fbbf24';
    }
  }

  // Improvement 6: Web Audio Synthesizer with Master Volume
  initAudioContext() {
    const unlock = () => {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
  }

  playQuranAyahRecitation(specificIndex = null) {
    if (!this.settings.soundEnabled) return;
    this.stopQuranAyahRecitation(false);

    let ayah;
    if (specificIndex !== null && QURAN_ALARM_AYAT[specificIndex]) {
      ayah = QURAN_ALARM_AYAT[specificIndex];
    } else {
      const randIdx = Math.floor(Math.random() * QURAN_ALARM_AYAT.length);
      ayah = QURAN_ALARM_AYAT[randIdx];
    }
    this.currentQuranAyah = ayah;

    // Update banner UI elements
    const banner = document.getElementById('quran-alarm-banner');
    const surahTag = document.getElementById('quran-alarm-surah-tag');
    const arabicText = document.getElementById('quran-alarm-arabic-text');
    const englishText = document.getElementById('quran-alarm-english-text');

    if (banner && surahTag && arabicText && englishText) {
      surahTag.textContent = ayah.ref;
      arabicText.textContent = ayah.arabic;
      englishText.textContent = `"${ayah.english}"`;
      banner.style.display = 'flex';
      try {
        banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (e) {
        // ignore
      }
    }

    try {
      this.quranAudio = new Audio(ayah.audioUrl);
      this.quranAudio.volume = Math.max(0.05, (this.settings.masterVolume || 80) / 100);
      const playPromise = this.quranAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Quran audio autoplay restricted or failed:', err);
          this.playSynthesizedSound('zenBell');
        });
      }

      this.quranAudio.onended = () => {
        this.stopQuranAyahRecitation(false);
      };
    } catch (err) {
      console.warn('Audio construction error, fallback to chime:', err);
      this.playSynthesizedSound('zenBell');
    }
  }

  stopQuranAyahRecitation(hideBanner = true) {
    if (this.quranAudio) {
      try {
        this.quranAudio.pause();
        this.quranAudio.currentTime = 0;
      } catch (e) {
        // ignore
      }
      this.quranAudio = null;
    }
    if (hideBanner) {
      const banner = document.getElementById('quran-alarm-banner');
      if (banner) banner.style.display = 'none';
    }
  }

  playSynthesizedSound(type) {
    if (!this.settings.soundEnabled) return;

    if (type === 'quranAyah') {
      this.playQuranAyahRecitation();
      return;
    }

    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const volMultiplier = (this.settings.masterVolume || 80) / 100;

      if (type === 'urgentRadar') {
        [0, 0.2, 0.4].forEach((offset) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, now + offset);
          osc.frequency.exponentialRampToValueAtTime(440, now + offset + 0.15);
          gain.gain.setValueAtTime(0.25 * volMultiplier, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.18);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.2);
        });
      } else if (type === 'pleasantChime') {
        [659.25, 880].forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.16);
          gain.gain.setValueAtTime(0.3 * volMultiplier, now + idx * 0.16);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.8);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + idx * 0.16);
          osc.stop(now + idx * 0.16 + 0.85);
        });
      } else if (type === 'zenBell') {
        [216, 432, 864].forEach((freq, i) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime((0.25 / (i + 1)) * volMultiplier, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 2.3);
        });
      } else if (type === 'retroPing') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.2 * volMultiplier, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
      } else if (type === 'celebrate') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);
          gain.gain.setValueAtTime(0.35 * volMultiplier, now + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.5);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.6);
        });
      }
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  speakVoiceNudge(text) {
    if (!this.settings.voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }

  // Web Notification & Service Worker
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
          'You will be reminded until daily tasks like Quran reading & Poe.com are verified.'
        );
        return true;
      } else {
        this.showToast('❌ Notification permission was denied. Alerts will sound inside this tab.', 'toast-nag');
        return false;
      }
    } catch (e) {
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
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
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

  // Master Nag Ticker
  startNagTicker() {
    setInterval(() => {
      this.checkDailyReset();
      this.tickNagLogic();
    }, 1000);
  }

  tickNagLogic() {
    const now = Date.now();
    const isGlobalSnoozed = this.settings.globalSnoozeUntil > now;

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
        if (remainingSec < minRemainingSec) minRemainingSec = remainingSec;
      }
    });

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
    const tier = this.getEscalatingNagTier(task);
    const isQuranTask = task.nagSound === 'quranAyah' || task.id === 'task-quran';

    // Prioritize Quran recitation if selected or default for Quran habit
    if (isQuranTask) {
      this.playQuranAyahRecitation();
      if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
    } else if (tier === 3) {
      this.playSynthesizedSound('urgentRadar');
      if ('vibrate' in navigator) navigator.vibrate([300, 100, 300, 100, 400]);
    } else {
      this.playSynthesizedSound(task.nagSound || 'pleasantChime');
      if ('vibrate' in navigator) navigator.vibrate([150, 75, 150]);
    }

    // Only speak synthetic TTS if not playing holy Quran recitation to preserve reverence
    if (task.voiceNag && !isQuranTask) {
      const urgencyPrefix = tier === 3 ? "Urgent attention required! " : "";
      this.speakVoiceNudge(`${urgencyPrefix}Reminder: It is time to complete your ${task.title}.`);
    }

    const notifTitle = isQuranTask
      ? `📖 QURAN NAG: ${task.emoji} ${task.title}`
      : (tier === 3 ? `🚨 CRITICAL NAG: ${task.emoji} ${task.title}` : `⚡ NAG ALERT: ${task.emoji} ${task.title}`);

    const notifBody = `Scheduled for ${this.formatDueTimeDisplay(task.dueTime)}. Keep your ${task.streak}-day streak alive!`;

    this.dispatchSystemNotification(notifTitle, notifBody, task.id, task.url);
    this.showToast(`⚡ NAG ALERT: ${task.emoji} ${task.title}! Finish it now!`, tier === 3 ? 'toast-nag' : 'toast-nag');
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

  // Improvement 1: In-App Quran Reader Implementation
  initQuranReader() {
    const select = document.getElementById('reader-surah-select');
    const prevBtn = document.getElementById('reader-prev-btn');
    const nextBtn = document.getElementById('reader-next-btn');
    const finishBtn = document.getElementById('finish-reading-btn');
    const fontIncBtn = document.getElementById('font-inc-btn');
    const fontDecBtn = document.getElementById('font-dec-btn');

    if (select) {
      select.addEventListener('change', () => {
        this.readerState.surah = select.value;
        this.readerState.currentPage = 1;
        this.renderQuranPage();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.readerState.currentPage > 1) {
          this.readerState.currentPage--;
          this.renderQuranPage();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.readerState.currentPage < 2) {
          this.readerState.currentPage++;
          this.renderQuranPage();
        }
      });
    }

    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        this.closeModal('quran-reader-modal');
        this.releaseWakeLock();
        const quranTask = this.tasks.find(t => t.id === 'task-quran') || this.tasks[0];
        if (quranTask) {
          this.openVerificationModal(quranTask);
          const surahName = QURAN_DATA[this.readerState.surah].name;
          const surahInput = document.getElementById('verify-quran-surah');
          if (surahInput) surahInput.value = `${surahName}, Pages 1 & 2 Completed`;
        }
      });
    }

    if (fontIncBtn) {
      fontIncBtn.addEventListener('click', () => {
        this.readerState.fontSize = Math.min(2.2, this.readerState.fontSize + 0.15);
        this.renderQuranPage();
      });
    }

    if (fontDecBtn) {
      fontDecBtn.addEventListener('click', () => {
        this.readerState.fontSize = Math.max(1.1, this.readerState.fontSize - 0.15);
        this.renderQuranPage();
      });
    }

    const readerModal = document.getElementById('quran-reader-modal');
    if (readerModal) {
      readerModal.addEventListener('close', () => this.releaseWakeLock());
    }
  }

  openQuranReader() {
    this.readerState.currentPage = 1;
    this.renderQuranPage();
    this.openModal('quran-reader-modal');
    this.acquireWakeLock();
  }

  renderQuranPage() {
    const container = document.getElementById('quran-reader-body');
    const indicator = document.getElementById('reader-page-indicator');
    const stepText = document.getElementById('reader-step-text');
    const prevBtn = document.getElementById('reader-prev-btn');
    const nextBtn = document.getElementById('reader-next-btn');

    if (!container) return;

    const surah = QURAN_DATA[this.readerState.surah] || QURAN_DATA.kahf;
    const pageKey = `page${this.readerState.currentPage}`;
    const ayahs = surah[pageKey] || [];

    if (indicator) indicator.textContent = `Page ${this.readerState.currentPage} of 2`;
    if (stepText) stepText.textContent = `Reading Page ${this.readerState.currentPage} of 2`;

    if (prevBtn) prevBtn.disabled = this.readerState.currentPage === 1;
    if (nextBtn) nextBtn.disabled = this.readerState.currentPage === 2;

    container.innerHTML = ayahs.map(a => `
      <div class="quran-verse-card">
        <div class="arabic-text" style="font-size: ${this.readerState.fontSize}rem;">
          ${a.ar} <span class="verse-num-badge">﴿${a.num}﴾</span>
        </div>
        <p class="trans-text">${a.en}</p>
      </div>
    `).join('');
  }

  // Improvement 5: 28-Day Consistency Matrix Heatmap
  renderHeatmap() {
    const grid = document.getElementById('heatmap-grid-container');
    const statText = document.getElementById('heatmap-stat-text');
    if (!grid) return;

    const cells = [];
    const today = new Date();
    let verifiedCount = 0;

    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const isToday = i === 0;

      // Find reports on this day
      const dayReports = this.reports.filter(r => r.date === dateStr);
      let level = 0;
      if (dayReports.length >= 2) level = 3;
      else if (dayReports.length === 1) level = 2;
      else if (i > 15) level = 1; // Prior baseline streaks

      if (level > 0) verifiedCount++;

      const dayNum = d.getDate();
      cells.push(`
        <div class="heatmap-cell lvl-${level} ${isToday ? 'is-today' : ''}" title="${dateStr}: ${dayReports.length} verified habits" data-date="${dateStr}">
          ${dayNum}
        </div>
      `);
    }

    grid.innerHTML = cells.join('');

    const consistencyPercent = Math.round((verifiedCount / 28) * 100);
    if (statText) statText.textContent = `${consistencyPercent}% Consistency`;
  }

  // Improvement 9: PWA Install Prompt Banner
  initPwaInstallBanner() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const banner = document.getElementById('pwa-install-banner');
    const dismissBtn = document.getElementById('dismiss-install-banner');

    if (!isStandalone && banner && !sessionStorage.getItem('recurr_dismiss_pwa')) {
      banner.style.display = 'flex';
    }

    if (dismissBtn && banner) {
      dismissBtn.addEventListener('click', () => {
        banner.style.display = 'none';
        sessionStorage.setItem('recurr_dismiss_pwa', 'true');
      });
    }
  }

  // Improvement 10: Keyboard Shortcuts
  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        this.resetTaskForm();
        this.openModal('task-modal');
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        this.renderReportsHistory();
        this.openModal('history-modal');
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        const incomplete = this.tasks.filter(t => !t.completed);
        if (incomplete.length > 0) this.triggerTaskNag(incomplete[0]);
      } else if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        this.openQuranReader();
      }
    });
  }

  // Bind All Events
  bindEvents() {
    // Header buttons
    document.getElementById('notif-perm-btn')?.addEventListener('click', () => {
      if (Notification.permission !== 'granted') this.requestNotificationPermission();
      else this.openModal('settings-modal');
    });

    document.getElementById('sound-toggle-btn')?.addEventListener('click', () => {
      this.settings.soundEnabled = !this.settings.soundEnabled;
      this.saveState();
      this.updateSoundIcon();
      this.showToast(this.settings.soundEnabled ? '🔊 Sound alerts enabled' : '🔇 Sound alerts muted', 'toast-success');
    });

    document.getElementById('history-open-btn')?.addEventListener('click', () => {
      this.renderReportsHistory();
      this.openModal('history-modal');
    });

    document.getElementById('settings-open-btn')?.addEventListener('click', () => {
      this.openModal('settings-modal');
    });

    // Reader buttons
    document.getElementById('open-quran-reader-btn')?.addEventListener('click', () => {
      this.openQuranReader();
    });

    // Calendar sync buttons
    document.getElementById('export-ics-btn')?.addEventListener('click', () => this.exportCalendarICS());
    document.getElementById('sync-calendar-btn')?.addEventListener('click', () => this.exportCalendarICS());

    // Share reports button (Improvement 8)
    document.getElementById('share-reports-btn')?.addEventListener('click', () => this.shareAccountabilityProof());

    // Banner buttons
    document.getElementById('trigger-nag-now-btn')?.addEventListener('click', () => {
      const incomplete = this.tasks.filter(t => !t.completed);
      if (incomplete.length > 0) this.triggerTaskNag(incomplete[0]);
      else {
        this.playSynthesizedSound('celebrate');
        this.showToast('🎉 All daily tasks completed honestly!', 'toast-success');
      }
    });

    document.getElementById('snooze-all-btn')?.addEventListener('click', () => {
      this.openSnoozeModal('all');
    });

    // Quran Alarm Banner Controls
    document.getElementById('stop-quran-alarm-btn')?.addEventListener('click', () => {
      this.stopQuranAyahRecitation(true);
      this.showToast('⏹ Quran recitation stopped.', 'toast-success');
    });

    document.getElementById('quran-alarm-read-now-btn')?.addEventListener('click', () => {
      this.stopQuranAyahRecitation(true);
      this.openQuranReader();
    });

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

    // Add modal button
    document.getElementById('open-add-modal-btn')?.addEventListener('click', () => {
      this.resetTaskForm();
      this.openModal('task-modal');
    });

    document.getElementById('modal-cancel-btn')?.addEventListener('click', () => {
      this.closeModal('task-modal');
    });

    document.getElementById('task-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleTaskFormSubmit();
    });

    // Verification form & photo upload
    document.getElementById('verification-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleVerificationSubmit();
    });

    document.getElementById('verify-cancel-btn')?.addEventListener('click', () => {
      this.stopFocusTimer();
      this.closeModal('verification-modal');
    });

    // Photo input handling (Improvement 4)
    const photoInput = document.getElementById('verify-photo-input');
    const photoBox = document.getElementById('photo-preview-box');
    const photoImg = document.getElementById('photo-preview-img');
    const removePhotoBtn = document.getElementById('remove-photo-btn');

    if (photoInput && photoBox && photoImg) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (loadEvt) => {
            this.currentPhotoBase64 = loadEvt.target.result;
            photoImg.src = this.currentPhotoBase64;
            photoBox.style.display = 'block';
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (removePhotoBtn && photoBox && photoInput) {
      removePhotoBtn.addEventListener('click', () => {
        this.currentPhotoBase64 = null;
        photoInput.value = '';
        photoBox.style.display = 'none';
      });
    }

    // Character counter for reflection
    const reflectionText = document.getElementById('verify-reflection-text');
    const charCountText = document.getElementById('char-count-text');
    if (reflectionText && charCountText) {
      reflectionText.addEventListener('input', () => {
        const len = reflectionText.value.trim().length;
        charCountText.textContent = `${len} / 15 chars`;
        charCountText.style.color = len >= 15 ? 'var(--done-success)' : 'var(--text-dim)';
      });
    }

    // Focus timer toggle
    document.getElementById('start-focus-timer-btn')?.addEventListener('click', () => {
      if (this.focusTimerInterval) this.stopFocusTimer();
      else this.startFocusTimer();
    });

    // Snooze modal controls (Improvement 7)
    const durationChips = document.querySelectorAll('.btn-duration-chip');
    durationChips.forEach(chip => {
      chip.addEventListener('click', () => {
        durationChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });

    document.getElementById('snooze-cancel-btn')?.addEventListener('click', () => {
      this.closeModal('snooze-modal');
    });

    document.getElementById('snooze-confirm-btn')?.addEventListener('click', () => {
      this.confirmSnooze();
    });

    // Master Volume & Sound Testing (Improvement 6)
    const volSlider = document.getElementById('master-volume-slider');
    const volText = document.getElementById('volume-val-text');
    if (volSlider && volText) {
      volSlider.value = this.settings.masterVolume || 80;
      volText.textContent = `${volSlider.value}%`;
      volSlider.addEventListener('input', () => {
        this.settings.masterVolume = parseInt(volSlider.value, 10);
        volText.textContent = `${this.settings.masterVolume}%`;
        this.saveState();
      });
    }

    document.getElementById('test-sound-choice-btn')?.addEventListener('click', () => {
      const choice = document.getElementById('sound-preview-select').value;
      this.playSynthesizedSound(choice);
    });

    // Settings Permission & Testing
    document.getElementById('request-permission-btn')?.addEventListener('click', () => {
      this.requestNotificationPermission();
    });

    document.getElementById('test-alert-btn')?.addEventListener('click', () => {
      this.playSynthesizedSound('urgentRadar');
      this.dispatchSystemNotification(
        '🔔 Test Alert from Recurr.ai',
        'Audio chime and notification alert tested successfully.'
      );
      this.showToast('🚨 Alert triggered with sound and notification!', 'toast-nag');
    });

    // Presets
    document.querySelectorAll('.chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        const key = chip.dataset.preset;
        if (PRESETS[key]) this.applyPreset(PRESETS[key]);
      });
    });

    // Data export & reset
    document.getElementById('export-data-btn')?.addEventListener('click', () => this.exportData());
    document.getElementById('reset-defaults-btn')?.addEventListener('click', () => {
      if (confirm('Reset habits back to default Quran & Poe.com tasks?')) {
        this.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
        this.saveState();
        this.render();
        this.closeModal('settings-modal');
        this.showToast('🔄 Restored default tasks.', 'toast-success');
      }
    });
  }

  // Improvement 8: Share Accountability Proof via Web Share API
  async shareAccountabilityProof() {
    const today = this.getTodayDateString();
    const todayReports = this.reports.filter(r => r.date === today);

    let shareText = `⚡ Recurr.ai Daily Habit Proof (${today}):\n`;
    if (todayReports.length > 0) {
      todayReports.forEach(r => {
        shareText += `• ${r.taskEmoji} ${r.taskTitle} (Verified at ${r.timestamp})\n  "${r.reflection}"\n`;
      });
    } else {
      shareText += `• In Progress: Working towards today's non-negotiable commitments!\n`;
    }
    shareText += `\nTracked with Recurr.ai — Zero Procrastination.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Daily Habit Proof — Recurr.ai',
          text: shareText
        });
        this.showToast('📤 Shared proof sheet successfully!', 'toast-success');
        return;
      } catch (err) {}
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      this.showToast('📋 Copied accountability report to clipboard!', 'toast-success');
    } catch (e) {
      alert(shareText);
    }
  }

  // Improvement 7: Smart Snooze with Limits & Reasons
  openSnoozeModal(taskId) {
    const currentCounts = this.settings.dailySnoozeCounts || {};
    const count = currentCounts[taskId] || 0;

    if (count >= 3) {
      this.showToast('🛡️ Anti-Procrastination Lock: Maximum 3 snoozes reached today. Time to get it done!', 'toast-nag');
      return;
    }

    document.getElementById('snooze-task-id').value = taskId;
    const quotaText = document.getElementById('snooze-quota-text');
    if (quotaText) {
      quotaText.textContent = `Quota: ${3 - count} of 3 snoozes remaining today`;
    }

    this.openModal('snooze-modal');
  }

  confirmSnooze() {
    this.stopQuranAyahRecitation(true);
    const taskId = document.getElementById('snooze-task-id').value;
    const activeChip = document.querySelector('.btn-duration-chip.active');
    const mins = parseInt(activeChip?.dataset.mins || '15', 10);
    const reason = document.getElementById('snooze-reason-select').value;

    const currentCounts = this.settings.dailySnoozeCounts || {};
    currentCounts[taskId] = (currentCounts[taskId] || 0) + 1;
    this.settings.dailySnoozeCounts = currentCounts;

    const snoozeDurationMs = mins * 60 * 1000;
    if (taskId === 'all') {
      this.settings.globalSnoozeUntil = Date.now() + snoozeDurationMs;
    } else {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) task.snoozedUntil = Date.now() + snoozeDurationMs;
    }

    this.saveState();
    this.closeModal('snooze-modal');
    this.render();
    this.showToast(`💤 Snoozed for ${mins}m (${reason}). Snooze used: ${currentCounts[taskId]}/3`, 'toast-success');
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

  render() {
    this.updateSoundIcon();
    this.updatePermissionUI();
    this.renderTasks();
    this.renderHeroStats();
    this.renderHeatmap();
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
      const circumference = 2 * Math.PI * 50;
      const offset = circumference - (percent / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    }

    if (percentVal) percentVal.textContent = `${percent}%`;

    if (headingText && summaryText) {
      if (percent === 100) {
        headingText.textContent = 'All Verified Done! 🎉';
        summaryText.textContent = `All ${total} daily tasks completed honestly!`;
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
      banner.classList.remove('all-done');
      if (badgeText) badgeText.textContent = '⏰ SCHEDULED (QUIET)';
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

    filtered.forEach(task => {
      const cardEl = container.querySelector(`[data-id="${task.id}"]`);
      if (!cardEl) return;

      cardEl.querySelector('.task-check-btn')?.addEventListener('click', () => {
        this.handleTaskCheckClick(task.id);
      });

      cardEl.querySelector('.snooze-task-btn')?.addEventListener('click', () => {
        this.openSnoozeModal(task.id);
      });

      cardEl.querySelector('.edit-task-btn')?.addEventListener('click', () => {
        this.openEditModal(task.id);
      });

      cardEl.querySelector('.delete-task-btn')?.addEventListener('click', () => {
        this.deleteTask(task.id);
      });

      cardEl.querySelector('.counter-inc-btn')?.addEventListener('click', () => {
        this.adjustTaskCount(task.id, 1);
      });

      cardEl.querySelector('.counter-dec-btn')?.addEventListener('click', () => {
        this.adjustTaskCount(task.id, -1);
      });

      cardEl.querySelector('.quick-reader-btn')?.addEventListener('click', () => {
        this.openQuranReader();
      });
    });
  }

  renderTaskCardHTML(task) {
    const isDue = this.isTaskDueNow(task);
    const isNagging = !task.completed && isDue;
    const isCompleted = task.completed;
    const hasCounter = (task.targetCount || 1) > 1;
    const tier = this.getEscalatingNagTier(task);

    let nagStatusPill = '';
    if (isCompleted) {
      nagStatusPill = `<span class="nag-status-pill done">✓ Verified Done</span>`;
    } else if (task.snoozedUntil > Date.now()) {
      const minsLeft = Math.ceil((task.snoozedUntil - Date.now()) / (60 * 1000));
      nagStatusPill = `<span class="nag-status-pill snoozed">💤 Snoozed (${minsLeft}m left)</span>`;
    } else if (!isDue) {
      nagStatusPill = `<span class="due-pill">⏳ Starts at ${this.formatDueTimeDisplay(task.dueTime)}</span>`;
    } else {
      const tierBadge = tier === 3 ? '🚨 CRITICAL OVERDUE' : tier === 2 ? '⚠️ INSISTENT NAG' : '⚡ NAG ACTIVE';
      nagStatusPill = `<span class="nag-status-pill nagging">${tierBadge} (every ${task.nagIntervalMinutes || 15}m)</span>`;
    }

    const duePill = task.dueTime 
      ? `<span class="due-pill ${isDue && !isCompleted ? 'overdue' : ''}">⏰ ${this.formatDueTimeDisplay(task.dueTime)}</span>`
      : '';

    const safeguardPill = task.safeguard && task.safeguard !== 'simple'
      ? `<span class="safeguard-pill">🛡️ Report Required</span>`
      : '';

    const isQuran = task.id === 'task-quran' || task.title.toLowerCase().includes('quran');

    const ctaLabel = isCompleted
      ? '✓ Completed — Tap to Unmark'
      : (task.safeguard && task.safeguard !== 'simple'
          ? (isQuran ? '📖 I Read My 2 Pages — Submit Report' : '✅ I Did It — Submit Report')
          : '✅ Mark as Done');

    const ctaClass = isCompleted
      ? 'task-cta-btn task-cta-done'
      : (isNagging ? `task-cta-btn task-cta-active nag-cta-tier-${tier}` : 'task-cta-btn task-cta-pending');

    return `
      <article class="task-card ${isNagging ? `is-nagging nag-tier-${tier}` : ''} ${isCompleted ? 'is-completed' : ''}" data-id="${task.id}">
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

          <div class="task-right-actions">
            ${!isCompleted ? `
              <button type="button" class="icon-subtle-btn snooze-task-btn" aria-label="Snooze" title="Snooze (Anti-procrastination limited)">
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

        ${isQuran || task.url || hasCounter ? `
        <div class="task-aux-strip">
          ${isQuran ? `<button type="button" class="action-link-btn quick-reader-btn">📖 Read 2 Pages Here</button>` : ''}
          ${task.url ? `<a href="${task.url}" target="_blank" rel="noopener noreferrer" class="action-link-btn">Launch ${this.getDomainName(task.url)} ↗</a>` : ''}
          ${hasCounter ? `
            <div class="counter-box">
              <button type="button" class="counter-btn counter-dec-btn" aria-label="Decrement">-</button>
              <span class="counter-text">${task.currentCount || 0} / ${task.targetCount}</span>
              <button type="button" class="counter-btn counter-inc-btn" aria-label="Increment">+</button>
            </div>
          ` : ''}
        </div>` : ''}

        <button type="button" class="${ctaClass} task-check-btn" aria-label="${ctaLabel}">
          ${ctaLabel}
        </button>
      </article>
    `;
  }

  handleTaskCheckClick(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.completed) {
      if (confirm(`Unmark "${task.title}" as completed? This will reopen today's nag alarms.`)) {
        this.toggleTaskCompletion(taskId, false);
      }
      return;
    }

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
    const photoBox = document.getElementById('photo-preview-box');
    const photoInput = document.getElementById('verify-photo-input');

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

    reflectionInput.value = '';
    charCount.textContent = '0 / 15 chars';
    charCount.style.color = 'var(--text-dim)';
    pledge.checked = false;
    document.getElementById('verify-quran-surah').value = '';

    this.currentPhotoBase64 = null;
    if (photoInput) photoInput.value = '';
    if (photoBox) photoBox.style.display = 'none';

    this.stopFocusTimer();
    this.openModal('verification-modal');
  }

  handleVerificationSubmit() {
    const taskId = document.getElementById('verify-task-id').value;
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    const isQuran = task.id === 'task-quran' || task.title.toLowerCase().includes('quran');
    const surahText = document.getElementById('verify-quran-surah').value.trim();
    const reflection = document.getElementById('verify-reflection-text').value.trim();
    const pledge = document.getElementById('verify-pledge-checkbox').checked;

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

    const lower = reflection.toLowerCase();
    const bannedBypasses = ['done', 'yes', 'asdf', 'test', 'completed', 'ok', 'did it', 'read it'];
    if (bannedBypasses.some(b => lower === b || lower === b.repeat(3))) {
      this.showToast('🛡️ Safeguard Alert: Meaningful report required. Generic words are not accepted.', 'toast-nag');
      return;
    }

    const newReport = {
      id: 'rep-' + Date.now(),
      taskId: task.id,
      taskTitle: task.title,
      taskEmoji: task.emoji,
      date: this.getTodayDateString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details: isQuran ? surahText : (task.url || ''),
      reflection: reflection,
      photo: this.currentPhotoBase64 || null
    };

    this.reports.unshift(newReport);
    this.saveReports();

    this.toggleTaskCompletion(task.id, true);
    this.closeModal('verification-modal');
    this.stopFocusTimer();

    this.showToast(`🛡️ Verified & Logged: "${task.title}" completed honestly!`, 'toast-success');
  }

  startFocusTimer() {
    this.focusTimerRemainingSec = 120;
    const display = document.getElementById('timer-digits-display');
    const bar = document.getElementById('timer-progress-bar');
    const btn = document.getElementById('start-focus-timer-btn');
    if (btn) btn.textContent = '⏸ Pause Reading Timer';
    this.acquireWakeLock();

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
        document.getElementById('verify-reflection-text')?.focus();
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
    this.releaseWakeLock();
  }

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
        ${rep.photo ? `
          <div style="margin-top: 0.4rem;">
            <img src="${rep.photo}" alt="Attached Proof" style="width: 100%; max-height: 140px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-card);">
          </div>
        ` : ''}
      </article>
    `).join('');
  }

  toggleTaskCompletion(taskId, forceState = null) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    const newState = forceState !== null ? forceState : !task.completed;
    task.completed = newState;

    if (newState) {
      this.stopQuranAyahRecitation(true);
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
      if (frame < 95) requestAnimationFrame(animate);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    requestAnimationFrame(animate);
  }

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

document.addEventListener('DOMContentLoaded', () => {
  window.recurrApp = new RecurrApp();
});
