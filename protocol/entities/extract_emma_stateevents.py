#!/usr/bin/env python3
"""
Task E (optional Phase 1 proof) — extract Emma's `character.stateEvent` series.

Proves the Phase 1 spine end-to-end against real data, no network:
  1. resolve the name "Emma" -> `char.emma` DETERMINISTICALLY through the
     registry (entities.yaml) — not by guessing,
  2. read the per-chapter frontmatter (`date` + `registers.Emma`) as the
     stateEvent source (per ARCHITECTURE §6.2), and
  3. emit validated `character.stateEvent` records with `createdAt = storyDate`
     (ARCHITECTURE §8), sorted chronologically.

This is a DEMONSTRATION artifact. The real `records/` build tree is deferred
(TASK.md §6 guardrail); output is written under `protocol/entities/proof/`
purely to show the mechanic works.

Usage:  python3 protocol/entities/extract_emma_stateevents.py
"""
import os
import re
import sys
import json
import glob

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
CHAPTERS = os.path.join(ROOT, "stories", "01. The Case of the Missing Hot Sauce", "chapters")
OUT_DIR = os.path.join(HERE, "proof")
OUT_FILE = os.path.join(OUT_DIR, "emma_stateevents.json")

# Reuse the registry parser from the resolver so there is one source of truth.
sys.path.insert(0, HERE)
from resolve import parse_registry, read_frontmatter_lines, unquote  # noqa: E402

VALID_REGISTER = re.compile(r"^(public|private|under-pressure)$")


def resolve_subject(name):
    alias_map, _ = parse_registry(os.path.join(HERE, "entities.yaml"))
    hit = alias_map.get(name.lower())
    if not hit or hit[1] != "character":
        raise SystemExit(f"FATAL: {name!r} does not resolve to a character id in the registry.")
    return hit[0]


def split_register_state(value):
    """
    A registers value looks like:
        "private (curious -> quietly alarmed); Western PA flickers"
        "public -> private (hostess persona softening as the soup lands)"
        "private -> deflating (money math ...)"   # transition target is a mood,
                                                   # not a controlled register
    Returns (register, register_expr, state):
      register      — the CANONICAL leading register (controlled vocab), which
                      is what a reader surface groups/filters on.
      register_expr — the full register expression before '(' as the author
                      wrote it (may be a transition like "private -> deflating"),
                      kept for fidelity.
      state         — the full descriptor line, unchanged (the human-readable
                      one-liner).
    Golden Rule: the prose/frontmatter wins — we canonicalize on read, we do not
    rewrite the source.
    """
    value = value.strip()
    m = re.match(r"^([^(]+?)\s*(\(.*)?$", value)
    register_expr = (m.group(1) if m else value).strip().rstrip(";").strip()
    # leading token before any transition arrow is the canonical register
    register = re.split(r"\s*(?:->|→)\s*", register_expr)[0].strip()
    state = value  # keep the full descriptor as the human-readable state line
    return register, register_expr, state


def validate(rec):
    assert rec["subject"].startswith("char."), rec
    assert re.match(r"^\d{4}-\d{2}-\d{2}$", rec["storyDate"]), rec
    assert rec["createdAt"] == rec["storyDate"], rec
    assert VALID_REGISTER.match(rec["register"]), f"bad register {rec['register']!r} in {rec}"
    assert rec["state"], rec


def main():
    subject = resolve_subject("Emma")
    print(f'Resolved "Emma" -> {subject}  (deterministic, via registry)\n')

    records = []
    for path in sorted(glob.glob(os.path.join(CHAPTERS, "m*.md"))):
        fm = read_frontmatter_lines(path)
        date = None
        chapter = None
        emma_register = None
        in_registers = False
        for line in fm:
            m_top = re.match(r"^(\w+):\s*(.*)$", line)
            if m_top and not line.startswith(" "):
                key, val = m_top.group(1), m_top.group(2).strip()
                in_registers = (key == "registers")
                if key == "date":
                    date = unquote(val)
                elif key == "chapter":
                    chapter = unquote(val)
                continue
            m_reg = re.match(r"^\s+([A-Za-z][\w '\-&]*?):\s+(.*)$", line)
            if m_reg and in_registers and m_reg.group(1).strip() == "Emma":
                emma_register = unquote(m_reg.group(2))
        if emma_register is None:
            continue  # Emma off-page this chapter
        register, register_expr, state = split_register_state(emma_register)
        # Some beats span a range ("2026-10-12 to 2026-10-14"); anchor the
        # stateEvent to the start date (createdAt), keep the span for fidelity.
        dates = re.findall(r"\d{4}-\d{2}-\d{2}", date or "")
        story_date = dates[0] if dates else date
        rec = {
            "type": "character.stateEvent",
            "subject": subject,
            "storyDate": story_date,
            "register": register,
            "state": state,
            "chapterRef": f"book.1#ch{chapter}",
            "sourceFile": os.path.relpath(path, ROOT),
            "createdAt": story_date,
        }
        if register_expr != register:
            rec["registerExpr"] = register_expr  # transition as authored
        if len(dates) > 1:
            rec["storyDateEnd"] = dates[-1]      # multi-day beat
        validate(rec)
        records.append(rec)

    records.sort(key=lambda r: (r["storyDate"], int(re.sub(r"\D", "", r["chapterRef"]))))

    os.makedirs(OUT_DIR, exist_ok=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"Extracted & validated {len(records)} character.stateEvent records for {subject}.")
    print(f"Written to {os.path.relpath(OUT_FILE, ROOT)}\n")
    print("Chronological state trajectory:")
    for r in records:
        print(f"  {r['storyDate']}  {r['chapterRef']:<12} [{r['register']}]  {r['state']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
