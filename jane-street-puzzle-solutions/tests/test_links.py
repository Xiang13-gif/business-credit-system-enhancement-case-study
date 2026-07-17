from check_links import internal_errors


def test_current_internal_markdown_links_are_valid() -> None:
    assert internal_errors() == []
