# Task Brief — Entity Registry (Protocol Phase 1)

**Status:** ✅ Done — Tasks A–E complete. See [`README.md`](README.md) for the delivered registry, resolver, and Emma stateEvent proof. This brief is retained as the record of intent.
**Owner doc:** `protocol/ARCHITECTURE.md` (§7 Identity Model, §13 Phase 1). Read that first.
**Guiding principle:** this is the *protocol-agnostic* foundation. Stable IDs feed **both** a future public site (e.g. Astro) and any AT-Protocol experiment. Building the registry commits us to neither. No network, no publishing, no prose changes.

---

## 1. Goal

Give every **character, place, and item** in the universe a **permanent, canonical ID** that never changes even when a display name or filename does, and make name→ID resolution **deterministic** (so extraction never guesses). Two artifacts:

1. **`protocol/entities/entities.yaml`** — the committed registry: `id → {type, displayName, aliases, sourceFile, status}`.
2. **`id:` frontmatter** on each entity's markdown file, pointing back to its registry id.

This is the "one new authoring habit" from the architecture doc. Everything downstream (the `scene` / `character.stateEvent` / `place` / `item` + `custodyEvent` record types) resolves references through this registry.

---

## 2. Why now / what's already in place

The demand side is ready. As of the PR #3 merge, **all 25 Book 1 chapters carry YAML frontmatter** whose `pov`, `characters_present`, `characters_referenced`, `registers` keys, and `location` values are the *names that need to resolve to IDs*. Location values were canonicalized to exactly match the location files. So the registry has a concrete, finite test corpus to satisfy.

**Already have `id:` frontmatter (do NOT redo):**
- **Locations** — all 14 under `canon library/locations/*.md` use `id: place.<slug>` (e.g. `place.mcgolrick-market`, `place.emmas-apartment`, `place.meadowlight-collective`).
- **Books** — `canon library/books/bookN.md` use `id: book.N`.

**Missing `id:` (this task adds them):**
- **Main characters** — `canon library/characters/{emma,elijah,noah,oliver,olivia,jasper}.md`
- **Antagonists** — `canon library/antagonists/book1_garrett_pike.md` (+ the 5 future-book files, optional now)
- **Book 1 recurring/minor characters** — `stories/01. The Case of the Missing Hot Sauce/characters/{hank,dorothy,sofia,marcus_gilded_fern,brenda_marquez,ruth,the_food_critic}.md`. (`the_mogul.md` is a stub that points to the Pike antagonist file — it is **not** a separate entity; treat it as an alias source for Pike.)

**Established ID scheme (follow it):** `<type>.<slug>` — already used by `place.*` and `book.*`. So: characters → `char.*`, items → `item.*`. This matches `ARCHITECTURE.md` §7 examples (`char.emma`, `place.mcgolrick-market`, `item.heritage-bottle`).

---

## 3. Scope — tasks

### Task A — Lock the entity conventions (decisions below)
Resolve the open decisions in §5, write them at the top of `entities.yaml` as a comment block.

### Task B — Author `protocol/entities/entities.yaml`
The registry. One entry per entity with: `id`, `type` (`character` | `place` | `item`), `displayName`, `aliases` (every string it appears as in prose/frontmatter — **this is what makes resolution work**), `sourceFile`, `status`. Cover at minimum every entity referenced by Book 1 chapter frontmatter (see §4 inventory).

### Task C — Add `id:` frontmatter to the entity files missing it
Main characters, the Book 1 antagonist (Pike), and the Book 1 story-character files. Keep the prose body untouched — only add the frontmatter key (and, for files with no frontmatter block yet, add a minimal one consistent with the location/book files: `type`, `title`, `id`, `status`). Match the `id` to `entities.yaml`.

### Task D — Resolution sanity check
Confirm that **every distinct name** used across the 25 chapters' frontmatter (`pov`, `characters_present`, `characters_referenced`, `registers` keys, `location`) either (a) resolves to a registry `id` via an alias, or (b) is on an explicit **"intentional non-entity / one-off"** list. A tiny script is fine; the point is to prove the corpus resolves cleanly with no silent misses.

### Task E — (follow-on, optional; the Phase 1 "proof") 
Per `ARCHITECTURE.md` §13: extract **Emma's `character.stateEvent` series** from `stories/01…/tracking/character_matrix.md` (and now the per-chapter `registers`) into validated records, `createdAt = storyDate`. This proves the spine end-to-end against real data, no network. Do this only after A–D; it belongs to record extraction more than the registry itself.

---

## 4. Entity inventory (Book 1)

**Characters — mains (6):** Emma Hartley `char.emma`, Elijah Miller `char.elijah`, Noah `char.noah`, Oliver `char.oliver`, Olivia `char.olivia`, Jasper `char.jasper`.

**Characters — antagonist:** Garrett Pike `char.garrett-pike` — aliases must include `"Garrett Pike"`, `"Pike"`, `"the mogul"`, `"the developer"` (all appear in prose/frontmatter/tracking).

**Characters — recurring / minor (have files):** Hank `char.hank`, Dorothy `char.dorothy`, Sofia `char.sofia` (**note:** distinct from the place `place.sofias-cheese-shop`), Marcus `char.marcus`, Brenda Marquez `char.brenda-marquez` (alias `"Brenda Marquez"`; the old `"Brenda Chen"` is superseded — do not add it), Ruth `char.ruth`, The Food Critic `char.food-critic` (unnamed but recurring; has a file), Paolo Ferrante `char.paolo-ferrante` (referenced only, no file — decide whether referenced-only entities get a registry entry; recommend yes, minimal).

**Places (14):** already have ids — mirror them into `entities.yaml` with their canonical `displayName` (the location file `title:`) and aliases (e.g. `place.mcgolrick-market` → displayName "McGolrick Park Farmers Market", aliases include the "(Down to Earth)" long title and "McGolrick").

**Items:** the heritage hot-sauce bottle Dorothy gives Emma "just in case" → `item.heritage-bottle`. It's the one tracked object (its custody path Ch1→17→20/23→25 powers the future `custodyEvent` demo — see `tracking/subplot_threads.md` → "Jasper's bottle").

**Intentional non-entities (do NOT register; they appear in frontmatter as free text / one-offs):** the process server, Emma's editor, Elijah's mother & sister (unnamed background), the conservative commentator; one-off settings the High Line, the road stops (The Ridgeline Diner / The Starlite Drive-In / Murph's), "Amtrak to Philadelphia", and the montage descriptors ("Distributed — …"). The resolver should treat these as expected non-matches, not errors.

---

## 5. Open decisions (resolve in Task A)

1. **Antagonist namespace** — recommend `char.*` (antagonists are characters; Pike = `char.garrett-pike`), not a separate `antagonist.*` namespace.
2. **Referenced-only entities** (Paolo Ferrante; future the-food-critic if unnamed) — recommend giving them minimal registry entries so references resolve; mark `status: referenced`.
3. **Alias coverage** — each entity's `aliases` must include every surface form in prose AND in chapter frontmatter (display names, nicknames, epithets). This is the highest-value, most error-prone part. Pike is the sharp case (`"the mogul"`, `"the developer"`).
4. **Future-book antagonists** (book2–6) — register now (they have files) or defer until those books exist? Recommend a light stub entry now (`status: future`) so the namespace is reserved, but low priority.
5. **entities.yaml shape** — confirm the field set (`id`, `type`, `displayName`, `aliases`, `sourceFile`, `status`) and whether one file holds all types or you split per type. Recommend one file for now.

---

## 6. Guardrails

- **No prose changes.** Only add `id:` frontmatter and author `entities.yaml`.
- **No network, no publishing.** `records/` (build output) is *not* part of this task; the registry is committed source of truth, records are generated later.
- **Golden Rule holds.** If a name in the prose/frontmatter and the registry disagree, the prose wins — fix the registry.
- **Protocol-agnostic.** Don't bake in atproto assumptions (DIDs are a later phase, §7 Phase 2). Local IDs only.
- **Keep it consistent with what exists** — the `place.*` / `book.*` id scheme and the location-file frontmatter format are the templates to match.

---

## 7. Files to read first

- `protocol/ARCHITECTURE.md` — §4 (directory layout), §6 (record types), §7 (identity model), §13 (phased roadmap).
- `canon library/locations/*.md` + `locations/index.md` — the done example of `id:` frontmatter + a registry index.
- Any Book 1 chapter (e.g. `stories/01…/chapters/m3_13_service_for_one.md`) — the frontmatter demand side.
- `stories/_story_template/chapters/00_chapter_guide.md` — the locked frontmatter schema.
- `canon library/glossary.md` — the character quick-reference + term list (a good alias source).

---

## 8. Definition of done (registry portion, Tasks A–D)

- `protocol/entities/entities.yaml` exists, with entries for every Book 1 character, place, and the heritage-bottle item, each with `id` + `aliases` + `sourceFile`.
- Every entity markdown file has an `id:` matching the registry.
- Every name used in the 25 chapters' frontmatter resolves to a registry id or is on the documented one-off list — verified.
- `CANON_CHANGELOG.md` entry logged. No prose changed.
