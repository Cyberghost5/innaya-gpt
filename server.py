"""
================================================================================
INNAYA-GPT: UNIFIED LAUNCHER & LOCAL AI SERVER
Innayatullah International School, Iwo, Osun State
================================================================================
Run this file directly to launch Innaya-GPT:
  python server.py

Then open your browser to:
  http://localhost:5000
================================================================================
"""

import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from backend.app import run_server

if __name__ == "__main__":
    run_server()
