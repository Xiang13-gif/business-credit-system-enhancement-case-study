from archive_utils import archive_rows, canonical_url, manifest_record, sort_records
from fetch_archive import discover_pages, update_manifest


def test_canonical_url_removes_fragments_tracking_and_index() -> None:
    assert canonical_url("/puzzles/example/index.html?utm_source=x#answer") == "https://www.janestreet.com/puzzles/example/"


def test_discover_pages_follows_numbered_pagination() -> None:
    html = '<a href="/puzzles/archive/page2/index.html">2</a><a href="/puzzles/archive/page3/">3</a>'
    assert discover_pages(html) == [
        "https://www.janestreet.com/puzzles/archive/",
        "https://www.janestreet.com/puzzles/archive/page2/",
        "https://www.janestreet.com/puzzles/archive/page3/",
    ]


def test_archive_rows_and_chronological_sorting() -> None:
    html = '<div class="row puzzle-row archive-list"><span class="date">July 2022:</span><span class="name">A &amp; B</span><a class="puzzle-link" href="/puzzles/a/">Puzzle</a></div>'
    row = archive_rows(html, "archive")[0]
    assert row["title"] == "A & B"
    record = manifest_record(row)
    earlier = {**record, "title": "Earlier", "date": "2022-01-01"}
    assert [item["title"] for item in sort_records([record, earlier])] == ["Earlier", "A & B"]


def test_manifest_deduplicates_canonical_urls_and_reports_duplicate() -> None:
    html = '<div class="row puzzle-row archive-list"><span class="date">July 2022:</span><span class="name">Duplicate</span><a class="puzzle-link" href="/puzzles/duplicate/">Puzzle</a></div>'
    payload = update_manifest({"page-one": html, "page-two": html})
    assert payload["total_archive_entries"] == 2
    assert len(payload["entries"]) == 1
    assert len(payload["duplicates"]) == 1
