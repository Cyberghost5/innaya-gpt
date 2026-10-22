# 🐍 Innaya-GPT Local Python Backend Guide
### Practical AI & ML Class Project for SS3 Students
**Innayatullah International School, Iwo, Osun State**

---

## 📌 Project Overview
In this practical session, students learn how **Retrieval-Augmented Generation (RAG)** allows AI models to answer questions accurately based on private, local data (like school records) without hallucination.

The backend performs three key machine learning steps:
1. **Document Ingestion**: Reads plain `.txt` files from the `school_data/` folder.
2. **Semantic Chunking**: Splits large documents into smaller paragraphs (chunks).
3. **Retrieval**: When a student asks a question, the backend calculates keyword similarity and vector overlap scores to return the exact relevant section.

---

## 🛠️ Step-by-Step Setup Guide

### Step 1: Open Terminal / Command Prompt
Navigate to the backend directory:
```bash
cd c:\laragon\www\innaya-gpt\backend
```

### Step 2: Install Dependencies
Run:
```bash
pip install -r requirements.txt
```

### Step 3: Start the Backend Server
Run:
```bash
python app.py
```
You will see:
```
=======================================================
🚀 Innaya-GPT Local AI Backend Server Starting...
🏫 Innayatullah International School, Iwo, Osun State
🔗 Server URL: http://127.0.0.1:5000
=======================================================
```

---

## 📁 Feeding New School Data (.txt Files)

Any new `.txt` file dropped into `c:\laragon\www\innaya-gpt\school_data\` will automatically be indexed!

Examples of files students can create:
* `school_data/teachers_list.txt` — List of subject teachers and classes taught.
* `school_data/hostel_rules.txt` — Boarding house schedule, prep time, and light-out hours.
* `school_data/school_fees_schedule.txt` — Termly fee structures and bank payment accounts.
* `school_data/waec_subject_combinations.txt` — Science vs Arts subject prerequisites.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Checks server health and active document count |
| `GET` | `/api/documents` | Lists all indexed `.txt` files and chunk numbers |
| `POST` | `/api/upload` | Uploads a new `.txt` file and triggers immediate re-indexing |
| `POST` | `/api/chat` | Receives `{ "query": "..." }` and returns the cited school answer |
