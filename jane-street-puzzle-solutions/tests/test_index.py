import json
from pathlib import Path

from build_index import generated

ROOT = Path(__file__).resolve().parents[1]


def test_generated_index_has_status_counts_and_both_languages() -> None:
    entries = json.loads((ROOT / "data" / "puzzles.json").read_text(encoding="utf-8"))["entries"]
    output = generated(entries, chinese=False)
    assert "Total unique puzzles: 50" in output
    assert "[EN]" in output and "[中文]" in output
