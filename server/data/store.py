import json
import os
from pathlib import Path
from typing import Any, Dict

DATA_DIR = Path(__file__).resolve().parent
DB_FILE = DATA_DIR / "db.json"
SEED_FILE = DATA_DIR / "seed_data.json"

_memory_db: Dict[str, Any] | None = None

def init_store() -> Dict[str, Any]:
    global _memory_db
    try:
        if DB_FILE.exists():
            with open(DB_FILE, "r", encoding="utf-8") as f:
                _memory_db = json.load(f)
        elif SEED_FILE.exists():
            with open(SEED_FILE, "r", encoding="utf-8") as f:
                _memory_db = json.load(f)
            save_store()
        else:
            _memory_db = {"activeLearner": {}, "courses": [], "questions": [], "cohortTelemetry": {}}
    except Exception as err:
        print(f"Error loading store, falling back to seed data: {err}")
        if SEED_FILE.exists():
            with open(SEED_FILE, "r", encoding="utf-8") as f:
                _memory_db = json.load(f)
        else:
            _memory_db = {"activeLearner": {}, "courses": [], "questions": [], "cohortTelemetry": {}}
    return _memory_db

def get_store() -> Dict[str, Any]:
    global _memory_db
    if _memory_db is None:
        init_store()
    return _memory_db

def save_store() -> None:
    global _memory_db
    try:
        if _memory_db is not None:
            with open(DB_FILE, "w", encoding="utf-8") as f:
                json.dump(_memory_db, f, indent=2, ensure_ascii=False)
    except Exception as err:
        print(f"Error saving store to disk: {err}")
