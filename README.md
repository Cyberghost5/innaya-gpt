# 🎓 Innaya-GPT — Innayatullah International School AI Companion

**Innaya-GPT** is a modern, intuitive, and accessible AI chatbot interface designed specifically for high school students at **Innayatullah International School (IIS)**.

---

## 🌟 Key Features

### 1. 📐 Layout & Structure
* **Responsive Full-Screen Dashboard**: Clean two-column desktop interface with collapsible sidebar and a full-height centered chat feed.
* **Collapsible Left Sidebar**:
  * **Brand Identity**: Custom vector robot mascot badge with graduation cap and school crest, title **Innaya-GPT**, version pill, and school sub-label.
  * **Actions**: `+ New Chat` button with `Ctrl+K` keyboard shortcut support.
  * **Search**: Real-time topic filter for searching previous conversations.
  * **Recent Topics List**: Categorized conversations with topic-specific icons (Feeding Timetable, Principal's Name, Exam Guidelines, Robotics Club, etc.) and delete options.
  * **Campus Resources**: Quick links to the Scholars' Dining Hall, Sultan Bello Library Hub, and School Emergency Hotline.
  * **Sidebar Footer**: Animated **Light / Dark Mode** toggle and student profile card (*Mustapha A. • Grade 11 Science • Emerald Falcon*).
* **Main Chat Window (Center)**:
  * **Top Navigation Bar**: Sidebar collapse toggle, active chat topic with category badges (*Campus Life*, *Academics*, *Administration*, *Guidelines*), export conversation button, clear messages button, and emergency directory modal.
  * **Dynamic Welcome Screen**: Interactive mascot greeting and 6 prompt suggestion cards (*Feeding Timetable*, *Principal & Leadership*, *Exams & Academic Dates*, *Robotics & Clubs*, *Uniform & Grooming*, *Library & E-Resources*).
  * **Left-Aligned AI Bubbles**: Soft academic green/blue tint in light mode (`bg-emerald-50/70`) and sleek slate in dark mode (`dark:bg-slate-800/90`), custom robot mascot avatar, timestamp, copy button, speech playback (TTS), and helpful/unhelpful rating buttons.
  * **Right-Aligned User Bubbles**: High-contrast academic emerald/teal gradient (`bg-gradient-to-r from-emerald-800 to-teal-900`), crisp white text, student avatar, timestamp, and read checkmark.
  * **Typing Indicator**: Animated 3-dot bouncing wave animation while the AI processes queries.
* **Input Area (Bottom Sticky)**:
  * **Quick Suggestion Pills**: Tap to ask about lunch menus, principal's office, exam rules, dress code, or library hours.
  * **Attachment Uploader**: Supports attaching homework, syllabus files, and documents with an interactive removable chip preview.
  * **Auto-Growing Input**: Multi-line textarea with `Enter` to send and `Shift+Enter` for newline.
  * **Speech-to-Text**: Built-in voice input microphone powered by the Web Speech API with recording animation.
  * **Paper-Plane Send Button**: Transitions to active brand color when text is typed.
  * **Official Academic Disclaimer**: Clarifying that administrative notices should be confirmed with the school desk.

---

## 🎨 Styling & Theming
* **Color Palette**:
  * Academic Emerald: `#0f766e` / `#0d9488`
  * Deep Academic Navy: `#0e2439` / `#1e293b`
  * Gold Crest Accent: `#eab308`
* **Typography**: Clean Google Fonts typography using **Plus Jakarta Sans** and **JetBrains Mono**.
* **Dark Mode**: Native Tailwind dark mode support with smooth transitions, custom dark scrollbars, and persistent `localStorage` theme state.
* **Mobile-First**: Smooth off-canvas drawer on mobile screens with backdrop click-to-close.

---

## 📚 Built-in Knowledge Base for Innayatullah International School
Innaya-GPT comes pre-loaded with comprehensive school context:
* 🍽️ **Feeding Timetable**: Daily breakfast, break snacks, boarders' dinner, and complete Monday–Friday lunch menu with vegetarian alternatives.
* 🎓 **Principal & Leadership**: Profile for Principal Dr. Hajia Amina Innayatullah, visiting hours (Mon–Fri: 10 AM–1 PM), Vice Principals, Head of Senior School, and Student Counselor.
* 📅 **Examinations & Grading**: 2026/2027 academic exam dates, Continuous Assessment breakdown (CA1 15%, CA2 15%, Homework 10%, Final 60%), official grading scale (A1 to F9 with GPA), and examination hall rules.
* 🤖 **Clubs & Societies**: Robotics & AI Club, Literary & Debate Society, JETS Club, Model UN, Sports Academy, and Music Guild.
* 👔 **Uniform & Grooming**: Senior boys' and girls' blazers, school tie, modesty scarf/hijab, and sports kit rules.
* 📖 **Sultan Bello Library Hub**: Opening hours, digital JSTOR/EBSCO terminals, 10-year past question bank, and book borrowing rules.
* 🚌 **Transportation & Clinic**: Bus routes across city corridors and 24/7 clinic details.

---

## 🚀 How to Run Locally

Because the project is built with HTML5, vanilla JavaScript, and CDN Tailwind CSS:

1. **Directly in Any Web Browser**:
   * Double-click or open `index.html` in Chrome, Edge, Firefox, or Safari:
     ```
     file:///c:/laragon/www/innaya-gpt/index.html
     ```

2. **Via Laragon Web Server**:
   * If Laragon is running, open:
     ```
     http://localhost/innaya-gpt/
     ```
     or
     ```
     http://innaya-gpt.test
     ```

---

## 📁 File Structure

```
innaya-gpt/
├── assets/
│   └── mascot.svg         # High-resolution vector mascot & school crest
├── css/
│   └── styles.css         # Custom animations, typing dots, typography, table styles
├── js/
│   ├── knowledge-base.js  # IIS school data & intelligent answer generator
│   └── app.js             # State management, Markdown block parser, voice & audio TTS
├── index.html             # Main dashboard layout, Tailwind CSS, semantic HTML5
└── README.md              # Project documentation
```
