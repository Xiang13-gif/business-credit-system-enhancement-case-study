#!/usr/bin/env python3
"""Check bilingual structure and cross-language status facts."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EN_SECTIONS = ("Metadata", "Original Problem Summary", "Key Observations", "Hints", "Solution Approach", "Detailed Derivation", "Algorithm or Computational Method", "Complexity", "Implementation", "Verification", "Final Answer", "Assumptions and Limitations", "Official Reference")
ZH_SECTIONS = ("基本资料", "原创题目摘要", "关键观察", "提示", "解题思路", "详细推导", "算法或计算方法", "时间与空间复杂度", "程序实现", "答案验证", "最终答案", "假设与限制", "官方参考链接")


def heading_set(text: str) -> set[str]:
    """Extract level-two Markdown headings."""
    return set(re.findall(r"^##\s+(.+?)\s*$", text, re.MULTILINE))


def final_answer(text: str, heading: str) -> str:
    """Return the paragraph immediately following a final-answer heading."""
    match = re.search(rf"^##\s+{re.escape(heading)}\s*$\n+(.*?)(?=^##\s|\Z)", text, re.MULTILINE | re.DOTALL)
    return match.group(1).strip() if match else ""


def validate() -> list[str]:
    """Return bilingual contract violations for solved and placeholder records."""
    entries = json.loads((ROOT / "data" / "puzzles.json").read_text(encoding="utf-8"))["entries"]
    errors: list[str] = []
    for item in entries:
        folder = ROOT / "puzzles" / str(item["year"]) / f"{item['year']}-{item['month_number']:02d}-{item['slug']}"
        en_path, zh_path = folder / "README.en.md", folder / "README.zh-CN.md"
        if not en_path.is_file() or not zh_path.is_file():
            errors.append(f"{item['title']}: one or both language files are missing")
            continue
        en, zh = en_path.read_text(encoding="utf-8"), zh_path.read_text(encoding="utf-8")
        for section in EN_SECTIONS:
            if section not in heading_set(en):
                errors.append(f"{item['title']}: English section missing: {section}")
        for section in ZH_SECTIONS:
            if section not in heading_set(zh):
                errors.append(f"{item['title']}: Chinese section missing: {section}")
        if item["official_url"] not in en or item["official_url"] not in zh:
            errors.append(f"{item['title']}: official URL is not identical in both language files")
        status = str(item["status"])
        if f"Status: {status}" not in en or f"完成状态：{status}" not in zh:
            errors.append(f"{item['title']}: language status differs from manifest")
        if status in {"solved", "verified"}:
            if "Not yet determined." in final_answer(en, "Final Answer") or "尚未确定。" in final_answer(zh, "最终答案"):
                errors.append(f"{item['title']}: completed status has placeholder final answer")
            if len(final_answer(en, "Final Answer")) < 8 or len(final_answer(zh, "最终答案")) < 4:
                errors.append(f"{item['title']}: completed status needs final answers in both languages")
            if len(final_answer(en, "Detailed Derivation")) < 80 or len(final_answer(zh, "详细推导")) < 40:
                errors.append(f"{item['title']}: completed status lacks detailed derivation")
        if status == "verified" and not item["verification_method"]:
            errors.append(f"{item['title']}: verified status lacks a documented method")
    return errors


def main() -> int:
    errors = validate()
    print("bilingual validation passed" if not errors else "bilingual validation failed:\n- " + "\n- ".join(errors))
    return int(bool(errors))


if __name__ == "__main__":
    sys.exit(main())
