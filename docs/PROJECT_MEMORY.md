# Project Memory

## 2026-02-26 — Index-Primary Baseline

- `index.html` is the primary experience and source of truth.
- Standalone product portfolio page is retired from active use.
- Products carousel on home is powered by:
  - Data: `js/product-portfolio-data.js`
  - Logic: `js/product-portfolio.js`

## Cleanup Decisions

- Removed obsolete duplicate products carousel implementation from `js/main.js`.
- Simplified `js/product-portfolio.js` to index-only responsibilities.
- Updated `README.md` architecture notes to reflect current ownership.

## Data Corrections in Current Baseline

- Removed Myanmar and Cambodia from global experience locations.
- Replaced Seattle with San Francisco in location references.
- Removed inaccurate Power BI/Azure DevOps dashboard product entry.
