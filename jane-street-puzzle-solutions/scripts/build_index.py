#!/usr/bin/env python3
"""Build marked generated index sections in the two language-specific root READMEs."""

from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
START, END = "<!-- GENERATED INDEX: START -->", "<!-- GENERATED INDEX: END -->"


def statistics(entries: list[dict[str, object]]) -> Counter[str]:
    """Count status values for display and reporting."""
    return Counter(str(item["status"]) for item in entries)


def completion(entries: list[dict[str, object]]) -> float:
    """Calculate solved-or-verified coverage percentage."""
    return 0.0 if not entries else 100 * sum(item["status"] in {"solved", "verified"} for item in entries) / len(entries)


def generated(entries: list[dict[str, object]], chinese: bool) -> str:
    """Render bilingual status statistics and a chronological index table."""
    counts = statistics(entries)
    labels = (("Total unique puzzles", "独立题目总数"), ("Solved", "已解出"), ("Verified", "已验证"), ("Partial", "部分完成"), ("Researching", "研究中"), ("Not started", "未开始"), ("Blocked", "受阻"), ("Overall completion", "总体完成率"))
    values = [len(entries), counts["solved"], counts["verified"], counts["partial"], counts["researching"], counts["not_started"], counts["blocked"], f"{completion(entries):.1f}%"]
    prefix = "## 自动生成的覆盖情况与索引\n\n" if chinese else "## Generated coverage and index\n\n"
    text = prefix + "\n".join(f"- {cn if chinese else en}: {value}" for (en, cn), value in zip(labels, values)) + "\n"
    by_year: dict[int, list[dict[str, object]]] = defaultdict(list)
    for item in entries:
        by_year[int(item["year"])].append(item)
    for year, items in sorted(by_year.items()):
        text += f"\n### {year}\n\n| {'日期' if chinese else 'Date'} | {'题目' if chinese else 'Puzzle'} | {'状态' if chinese else 'Status'} | English | 中文 | Code | Tests | Official |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n"
        for item in items:
            rel = f"puzzles/{item['year']}/{item['year']}-{item['month_number']:02d}-{item['slug']}"
            text += f"| {item['date']} | {item['title']} | {item['status']} | [EN](./{rel}/README.en.md) | [中文](./{rel}/README.zh-CN.md) | [Python](./{rel}/solution.py) | [Tests](./{rel}/test_solution.py) | [Official]({item['official_url']}) |\n"
    return text


def replace_generated(path: Path, text: str) -> None:
    """Replace only the designated generated section, preserving prose around it."""
    source = path.read_text(encoding="utf-8")
    before, _, tail = source.partition(START)
    _, marker, after = tail.partition(END)
    if not marker:
        raise ValueError(f"missing generated markers in {path}")
    path.write_text(before + START + "\n" + text + END + after, encoding="utf-8")


def main() -> int:
    """Rebuild both indexes."""
    entries = json.loads((ROOT / "data" / "puzzles.json").read_text(encoding="utf-8"))["entries"]
    replace_generated(ROOT / "README.en.md", generated(entries, chinese=False))
    replace_generated(ROOT / "README.zh-CN.md", generated(entries, chinese=True))
    print(f"rebuilt indexes for {len(entries)} puzzles")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
