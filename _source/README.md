# NOVAE site source

- `build.py` generates `index.html` (the website) from `site.css`, `site.js`, `proof.json`, `prices.json`.
- `book.html` is the NOVAE book (page-turn experience), linked from the site at `/book`.
- To publish prices: fill `prices.json` ("position", "presence", "growth", e.g. "350.000") and rebuild.
- To publish Lumière results: fill `proof.json` (quote with author and permission, metric values) and rebuild. Empty values are not shown.
