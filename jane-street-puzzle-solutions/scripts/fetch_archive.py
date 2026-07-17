#!/usr/bin/env python3
"""Fetch every official Jane Street puzzle archive page and build the manifest."""

from __future__ import annotations

import argparse
import time
from pathlib import Path
from urllib.request import Request, urlopen

from archive_utils import ARCHIVE_URL, archive_rows, canonical_url, load_manifest, manifest_record, merge_manual, sort_records, write_json

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "data" / "puzzles.json"
USER_AGENT = "jane-street-puzzle-solutions/0.1 (independent research archive)"


def fetch(url: str) -> str:
    """Retrieve one archive page using a descriptive user agent."""
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=30) as response:  # nosec B310: fixed public HTTPS source
        return response.read().decode("utf-8")


def discover_pages(first_html: str) -> list[str]:
    """Return all numbered archive pages advertised by the first page."""
    import re

    links = re.findall(r'href="([^"]*?/puzzles/archive(?:/page\d+)?(?:/index\.html)?/?)[^"]*"', first_html)
    pages = {canonical_url(link) for link in links}
    pages.add(ARCHIVE_URL)
    return sorted(pages, key=lambda url: (0 if url == ARCHIVE_URL else int(re.search(r"page(\d+)", url).group(1))))


def update_manifest(page_html: dict[str, str]) -> dict[str, object]:
    """Build a deduplicated manifest and preserve manual contributor fields."""
    previous = load_manifest(MANIFEST)
    prior_by_url = {item["canonical_url"]: item for item in previous.get("entries", [])}
    all_rows = [row for page, html in page_html.items() for row in archive_rows(html, page)]
    records: dict[str, dict[str, object]] = {}
    duplicates: list[dict[str, str]] = []
    for row in all_rows:
        record = manifest_record(row)
        key = str(record["canonical_url"])
        if key in records:
            duplicates.append({"canonical_url": key, "title": str(record["title"]), "archive_page": row["archive_page"]})
            continue
        records[key] = merge_manual(record, prior_by_url.get(key))
    entries = sort_records(records.values())
    return {"archive_url": ARCHIVE_URL, "generated_from": sorted(page_html), "total_archive_entries": len(all_rows), "entries": entries, "duplicates": duplicates}


def main() -> int:
    """Fetch pages, write the manifest, and print a concise summary."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--fixture-dir", type=Path, help="Read archive HTML from a directory instead of the network.")
    args = parser.parse_args()
    try:
        if args.fixture_dir:
            first = (args.fixture_dir / "page1.html").read_text(encoding="utf-8")
            pages = discover_pages(first)
            html = {page: (args.fixture_dir / f"page{index}.html").read_text(encoding="utf-8") for index, page in enumerate(pages, 1)}
        else:
            first = fetch(ARCHIVE_URL)
            pages = discover_pages(first)
            html = {ARCHIVE_URL: first}
            for page in pages:
                if page != ARCHIVE_URL:
                    time.sleep(0.25)
                    html[page] = fetch(page)
    except OSError as exc:
        print(f"archive fetch failed: {exc}")
        return 2
    payload = update_manifest(html)
    write_json(MANIFEST, payload)
    print(f"archive entries: {payload['total_archive_entries']}; unique puzzles: {len(payload['entries'])}; duplicates: {len(payload['duplicates'])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
