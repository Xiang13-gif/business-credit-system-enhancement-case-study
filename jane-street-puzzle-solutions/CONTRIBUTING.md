# Contributing

1. Refresh `data/puzzles.json` with `python3 scripts/fetch_archive.py` before beginning a batch.
2. Work on the next chronological unresearched puzzle unless a documented exception applies.
3. Keep `README.md`, `README.en.md`, `README.zh-CN.md`, `metadata.json`, `notes.md`, `solution.py`, and `test_solution.py` in every puzzle folder.
4. Write original summaries and derivations in both languages; do not copy the official statement, images, or solution.
5. Update `metadata.json` and the manifest together. Status is `partial` until both languages, reasoning, implementation where useful, and tests are complete. Use `verified` only with a documented independent check.
6. Add deterministic, focused tests and run `python3 -m pytest`, both validators, the index builder, and link checker.
7. Report mistakes with the puzzle URL, the affected claim, evidence, and a proposed correction when possible.
8. Use focused conventional commits such as `feat(puzzles): add 2022 batch 1 solution` or `fix(solution): correct recurrence`.
9. Pull requests should explain the independent verification method and avoid unrelated refactoring.
