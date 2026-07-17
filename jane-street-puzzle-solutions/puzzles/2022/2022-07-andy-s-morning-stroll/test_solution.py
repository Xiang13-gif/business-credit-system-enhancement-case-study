from fractions import Fraction
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent))
from solution import START, first_return_probabilities, neighbors, probability_exceeds_ball_expectation


def test_honeycomb_adjacency_is_symmetric_and_cubic() -> None:
    assert len(neighbors(START)) == 3
    assert all(START in neighbors(vertex) for vertex in neighbors(START))


def test_small_first_return_probabilities() -> None:
    probabilities = first_return_probabilities(6)
    assert probabilities[1] == 0
    assert probabilities[2] == Fraction(1, 3)
    assert probabilities[4] == Fraction(2, 27)
    assert probabilities[6] == Fraction(10, 243)


def test_final_exact_probability_and_rounding() -> None:
    answer = probability_exceeds_ball_expectation()
    assert answer == Fraction(173_576_992, 387_420_489)
    assert format(float(answer), ".7g") == "0.4480326"


def test_negative_step_bound_is_rejected() -> None:
    try:
        first_return_probabilities(-1)
    except ValueError as error:
        assert "non-negative" in str(error)
    else:
        raise AssertionError("negative step bound was accepted")
