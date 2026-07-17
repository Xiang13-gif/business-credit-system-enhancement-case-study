#!/usr/bin/env python3
"""Validate the manifest and the metadata/folder contract for every puzzle."""

from __future__ import annotations

import json
import sys
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit

from archive_utils import ALLOWED_STATUSES, REQUIRED_FIELDS

ROOT = Path(__file__).resolve().parents[1]


def validate() -> list[str]:
    """Return all metadata contract violations without stopping at the first one."""
    payload = json.loads((ROOT / "data" / "puzzles.json").read_text(encoding="utf-8"))
    entries = payload.get("entries", [])
    errors: list[str] = []
    urls: set[str] = set()
    slugs: set[str] = set()
    previous = ""
    for item in entries:
        label = str(item.get("title", "<untitled>"))
        missing = REQUIRED_FIELDS - item.keys()
        if missing:
            errors.append(f"{label}: missing manifest fields {sorted(missing)}")
            continue
        try:
            date.fromisoformat(str(item["date"]))
        except ValueError:
            errors.append(f"{label}: invalid date")
        if item["status"] not in ALLOWED_STATUSES:
            errors.append(f"{label}: invalid status {item['status']}")
        if item["verified"] and item["status"] != "verified":
            errors.append(f"{label}: verified=true requires status=verified")
        if item["status"] == "verified" and (not item["verified"] or not item["verification_method"]):
            errors.append(f"{label}: verified status needs verified=true and a method")
        if not urlsplit(str(item["official_url"])).netloc:
            errors.append(f"{label}: official URL is not absolute")
        if item["canonical_url"] in urls:
            errors.append(f"{label}: duplicate canonical URL")
        urls.add(str(item["canonical_url"]))
        if item["slug"] in slugs:
            errors.append(f"{label}: duplicate slug")
        slugs.add(str(item["slug"]))
        if previous > str(item["date"]):
            errors.append(f"{label}: manifest is not chronological")
        previous = str(item["date"])
        folder = ROOT / "puzzles" / str(item["year"]) / f"{item['year']}-{item['month_number']:02d}-{item['slug']}"
        required = ("README.md", "README.en.md", "README.zh-CN.md", "metadata.json", "solution.py", "test_solution.py", "notes.md")
        for name in required:
            if not (folder / name).is_file():
                errors.append(f"{label}: missing {folder.relative_to(ROOT) / name}")
        if (folder / "metadata.json").is_file():
            local = json.loads((folder / "metadata.json").read_text(encoding="utf-8"))
            for key in ("title", "date", "slug", "official_url", "status", "verified"):
                if local.get(key) != item.get(key):
                    errors.append(f"{label}: metadata.json {key} differs from manifest")
    return errors


def main() -> int:
    errors = validate()
    print("metadata validation passed" if not errors else "metadata validation failed:\n- " + "\n- ".join(errors))
    return int(bool(errors))


if __name__ == "__main__":
    sys.exit(main())
