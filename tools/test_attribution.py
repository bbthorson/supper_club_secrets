#!/usr/bin/env python3
"""
The gate on elevating dialogue attribution out of this project.

`tools/prose_check.py` ports cleanly to Pinakes except for dialogue attribution,
which was held back because it has never run against prose that isn't Book 1's.
Book 1 is a poor test: six principals, every one a single capitalised ASCII
token, no two sharing a prefix, and straight quote marks throughout. Attribution
can be wrong in ways this cast structurally cannot reveal.

There is no second universe with real prose to test against yet, so this is the
substitute: a deliberately hostile fixture that exercises the assumptions
directly. It is not a unit test of current behaviour — several cases below are
expected to FAIL today, and they are written as the specification attribution
must meet before it is called general.

The contract being tested is the one the tool already states about itself: it may
decline, but it must never mislabel. A DECLINE is always an acceptable result. A
WRONG answer is a failure, because a wrong answer puts the wrong register beside
the wrong line and makes the report lie.

    python3 tools/test_attribution.py

Exit code 0 when every case is either correct or a decline; 1 when any case
mislabels.
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from prose_check import attribute, spoken  # noqa: E402


# (name, paragraph, cast, others, expected, gap, why)
#
# `expected` is the only correct attribution, or None where the paragraph is
# genuinely ambiguous and declining is both correct and complete.
#
# `gap` marks a case where the paragraph DOES carry an attributable line that the
# tool cannot currently see at all. Declining there is not a clean decline: it is
# a universe whose dialogue is invisible to this tool. Tracked separately from a
# correct decline so the two are never reported as the same result.
CASES = [
    (
        "ascii-baseline",
        '"I already told you," Emma said, setting down the glass.',
        ["emma", "noah"],
        {},
        "emma",
        False,
        "The case Book 1 is made of. If this breaks, everything does.",
    ),
    (
        "overlapping-prefix",
        '"Fine," Annette said, not looking up.',
        ["anne", "annette"],
        {},
        "annette",
        False,
        "Two principals where one name is a prefix of the other. The scene-cast "
        "filter matches with `c in present.lower()`, so `anne` matches a chapter "
        "whose only present character is Annette — and then `\\bAnne\\b` fails to "
        "match 'Annette', so the paragraph silently declines. Here both are in "
        "cast, so the word-boundary regex must pick Annette alone.",
    ),
    (
        "multi-token-name",
        '"We are not doing that," Mary Beth Okonkwo said.',
        ["mary beth okonkwo", "noah"],
        {},
        "mary beth okonkwo",
        False,
        "A two-word given name. `slug.title()` happens to round-trip here, so "
        "this should pass — it is the control for the next case.",
    ),
    (
        "lowercase-particle-name",
        '"Enough," Jean-Luc van der Berg said, and meant it.',
        ["jean-luc van der berg", "noah"],
        {},
        "jean-luc van der berg",
        True,
        "`str.title()` renders this 'Jean-Luc Van Der Berg', which does not "
        "appear in the prose, so the name never matches. This is the concrete "
        "reason attribution needs the entity registry's resolver rather than "
        "title-casing a slug.",
    ),
    (
        "non-ascii-name",
        '"Later," Zoë Ramírez said from the doorway.',
        ["zoë ramírez", "noah"],
        {},
        "zoë ramírez",
        False,
        "Accented names must round-trip. Python's title() and \\b are "
        "Unicode-aware, so this should pass; it is here so a future port to a "
        "language whose \\w is ASCII-only cannot regress it silently.",
    ),
    (
        "dash-led-dialogue",
        "— I told you already, Emma said, and turned away.",
        ["emma", "noah"],
        {},
        "emma",
        True,
        "Dialogue marked with an em-dash instead of quote marks, the standard in "
        "French, Spanish, Polish and Joycean English. Nothing is quoted, so "
        "nothing is collected and the line is invisible rather than misattributed. "
        "Declining is acceptable; the real cost is silent under-collection, which "
        "the report should disclose rather than this test catch.",
    ),
    (
        "non-cast-speaker",
        'Dorothy smiled — the first warmth Emma had seen from her. "He\'d like that."',
        ["emma"],
        {"Dorothy": "dorothy"},
        None,
        False,
        "The exact Book 1 ch1 defect. Emma is the only principal present, so a "
        "cast-only match hands her a line Dorothy speaks. The registry list is "
        "what makes this decline.",
    ),
    (
        "absent-principal-flashback",
        '"You\'re my anchor," she\'d told him once, early in their marriage. '
        "Oliver had appreciated the sentiment, even as part of him wished he "
        "could be more like Jasper.",
        ["oliver"],
        {"Olivia": "olivia", "Jasper": "jasper"},
        None,
        False,
        "Book 1 ch6. A remembered line from a character who is not on-page. "
        "Only the full registry declines it.",
    ),
    (
        "narration-scare-quote",
        'The apartment was what agents called "charming" and everyone else called "tiny".',
        ["emma"],
        {},
        None,
        False,
        "No speech at all — `spoken()` must return nothing so there is no line to "
        "attribute. Guards the register comparison against narration vocabulary.",
    ),
    (
        "nested-quotation-is-speech",
        '"You can\'t say \'discounted cash flow projection,\'" Oliver said.',
        ["oliver", "noah"],
        {},
        "oliver",
        False,
        "A real line ending on a nested quotation. Must not be mistaken for a "
        "narration-quoted phrase by the trailing-punctuation test.",
    ),
]


def main() -> int:
    wrong: list[tuple[str, str]] = []
    gaps: list[tuple[str, str]] = []
    passed = 0

    print("Hostile attribution fixture\n" + "=" * 72)
    for name, para, cast, others, expected, gap, why in CASES:
        quotes = spoken(para)
        got = attribute(para, cast, others) if quotes else None

        if got == expected:
            status = "PASS"
            passed += 1
        elif got is None and gap:
            # The line exists but the tool cannot see it. Not a lie, not a pass.
            status = "GAP"
            gaps.append((name, why))
        elif got is None:
            # Declining an attributable line is a miss, not a contract breach,
            # but it is still not the specified answer.
            status = "MISS"
            gaps.append((name, why))
        else:
            status = "WRONG"
            wrong.append((name, why))

        print(f"\n[{status:5s}] {name}")
        print(f"        expected: {expected!r}   got: {got!r}")
        if status != "PASS":
            print(f"        {why}")

    print("\n" + "=" * 72)
    print(f"{passed} correct, {len(gaps)} not visible, {len(wrong)} mislabelled")

    if wrong:
        print("\nMISLABELLED — these break the tool's own contract:")
        for n, _ in wrong:
            print(f"  - {n}")
        print("\nAttribution must not be elevated while any case mislabels.")
        return 1

    print(
        "\nNo case mislabels: the conservative design holds even against a cast\n"
        "built to break it. That is the part that was worth verifying — a wrong\n"
        "answer would put the wrong register beside the wrong line."
    )
    if gaps:
        print("\nStill not general. Each of these is prose this tool cannot read:")
        for n, _ in gaps:
            print(f"  - {n}")
        print(
            "\nBoth causes are known and neither is deep:\n"
            "  * Names are matched by title-casing a slug. Resolve them through the\n"
            "    entity registry instead — Pinakes already does this for its lint\n"
            "    rules, so the general form exists and is not being used here.\n"
            "  * The dialogue convention is assumed to be quote marks. It belongs in\n"
            "    configuration alongside the universe's other vocabulary choices."
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
