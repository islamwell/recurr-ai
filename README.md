# Recurr.ai ⚡

> **Mobile-Ready Persistent Daily Task & Habit Reminder That Nags You Until You Do It.**

![Recurr.ai Icon](icons/icon-192.png)

## Overview

**Recurr.ai** is an ultra-focused, beautiful, mobile-first progressive web application (PWA) designed to eliminate procrastination on essential daily habits. 

Traditional reminder apps send one polite notification that is easily swiped away and forgotten. **Recurr.ai** takes a persistent approach: if you have not completed your daily commitments (like reading your 2 pages of Quran or visiting Poe.com), it enters **Nag Mode**—continually alerting you via customizable chimes, browser/push notifications, tab blinks, and optional voice prompts until you mark them as done or explicitly snooze them.

---

## ✨ Features

- 📱 **Mobile Ready & Installable (PWA)**:
  - Add to Home Screen on iOS (Safari) and Android (Chrome) with full standalone app feel.
  - Safe-area insets (`env(safe-area-inset-bottom)`) for iPhone notched screens.
  - Responsive, thumb-friendly UI designed with dynamic viewport units (`100dvh`).
  - Offline support via Service Worker caching.

- ⚡ **Persistent "Nag Mode"**:
  - Configurable nag frequency (Every 5 min, 10 min, 15 min, 30 min, 1 hour).
  - Keeps reminding you until you check off the task!
  - Active countdown timer showing when the next nag alert will trigger.
  - Direct "Nag Me Now" button for instant alert checks.
  - Quick 15-minute snooze option for meetings or prayers.

- 📖 **Tailored for Your Daily Non-Negotiables**:
  - **Read 2 Pages of Quran**: Integrated page counter (`0/2`, `1/2`, `2/2`), 1-tap launcher to [quran.com](https://quran.com), and daily streak tracker.
  - **Visit poe.com**: 1-tap "Launch poe.com" button, habit streak tracker, and automated daily nag.
  - **Quick Presets**: Hydration (2L Water), Fitness (Pushups), Gratitude Journal, or any custom daily task.

- 🔔 **Multi-Channel Nag Alerts**:
  - **Web Notifications API**: System notifications with direct action buttons (`✓ Mark Done`, `🚀 Open Link`).
  - **Zero-Dependency Web Audio Synthesizer**: Instant, crisp notification sounds (Urgent Radar, Pleasant Melody Chime, Zen Singing Bowl, Retro Blip) without relying on external MP3 downloads.
  - **Voice Nagging**: Optional spoken speech synthesis ("Reminder: Read 2 pages of Quran!").
  - **Tab Blinking**: Visual alert in browser tabs when running in background.
  - **Haptic Vibration**: Native mobile vibration patterns on compatible Android and mobile devices.

- 🎯 **Habit Streaks & Daily Auto-Reset**:
  - Keeps count of consecutive active days (e.g., 🔥 12-day streak).
  - Automatic midnight reset with countdown timer.
  - Celebratory confetti particle explosion upon completion.

---

## 🚀 Running Locally

You can serve Recurr.ai using any static web server:

### Option 1: Python
```bash
python3 -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### Option 2: Node / npx
```bash
npx serve .
```

---

## 📲 How to Install as an App on Mobile

### iPhone (iOS Safari)
1. Open the website in **Safari**.
2. Tap the **Share** button (the square with an upward arrow) in the bottom navigation bar.
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **Add** in the top right.
5. Launch Recurr.ai from your home screen and tap **"Enable Push Notifications"**.

### Android (Google Chrome)
1. Open the website in **Chrome**.
2. Tap the **three-dot menu** in the top-right corner.
3. Tap **"Install App"** (or **"Add to Home screen"**).
4. Launch the app and grant notification permissions.

---

## 🛠️ Tech Stack & Architecture

- **Semantic HTML5**: `<header>`, `<main>`, `<dialog>`, `<footer>`, `<search>`, `<nav>`.
- **Modern CSS**: Custom properties, Glassmorphism, CSS grid & flexbox, dynamic viewport units (`dvh`), safe-area-inset padding, reduced motion support.
- **Vanilla ES Modules**: Clean, zero-bloat state management with `localStorage` persistence.
- **Service Worker (`sw.js`)**: Cache-first asset management and background notification handlers.
- **Web Audio API**: Real-time synthesized chimes and radar sweeps.
- **Web Speech API**: Spoken reminders.
- **Web Notification API**: Native OS-level banners.

---

## 📄 License

MIT License. Crafted with excellence.
