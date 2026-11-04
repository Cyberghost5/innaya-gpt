# 🎓 SS3 Practical Lab Manual: Building "Innaya-GPT"
### *Department of Computer Science & Robotics*
**Innayatullah International School, Iwo, Osun State**

---

## 👨‍🏫 Teacher & Student Overview

Welcome to your hands-on AI & Machine Learning practical session! In this lab, you will build and interact with **Innaya-GPT**, a custom local AI agent that runs completely on your computer without needing an internet connection.

By the end of this lab, you will understand:
1. What a Large Language Model (LLM) is and why it cannot know about our school without help.
2. How **Retrieval-Augmented Generation (RAG)** prevents AI hallucinations.
3. How text documents are broken down into **Tokens** and **Chunks**.
4. How to feed your own plain text `.txt` files to teach an AI new facts in real time.

---

## 🔬 Lab Architecture

```
  ┌────────────────────────────────────────────────────────┐
  │                 1. KNOWLEDGE FEEDING                   │
  │  Students create school files (.txt) in school_data/   │
  │  (e.g., student_population.txt, feeding_timetable.txt) │
  └───────────────────────────┬────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │                  2. CHUNKING & TF-IDF                  │
  │  Long documents are sliced into paragraphs (Chunks)    │
  │  and indexed mathematically using keyword vectors.     │
  └───────────────────────────┬────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │                     3. RETRIEVAL                       │
  │  When a student asks a question, the RAG engine finds  │
  │  the exact 2 to 3 most relevant paragraphs.            │
  └───────────────────────────┬────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │              4. OLLAMA GENERATION (LOCAL)              │
  │  Ollama (llama3.2:1b) reads the retrieved context and  │
  │  generates a conversational, accurate response!        │
  └────────────────────────────────────────────────────────┘
```

---

## 💻 System Requirements & Optimization

* **Lab Computers**: 8GB RAM, Core i3/i5/i7 (CPU-only, no dedicated GPU needed).
* **AI Model**: `llama3.2:1b` (Meta's lightweight model, only ~1.3 GB, runs fast on 8GB RAM CPU).
* **Interface**: Unified Web Dashboard (`index.html` on `http://localhost:5000`).

---

## 🚀 Lab Step-by-Step Instructions

### Step 1: Start the Local Ollama Engine
Open your terminal (PowerShell or Command Prompt) and run:
```bash
ollama run llama3.2:1b
```
*(Leave this window open in the background! Ollama is now acting as the AI's brain).*

### Step 2: Start Innaya-GPT
Open a second terminal window or double-click `run_innaya_gpt.bat` (or run `python server.py`):
```bash
python server.py
```
Your browser will automatically open to `http://localhost:5000`.

---

## 📝 Hands-on Lab Tasks for Students

### Task 1: Ask Baseline Questions (Testing the Pre-loaded Knowledge)
Try asking Innaya-GPT the following questions:
1. *"How many students are enrolled in Innayatullah International School?"*
2. *"What is the senior school lunch menu for Wednesday?"*
3. *"Who is the Principal of the school and where is her office located?"*
4. *"What time is evening lights-out in the boarding hostel?"*

👉 **Observe**: Click the **`📄 Verified From School Records`** drawer beneath the AI's answer. Notice how Innaya-GPT quotes the exact `.txt` document where it found the answer!

---

### Task 2: Teach Innaya-GPT Something Brand New! (Data Feeding)
1. Open Notepad on your computer.
2. Create a new text file named `physics_lab_rules.txt`.
3. Type the following content:
   ```text
   INNAYATULLAH INTERNATIONAL SCHOOL - PHYSICS LABORATORY RULES
   - Laboratory Prefect: Master Faruq Adeleke (SS3 Science).
   - Lab Technologist: Mr. Olawale Johnson.
   - All students must wear white cotton lab coats and safety goggles.
   - Food and drinks are strictly forbidden inside Physics Lab 1.
   - Any broken glassware must be reported immediately to Mr. Johnson.
   ```
4. Save the file.
5. In the Innaya-GPT top bar, click **"Feed AI Data (.txt)"**, then click **"Upload Custom .txt File"** and select `physics_lab_rules.txt`.
6. Now ask Innaya-GPT in the chat:
   *"Who is the Physics Laboratory Prefect and what are the lab rules?"*

🎉 **Look at that!** Innaya-GPT now knows who Master Faruq Adeleke is, without anyone having to retrain the AI model!

---

### Task 3: Experiment with AI Temperature (Creativity vs. Factuality)
In the top bar, click **"Feed AI Data (.txt)"** to open the parameters panel:
1. Set the **"Creativity (Temperature)"** slider to **`0.0`** and ask: *"What are the 4 school houses and their colors?"*
   * *Observation*: The answer is direct, factual, and strictly grounded in the text.
2. Move the slider up to **`0.8`** and ask the same question.
   * *Observation*: The AI uses more expressive adjectives and creative phrasing.

---

## 🧠 SS3 Examination Review Questions

1. **What is an LLM hallucination, and how does RAG prevent it?**
2. **Why do we break long documents into "chunks" instead of feeding an entire 100-page book into the prompt all at once?**
3. **What is the difference between an AI model that runs "in the cloud" (like ChatGPT on chatgpt.com) and a local model running with Ollama?**
4. **Why is `llama3.2:1b` well-suited for a computer with 8GB RAM and no dedicated graphics card?**
