from validate_bilingual_content import validate


def test_current_bilingual_documents_validate() -> None:
    assert validate() == []
