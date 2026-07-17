# Andy's Morning Stroll — English Solution

## Metadata

- Date: 2022-07-01
- Official puzzle: https://www.janestreet.com/puzzles/andys-morning-stroll-index/
- Status: verified
- Verification status: verified
- Verification method: Exact first-return dynamic programming with rational arithmetic, independently cross-checked against the finite-graph return-time identity and then against the official published decimal.
- Topics: random walk; Markov chains; graph theory; exact enumeration
- Difficulty: advanced
- Implementation language: Python

## Original Problem Summary

An ant makes an equal-probability random walk among the white cells of a soccer-ball-like surface, stopping at its first revisit to its starting cell. It then makes the analogous walk on an infinite planar tiling. The task is to find the chance that the planar first-return time is greater than the finite-surface expected return time. This summary omits the official artwork and full wording.

## Key Observations

The white-cell adjacency graph on the ball is 3-regular with 20 vertices (the dodecahedral graph). For a random walk on any finite undirected graph, the expected first return to vertex `v` is `1 / π(v)`. Regularity makes `π` uniform, hence the ball expectation is 20.

On the floor, the white-cell graph is the infinite honeycomb graph. It is bipartite, so a return is possible only at even times. We need `P(T > 20)`, where `T` is the first return time.

## Hints

<details><summary>Hint 1</summary>

Use the stationary distribution for the finite graph instead of enumerating ball walks.

</details>

<details><summary>Hint 2</summary>

In a dynamic program, discard a path as soon as it returns to the start; the next transition back to the start is then a first return.

</details>

## Solution Approach

Represent a honeycomb vertex by `(colour, i, j)`. A colour-0 vertex has neighbours `(1,i,j)`, `(1,i-1,j)`, and `(1,i,j-1)`; the colour-1 rule is the inverse. Count origin-avoiding walks after each step. Dividing the number that next hit the origin by `3^t` gives `P(T=t)` exactly.

## Detailed Derivation

The ball graph has `V=20` vertices and every vertex has degree 3. Its stationary mass is therefore `π(v)=3/(20·3)=1/20`; the standard recurrence identity gives `E[T]=1/π(v)=20`.

Let `A_t(x)` be the number of length-`t` paths from the origin to `x` that have not returned earlier. Initially `A_0(origin)=1`. For every active path, extend it through each of the three edges. A transition to the origin contributes to `F_t`, the number of first-return paths of length `t`; every other transition is accumulated into `A_t`. Thus `P(T=t)=F_t/3^t`. The nonzero values through time 20 are:

`P(T=2)=1/3`, `P(T=4)=2/27`, `P(T=6)=10/243`, `P(T=8)=20/729`, `P(T=10)=44/2187`, `P(T=12)=2774/177147`, `P(T=14)=6746/531441`, `P(T=16)=50686/4782969`, `P(T=18)=1168210/129140163`, and `P(T=20)=3044234/387420489`.

Subtracting their sum from one yields

`P(T>20) = 173576992 / 387420489 ≈ 0.4480325561718033`.

## Algorithm or Computational Method

`first_return_probabilities` stores only active coordinate states and integer path counts. `Fraction` converts each exact count to a probability; no floating-point decision affects the result.

## Complexity

For a horizon `n`, the explored honeycomb ball has `O(n²)` vertices. Each step scans its active states, so this direct implementation uses `O(n²)` space and `O(n³)` time in the conservative worst-case bound; for `n=20` it is tiny.

## Implementation

Run `python3 solution.py`. It prints both the exact fraction and the seven-significant-digit form.

## Verification

Two independent checks are recorded: (1) the return-time threshold follows from the stationary distribution of the finite 20-vertex regular graph, and (2) an exact-integer DP counts first returns on the infinite graph. After that independent derivation, its displayed decimal was compared with the official published final decimal and agrees. Tests verify the small probabilities `1/3`, `2/27`, and `10/243`, adjacency symmetry, invalid input handling, and the final exact fraction.

## Final Answer

`p = 173576992/387420489 ≈ 0.4480326` (seven significant digits).

## Assumptions and Limitations

The graph model treats the white-cell moves described in the puzzle as the 3-regular dodecahedral and honeycomb adjacency graphs. The final displayed decimal is rounded only at presentation; all calculations prior to it are exact.

## Official Reference

[Jane Street: Andy's Morning Stroll](https://www.janestreet.com/puzzles/andys-morning-stroll-index/)
