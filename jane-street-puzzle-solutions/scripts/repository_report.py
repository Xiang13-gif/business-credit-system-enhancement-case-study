#!/usr/bin/env python3
"""Print a transparent progress report for the independently maintained archive."""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

from validate_bilingual_content import validate as bilingual_errors
from validate_metadata import validate as metadata_errors

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    """Generate archive, coverage, and validation facts without changing files."""
    payload = json.loads((ROOT / "data" / "puzzles.json").read_text(encoding="utf-8"))
    entries = payload["entries"]
    statuses = Counter(item["status"] for item in entries)
    years = Counter(item["year"] for item in entries)
    print(f"total archive entries: {payload.get('total_archive_entries', len(entries))}")
    print(f"total unique puzzles: {len(entries)}")
    print(f"duplicate entries: {len(payload.get('duplicates', []))}")
    print(f"earliest: {entries[0]['date']} — {entries[0]['title']}")
    print(f"latest: {entries[-1]['date']} — {entries[-1]['title']}")
    print("by year: " + ", ".join(f"{year}={count}" for year, count in sorted(years.items())))
    print("by status: " + ", ".join(f"{status}={statuses[status]}" for status in sorted(statuses)))
    print(f"metadata errors: {len(metadata_errors())}")
    print(f"bilingual inconsistencies: {len(bilingual_errors())}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
