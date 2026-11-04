# 🎓 Innaya-GPT: Local Offline AI Agent & RAG System
### *Innayatullah International School, Iwo, Osun State*
**Educational AI & Machine Learning Project for SS3 Students**

---

## 🌟 Overview
**Innaya-GPT** is a 100% offline, local AI chatbot built specifically for high school students and teachers at **Innayatullah International School (IIS)** in Iwo, Osun State.

Powered by **Ollama** (using the lightweight `llama3.2:1b` model optimized for 8GB RAM CPU-only computers) and **Streamlit**, it implements **Retrieval-Augmented Generation (RAG)**. The AI answers questions about school operations strictly grounded in plain `.txt` files that students and teachers feed into the system.

---

## 🔬 System Architecture

```
  📁 school_data/*.txt 
  (student_population.txt, feeding_timetable.txt, principals_profile.txt, etc.)
            │
            ▼
  ┌─────────────────────────────────────────────────────────┐
  │ 1. INGESTION & CHUNKING (rag_engine.py)                 │
  │    Splits text files into semantic paragraphs.          │
  └─────────────────────────┬───────────────────────────────┘
                            │
                            ▼
  ┌─────────────────────────────────────────────────────────┐
  │ 2. VECTOR RETRIEVAL & TF-IDF SCORING                    │
  │    Finds matching chunks for the student's question.    │
  └─────────────────────────┬───────────────────────────────┘
                            │
                            ▼
  ┌─────────────────────────────────────────────────────────┐
  │ 3. LOCAL OLLAMA INFERENCE (llama3.2:1b on port 11434)   │
  │    Generates conversational response using ONLY facts.  │
  └─────────────────────────┬───────────────────────────────┘
                            │
                            ▼
  ┌─────────────────────────────────────────────────────────┐
  │ 4. UNIFIED WEB INTERFACE (index.html via AJAX Fetch)    │
  │    Word-by-word streaming typewriter response +         │
  │    drag-and-drop .txt data feeding studio modal.        │
  └─────────────────────────────────────────────────────────┘
```

---

## 💻 Hardware Compatibility (8GB RAM, CPU-Only)
* **Target Environment**: School computer lab desktops/laptops with **8GB RAM and no dedicated graphics card**.
* **Primary LLM**: `llama3.2:1b` (Meta's 1B model, requires only ~1.3 GB RAM/disk, runs fast on Intel/AMD CPUs).
* **Alternative Lightweight LLMs**: `phi3:mini` (Microsoft, 3.8B) or `llama3.2:3b`.

---

## 🚀 Quick Start Guide

### Step 1: Install & Start Ollama
1. Download Ollama for Windows from [ollama.com](https://ollama.com).
2. Open Command Prompt / PowerShell and run:
   ```bash
   ollama run llama3.2:1b
   ```
*(Keep this terminal open in the background. Ollama is now running locally on port 11434).*

### Step 2: Launch Innaya-GPT
Double-click **`run_innaya_gpt.bat`** OR run in terminal:
```bash
python server.py
```
The browser will automatically open to **`http://localhost:5000`** (or access via Laragon at `http://localhost/innaya-gpt/`).

---

## 📁 Feeding New School Data (.txt Files)

Students can feed the AI in two ways:
1. **Via the Web Interface**: Click **"Feed AI Data (.txt)"** in the top navigation bar and drop any `.txt` file into the upload zone.
2. **Via the File System**: Drop any `.txt` file directly into the `school_data/` folder and it will be indexed immediately.

### Pre-loaded School Knowledge:
* `school_data/student_population.txt` — 840 registered students, day/boarder numbers, class breakdown.
* `school_data/feeding_timetable.txt` — Scholars' Dining Hall meal times, daily menus (Jollof, Pasta, Egusi/Pounded yam).
* `school_data/principals_profile.txt` — Principal Dr. Hajia Amina Innayatullah, office hours (Mon–Fri, 10 AM–1 PM).
* `school_data/waec_and_academics.txt` — CA score breakdown, A1–F9 grading table, examination hall rules.
* `school_data/clubs_and_hostel.txt` — Robotics Guild, Debate Society, hostel schedules, lights-out times.

---

## 📁 Repository Directory Structure

```
innaya-gpt/
├── school_data/                # 📂 Data Feeding Folder (Drop .txt files here)
│   ├── student_population.txt  # Enrollment numbers and demographics
│   ├── feeding_timetable.txt   # Dining hall schedule and weekly menus
│   ├── principals_profile.txt  # Principal credentials and visiting hours
│   ├── waec_and_academics.txt  # Grading scale and exam guidelines
│   └── clubs_and_hostel.txt    # Extracurriculars and boarding rules
├── index.html                  # 🎨 Unified Web Interface (Tailwind CSS, Dark Mode, Voice)
├── js/
│   ├── app.js                  # ⚡ AJAX controller, SSE token streaming, audio, state
│   └── knowledge-base.js       # In-browser fallback knowledge store
├── css/
│   └── styles.css              # Custom styling, animations, table rules
├── backend/
│   └── app.py                  # 🚀 Multi-threaded Python server & RAG API (zero-dependency)
├── server.py                   # ⚡ One-command root server launcher
├── rag_engine.py               # 🧠 Local RAG chunking and vector search engine
├── run_innaya_gpt.bat          # ⚡ One-click Windows batch launcher
├── STUDENT_LAB_GUIDE.md        # 📖 SS3 Classroom Lab Manual & Questions
├── assets/                     # School crest vector mascot
└── README.md                   # This project guide
```

---

## 👨‍🏫 Teaching Plan for SS3 Classes
For a complete 4-stage laboratory lesson plan with student exercises and review questions, open [STUDENT_LAB_GUIDE.md](file:///c:/laragon/www/innaya-gpt/STUDENT_LAB_GUIDE.md).
