"""
================================================================================
INNAYA-GPT UNIFIED LOCAL AI BACKEND & HTTP SERVER
Educational AI & ML Project for SS3 Students
Innayatullah International School, Iwo, Osun State
================================================================================
Zero-Dependency Python Architecture:
- Uses Python's built-in `http.server.ThreadingHTTPServer` (no pip packages needed).
- Connects via AJAX / Fetch API to `index.html` with real-time token streaming.
- Runs TF-IDF Retrieval-Augmented Generation (RAG) using `rag_engine.py`.
- Connects locally to Ollama (http://localhost:11434, llama3.2:1b).
- Full CORS support for Laragon, local web server, and file:// protocols.
"""

import os
import sys
import json
import glob
import mimetypes
import urllib.request
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn

# Add root directory to sys.path to import rag_engine
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from rag_engine import LocalSchoolRAG

# Configuration
PORT = 5000
DATA_DIR = os.path.join(BASE_DIR, "school_data")
OLLAMA_BASE_URL = "http://localhost:11434"
DEFAULT_MODEL = "llama3.2:1b"

# Initialize RAG Engine
rag_engine = LocalSchoolRAG(DATA_DIR)


def check_ollama_status() -> tuple[bool, list[str]]:
    """Checks if Ollama is running locally on port 11434 and returns installed models."""
    try:
        req = urllib.request.Request(
            f"{OLLAMA_BASE_URL}/api/tags",
            headers={"User-Agent": "Innaya-GPT/2.0"}
        )
        with urllib.request.urlopen(req, timeout=1.5) as resp:
            if resp.status == 200:
                data = json.loads(resp.read().decode("utf-8"))
                models = [m["name"] for m in data.get("models", [])]
                return True, models
    except Exception:
        pass
    return False, []


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Multi-threaded HTTP server to handle concurrent AJAX streaming requests."""
    daemon_threads = True


class InnayaAPIHandler(SimpleHTTPRequestHandler):
    """Handles static files, API endpoints, and streaming LLM responses."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def _send_cors_headers(self):
        """Injects CORS headers for seamless cross-origin AJAX requests."""
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

    def do_OPTIONS(self):
        """Handles CORS preflight checks."""
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def _send_json_response(self, data: dict, status_code: int = 200):
        """Sends a JSON formatted response with CORS headers."""
        response_bytes = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response_bytes)))
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(response_bytes)

    def do_GET(self):
        """Handles API GET endpoints and static frontend files."""
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path

        # Root route: serve index.html
        if path in ("/", "/index.html"):
            self.path = "/index.html"
            return super().do_GET()

        # API: Health & Engine Status Check
        if path == "/api/health":
            ollama_online, installed_models = check_ollama_status()
            stats = {
                "status": "online",
                "project": "Innaya-GPT Local AI System",
                "school": "Innayatullah International School, Iwo, Osun State",
                "ollama_online": ollama_online,
                "installed_models": installed_models,
                "active_model": DEFAULT_MODEL if not installed_models else installed_models[0],
                "documents_count": len(rag_engine.document_stats),
                "total_chunks": rag_engine.total_chunks
            }
            return self._send_json_response(stats)

        # API: List Documents and Chunks in Knowledge Base
        if path == "/api/documents":
            doc_list = []
            for d in rag_engine.document_stats:
                # Find sample chunks for this file
                file_chunks = [
                    {"chunk_index": c.chunk_index, "text": c.text}
                    for c in rag_engine.chunks if c.filename == d["filename"]
                ]
                doc_list.append({
                    "id": d["filename"].replace(".", "_"),
                    "filename": d["filename"],
                    "chunk_count": d["chunk_count"],
                    "word_count": d["word_count"],
                    "sample_chunk": file_chunks[0]["text"] if file_chunks else "",
                    "chunks": file_chunks
                })

            data = {
                "documents": doc_list,
                "total_documents": len(doc_list),
                "total_chunks": rag_engine.total_chunks,
                "total_words": sum(d["word_count"] for d in rag_engine.document_stats)
            }
            return self._send_json_response(data)

        # Fall back to standard static file server
        super().do_GET()

    def do_POST(self):
        """Handles AI queries and document uploads via AJAX."""
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path

        # Read JSON body
        content_length = int(self.headers.get("Content-Length", 0))
        body_bytes = self.rfile.read(content_length) if content_length > 0 else b"{}"

        try:
            body = json.loads(body_bytes.decode("utf-8")) if body_bytes else {}
        except Exception:
            body = {}

        # API: Chat Query with Local RAG & Ollama
        if path == "/api/chat":
            return self._handle_chat_request(body)

        # API: Upload new .txt document into knowledge base
        if path == "/api/upload":
            return self._handle_upload_request(body)

        # API: Delete document from knowledge base
        if path == "/api/delete":
            return self._handle_delete_request(body)

        self._send_json_response({"error": "Endpoint not found"}, status_code=404)

    def _handle_chat_request(self, body: dict):
        """Processes a student question through RAG retrieval and Ollama inference."""
        query = body.get("query", "").strip()
        if not query:
            return self._send_json_response({"error": "Query cannot be empty"}, status_code=400)

        stream = body.get("stream", True)
        temperature = float(body.get("temperature", 0.1))
        top_k = int(body.get("top_k", 3))
        model_name = body.get("model", DEFAULT_MODEL)

        # 1. RAG Retrieval Step: Find relevant chunks
        relevant_chunks = rag_engine.search_relevant_chunks(query, top_k=top_k)
        sources = [
            {
                "filename": c.filename,
                "chunk_index": c.chunk_index,
                "text": c.text,
                "score": round(score, 2)
            }
            for (c, score) in relevant_chunks
        ]

        # 2. RAG Augmentation Step: Construct prompt
        augmented_prompt = rag_engine.build_rag_prompt(query, relevant_chunks)

        # 3. Check Ollama engine status
        ollama_online, installed_models = check_ollama_status()
        if installed_models and model_name not in installed_models:
            model_name = installed_models[0]

        # Scenario A: Ollama is running and client requested live streaming
        if ollama_online and stream:
            self._stream_ollama_response(augmented_prompt, model_name, temperature, sources)
            return

        # Scenario B: Ollama is running with synchronous JSON response
        if ollama_online and not stream:
            answer = self._generate_ollama_sync(augmented_prompt, model_name, temperature)
            return self._send_json_response({
                "response": answer,
                "sources": sources,
                "model": model_name,
                "ollama_online": True
            })

        # Scenario C: Ollama is offline -> Graceful extractive RAG fallback
        if relevant_chunks:
            top_chunk, score = relevant_chunks[0]
            answer = (
                f"### 📖 Information From School Records:\n\n{top_chunk.text}\n\n"
                f"> 📄 **Source Document:** `{top_chunk.filename}` (Section {top_chunk.chunk_index})\n\n"
                f"*(Note: Ollama engine is offline. Start Ollama with `ollama run llama3.2:1b` in terminal to enable full conversational AI generation)*"
            )
        else:
            answer = (
                f"I could not find information regarding **'{query}'** in our uploaded school `.txt` files.\n\n"
                f"Please upload the relevant school file using the **\"Feed AI Data (.txt)\"** studio in the top navigation bar."
            )

        if stream:
            # Send single event stream for offline mode
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "keep-alive")
            self._send_cors_headers()
            self.end_headers()

            event_token = json.dumps({"token": answer, "done": False})
            self.wfile.write(f"data: {event_token}\n\n".encode("utf-8"))
            event_done = json.dumps({"done": True, "sources": sources, "ollama_online": False})
            self.wfile.write(f"data: {event_done}\n\n".encode("utf-8"))
            self.wfile.flush()
        else:
            self._send_json_response({
                "response": answer,
                "sources": sources,
                "model": "offline-extractive",
                "ollama_online": False
            })

    def _stream_ollama_response(self, prompt: str, model_name: str, temperature: float, sources: list):
        """Streams tokens word-by-word via Server-Sent Events (SSE)."""
        payload = json.dumps({
            "model": model_name,
            "prompt": prompt,
            "stream": True,
            "options": {"temperature": temperature}
        }).encode("utf-8")

        req = urllib.request.Request(
            f"{OLLAMA_BASE_URL}/api/generate",
            data=payload,
            headers={"Content-Type": "application/json"}
        )

        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "keep-alive")
        self._send_cors_headers()
        self.end_headers()

        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                for line in resp:
                    if line:
                        chunk_data = json.loads(line.decode("utf-8"))
                        token = chunk_data.get("response", "")
                        is_done = chunk_data.get("done", False)

                        event = json.dumps({"token": token, "done": False})
                        self.wfile.write(f"data: {event}\n\n".encode("utf-8"))
                        self.wfile.flush()

                        if is_done:
                            break

            # Final completion event with source attribution
            final_event = json.dumps({
                "done": True,
                "sources": sources,
                "model": model_name,
                "ollama_online": True
            })
            self.wfile.write(f"data: {final_event}\n\n".encode("utf-8"))
            self.wfile.flush()

        except Exception as e:
            error_event = json.dumps({
                "token": f"\n\n*(Error communicating with Ollama: {e})*",
                "done": True,
                "sources": sources,
                "ollama_online": False
            })
            self.wfile.write(f"data: {error_event}\n\n".encode("utf-8"))
            self.wfile.flush()

    def _generate_ollama_sync(self, prompt: str, model_name: str, temperature: float) -> str:
        """Calls Ollama synchronously and returns the complete text."""
        payload = json.dumps({
            "model": model_name,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": temperature}
        }).encode("utf-8")

        req = urllib.request.Request(
            f"{OLLAMA_BASE_URL}/api/generate",
            data=payload,
            headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data.get("response", "")
        except Exception as e:
            return f"Error contacting Ollama: {e}"

    def _handle_upload_request(self, body: dict):
        """Accepts a .txt filename and content, saves to school_data, and reloads RAG."""
        filename = body.get("filename", "").strip()
        content = body.get("content", "")

        if not filename or not filename.endswith(".txt"):
            return self._send_json_response({"error": "Only .txt files are supported"}, status_code=400)

        # Sanitize filename
        safe_filename = os.path.basename(filename)
        target_path = os.path.join(DATA_DIR, safe_filename)

        try:
            with open(target_path, "w", encoding="utf-8") as f:
                f.write(content)

            # Re-index RAG immediately
            rag_engine.reload_documents()

            return self._send_json_response({
                "message": f"Successfully indexed '{safe_filename}' into AI knowledge base!",
                "filename": safe_filename,
                "total_documents": len(rag_engine.document_stats),
                "total_chunks": rag_engine.total_chunks
            })
        except Exception as e:
            return self._send_json_response({"error": f"Failed to save file: {e}"}, status_code=500)

    def _handle_delete_request(self, body: dict):
        """Deletes a .txt file from school_data and reloads RAG."""
        filename = body.get("filename", "").strip()
        if not filename:
            return self._send_json_response({"error": "Filename required"}, status_code=400)

        safe_filename = os.path.basename(filename)
        target_path = os.path.join(DATA_DIR, safe_filename)

        if os.path.exists(target_path):
            try:
                os.remove(target_path)
                rag_engine.reload_documents()
                return self._send_json_response({
                    "message": f"Deleted '{safe_filename}'",
                    "total_documents": len(rag_engine.document_stats),
                    "total_chunks": rag_engine.total_chunks
                })
            except Exception as e:
                return self._send_json_response({"error": str(e)}, status_code=500)
        else:
            return self._send_json_response({"error": "File not found"}, status_code=404)


def run_server(port: int = PORT):
    """Starts the Innaya-GPT HTTP server."""
    # Ensure Windows console handles UTF-8 gracefully
    if sys.stdout and hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

    server_address = ("0.0.0.0", port)
    httpd = ThreadedHTTPServer(server_address, InnayaAPIHandler)

    print("\n" + "=" * 65)
    print("[IIS] INNAYA-GPT: UNIFIED LOCAL AI BACKEND & WEB SERVER")
    print("      Innayatullah International School, Iwo, Osun State")
    print(f"      Local Web Address : http://localhost:{port}")
    print(f"      RAG Knowledge Base: {len(rag_engine.document_stats)} documents, {rag_engine.total_chunks} chunks loaded")
    
    ollama_ok, models = check_ollama_status()
    if ollama_ok:
        print(f"      Ollama Engine Status: ONLINE ({len(models)} model(s) available: {', '.join(models)})")
    else:
        print("      Ollama Engine Status: OFFLINE (Extractive RAG fallback active)")
        print("      Tip: Run 'ollama run llama3.2:1b' in another terminal for generative responses.")
    print("=" * 65 + "\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down Innaya-GPT server...")
        httpd.server_close()


if __name__ == "__main__":
    run_server()
