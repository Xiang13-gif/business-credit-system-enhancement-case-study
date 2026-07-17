"""Exact first-return calculation for Andy's Morning Stroll."""

from __future__ import annotations

from collections import defaultdict
from fractions import Fraction

Vertex = tuple[int, int, int]
START: Vertex = (0, 0, 0)


def neighbors(vertex: Vertex) -> tuple[Vertex, Vertex, Vertex]:
    """Return the three neighbours in a coordinate model of the honeycomb graph.

    The first coordinate is the bipartite colour.  A white vertex ``(0, i, j)``
    is connected to three black vertices, and the reverse rules define the same
    undirected graph.
    """
    colour, i, j = vertex
    if colour == 0:
        return ((1, i, j), (1, i - 1, j), (1, i, j - 1))
    if colour == 1:
        return ((0, i, j), (0, i + 1, j), (0, i, j + 1))
    raise ValueError("colour must be 0 or 1")


def first_return_probabilities(max_steps: int) -> dict[int, Fraction]:
    """Return exact probabilities of first return at each step through ``max_steps``.

    States that have returned to the origin are removed immediately, so each
    retained walk has avoided the origin after time zero.  A transition back to
    the origin therefore contributes exactly to a first return.
    """
    if max_steps < 0:
        raise ValueError("max_steps must be non-negative")
    active: dict[Vertex, int] = {START: 1}
    result: dict[int, Fraction] = {}
    for step in range(1, max_steps + 1):
        next_active: defaultdict[Vertex, int] = defaultdict(int)
        hits = 0
        for vertex, count in active.items():
            for destination in neighbors(vertex):
                if destination == START:
                    hits += count
                else:
                    next_active[destination] += count
        active = dict(next_active)
        result[step] = Fraction(hits, 3**step)
    return result


def probability_exceeds_ball_expectation() -> Fraction:
    """Return ``P(T > 20)`` exactly for the infinite-floor walk."""
    return 1 - sum(first_return_probabilities(20).values(), Fraction())


def main() -> None:
    """Print the exact and seven-significant-digit final result."""
    value = probability_exceeds_ball_expectation()
    print(f"P(T > 20) = {value} = {float(value):.7g}")


if __name__ == "__main__":
    main()
