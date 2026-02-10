# 🚀 Sandeep Tracker (Sandy Elite Pro)

A high-performance, OLED-optimized Progressive Web App (PWA) designed to manage **Semester 4 Computer Science** academics and **Vegetarian Strength Training** goals in one unified dashboard.

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Tech](https://img.shields.io/badge/Tech-HTML5%20|%20CSS3%20|%20JS-orange)

---

## 🌟 Key Features

### 🎓 College Mode
* **Live Timetable:** Automatically detects the current day and highlights your active class based on system time.
* **Sem 4 Integration:** Pre-loaded with Discrete Maths, DAA, OS, CSA, and Microprocessor labs.
* **Focus View:** Hides all fitness and lifestyle data to keep you focused during lectures.

### 🏋️ Fitness & Strength
* **Dynamic Workouts:** Tailored vegetarian strength plan including Floor Press, Squats, and RDLs.
* **Personal Bests (PB):** Track your 1RM for Squats and Overhead Press directly in the UI.
* **Rest Timer:** Automatic 60-second countdown triggered after key sets to optimize recovery.

### 💧 Smart Hydration
* **Animated Water Glass:** Log 500ml increments with a smooth visual filling effect.
* **Momentum Sync:** Water intake is calculated into your daily "Consistency Momentum" graph.

### 📈 Data & Persistence
* **Streak Flame:** Track consecutive days of hitting your goals.
* **Local Persistence:** Data is saved to your browser's local storage.
* **Cloud-Style Backup:** Export all logs, PBs, and history to a `.json` file for safe-keeping.

---

## 🛠️ Technical Implementation

The project is built as a **Progressive Web App**, allowing it to be installed on Android and iOS devices without an app store.



* **Logic:** $O(1)$ and $O(n)$ complexity algorithms for timetable filtering and chart rendering.
* **UI:** OLED-Black theme for battery efficiency and high-contrast reading.
* **Architecture:** Modular Javascript handling real-time clock synchronization.



---

## 🚀 Installation

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/yourusername/sandeep-tracker.git](https://github.com/yourusername/sandeep-tracker.git)
    ```
2.  **Open on Mobile**
    Deploy via GitHub Pages, open the link in Chrome/Safari.
3.  **Add to Home Screen**
    * **Android:** Tap the three dots → "Install App".
    * **iOS:** Tap Share → "Add to Home Screen".

---

## 📁 File Structure

* `index.html` - Core structure and PWA entry point.
* `style.css` - OLED-optimized styling and animations.
* `app.js` - Application logic and data management.
* `manifest.json` - PWA configuration and icons.
* `icon.png` - App logo and browser favicon.

---

## 📝 License
Built by Sandeep Bollavaram. For personal use in Sem 4 and beyond.