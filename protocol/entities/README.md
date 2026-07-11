# Entity Registry — Protocol Phase 1

Canonical, permanent, **local** IDs for every character, place, and item in the
*Supper Club Secrets* universe, plus deterministic name→ID resolution. This is
the protocol-agnostic foundation described in
[`../ARCHITECTURE.md`](../ARCHITECTURE.md) §7 (Identity Model) and §13 (Phase 1):
stable IDs feed **both** a future public site and any AT-Protocol experiment, and
committing to the registry commits us to neither. No DIDs yet, no network, no
prose changes.

The task brief this executes is [`TASK.md`](TASK.md).

## Files

| File | What it is |
|------|-----------|
| [`entities.yaml`](entities.yaml) | The registry. One entry per entity: `id`, `type`, `displayName`, `aliases`, `sourceFile`, `status`. Grouped by type. The comment header records the locked conventions (Task A). |
| [`non_entities.yaml`](non_entities.yaml) | Intentional one-offs / background surfaces that appear in chapter frontmatter but are deliberately **not** registered. The resolver treats these as expected non-matches, not misses. |
| [`resolve.py`](resolve.py) | **Task D** sanity check. Parses the registry + every Book 1 chapter's frontmatter and proves each distinct name either resolves to an `id` or is a documented one-off. Exit 0 = clean. No dependencies. |
| [`extract_emma_stateevents.py`](extract_emma_stateevents.py) | **Task E** (optional proof). Resolves `Emma → char.emma` through the registry and extracts her `character.stateEvent` series with `createdAt = storyDate`. |
| `proof/emma_stateevents.json` | Generated demonstration output of Task E. Regenerate with the script above. |

## Run it

```sh
python3 protocol/entities/resolve.py                  # Task D — resolution check
python3 protocol/entities/extract_emma_stateevents.py # Task E — Emma stateEvent proof
```

Both run on a stock Python 3 — a minimal frontmatter/YAML reader is bundled in
`resolve.py` so PyYAML is not required.

## What's registered

- **20 characters** — 6 mains (`char.emma` … `char.jasper`), the Book 1
  antagonist `char.garrett-pike`, 7 recurring/minor Book 1 characters
  (`char.hank`, `char.dorothy`, `char.sofia`, `char.marcus`,
  `char.brenda-marquez`, `char.food-critic`), the referenced-only
  `char.paolo-ferrante`, and 5 `status: future` stubs for the book 2–6
  antagonists (namespace reserved).
- **14 places** — mirror the `id:` frontmatter already on the location files.
- **1 item** — `item.heritage-bottle`, the tracked hot-sauce bottle.

Every entity file now also carries an `id:` in its frontmatter pointing back to
its registry id.

## Conventions (Task A, locked)

- **ID scheme** `<type>.<slug>` (matches the existing `place.*` / `book.*`). IDs
  are permanent; display names and filenames may change, the id does not.
- **Antagonists are characters** — `char.garrett-pike`, no `antagonist.*`
  namespace.
- **Resolution is type-aware** — `location` values resolve against places, the
  character fields against characters. This keeps the *character* `char.sofia`
  distinct from the *place* `place.sofias-cheese-shop`.
- **Aliases hold base surface forms.** The resolver strips a trailing `(...)`
  annotation before matching, so `"Dorothy (honey vendor — gives the bottle)"`
  resolves via the alias `"Dorothy"`.
- **Golden Rule** — if the prose/frontmatter and the registry disagree, the
  prose wins; fix the registry.

## The two flagged decisions

1. **Alias coverage — Pike.** `char.garrett-pike` registers `"Garrett Pike"`,
   `"Pike"`, and the pre-naming epithets `"the mogul"` / `"the developer"`, all
   of which appear in prose/frontmatter/tracking. The deliberately-anonymous
   "unknown out-of-place man" from Ch1 (the *Pike seed*) is **not** resolved to
   Pike — the narrative withholds his identity there, so it's listed as an
   intentional non-entity rather than asserting an identity the prose hides.
2. **Referenced-only entities.** Paolo Ferrante (named, no file) gets a minimal
   entry with `status: referenced` so his references resolve.

## Resolution status (Task D)

Against the 25-chapter Book 1 frontmatter corpus: **26 distinct names resolve to
registry ids, 16 are documented one-offs, 0 silent misses.** Re-run `resolve.py`
after any frontmatter or registry change.

## Out of scope (deferred)

The `records/` build tree is **not** produced here (see `TASK.md` §6). The
registry is committed source of truth; records are generated later.
`proof/emma_stateevents.json` is a demonstration artifact only, kept under
`protocol/entities/` rather than a real records directory.
