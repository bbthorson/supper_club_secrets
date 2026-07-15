#!/usr/bin/env python3
"""
Phase 2 — full record extraction for Book 1 (Protocol Phase 2).

Re-runnable, read-only pipeline. Reads finalized prose/tracking + the entity
registry and emits validated record instances under `protocol/records/book1/`.
Every reference (scene participants, place refs, stateEvent subjects, custody
holders) is resolved DETERMINISTICALLY through `protocol/entities/entities.yaml`
— an unresolved reference FAILS the build. No network.

Records emitted (see ARCHITECTURE.md §6):
  scene                 — one per chapter (date, place, participants, pov, event)
  character.stateEvent  — per character per chapter, from `registers` frontmatter
  place                 — from canon location files + known schedule rules
  character.profile     — structured, reader-safe facts only (not prose)
  item + custodyEvent    — the heritage bottle and its Ch1→17→25 custody chain

`records/` is disposable build output; `entities/` + `lexicons/` are source.

Usage:  python3 protocol/pipeline/extract.py
Exit 0 on a clean, fully-resolved build; exit 1 on any validation failure.
"""
import os
import re
import sys
import json
import glob

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
ENTITIES = os.path.join(ROOT, "protocol", "entities")
STORY = os.path.join(ROOT, "stories", "01. The Case of the Missing Hot Sauce")
CHAPTERS = os.path.join(STORY, "chapters")
LOCATIONS = os.path.join(ROOT, "canon library", "locations")
CHAR_DIRS = [os.path.join(ROOT, "canon library", "characters"),
             os.path.join(ROOT, "canon library", "antagonists"),
             os.path.join(STORY, "characters")]
OUT = os.path.join(ROOT, "protocol", "records", "book1")

NS = "site.supperclub"  # placeholder NSID root, pending ARCHITECTURE §12.1

# Reuse the Phase 1 registry + frontmatter parsers (one source of truth).
sys.path.insert(0, ENTITIES)
from resolve import (  # noqa: E402
    parse_registry, parse_non_entities, read_frontmatter_lines, unquote, normalize,
)

VALID_REGISTER = re.compile(r"^(public|private|under-pressure)$")
ERRORS = []


def err(msg):
    ERRORS.append(msg)


# --------------------------------------------------------------------------
# Registry-backed resolution
# --------------------------------------------------------------------------
ALIAS_MAP, ENTRIES = parse_registry(os.path.join(ENTITIES, "entities.yaml"))
NE_EXACT, NE_PREFIXES = parse_non_entities(os.path.join(ENTITIES, "non_entities.yaml"))
DISPLAY = {e["id"]: e.get("displayName", e["id"]) for e in ENTRIES}


def is_non_entity(name):
    low = name.lower()
    return low in NE_EXACT or any(low.startswith(p) for p in NE_PREFIXES)


def resolve(name, want_type, ctx):
    """Resolve a raw frontmatter/prose name to a registry id, or None.

    Returns (id | None, status) where status is 'resolved', 'non-entity', or
    'MISS'. A MISS is recorded as a build error via the caller.
    """
    nm = normalize(name)
    if not nm:
        return None, "empty"
    hit = ALIAS_MAP.get(nm.lower())
    if hit and (want_type is None or hit[1] == want_type):
        return hit[0], "resolved"
    if is_non_entity(nm):
        return None, "non-entity"
    err(f"UNRESOLVED {want_type or 'any'} ref {nm!r} ({ctx})")
    return None, "MISS"


# --------------------------------------------------------------------------
# Chapter frontmatter (fuller than resolve.py's extract_names)
# --------------------------------------------------------------------------
def parse_chapter_fm(path):
    fm = read_frontmatter_lines(path)
    data = {"location": [], "characters_present": [], "characters_referenced": [],
            "registers": {}, "pov": None, "chapter": None, "date": None,
            "title": None, "meal": None, "beat": None}
    cur = None
    in_registers = False
    for line in fm:
        m_top = re.match(r"^(\w+):\s*(.*)$", line)
        if m_top and not line.startswith(" "):
            key, val = m_top.group(1), m_top.group(2).strip()
            cur = key
            in_registers = (key == "registers")
            if key in ("pov", "chapter", "date", "title", "meal", "beat") and val:
                data[key] = unquote(val)
            continue
        m_list = re.match(r"^\s+-\s+(.*)$", line)
        if m_list and cur in ("location", "characters_present", "characters_referenced"):
            data[cur].append(unquote(m_list.group(1)))
            continue
        m_reg = re.match(r"^\s+([A-Za-z][\w '\-&]*?):\s+(.*)$", line)
        if m_reg and in_registers:
            data["registers"][m_reg.group(1).strip()] = unquote(m_reg.group(2))
    return data


def dates_of(date_str):
    return re.findall(r"\d{4}-\d{2}-\d{2}", date_str or "")


def chapter_ref(num):
    return f"book.1#ch{num}"


# --------------------------------------------------------------------------
# timeline_ledger.md — primaryEvent / simultaneous threads keyed by chapter
# --------------------------------------------------------------------------
def parse_ledger():
    path = os.path.join(STORY, "tracking", "timeline_ledger.md")
    by_chapter = {}  # int -> {"primaryEvent": [...], "simultaneous": [...]}
    in_table = False
    with open(path, encoding="utf-8") as f:
        lines = f.read().splitlines()
    for line in lines:
        if line.startswith("| Date (2026)"):
            in_table = True
            continue
        if in_table:
            if not line.startswith("|"):
                break
            if set(line.strip()) <= set("|- "):
                continue
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if len(cells) < 5:
                continue
            _, _, chap_cell, primary, simo = cells[0], cells[1], cells[2], cells[3], cells[4]
            nums = [int(n) for n in re.findall(r"Ch(\d+)", chap_cell)]
            # a range like "Ch1–Ch5" -> expand
            rng = re.search(r"Ch(\d+)[–-]Ch(\d+)", chap_cell)
            if rng:
                nums = list(range(int(rng.group(1)), int(rng.group(2)) + 1))
            for n in nums:
                d = by_chapter.setdefault(n, {"primaryEvent": [], "simultaneous": []})
                clean_primary = re.sub(r"\s+", " ", primary).strip()
                if clean_primary and clean_primary not in d["primaryEvent"]:
                    d["primaryEvent"].append(clean_primary)
                clean_sim = re.sub(r"\s+", " ", simo).strip()
                if clean_sim and clean_sim not in d["simultaneous"]:
                    d["simultaneous"].append(clean_sim)
    return by_chapter


# --------------------------------------------------------------------------
# Extractors
# --------------------------------------------------------------------------
def extract_scenes():
    ledger = parse_ledger()
    scenes = []
    for path in sorted(glob.glob(os.path.join(CHAPTERS, "m*.md"))):
        fm = parse_chapter_fm(path)
        num = fm["chapter"]
        if not num:
            continue
        num = int(num)
        ds = dates_of(fm["date"])
        rel = os.path.relpath(path, ROOT)
        # places — registered locations resolve to ids; one-off settings
        # (road stops, "Distributed …" montage) are kept verbatim as placeText.
        place_refs = []
        place_text = []
        for loc in fm["location"]:
            rid, status = resolve(loc, "place", f"{rel} location")
            if rid and rid not in place_refs:
                place_refs.append(rid)
            elif status == "non-entity":
                pt = normalize(loc)
                if pt and pt not in place_text:
                    place_text.append(pt)
        # participants (present) + referenced, resolved to character ids
        def resolve_people(values, field):
            out = []
            for v in values:
                rid, status = resolve(v, "character", f"{rel} {field}")
                if rid and rid not in out:
                    out.append(rid)
            return out
        participants = resolve_people(fm["characters_present"], "characters_present")
        referenced = resolve_people(fm["characters_referenced"], "characters_referenced")
        pov_id = None
        if fm["pov"]:
            pov_id, _ = resolve(fm["pov"], "character", f"{rel} pov")
        led = ledger.get(num, {})
        rec = {
            "$type": f"{NS}.scene",
            "id": f"scene.book1.ch{num}",
            "storyDate": ds[0] if ds else fm["date"],
            "chapterRefs": [chapter_ref(num)],
            "title": fm["title"],
            "meal": int(fm["meal"]) if fm["meal"] and fm["meal"].isdigit() else fm["meal"],
            "beat": fm["beat"],
            "placeRefs": place_refs,
            "placeText": place_text or None,
            "pov": pov_id,
            "participants": participants,
            "referenced": referenced,
            "primaryEvent": " / ".join(led.get("primaryEvent", [])) or None,
            "simultaneousThreads": [s for s in led.get("simultaneous", []) if s] or None,
            "createdAt": ds[0] if ds else fm["date"],
            "sourceFile": rel,
        }
        if len(ds) > 1:
            rec["storyDateEnd"] = ds[-1]
        scenes.append(rec)
    return scenes


def split_register(value):
    value = value.strip()
    m = re.match(r"^([^(]+?)\s*(\(.*)?$", value)
    expr = (m.group(1) if m else value).strip().rstrip(";").strip()
    register = re.split(r"\s*(?:->|→)\s*", expr)[0].strip()
    return register, expr


def extract_state_events():
    events = []
    for path in sorted(glob.glob(os.path.join(CHAPTERS, "m*.md"))):
        fm = parse_chapter_fm(path)
        num = fm["chapter"]
        if not num:
            continue
        num = int(num)
        ds = dates_of(fm["date"])
        story_date = ds[0] if ds else fm["date"]
        rel = os.path.relpath(path, ROOT)
        for name, value in fm["registers"].items():
            subject, status = resolve(name, "character", f"{rel} registers")
            if not subject:
                if status == "non-entity":
                    continue  # a one-off register key (e.g. Murph) — expected
                continue
            register, expr = split_register(value)
            if not VALID_REGISTER.match(register):
                err(f"BAD register {register!r} for {subject} ({rel})")
            rec = {
                "$type": f"{NS}.character.stateEvent",
                "id": f"stateEvent.{subject.split('.',1)[1]}.book1.ch{num}",
                "subject": subject,
                "storyDate": story_date,
                "register": register,
                "state": value,
                "chapterRef": chapter_ref(num),
                "sceneRef": f"scene.book1.ch{num}",
                "createdAt": story_date,
                "sourceFile": rel,
            }
            if expr != register:
                rec["registerExpr"] = expr
            if len(ds) > 1:
                rec["storyDateEnd"] = ds[-1]
            events.append(rec)
    events.sort(key=lambda r: (r["subject"], r["storyDate"], r["chapterRef"]))
    return events


# Known operating-constraint schedules (from locations/index.md canon rules).
SCHEDULES = {
    "place.mcgolrick-market": {"days": ["Sunday"], "hours": "09:00–14:00", "note": "Sunday only, year-round"},
    "place.mccarren-market": {"days": ["Saturday"], "hours": "morning–early afternoon", "note": "Saturday only"},
}
NEIGHBORHOOD_TAGS = {"brooklyn", "williamsburg", "greenpoint", "chelsea", "manhattan",
                     "clinton-hill", "bed-stuy", "pennsylvania"}


def parse_location_fm(path):
    fm = read_frontmatter_lines(path)
    data = {"id": None, "title": None, "status": None, "first_appearance": None, "tags": []}
    for line in fm:
        m = re.match(r"^(\w+):\s*(.*)$", line)
        if m:
            k, v = m.group(1), m.group(2).strip()
            if k == "tags":
                data["tags"] = [t.strip() for t in v.strip("[]").split(",") if t.strip()]
            elif k in data:
                data[k] = unquote(v)
    return data


def extract_places():
    places = []
    for path in sorted(glob.glob(os.path.join(LOCATIONS, "*.md"))):
        fm = parse_location_fm(path)
        pid = fm["id"]
        if not pid or not pid.startswith("place."):
            continue
        rel = os.path.relpath(path, ROOT)
        neighborhood = next((t for t in fm["tags"] if t in NEIGHBORHOOD_TAGS), None)
        rec = {
            "$type": f"{NS}.place",
            "id": pid,
            "name": fm["title"],
            "status": fm["status"],
            "neighborhood": neighborhood,
            "firstAppearance": fm["first_appearance"],
            "schedule": SCHEDULES.get(pid),
            "sourceFile": rel,
        }
        places.append(rec)
    # sanity: every registry place has a file/record
    reg_places = {e["id"] for e in ENTRIES if e.get("type") == "place"}
    got = {p["id"] for p in places}
    for missing in reg_places - got:
        err(f"registry place {missing} has no location record")
    return places


def first_heading_oneline(path):
    """Return the '## Overview' line's following text as the one-line summary."""
    with open(path, encoding="utf-8") as f:
        lines = f.read().splitlines()
    for i, l in enumerate(lines):
        if l.strip().lower() == "## overview":
            for j in range(i + 1, min(i + 6, len(lines))):
                t = lines[j].strip().lstrip("*").strip()
                t = re.sub(r"^\*|\*$", "", t).strip()
                if t:
                    return t
    return None


CHAR_FILE_BY_ID = {
    "char.emma": "canon library/characters/emma.md",
    "char.elijah": "canon library/characters/elijah.md",
    "char.noah": "canon library/characters/noah.md",
    "char.oliver": "canon library/characters/oliver.md",
    "char.olivia": "canon library/characters/olivia.md",
    "char.jasper": "canon library/characters/jasper.md",
    "char.garrett-pike": "canon library/antagonists/book1_garrett_pike.md",
}


def char_reader_fields(path):
    """Reader-safe curated fields from a character file's frontmatter
    (personaPublic, keyContradiction). Authored, not derived — the curation the
    lexicon reserved slots for (ARCHITECTURE.md §6.1). Absent → None."""
    data = {"handle": None, "personaPublic": None, "keyContradiction": None}
    for line in read_frontmatter_lines(path):
        m = re.match(r"^(\w+):\s*(.*)$", line)
        if m and m.group(1) in data:
            v = unquote(m.group(2).strip())
            data[m.group(1)] = v or None
    return data


def extract_profiles():
    profiles = []
    for cid, rel in CHAR_FILE_BY_ID.items():
        path = os.path.join(ROOT, rel)
        one = first_heading_oneline(path)
        reader = char_reader_fields(path)
        rec = {
            "$type": f"{NS}.character.profile",
            "id": f"profile.{cid.split('.',1)[1]}",
            "subject": cid,
            "displayName": DISPLAY.get(cid, cid),
            "handle": reader["handle"],
            "oneLine": one,
            # curated reader-safe persona (frontmatter); antagonist file carries
            # none, so these stay null there.
            "personaPublic": reader["personaPublic"],
            "keyContradiction": reader["keyContradiction"],
            "sourceFile": rel,
        }
        profiles.append(rec)
    return profiles


def extract_item_and_custody():
    """The heritage bottle and its custody chain, from subplot_threads.md
    → 'Jasper's bottle'. Hand-encoded from the cited table (small, canon-
    critical set); every holder is resolved through the registry."""
    item = {
        "$type": f"{NS}.item",
        "id": "item.heritage-bottle",
        "displayName": DISPLAY.get("item.heritage-bottle", "Heritage Hot Sauce Bottle"),
        "firstAppearance": chapter_ref(1),
        "sourceFile": "stories/01. The Case of the Missing Hot Sauce/tracking/subplot_threads.md",
    }
    # (storyDate, holder-name, chapter, event) — names resolved below
    chain = [
        ("2026-10-04", "Emma", 1, "Dorothy gives Emma the bottle 'just in case'."),
        ("2026-10-15", "Jasper", 17, "Jasper palms the bottle from Emma's counter on his way to PA."),
        ("2026-10-25", "Emma", 25, "Jasper returns the bottle to Emma; it goes back on the counter."),
    ]
    events = []
    prev = None
    for date, holder_name, ch, event in chain:
        holder, _ = resolve(holder_name, "character", f"custodyEvent ch{ch}")
        rec = {
            "$type": f"{NS}.custodyEvent",
            "id": f"custodyEvent.heritage-bottle.ch{ch}",
            "item": "item.heritage-bottle",
            "storyDate": date,
            "holder": holder,
            "fromHolder": prev,
            "chapterRef": chapter_ref(ch),
            "event": event,
            "createdAt": date,
        }
        events.append(rec)
        prev = holder
    return item, events


# --------------------------------------------------------------------------
# Validation + write
# --------------------------------------------------------------------------
def validate_common(rec):
    for k in ("storyDate", "createdAt"):
        if k in rec and rec[k] and not re.match(r"^\d{4}-\d{2}-\d{2}$", str(rec[k])):
            err(f"{rec.get('id')}: bad {k} {rec[k]!r}")
    if "createdAt" in rec and "storyDate" in rec and rec["createdAt"] != rec["storyDate"]:
        err(f"{rec.get('id')}: createdAt != storyDate")


LEXICONS = os.path.join(ROOT, "protocol", "lexicons")


def _type_ok(val, types):
    if isinstance(types, str):
        types = [types]
    for t in types:
        if t == "null" and val is None:
            return True
        if t == "string" and isinstance(val, str):
            return True
        if t == "integer" and isinstance(val, int) and not isinstance(val, bool):
            return True
        if t == "array" and isinstance(val, list):
            return True
        if t == "object" and isinstance(val, dict):
            return True
    return False


def check_schema(rec, schema, label):
    """Recursive JSON-Schema check: required, const, enum, type, pattern,
    additionalProperties:false, plus nested objects and array items. Enough for
    the lexicons in this repo — no external dependency."""
    def validate(v, s, path):
        if "const" in s and v != s["const"]:
            err(f"[{label}] {path}: must be {s['const']!r}")
        if "enum" in s and v not in s["enum"]:
            err(f"[{label}] {path}: {v!r} not in {s['enum']}")
        if "type" in s and not _type_ok(v, s["type"]):
            err(f"[{label}] {path}: {v!r} wrong type (want {s['type']})")
        if "pattern" in s and isinstance(v, str) and not re.search(s["pattern"], v):
            err(f"[{label}] {path}: {v!r} fails pattern {s['pattern']}")
        if isinstance(v, dict) and "properties" in s:
            props = s["properties"]
            for req in s.get("required", []):
                if req not in v:
                    err(f"[{label}] {path}: missing required field {req!r}")
            if s.get("additionalProperties") is False:
                for k in v:
                    if k not in props:
                        err(f"[{label}] {path}: unexpected field {k!r}")
            for k, sub in v.items():
                if k in props:
                    validate(sub, props[k], f"{path}.{k}")
        if isinstance(v, list) and "items" in s:
            for idx, item in enumerate(v):
                validate(item, s["items"], f"{path}[{idx}]")

    validate(rec, schema, rec.get("id", "?"))


SCHEMA_FILES = {
    "scenes.json": "scene.json",
    "character_state_events.json": "character/stateEvent.json",
    "places.json": "place.json",
    "character_profiles.json": "character/profile.json",
    "items.json": "item.json",
    "custody_events.json": "custodyEvent.json",
}


def validate_against_lexicons(outputs):
    for name, data in outputs.items():
        schema_path = os.path.join(LEXICONS, SCHEMA_FILES[name])
        with open(schema_path, encoding="utf-8") as f:
            schema = json.load(f)
        for rec in data:
            check_schema(rec, schema, name)


def write(name, data):
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    return os.path.relpath(path, ROOT)


def main():
    os.makedirs(OUT, exist_ok=True)
    scenes = extract_scenes()
    state_events = extract_state_events()
    places = extract_places()
    profiles = extract_profiles()
    item, custody = extract_item_and_custody()

    for coll in (scenes, state_events, custody):
        for rec in coll:
            validate_common(rec)

    # every scene must be placed — either a registered place or a documented
    # one-off setting (road stop / montage) captured as placeText.
    for s in scenes:
        if not s["placeRefs"] and not s["placeText"]:
            err(f"{s['id']}: no place (neither registered placeRef nor placeText)")

    outputs = {
        "scenes.json": scenes,
        "character_state_events.json": state_events,
        "places.json": places,
        "character_profiles.json": profiles,
        "items.json": [item],
        "custody_events.json": custody,
    }

    validate_against_lexicons(outputs)

    print("=" * 68)
    print("PHASE 2 EXTRACTION — Book 1")
    print("=" * 68)
    written = []
    for name, data in outputs.items():
        rel = write(name, data)
        written.append((name, len(data)))
        print(f"  {name:<30} {len(data):>3} records  -> {rel}")

    print(f"\nRegistry entities referenced: "
          f"{len({r.get('subject') or r.get('id') for r in state_events})} characters w/ state")

    if ERRORS:
        print(f"\n!!! {len(ERRORS)} VALIDATION ERROR(S):")
        for e in ERRORS[:50]:
            print(f"  - {e}")
        print("\nFAIL — records written but the build is not clean.")
        return 1

    print("\nOK — all records extracted and every reference resolved through the "
          "registry. Clean build.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
