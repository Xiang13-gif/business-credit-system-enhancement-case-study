"""Shared, dependency-free archive parsing and manifest helpers."""

from __future__ import annotations

import calendar
import json
import re
import unicodedata
from collections.abc import Iterable
from datetime import date
from html import unescape
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit

BASE_URL = "https://www.janestreet.com"
ARCHIVE_URL = f"{BASE_URL}/puzzles/archive/"
ALLOWED_STATUSES = {"not_started", "researching", "partial", "solved", "verified", "blocked"}
REQUIRED_FIELDS = {
    "title", "slug", "year", "month", "month_number", "date", "official_url",
    "canonical_url", "archive_page", "status", "topics", "difficulty", "solution_type",
    "code_language", "verified", "verification_method",
}


def canonical_url(url: str, base: str = BASE_URL) -> str:
    """Return a stable, fragment-free HTTPS URL without tracking parameters."""
    parts = urlsplit(urljoin(base, url))
    query = urlencode([(key, value) for key, value in parse_qsl(parts.query) if not key.lower().startswith(("utm_", "fbclid", "gclid"))])
    path = re.sub(r"/index\.html$", "/", parts.path)
    if not path.endswith("/") and path.startswith("/puzzles/"):
        path += "/"
    return urlunsplit(("https", parts.netloc.lower(), path, query, ""))


def slugify(title: str) -> str:
    """Create a portable, lowercase kebab-case identifier from an archive title."""
    normalized = unicodedata.normalize("NFKD", title).encode("ascii", "ignore").decode()
    slug = re.sub(r"[^a-z0-9]+", "-", normalized.lower()).strip("-")
    return slug or "untitled-puzzle"


def archive_rows(html: str, archive_page: str) -> list[dict[str, str]]:
    """Extract the title, month-year label, and puzzle URL from one archive page."""
    pattern = re.compile(
        r'<div class="row puzzle-row archive-list">.*?<span class="date">\s*([^<]+):</span>\s*'
        r'<span class="name">\s*(.*?)\s*</span>.*?<a class="puzzle-link" href="([^"]+)"',
        re.DOTALL,
    )
    return [
        {"date_label": unescape(label).strip(), "title": unescape(re.sub(r"<[^>]+>", "", title)).strip(), "url": canonical_url(url), "archive_page": archive_page}
        for label, title, url in pattern.findall(html)
    ]


def manifest_record(row: dict[str, str]) -> dict[str, object]:
    """Convert one archive row to the public manifest schema."""
    month, year_text = row["date_label"].rsplit(" ", 1)
    month_number = list(calendar.month_name).index(month)
    year = int(year_text)
    title = row["title"]
    return {
        "title": title, "slug": slugify(title), "year": year, "month": month,
        "month_number": month_number, "date": date(year, month_number, 1).isoformat(),
        "official_url": row["url"], "canonical_url": row["url"], "archive_page": row["archive_page"],
        "status": "not_started", "topics": [], "difficulty": "", "solution_type": "",
        "code_language": "python", "verified": False, "verification_method": "",
    }


def merge_manual(record: dict[str, object], prior: dict[str, object] | None) -> dict[str, object]:
    """Keep fields maintained by contributors when an archive refresh changes labels."""
    if not prior:
        return record
    for key in ("status", "topics", "difficulty", "solution_type", "code_language", "verified", "verification_method"):
        if key in prior:
            record[key] = prior[key]
    return record


def sort_records(records: Iterable[dict[str, object]]) -> list[dict[str, object]]:
    """Sort records deterministically in chronological order."""
    return sorted(records, key=lambda item: (str(item["date"]), str(item["title"]).casefold(), str(item["canonical_url"])))


def load_manifest(path: Path) -> dict[str, object]:
    """Load a manifest or return the standard empty document."""
    if not path.exists():
        return {"archive_url": ARCHIVE_URL, "entries": [], "duplicates": []}
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: object) -> None:
    """Write stable UTF-8 JSON with a trailing newline."""
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
