"""
================================================================================
INNAYA-GPT: RETRIEVAL-AUGMENTED GENERATION (RAG) ENGINE
Educational AI & ML Project for SS3 Students
Innayatullah International School, Iwo, Osun State
================================================================================
How this works for SS3 Computer Science Students:
1. Ingestion: Reads all plain .txt files from the school_data/ directory.
2. Chunking: Splits long school documents into smaller paragraphs (chunks).
3. Vector Retrieval: Uses TF-IDF cosine similarity vector math to find the 
   exact school paragraphs relevant to any student's question.
4. Prompt Augmentation: Combines retrieved facts with the system prompt for Ollama.
"""

import os
import re
import glob
import math
from collections import Counter

# Common English stopwords (words that carry little meaning for search)
STOPWORDS = set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 
    'of', 'and', 'or', 'with', 'about', 'what', 'who', 'when', 'where', 'why', 
    'how', 'does', 'do', 'did', 'can', 'could', 'would', 'should', 'i', 'you', 
    'we', 'they', 'it', 'this', 'that', 'these', 'those', 'their', 'there', 
    'have', 'has', 'had', 'be', 'been', 'by', 'from', 'as', 'all', 'any'
])

def clean_and_tokenize(text: str) -> list[str]:
    """
    Step 1 of Natural Language Processing (Tokenization):
    Converts sentences into lowercased alphanumeric keywords, filtering stopwords.
    """
    clean_text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text.lower())
    tokens = [word for word in clean_text.split() if len(word) > 2 and word not in STOPWORDS]
    return tokens


class SchoolDocumentChunk:
    """Represents a single chunk (paragraph) from a school document."""
    def __init__(self, chunk_id: str, filename: str, text: str, chunk_index: int):
        self.chunk_id = chunk_id
        self.filename = filename
        self.text = text.strip()
        self.chunk_index = chunk_index
        self.tokens = clean_and_tokenize(self.text)
        self.term_frequencies = Counter(self.tokens)


class LocalSchoolRAG:
    """
    Lightweight, 100% offline local RAG system.
    Designed specifically to run efficiently on 8GB RAM CPU-only school computers.
    """
    def __init__(self, data_directory: str):
        self.data_directory = data_directory
        self.chunks: list[SchoolDocumentChunk] = []
        self.document_stats: list[dict] = []
        self.document_frequencies = Counter()
        self.total_chunks = 0
        self.reload_documents()

    def reload_documents(self):
        """Scans the school_data directory, reads all .txt files, and chunks them."""
        self.chunks = []
        self.document_stats = []
        self.document_frequencies = Counter()

        os.makedirs(self.data_directory, exist_ok=True)
        txt_files = glob.glob(os.path.join(self.data_directory, "*.txt"))

        for filepath in txt_files:
            filename = os.path.basename(filepath)
            try:
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()

                # Chunking: Break document by double newlines into paragraphs
                raw_paragraphs = [p.strip() for p in re.split(r'\n\s*\n+', content) if len(p.strip()) > 20]
                
                doc_chunks = []
                for idx, para in enumerate(raw_paragraphs):
                    chunk = SchoolDocumentChunk(
                        chunk_id=f"{filename}_chunk_{idx}",
                        filename=filename,
                        text=para,
                        chunk_index=idx + 1
                    )
                    doc_chunks.append(chunk)
                    self.chunks.append(chunk)

                # Record statistics for the classroom dashboard
                self.document_stats.append({
                    "filename": filename,
                    "chunk_count": len(doc_chunks),
                    "word_count": len(content.split()),
                    "filepath": filepath
                })

            except Exception as e:
                print(f"[RAG Warning] Could not process {filename}: {e}")

        self.total_chunks = len(self.chunks)

        # Calculate Document Frequencies (DF) for TF-IDF ranking
        for chunk in self.chunks:
            unique_terms = set(chunk.tokens)
            for term in unique_terms:
                self.document_frequencies[term] += 1

    def search_relevant_chunks(self, query: str, top_k: int = 3) -> list[tuple[SchoolDocumentChunk, float]]:
        """
        Retrieval Step (Vector Similarity / TF-IDF Scoring):
        Finds the chunks with highest semantic relevance to the query.
        """
        if not self.chunks:
            return []

        query_lower = query.lower().strip()
        query_tokens = clean_and_tokenize(query)

        scored_chunks = []

        for chunk in self.chunks:
            score = 0.0
            chunk_lower = chunk.text.lower()

            # 1. Exact phrase matching bonus
            if query_lower in chunk_lower:
                score += 30.0

            # 2. Sub-phrase overlap bonus
            query_words = [w for w in query_lower.split() if len(w) > 3]
            if query_words:
                matched_words = sum(1 for w in query_words if w in chunk_lower)
                score += (matched_words / len(query_words)) * 15.0

            # 3. TF-IDF Token Scoring
            for token in query_tokens:
                if token in chunk.term_frequencies:
                    tf = chunk.term_frequencies[token]
                    df = self.document_frequencies.get(token, 1)
                    # Inverse Document Frequency (IDF)
                    idf = math.log((self.total_chunks + 1) / (df + 1)) + 1.0
                    score += tf * idf * 4.0

            if score > 2.0:
                scored_chunks.append((chunk, score))

        # Sort descending by score
        scored_chunks.sort(key=lambda x: x[1], reverse=True)
        return scored_chunks[:top_k]

    def build_rag_prompt(self, query: str, relevant_chunks: list[tuple[SchoolDocumentChunk, float]]) -> str:
        """
        Augmentation Step:
        Combines the retrieved facts into a clean system instruction for Ollama.
        """
        if not relevant_chunks:
            context_text = "No relevant school records were found for this query in the uploaded files."
        else:
            formatted_chunks = []
            for i, (chunk, score) in enumerate(relevant_chunks, 1):
                formatted_chunks.append(
                    f"--- RECORD EXCERPT {i} (Source: {chunk.filename}, Section {chunk.chunk_index}) ---\n"
                    f"{chunk.text}"
                )
            context_text = "\n\n".join(formatted_chunks)

        prompt = f"""You are Innaya-GPT, the official local AI companion and student tutor for Innayatullah International School in Iwo, Osun State, Nigeria.

YOUR RULES:
1. Answer the student's question accurately using ONLY the official school records provided in the context below.
2. If the answer cannot be found in the context, politely say:
   "I do not have this information in the uploaded school records yet. Please ask the school administration or upload the relevant .txt document."
3. Do not make up false facts or hallucinate.
4. Be friendly, encouraging, and respectful, suitable for secondary school students.
5. Always cite which document your answer came from at the end of your response.

OFFICIAL SCHOOL CONTEXT:
{context_text}

STUDENT QUESTION:
{query}

INNAYA-GPT'S ANSWER:"""
        return prompt
