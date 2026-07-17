from validate_metadata import validate


def test_current_manifest_and_folders_validate() -> None:
    assert validate() == []
