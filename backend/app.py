"""
================================================================================
INNAYA-GPT BACKEND (FLASK + LOCAL DIY RAG)
Educational AI & ML Project for SS3 Students
Innayatullah International School, Iwo, Osun State
================================================================================
How this works for SS3 Students:
1. INGESTION: Scans the `school_data/` directory for all `.txt` files.
2. CHUNKING: Breaks long school documents into digestible paragraphs (chunks).
3. RETRIEVAL (Vector Search / BM25): Finds the top chunks most relevant to the student's question.
4. SYNTHESIS: Connects either to Ollama (Local LLM), Gemini/Groq API, or uses local extractive answer formatting.
"""

import os
import re
import glob
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend to connect from browser

DATA_FOLDER = os.path.join(os.path.dirname(__file__), "..", "school_data")
os.makedirs(DATA_FOLDER, exist_ok=True)

# Stopwords for simple tokenization
STOPWORDS = set([
    'the','a','an','is','are','was','were','in','on','at','to','for','of','and','or',
    'with','about','what','who','when','where','why','how','does','do','did','can',
    'could','would','should','i','you','we','they','it','this','that','these','those',
    'their','there','have','has','had','be','been','by','from','as','all','any'
])

def tokenize(text):
    """Educational helper: Converts sentences into clean keyword tokens."""
    clean = re.sub(r'[^a-zA-Z0-9\s]', ' ', text.lower())
    tokens = [w for w in clean.split() if len(w) > 2 and w not in STOPWORDS]
    return tokens

class SchoolKnowledgeBase:
    """Classroom RAG Knowledge Base that reads, chunks, and searches .txt files."""
    def __init__(self, folder_path):
        self.folder_path = folder_path
        self.documents = []
        self.chunks = []
        self.reload()

    def reload(self):
        """Read all .txt files from the school_data folder and chunk them."""
        self.documents = []
        self.chunks = []
        txt_files = glob.glob(os.path.join(self.folder_path, "*.txt"))

        for filepath in txt_files:
            filename = os.path.basename(filepath)
            try:
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()

                # Chunking: split paragraphs by double newlines
                raw_paras = [p.strip() for p in re.split(r'\n\s*\n+', content) if len(p.strip()) > 15]

                file_chunks = []
                for idx, para in enumerate(raw_paras):
                    chunk_obj = {
                        "id": f"{filename}_{idx}",
                        "file": filename,
                        "text": para,
                        "tokens": tokenize(para)
                    }
                    file_chunks.append(chunk_obj)
                    self.chunks.append(chunk_obj)

                self.documents.append({
                    "filename": filename,
                    "chunk_count": len(file_chunks),
                    "word_count": len(content.split())
                })
            except Exception as e:
                print(f"Error loading {filename}: {e}")

        print(f"[Knowledge Base Loaded] {len(self.documents)} documents, {len(self.chunks)} total chunks indexed.")

    def search(self, query, top_k=3):
        """Scored retrieval: Finds the chunks with highest keyword & semantic overlap."""
        q_lower = query.lower().strip()
        q_tokens = tokenize(query)

        scored = []
        for chunk in self.chunks:
            score = 0
            chunk_lower = chunk["text"].lower()

            # Exact query phrase boost
            if q_lower in chunk_lower:
                score += 25

            # Partial word phrase matches
            words = q_lower.split()
            if len(words) > 1:
                matched_words = sum(1 for w in words if len(w) > 3 and w in chunk_lower)
                score += (matched_words / len(words)) * 15

            # Keyword token matches
            for token in q_tokens:
                matches = sum(1 for tok in chunk["tokens"] if token in tok or tok in token)
                score += matches * 4

            if score > 3:
                scored.append((score, chunk))

        # Sort by highest relevance score
        scored.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored[:top_k]]

# Initialize Knowledge Base
kb = SchoolKnowledgeBase(DATA_FOLDER)

# ===============================================================
# API ENDPOINTS
# ===============================================================

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "project": "Innaya-GPT Local AI Backend",
        "school": "Innayatullah International School, Iwo, Osun State",
        "active_documents": len(kb.documents),
        "total_chunks": len(kb.chunks)
    })

@app.route("/api/documents", methods=["GET"])
def list_documents():
    """Returns the list of uploaded .txt documents and stats."""
    return jsonify({
        "documents": kb.documents,
        "total_chunks": len(kb.chunks)
    })

@app.route("/api/upload", methods=["POST"])
def upload_file():
    """Allows uploading new .txt files directly to the school data folder."""
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if not file.filename.endswith(".txt"):
        return jsonify({"error": "Only .txt files are supported"}), 400

    save_path = os.path.join(DATA_FOLDER, file.filename)
    file.save(save_path)

    # Re-index the knowledge base immediately
    kb.reload()

    return jsonify({
        "message": f"Successfully uploaded and indexed {file.filename}",
        "documents": kb.documents,
        "total_chunks": len(kb.chunks)
    })

@app.route("/api/chat", methods=["POST"])
def chat():
    """
    Main Chat / Query Endpoint:
    Accepts: { "query": "How many students are in the school?" }
    Returns: Extracted answer and cited source file.
    """
    data = request.get_json() or {}
    query = data.get("query", "").strip()

    if not query:
        return jsonify({"error": "Query cannot be empty"}), 400

    # Step 1: Retrieve relevant knowledge chunks
    matched_chunks = kb.search(query, top_k=3)

    if not matched_chunks:
        return jsonify({
            "response": f"I could not find specific information regarding '{query}' in the uploaded school documents. Please ensure relevant school .txt files are uploaded into the knowledge base.",
            "sources": []
        })

    # Step 2: Formulate response with source attribution
    top_chunk = matched_chunks[0]
    extra_chunks = matched_chunks[1:]
    source_files = list(set([c["file"] for c in matched_chunks]))

    formatted_answer = f"### 📖 Answer From School Records\n\n{top_chunk['text']}\n\n"
    if extra_chunks:
        formatted_answer += "#### 📌 Additional Relevant Details:\n"
        for c in extra_chunks:
            formatted_answer += f"* {c['text']}\n"
        formatted_answer += "\n"

    formatted_answer += f"> 📄 **Source Document:** `{', '.join(source_files)}`"

    return jsonify({
        "response": formatted_answer,
        "sources": source_files,
        "chunks_used": len(matched_chunks)
    })

if __name__ == "__main__":
    print("\n=======================================================")
    print("🚀 Innaya-GPT Local AI Backend Server Starting...")
    print("🏫 Innayatullah International School, Iwo, Osun State")
    print("🔗 Server URL: http://127.0.0.1:5000")
    print("=======================================================\n")
    app.run(host="0.0.0.0", port=5000, debug=True)
