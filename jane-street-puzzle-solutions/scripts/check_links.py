#!/usr/bin/env python3
"""Check local Markdown links; optionally probe official links conservatively."""

from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor
import re
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
LINK = re.compile(r"\[[^]]*\]\(([^)]+)\)")


def internal_errors() -> list[str]:
    """Return broken relative Markdown links, ignoring anchors and mail links."""
    errors: list[str] = []
    for path in ROOT.rglob("*.md"):
        if "templates" in path.parts:
            continue
        for target in LINK.findall(path.read_text(encoding="utf-8")):
            if target.startswith(("http://", "https://", "#", "mailto:")):
                continue
            clean = target.split("#", 1)[0]
            if clean and not (path.parent / clean).exists():
                errors.append(f"{path.relative_to(ROOT)} -> {target}")
    return errors


def official_results() -> tuple[list[str], list[str]]:
    """Return confirmed broken links and temporary-network failures for the manifest."""
    import json

    broken: list[str] = []
    transient: list[str] = []
    urls = {item["official_url"] for item in json.loads((ROOT / "data" / "puzzles.json").read_text(encoding="utf-8"))["entries"]}
    def probe(url: str) -> tuple[str, str | None, str | None]:
        """Probe one public URL, classifying confirmed and temporary failures."""
        try:
            with urlopen(Request(url, method="HEAD", headers={"User-Agent": "jane-street-puzzle-solutions/0.1"}), timeout=15) as response:  # nosec B310: fixed public HTTPS manifest URLs
                if response.status >= 400:
                    return url, f"{response.status}: {url}", None
        except HTTPError as exc:
            return url, f"{exc.code}: {url}", None
        except URLError as exc:
            return url, None, f"{exc.reason}: {url}"
        return url, None, None
    # Eight workers keep the check fast without issuing an uncontrolled burst.
    with ThreadPoolExecutor(max_workers=8) as executor:
        for _, broken_result, transient_result in executor.map(probe, sorted(urls)):
            if broken_result:
                broken.append(broken_result)
            if transient_result:
                transient.append(transient_result)
    return broken, transient


def main() -> int:
    """Print a link-check report."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--official", action="store_true", help="Also make one HEAD request per official puzzle URL.")
    args = parser.parse_args()
    errors = internal_errors()
    transient: list[str] = []
    if args.official:
        broken, transient = official_results()
        errors.extend(broken)
    print("internal links: OK" if not errors else "broken links:\n- " + "\n- ".join(errors))
    if transient:
        print("temporary network failures (not treated as broken):\n- " + "\n- ".join(transient))
    return int(bool(errors))


if __name__ == "__main__":
    sys.exit(main())
