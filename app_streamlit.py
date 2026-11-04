"""
================================================================================
INNAYA-GPT: STREAMLIT AI CHATBOT INTERFACE
Local Offline AI Agent for SS3 Students
Innayatullah International School, Iwo, Osun State
================================================================================
Run command:
  streamlit run app_streamlit.py
"""

import os
import time
import json
import requests
import streamlit as st
from rag_engine import LocalSchoolRAG

# -----------------------------------------------------------------------------
# 1. PAGE CONFIGURATION & SCHOOL BRANDING
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="Innaya-GPT | Innayatullah Int'l School",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for modern academic styling
st.markdown("""
<style>
    /* Main container styling */
    .main-header {
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        color: #0f766e;
        margin-bottom: 0px;
        font-weight: 800;
        letter-spacing: -0.5px;
    }
    .sub-header {
        font-size: 0.95rem;
        color: #64748b;
        margin-top: 0px;
        margin-bottom: 20px;
    }
    .metric-badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 8px;
        font-size: 0.75rem;
        font-weight: 700;
        background-color: #f0fdfa;
        color: #0f766e;
        border: 1px solid #ccfbf1;
        margin-right: 6px;
    }
    .rag-source-box {
        background-color: #f8fafc;
        border-left: 4px solid #0f766e;
        padding: 10px 14px;
        border-radius: 0 8px 8px 0;
        font-size: 0.82rem;
        color: #334155;
        margin-top: 8px;
    }
</style>
""", unsafe_allow_html=True)

DATA_DIR = os.path.join(os.path.dirname(__file__), "school_data")
OLLAMA_BASE_URL = "http://localhost:11434"

# -----------------------------------------------------------------------------
# 2. STATE MANAGEMENT & RAG INITIALIZATION
# -----------------------------------------------------------------------------
if "rag" not in st.session_state:
    st.session_state.rag = LocalSchoolRAG(DATA_DIR)

if "messages" not in st.session_state:
    st.session_state.messages = [
        {
            "role": "assistant",
            "content": "👋 **Assalamu Alaikum & Welcome to Innaya-GPT!**\n\nI am your local AI companion at **Innayatullah International School, Iwo, Osun State**.\n\nAll my answers are generated locally from our official school `.txt` records (feeding timetables, student population, leadership, exam calendars, and clubs). What would you like to know today?"
        }
    ]

# -----------------------------------------------------------------------------
# 3. HELPER FUNCTIONS (OLLAMA API & STREAMING)
# -----------------------------------------------------------------------------
def check_ollama_status() -> tuple[bool, list[str]]:
    """Checks if the local Ollama server is running and returns installed models."""
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=1.5)
        if response.status_code == 200:
            models_data = response.json().get("models", [])
            model_names = [m["name"] for m in models_data]
            return True, model_names
    except Exception:
        pass
    return False, []

def stream_ollama_response(prompt: str, model_name: str, temperature: float):
    """
    Calls Ollama's local streaming API and yields words token-by-token.
    This gives the authentic ChatGPT real-time typing effect.
    """
    payload = {
        "model": model_name,
        "prompt": prompt,
        "stream": True,
        "options": {
            "temperature": temperature
        }
    }
    try:
        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json=payload,
            stream=True,
            timeout=60
        )
        for line in response.iter_lines():
            if line:
                chunk_data = json.loads(line.decode("utf-8"))
                yield chunk_data.get("response", "")
                if chunk_data.get("done", False):
                    break
    except Exception as e:
        yield f"\n\n*(Error connecting to Ollama: {e})*"

# -----------------------------------------------------------------------------
# 4. SIDEBAR: KNOWLEDGE FEEDING STUDIO & OLLAMA CONTROLS
# -----------------------------------------------------------------------------
with st.sidebar:
    st.image("assets/mascot.svg", width=68)
    st.markdown("### 🎓 Innaya-GPT Control Lab")
    st.caption("Innayatullah International School, Iwo")

    st.markdown("---")
    
    # --- SECTION A: OLLAMA STATUS & MODEL SELECTION ---
    st.markdown("#### 🤖 Local AI Engine (Ollama)")
    ollama_online, installed_models = check_ollama_status()

    if ollama_online:
        st.success("🟢 Ollama Engine: Running Locally")
        
        # Priority list of models optimized for 8GB RAM CPU
        preferred_models = ["llama3.2:1b", "phi3:mini", "llama3.2:3b", "mistral:7b"]
        
        # Build select list
        if installed_models:
            default_index = 0
            for i, m in enumerate(installed_models):
                if any(pref in m for pref in preferred_models):
                    default_index = i
                    break
            selected_model = st.selectbox("Select Model:", installed_models, index=default_index)
        else:
            selected_model = st.text_input("Model name:", value="llama3.2:1b")
            st.warning("No models found in Ollama. Pull one with: `ollama pull llama3.2:1b`")
    else:
        st.error("🔴 Ollama Engine: Offline")
        st.info("""
        **To start Ollama on your computer:**
        1. Open Command Prompt / PowerShell.
        2. Run:
        ```bash
        ollama run llama3.2:1b
        ```
        *(Only ~1.3GB, optimized for 8GB RAM without GPU)*
        """)
        selected_model = "llama3.2:1b"

    st.markdown("---")

    # --- SECTION B: DATA FEEDING STUDIO (THE CORE TASK!) ---
    st.markdown("#### 📂 Feed AI Data (.txt Files)")
    st.caption("Upload new school documents to update the AI's knowledge:")

    uploaded_files = st.file_uploader(
        "Drop school .txt files here",
        type=["txt"],
        accept_multiple_files=True,
        help="Upload school documents like feeding_timetable.txt, student_population.txt, etc."
    )

    if uploaded_files:
        files_saved = 0
        for uploaded_file in uploaded_files:
            target_path = os.path.join(DATA_DIR, uploaded_file.name)
            # Write file to disk
            with open(target_path, "wb") as f:
                f.write(uploaded_file.getbuffer())
            files_saved += 1
        
        # Re-index immediately
        st.session_state.rag.reload_documents()
        st.toast(f"✅ Ingested {files_saved} file(s) into AI Knowledge Base!", icon="🧠")

    # Document Statistics
    rag_stats = st.session_state.rag.document_stats
    total_words = sum(doc["word_count"] for doc in rag_stats)
    total_chunks = st.session_state.rag.total_chunks

    col_a, col_b = st.columns(2)
    col_a.metric("Documents", len(rag_stats))
    col_b.metric("Chunks", total_chunks)

    # Document Chunk Inspector (Educational Tool for SS3 Students)
    with st.expander("🔍 Inspect Active School Records"):
        if rag_stats:
            for doc in rag_stats:
                st.markdown(f"**📄 `{doc['filename']}`** ({doc['chunk_count']} chunks, {doc['word_count']} words)")
            
            # Show sample chunk from first doc
            if st.session_state.rag.chunks:
                sample_chunk = st.session_state.rag.chunks[0]
                st.markdown(f"**Sample Chunk from `{sample_chunk.filename}`:**")
                st.code(sample_chunk.text[:220] + "...", language="text")
        else:
            st.write("No files in `school_data/` directory.")

    if st.button("🔄 Re-Index All Files", use_container_width=True):
        st.session_state.rag.reload_documents()
        st.success(f"Indexed {st.session_state.rag.total_chunks} chunks from {len(rag_stats)} files.")

    st.markdown("---")

    # --- SECTION C: TUNING & CONTROLS ---
    st.markdown("#### ⚙️ Classroom Parameters")
    temperature = st.slider(
        "Creativity (Temperature):",
        min_value=0.0,
        max_value=1.0,
        value=0.1,
        step=0.05,
        help="0.0 = Strict, factual. 0.7 = More expressive."
    )
    top_k_chunks = st.slider(
        "Chunks to Retrieve (top_k):",
        min_value=1,
        max_value=5,
        value=3,
        help="How many document sections the AI reads before answering."
    )

    if st.button("🧹 Clear Chat History", use_container_width=True):
        st.session_state.messages = [
            {
                "role": "assistant",
                "content": "Chat history cleared. How can I help you with school information today?"
            }
        ]
        st.rerun()

# -----------------------------------------------------------------------------
# 5. MAIN CHAT AREA
# -----------------------------------------------------------------------------
st.markdown('<h1 class="main-header">🎓 Innaya-GPT</h1>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">Official AI Assistant for <strong>Innayatullah International School, Iwo, Osun State</strong> • Powered Locally by Ollama & RAG</div>', unsafe_allow_html=True)

# Quick Metric Pills
st.markdown(f"""
<div>
    <span class="metric-badge">🏫 IIS Knowledge Base: Active</span>
    <span class="metric-badge">📂 {len(rag_stats)} School Files Loaded</span>
    <span class="metric-badge">⚡ 8GB RAM CPU Optimized</span>
    <span class="metric-badge">🔒 100% Offline & Private</span>
</div>
""", unsafe_allow_html=True)

st.write("")

# Quick Question Suggestions for Students
col1, col2, col3, col4 = st.columns(4)
prompt_to_send = None

if col1.button("🍽️ Feeding Timetable", use_container_width=True):
    prompt_to_send = "What is the feeding timetable and lunch menu for students?"
if col2.button("🎓 Principal's Office", use_container_width=True):
    prompt_to_send = "Who is the principal of Innayatullah International School and what are her office hours?"
if col3.button("📊 Student Population", use_container_width=True):
    prompt_to_send = "How many students are enrolled in Innayatullah International School and what is the breakdown?"
if col4.button("👔 School Uniform", use_container_width=True):
    prompt_to_send = "What is the official dress code and uniform guidelines for senior school students?"

# Display Conversation History
for message in st.session_state.messages:
    if message["role"] == "user":
        with st.chat_message("user", avatar="🧑‍🎓"):
            st.write(message["content"])
    else:
        with st.chat_message("assistant", avatar="assets/mascot.svg"):
            st.markdown(message["content"])
            if "sources" in message and message["sources"]:
                with st.expander("📄 View Retrieved Document Sources"):
                    for s in message["sources"]:
                        st.markdown(f"**From `{s['filename']}` (Section {s['chunk_index']}):**\n> {s['text']}")

# Handle User Input via chat_input or quick button
user_input = st.chat_input("Ask Innaya-GPT anything about the school records...")

query = prompt_to_send or user_input

if query:
    # 1. Add user message to state
    st.session_state.messages.append({"role": "user", "content": query})
    with st.chat_message("user", avatar="🧑‍🎓"):
        st.write(query)

    # 2. RAG Retrieval Step: Find relevant chunks
    retrieved = st.session_state.rag.search_relevant_chunks(query, top_k=top_k_chunks)
    sources_data = [
        {"filename": c.filename, "chunk_index": c.chunk_index, "text": c.text}
        for (c, score) in retrieved
    ]

    # 3. RAG Augmentation Step: Construct prompt
    augmented_prompt = st.session_state.rag.build_rag_prompt(query, retrieved)

    # 4. RAG Generation Step: Stream tokens from Ollama
    with st.chat_message("assistant", avatar="assets/mascot.svg"):
        if ollama_online:
            # Live streaming from local LLM
            response_container = st.empty()
            full_response = ""
            
            with st.spinner("Innaya-GPT is thinking and reviewing school records..."):
                response_stream = stream_ollama_response(augmented_prompt, selected_model, temperature)
                full_response = st.write_stream(response_stream)
        else:
            # Fallback if Ollama is not launched yet: Shows extractive RAG output + setup reminder
            st.warning("⚠️ **Ollama engine is currently offline.** Displaying extracted school record directly:")
            if retrieved:
                top_chunk, score = retrieved[0]
                full_response = f"### 📖 Information From School Records:\n\n{top_chunk.text}\n\n> 📄 **Source:** `{top_chunk.filename}`\n\n*(To enable full generative conversational AI, launch Ollama with `ollama run llama3.2:1b` in your terminal)*"
            else:
                full_response = f"I could not find information regarding '{query}' in our uploaded `.txt` files. Please upload the relevant school file in the sidebar."
            st.markdown(full_response)

        # Show source citations expander
        if sources_data:
            with st.expander("📄 View Retrieved Document Sources"):
                for s in sources_data:
                    st.markdown(f"**From `{s['filename']}` (Section {s['chunk_index']}):**\n> {s['text']}")

    # 5. Save assistant response to state
    st.session_state.messages.append({
        "role": "assistant",
        "content": full_response,
        "sources": sources_data
    })
