#!/usr/bin/env python3
"""
Mechanical prose triage. Free to run, so the expensive judgment read only has
to look where the counts point.

`.claude/skills/story-audit/references/ai_tells.md` already specifies the
method: a mechanical pre-pass feeding a judgment pass, with an SCS allowlist for
the tics that are designed rather than accidental. The only thing missing was a
way to run the mechanical half without spending a full `story-audit`. That is
all this is.

Three reports, each answering a question a regex alone cannot:

  tells    per-chapter counts for the signals the taxonomy lists, with the
           negative-parallelism trap the 2026-09-17 changelog documented kept
           open rather than papered over.
  closers  every chapter's final paragraph in one file. The changelog records
           that the epiphany-button close was the highest-yield Book 1 finding
           AND had zero mechanical signal, because catching it needs all the
           closers read together.
  voice    dialogue per character per chapter, joined to that character's
           register in that chapter and to the voice guide's markers for that
           register. The mood is pre-planned and already compiled; this puts it
           beside the lines the character actually speaks.

Counts are inputs, not verdicts — the taxonomy is explicit about that, and so is
this tool. Nothing here decides whether a number is a problem.

Usage:
    python3 tools/prose_check.py tells [--book book1]
    python3 tools/prose_check.py closers
    python3 tools/prose_check.py voice [--character emma] [--chapter 14]
    python3 tools/prose_check.py all --out .prose/
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STORIES = ROOT / "stories"
VOICE_GUIDE = ROOT / "lore" / "02_character_voice_guide.md"

# ---------------------------------------------------------------- signals

# Verbatim from the taxonomy's mechanical pre-pass. Kept as a list of
# (label, regex, note) so the report can say what each number is and cannot be
# read as a verdict by accident.
SIGNALS = [
    (
        "negative-parallelism",
        r"not (just |merely |only )?[^.]{1,40}[—,] (it'?s|but) ",
        "the corrective form; this is the classified count",
    ),
    (
        "here's-the-kicker",
        r"here'?s (the|where) (the )?(thing|kicker|catch|interesting|deal)|but here'?s",
        "",
    ),
    (
        "corporate-filler",
        r"\b(delve|leverage|unlock|elevate|testament|tapestry|landscape|ecosystem|symphony|realm|navigate the)\b",
        "",
    ),
    (
        "magic-adverbs",
        r"\b(deeply|quietly|fundamentally|remarkably|profoundly|utterly|palpably)\b",
        "see the Oliver carve-out below",
    ),
    (
        "somatic-beats",
        r"\b(jaw|breath|throat|chest|pulse|swallow\w*|exhal\w*)\b",
        "a proxy, not a detector — frequency only matters if the SAME beat repeats",
    ),
]

# The trap the changelog names. A bare grep for sentence-initial "Not " sweeps in
# participials ("Not wanting to hear Jasper argue"), conditionals ("Not unless
# you had a plan") and dialogue punchlines ("Not after the 2nd Avenue Debacle"),
# which is how a real count of ~31 got reported as 42. It is counted separately,
# labelled unclassified, and never added to the signal above.
BARE_NOT = re.compile(r"(?:^|(?<=[.!?]\s))Not\s+\w", re.MULTILINE)

# Frontmatter `registers:` is per character per chapter — the pre-planned mood.
REGISTER_ORDER = ["public", "private", "under-pressure"]


def _find_book(book: str) -> Path:
    """`book1` -> the story directory whose leading number is 1."""
    n = re.sub(r"\D", "", book) or "1"
    for d in sorted(STORIES.iterdir()):
        if d.is_dir() and not d.name.startswith(("_", ".")):
            m = re.match(r"^0*(\d+)", d.name)
            if m and m.group(1) == n:
                return d
    sys.exit(f"No story directory found for '{book}'.")


def _frontmatter(text: str) -> tuple[dict, str]:
    """Minimal YAML-ish frontmatter reader. Only the flat scalars and the
    `registers:` block are needed, so this avoids a yaml dependency and keeps
    the tool runnable with nothing installed."""
    if not text.startswith("---"):
        return {}, text
    end = text.find("\n---", 3)
    if end == -1:
        return {}, text
    head, body = text[3:end], text[end + 4 :]
    data: dict = {}
    section = None
    for line in head.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if re.match(r"^\s+", line) and section:
            m = re.match(r"^\s*-\s*(.+)$", line)
            if m:
                # A list item. The first one decides the shape of the key.
                if not isinstance(data.get(section), list):
                    data[section] = []
                data[section].append(m.group(1).strip().strip("\"'"))
                continue
            m = re.match(r"^\s+([\w'\- ]+):\s*(.*)$", line)
            if m:
                if not isinstance(data.get(section), dict):
                    data[section] = {}
                data[section][m.group(1).strip()] = m.group(2).strip().strip("\"'")
            continue
        m = re.match(r"^([\w_]+):\s*(.*)$", line)
        if m:
            key, val = m.group(1), m.group(2).strip()
            if val == "":
                section = key
                data[key] = {}
            else:
                section = None
                data[key] = val.strip("\"'")
    return data, body.strip()


def load_chapters(book_dir: Path) -> list[dict]:
    out = []
    for f in sorted((book_dir / "chapters").glob("*.md")):
        if f.name.startswith("00_"):
            continue
        fm, body = _frontmatter(f.read_text(encoding="utf-8"))
        try:
            num = int(str(fm.get("chapter", "0")))
        except ValueError:
            num = 0
        out.append(
            {
                "num": num,
                "title": fm.get("title", f.stem),
                "file": f.relative_to(ROOT).as_posix(),
                "registers": fm.get("registers", {}) if isinstance(fm.get("registers"), dict) else {},
                "present": fm.get("characters_present", []) if isinstance(fm.get("characters_present"), list) else [],
                "body": body,
            }
        )
    return sorted(out, key=lambda c: c["num"])


# ---------------------------------------------------------------- tells

def report_tells(chapters: list[dict]) -> str:
    lines = [
        "# Mechanical pre-pass",
        "",
        "Counts are **inputs, not verdicts** (`ai_tells.md` §mechanical pre-pass).",
        "The judgment pass decides which are genre-legitimate and which are fingerprints.",
        "",
        "| Ch | Words | em-dash /1k | neg-par | kicker | filler | adverbs | somatic |",
        "| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ]
    totals: dict[str, int] = defaultdict(int)
    total_words = 0
    flagged: list[str] = []

    for ch in chapters:
        body = ch["body"]
        words = len(re.findall(r"\b\w+\b", body))
        total_words += words
        em = body.count("—")
        em_density = round(em * 1000 / words, 1) if words else 0.0
        totals["em"] += em

        counts = {}
        for label, pattern, _ in SIGNALS:
            n = len(re.findall(pattern, body, re.IGNORECASE))
            counts[label] = n
            totals[label] += n

        row = [
            ch["num"],
            words,
            em_density,
            counts["negative-parallelism"],
            counts["here's-the-kicker"],
            counts["corporate-filler"],
            counts["magic-adverbs"],
            counts["somatic-beats"],
        ]
        lines.append("| " + " | ".join(str(v) for v in row) + " |")
        if counts["corporate-filler"] or counts["here's-the-kicker"]:
            flagged.append(f"Ch {ch['num']}")

    lines += [
        "",
        f"**Book totals** — {total_words} words. "
        + ", ".join(f"{k}: {totals[k]}" for k, _, _ in SIGNALS)
        + f", em-dash: {totals['em']} ({round(totals['em']*1000/total_words,1)}/1k).",
        "",
    ]
    # Hard signals are rare enough to quote in full. A bare count invites the
    # wrong call in both directions: Book 1's only `leverage` is inside Noah's
    # catalogued jargon-for-laughs register, which is designed voice and not a
    # tell at all. Showing the line settles that in two seconds; a number in a
    # table does not.
    hard = []
    for ch in chapters:
        for label, pattern, _ in SIGNALS:
            if label not in ("corporate-filler", "here's-the-kicker"):
                continue
            for m in re.finditer(pattern, ch["body"], re.IGNORECASE):
                a, b = max(0, m.start() - 90), min(len(ch["body"]), m.end() + 90)
                snippet = " ".join(ch["body"][a:b].split())
                hard.append(f"- **Ch {ch['num']}** `{label}` — …{snippet}…")
    lines += ["## Hard-signal hits, verbatim", ""]
    lines += hard if hard else ["_None._"]
    lines.append("")

    # The classification trap, kept visible rather than folded into a number.
    bare = sum(len(BARE_NOT.findall(c["body"])) for c in chapters)
    classified = totals["negative-parallelism"]
    lines += [
        "## Negative parallelism: the counting note",
        "",
        f"- **{classified}** matches of the corrective form (`not X — it's Y`). This is the count that means something.",
        f"- **{bare}** sentence-initial `Not …` overall. This is **unclassified** and is not a tell count.",
        "",
        "The 2026-09-17 changelog records a pass that reported 42 → 34 from a bare",
        "`Not ` grep and was wrong: it swept in participials, conditionals and dialogue",
        "punchlines, and the true figure was ~31 → ~27. The two numbers are kept apart",
        "here so that mistake cannot be repeated by reading one as the other.",
        "",
        "## Carve-outs the taxonomy requires",
        "",
        "- **`quietly`** — Oliver's catalogued register. Occurrences in paragraphs naming Oliver are listed below; subtract them before judging the adverb count.",
        "- **Somatic beats** — presence is mandated by the sensory-first style. Only a *repeated specific* beat is a tell. The column counts the family, not the offence.",
        "",
    ]

    oliver_quietly = 0
    for ch in chapters:
        for para in re.split(r"\n\s*\n", ch["body"]):
            if "quietly" in para.lower() and "Oliver" in para:
                oliver_quietly += 1
    lines.append(f"`quietly` in Oliver-naming paragraphs: **{oliver_quietly}**.")
    lines.append("")

    # Repeated-construction scan: the taxonomy calls this a worthwhile optional
    # extension and notes no fixed regex predicts it. Distinctive 6-grams that
    # recur across different chapters are the mechanical shadow of it.
    seen: dict[str, set[int]] = defaultdict(set)
    for ch in chapters:
        words = re.findall(r"[a-z']+", ch["body"].lower())
        for i in range(len(words) - 5):
            seen[" ".join(words[i : i + 6])].add(ch["num"])
    repeats = sorted(
        ((g, chs) for g, chs in seen.items() if len(chs) > 1),
        key=lambda kv: (-len(kv[1]), kv[0]),
    )[:15]
    lines += ["## Repeated six-word constructions across chapters", ""]
    if repeats:
        for gram, chs in repeats:
            lines.append(f"- `{gram}` — ch {', '.join(str(c) for c in sorted(chs))}")
    else:
        lines.append("_None._")
    lines.append("")
    return "\n".join(lines)


# ---------------------------------------------------------------- closers

def report_closers(chapters: list[dict]) -> str:
    lines = [
        "# Chapter closers",
        "",
        "Every chapter's final paragraph, together. The taxonomy flags the",
        "epiphany-button close as this genre's most likely symmetry tell, notes it has",
        "**zero mechanical signal**, and records it as the highest-yield Book 1 finding.",
        "It can only be caught by reading all of these in one sitting.",
        "",
        "`SHORT` marks a final paragraph under 12 words — the cheap proxy. A run of them",
        "is the tell; one is just an ending.",
        "",
        "@@SUMMARY@@",
        "",
    ]
    short = 0
    for ch in chapters:
        paras = [p.strip() for p in re.split(r"\n\s*\n", ch["body"]) if p.strip()]
        last = paras[-1] if paras else ""
        n = len(re.findall(r"\b\w+\b", last))
        tag = " `SHORT`" if n < 12 else ""
        if n < 12:
            short += 1
        lines += [f"### Ch {ch['num']} — {ch['title']} ({n} words){tag}", "", f"> {last}", ""]
    return "\n".join(lines).replace(
        "@@SUMMARY@@",
        f"**{short} of {len(chapters)}** chapters close on a sub-12-word paragraph.",
    )


# ---------------------------------------------------------------- voice

DIALOGUE = re.compile(r"[“\"]([^“”\"]{2,})[”\"]")


def load_registers(book: str) -> dict[tuple[int, str], dict]:
    """(chapter, character-slug) -> the compiled state event.

    The mood is already pre-planned and compiled: `registers:` frontmatter is
    extracted into `character_state_events.json` with the name resolved to a
    canonical id. Reading the records rather than the frontmatter means this
    agrees with every other surface by construction.
    """
    path = ROOT / "records" / book / "character_state_events.json"
    if not path.exists():
        return {}
    out = {}
    for e in json.loads(path.read_text(encoding="utf-8")):
        m = re.search(r"#ch(\d+)", e.get("chapterRef", ""))
        if not m:
            continue
        out[(int(m.group(1)), e["subject"].split(".", 1)[1])] = e
    return out


def load_voice_guide() -> dict[str, dict[str, str]]:
    """character slug -> {register -> the guide's markers for it}."""
    if not VOICE_GUIDE.exists():
        return {}
    text = VOICE_GUIDE.read_text(encoding="utf-8")
    guide: dict[str, dict[str, str]] = {}
    for block in re.split(r"\n## ", text)[1:]:
        name = block.splitlines()[0].strip().lower()
        m = re.search(r"### Three Registers\n(.*?)(?=\n### |\Z)", block, re.S)
        if not m:
            continue
        registers: dict[str, str] = {}
        for sub in re.split(r"\n\*\*", m.group(1)):
            sub = sub.strip()
            if not sub:
                continue
            head = sub.splitlines()[0]
            key = head.lower().replace("**", "")
            for canon in REGISTER_ORDER:
                if canon.replace("-", " ") in key:
                    registers[canon] = sub.split("\n", 1)[1].strip() if "\n" in sub else ""
                    break
        if registers:
            guide[name] = registers
    return guide


def attribute(paragraph: str, cast: list[str]) -> str | None:
    """Name the speaker when exactly one cast member is named outside the quotes.

    Deliberately conservative. Ambiguous lines are better left unattributed and
    read blind — an unattributed pile is itself the voice-differentiation test —
    than confidently mislabelled, which would put the wrong register beside the
    wrong line and make the report lie.
    """
    outside = DIALOGUE.sub(" ", paragraph)
    hits = {c for c in cast if re.search(rf"\b{re.escape(c.title())}\b", outside)}
    return hits.pop() if len(hits) == 1 else None


def report_voice(book: str, chapters: list[dict], only_char=None, only_ch=None) -> str:
    registers = load_registers(book)
    guide = load_voice_guide()
    cast = sorted(guide) or ["emma", "elijah", "noah", "oliver", "olivia", "jasper"]

    lines = [
        "# Voice against pre-planned mood",
        "",
        "Each character's dialogue in a chapter, beside **the register the records say",
        "they are in for that chapter** and the voice guide's markers for that register.",
        "",
        "The mood is not inferred here. It is `registers:` frontmatter, compiled into",
        "`character_state_events.json`, which is the same source every other surface",
        "reads. The question this answers: *do the lines sound like that register?*",
        "",
        "Attribution is conservative — a line is attributed only when exactly one cast",
        "member is named outside the quotes. Unattributed lines are collected per chapter",
        "and are worth reading blind: if you cannot tell who is speaking without the tag,",
        "the voices are not differentiated, which is the finding.",
        "",
        "@@SUMMARY@@",
        "",
    ]

    attributed = unattributed = 0
    for ch in chapters:
        if only_ch and ch["num"] != only_ch:
            continue
        # Attribution is scoped to `characters_present`. Without this, a
        # character merely *referenced* in a chapter collects lines they never
        # spoke: Book 1 ch21 names Noah in the narration while he is two hundred
        # miles away, and a whole-cast match handed him Jasper's dialogue.
        scene_cast = [c for c in cast if any(c in p.lower() for p in ch["present"])] or (
            [] if ch["present"] else cast
        )
        by_char: dict[str, list[str]] = defaultdict(list)
        loose: list[str] = []
        for para in re.split(r"\n\s*\n", ch["body"]):
            quotes = DIALOGUE.findall(para)
            if not quotes:
                continue
            who = attribute(para, scene_cast)
            for q in quotes:
                if who:
                    by_char[who].append(q.strip())
                else:
                    loose.append(q.strip())

        speakers = [c for c in cast if by_char.get(c)]
        if only_char:
            speakers = [c for c in speakers if c == only_char]
        if not speakers and not (loose and not only_char):
            continue

        lines.append(f"## Ch {ch['num']} — {ch['title']}")
        lines.append("")
        for c in speakers:
            ev = registers.get((ch["num"], c))
            reg = ev["register"] if ev else None
            state = ev.get("state", "") if ev else ""
            attributed += len(by_char[c])
            lines.append(f"### {c.title()} — register: `{reg or 'none recorded'}`")
            if state:
                lines.append(f"*Planned:* {state}")
            markers = guide.get(c, {}).get(reg or "", "")
            if markers:
                lines.append("")
                lines.append("*Guide says this register sounds like:*")
                for ln in markers.splitlines():
                    if ln.strip().startswith("-") or ln.strip().startswith("*"):
                        lines.append(f"  {ln.strip()}")
            lines.append("")
            for q in by_char[c]:
                lines.append(f"- “{q}”")
            lines.append("")
        if loose and not only_char:
            unattributed += len(loose)
            lines.append(f"### Unattributed ({len(loose)}) — read blind")
            lines.append("")
            for q in loose:
                lines.append(f"- “{q}”")
            lines.append("")

    total = attributed + unattributed
    rate = round(attributed * 100 / total) if total else 0
    return "\n".join(lines).replace(
        "@@SUMMARY@@",
        f"**{attributed} of {total} lines attributed ({rate}%).** "
        "A low rate is a property of the prose, not a bug in the tool: "
        "feed-POV writing often carries the speaker in the surrounding beat.",
    )


# ---------------------------------------------------------------- cli

def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("report", choices=["tells", "closers", "voice", "all"])
    ap.add_argument("--book", default="book1")
    ap.add_argument("--character")
    ap.add_argument("--chapter", type=int)
    ap.add_argument("--out", help="write markdown files into this directory instead of stdout")
    args = ap.parse_args()

    chapters = load_chapters(_find_book(args.book))
    if not chapters:
        sys.exit("No chapters found.")

    wanted = ["tells", "closers", "voice"] if args.report == "all" else [args.report]
    produced = {}
    for name in wanted:
        if name == "tells":
            produced[name] = report_tells(chapters)
        elif name == "closers":
            produced[name] = report_closers(chapters)
        else:
            produced[name] = report_voice(args.book, chapters, args.character, args.chapter)

    if args.out:
        out = Path(args.out)
        out.mkdir(parents=True, exist_ok=True)
        for name, body in produced.items():
            (out / f"{name}.md").write_text(body + "\n", encoding="utf-8")
            print(f"wrote {out / (name + '.md')}")
    else:
        print("\n\n".join(produced.values()))


if __name__ == "__main__":
    main()
