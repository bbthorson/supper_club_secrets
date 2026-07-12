# Self-hosted fonts

All reader-facing type is self-hosted here — no CDN dependency (BRAND.md §3).
These files are build inputs, committed to the repo.

| File | Family / role | Source | License |
|---|---|---|---|
| `Fraunces-roman-var.woff2` | Fraunces (poster/title/romance), variable 100–900 | extracted from `protocol/brand/brand-book.html` | SIL OFL 1.1 |
| `Fraunces-italic-var.woff2` | Fraunces italic, variable 100–900 | extracted from `protocol/brand/brand-book.html` | SIL OFL 1.1 |
| `Literata-400.woff2` | Literata (body/reading) 400 | extracted from `protocol/brand/brand-book.html` | SIL OFL 1.1 |
| `Literata-400-italic.woff2` | Literata italic 400 | extracted from `protocol/brand/brand-book.html` | SIL OFL 1.1 |
| `Archivo-600.woff2` | Archivo (label caps) 600, latin subset | Google Fonts (`fonts.gstatic.com`, Archivo v25) | SIL OFL 1.1 |

## Regenerating

The four Fraunces/Literata files are extracted from the brand book (the locked
source of the embedded faces):

```sh
node scripts/extract-fonts.mjs
```

Archivo is fetched from Google Fonts (latin subset, weight 600 — the only cut
the label role uses). It is not embedded in the brand book.

All five faces are Open Font License 1.1. The `@font-face` declarations live in
`src/styles/base.css`; the variation axes (opsz/WONK/SOFT) are driven by the
role variables in `protocol/brand/tokens.css`, not set on the faces.
