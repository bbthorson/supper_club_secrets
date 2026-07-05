# Supper Club Secrets — Brand Guidelines

**Direction: "The Menu."** Locked 2026-07-05 (brand book v2). The visual identity for all reader-facing surfaces — the public site first (Protocol Phase 3), plus social cards, covers, and any atproto projection chrome.

**Companion files:**
- [`tokens.css`](tokens.css) — the palette, type scale, and component tokens as CSS custom properties. The site build imports this; nothing re-derives hex values by hand.
- [`tokens.json`](tokens.json) — the same tokens, platform-neutral, for non-CSS consumers (social-card generation, cover templates).
- [`brand-book.html`](brand-book.html) — the visual spec, self-contained (fonts embedded). Open it in a browser; it renders every rule in this document.

---

## 1. The Concept

Every book in the series is structured around four meals; every menu mirrors the group's emotional state. So the brand's central move is to make **the menu the interface**:

- A book's table of contents is a **menu card** — four courses, dotted leaders, a footnote.
- Secrets are **redactions** — the line the kitchen won't print. Spoiler-safe by construction.
- Dark mode is **after hours** — not inverted colors, the same restaurant after the candles are lit.
- The brand's wit lives in **menu copy** ("*served family style," "Please inform your host of any secrets before dining").

This isn't styling borrowed from the mystery genre; it's the series' own architecture made visible. It scales with the series — every new book is a new menu, every secret a new redaction.

### Research grounding (July 2026)

Three currents in restaurant menu design informed v2, replacing v1's three separate directions:

1. **The bistro revival** — chunky, exaggerated serifs from diner menus and roadside signage are the current center of restaurant identity, not a novelty.
2. **Old meets new pairings** — one characterful decorative serif + one quiet workhorse (the Albertus/Maison Neue pattern).
3. **Single-pop palettes** — earthy neutrals with exactly one bold accent.

---

## 2. Wordmark

Set in **Fraunces Black, optical size 144, WONK axis on** (`font-weight: 900; font-variation-settings: 'opsz' 144, 'WONK' 1, 'SOFT' 0`).

**Primary lockup** (covers, social, landing):

```
Supper Club          ← roman, Espresso
Secrets*             ← italic, Hot Sauce; brass asterisk
WILLIAMSBURG, BROOKLYN · THURSDAYS   ← label caps, muted
*served family style                 ← body italic, Hot Sauce (optional line)
```

**Site-header lockup:** one line, Fraunces 700 at text optical size — `Supper Club` in Espresso, `Secrets` in Hot Sauce italic.

**Coaster monogram:** `SCS` in Fraunces Black inside a double-ring circle, `EST. OCTOBER` beneath in tracked label caps. For favicons, avatars, stamps, and anywhere the full name won't fit.

The asterisk is part of the brand's grammar: it marks a secret, and it always pays off in a footnote somewhere on the surface.

---

## 3. Typography

One variable family carries the whole personality register; a dedicated reading face carries the prose. All faces are free (Google Fonts / SIL OFL) and must be **self-hosted** — no CDN dependency.

| Role | Face | Settings | Used for |
|---|---|---|---|
| Poster | Fraunces | 900, opsz 144, WONK 1, SOFT 0 | Wordmark, book covers, hero moments, stamps |
| Title | Fraunces | 600, opsz 90 | Book/chapter titles, section heads |
| Romance | Fraunces | ~340 italic, opsz 60, WONK 1 | Taglines, menu descriptions, pull-quotes |
| Body | Literata | 400, 17–19px | Chapter prose, long-form reading |
| Label | Archivo | 600, tracked caps (0.14–0.26em) | Eyebrows, nav, metadata, buttons |

**House rules:**
- **Fraunces never sets a paragraph.** It is front of house; Literata is the meal itself.
- Chapter prose reads at a **65–70 character measure**, ~19px, generous leading.
- Why Fraunces: it's the open-source revival of the "wonky" turn-of-the-century faces (Windsor chief among them) that the bistro revival is built on. Black weight = the poster voice; light italic = menu romance. One font file, whole register.

---

## 4. Color

### Day service (default theme)

| Token | Hex | Role | Proportion |
|---|---|---|---|
| Linen | `#FBF8F1` | Page ground | ~62% |
| Espresso | `#2A211C` | Text, redaction bars | ~20% |
| Brass | `#9C7C34` | Rules, dotted leaders, numerals, ornament | ~10% |
| Hot Sauce | `#C13A21` | **The single pop** — accents, links, stickers | ≤10% |

**The seasoning rule: if Hot Sauce passes ten percent of a screen, the dish is over-seasoned.** There is exactly one accent; Book 1's title makes it the only honest choice.

Contrast notes: body text is always Espresso on Linen. Hot Sauce on Linen is reserved for large/bold type and accents, not body copy. Brass is ornament-only — never body-size text.

### After hours (night / reading theme)

| Token | Hex | Role |
|---|---|---|
| Bottle Green | `#10231C` | Ground |
| Candle | `#E3AC44` | Accent, links, eyebrows |
| Menu Cream | `#F1E8D4` | Text |

Night is **not inverted Linen** — same restaurant, candles lit. Same typefaces, same menu structure. Readers choose day or night in the reading room; the day/night duality mirrors the series' cozy/mystery balance.

---

## 5. Components

- **Menu card** — the book TOC. Centered eyebrow (`BOOK ONE`), Poster-weight title, italic subline, four courses with dotted-leader rows and Hot Sauce course numerals, footnote footer.
- **Redaction** — Espresso bar over its own text (`background` = `color`), tap/click/keyboard to reveal. Every teaser and recap is spoiler-safe by default because the component, not editorial discipline, does the hiding.
- **Sticker** — Hot Sauce circle, slight rotation, label caps + Poster line (`NOW SERVING / Chapter 9`). Chapter-drop announcements, social.
- **Stamp** — Poster-weight outlined text, rotated, Hot Sauce (`CASE CLOSED`). Marks finished books on the shelf page.
- **Dotted leaders** — the connective tissue (2px dotted Brass). Section heads, menu rows, "the check" lists.

## 6. Voice

Interface copy is written as menu copy: warm, precise, a little formal, with the joke in the footnote. Canonical lines:

- `*served family style`
- `Please inform your host of any secrets before dining.`
- `Now serving: Chapter …` / `…is now serving`
- `Case closed` (a finished book) · `The check` (next steps / what's owed)

Tone matches the books: capped at 7/10. The brand never plays noir-thriller; mystery is seasoning, never the ground.

---

## 7. Open items (the check)

- Wordmark as a production **SVG with outlined paths** (needs the Fraunces instance traced so the mark doesn't depend on font loading), plus favicon and social-card templates.
- Astro templates for the **menu page** and **night reading room** when Phase 3 begins (prototypes exist in the brand book §V).
- Per-book menu covers, Books 2–6 (each book's menu card can carry its month and host).
