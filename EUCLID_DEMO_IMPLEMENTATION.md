# Euclid Labs demo — implementation record

Implemented 25 September 2026. The demo remains a post-pitch investment workspace. The financial snapshot is fixed at 1 September 2026. All figures are illustrative; fees are excluded.

## Financial dataset

SRN contractual spreads now support the agreed reference relationship: annual net return = 3% + 6 × annual expected loss. Subsequent monitoring changes do not reset contractual spreads. Returns are measured on original capital, not secondary purchase price.

| Asset | Annual EL | Annual net return |
|---|---:|---:|
| SRN 1 | 1.00% | 9.00% |
| SRN 2 | 3.48% | 23.88% |
| SRN 3 | 2.65% | 18.90% |
| SRN 4 | 2.80% | 19.80% |
| SRN 5 | 3.30% | 22.80% |
| SRN 6 | 2.70% | 19.20% |
| SRN 7 | 3.15% | 21.90% |
| SRN 8 | 1.75% | 13.50% |
| SRP 1 Senior | 0.50% | 6.50% |
| SRP 1 Junior | 2.63% | 19.37% |
| SRP 1 Equity | 9.61% | 59.00% |
| SRP 2 Senior | 0.56% | 6.94% |
| SRP 2 Junior | 2.91% | 21.09% |
| SRP 2 Equity | 11.03% | 67.40% |

Pool EL and tranche EL come from a common annual loss distribution. Senior and junior use fixed illustrative coupons; equity receives residual income and absorbs first losses. Equity's larger returns reflect its smaller original capital base and first-loss position. Outstanding equity units and residual NAV now reconcile. Cash includes restricted reserves once. The annual calculation assumes full-year income before year-end principal losses; no fee deduction or reserve transfer is applied.

Underlying pool returns are 17.8320% and 21.3492%. Pool cash earns 3.75% separately. Tranche net-income dollars sum to underlying income plus cash interest less expected principal loss.

The starting investor portfolio has $23.20M original capital, $23,045,250 market value, $10M available cash, approximately 17.18% annual net return and 2.34% annual EL on original capital. Starting acquisition cost is assumed equal to the snapshot market value. Purchases add actual simulated consideration to acquisition cost; sales release average cost proportionally.

## Implemented experience

- Portfolio summary, dated risk updates, upcoming maturity, event shortcuts and capital-weighted geographic look-through.
- Asset names, selected-tranche summaries, consistent price and return bases, section navigation and expandable technical detail.
- Shared event values across note and pool pages, participation-scaled losses, and explicit separation of unbooked event scenarios from the financial snapshot.
- Correct remaining months, normalized seasonal runoff, dated historical observations and labeled chart axes.
- Derived coverage and concentration tests with reproducible Watch/Breach thresholds.
- Marketplace geography, maturity and tranche filters; return, EL and maturity sorting; persistent filters; explicit Open and Quick pricing actions; empty-result state.
- Simulated orders update cash, holdings, cost basis and inventory. Capacity, increment and cash checks reject invalid fills. Quote requests do not alter balances. Duplicate submission is blocked.
- Session persistence, reset, modal focus containment and focus return; pool-to-note return navigation.
- Immediate financial rendering, cached geographic generation, readable map-failure state and working map tiles. The former map provider displayed an API-key watermark and was replaced with OpenStreetMap tiles, with matching attribution and content security policy.
- Improved typography, table wrapping, navy exposure markers, grayscale map background, laptop and narrow-screen layouts.

Portfolio, marketplace, trade-log and pool transitions reuse the page. Selecting a different note still loads its geographic workspace; generated exposure is cached locally to avoid repeating the expensive calculation.

## Verification

`npm test` covers all eight SRN benchmarks; six tranche loss and return allocations; probability totals; pool cash and residual equity NAV; loss-waterfall conservation; date/runoff consistency; buy/sell balances, invalid amounts, capacity, equity units, cost basis and session restoration. It also generates all eight exposure maps and verifies the three generated event-trigger totals against the shared event records.

Browser checks covered a $500,000 SRN 6 buy at 98.55 ($492,750 consideration), updated portfolio and inventory, an RFQ with unchanged balances, reset, combined filters, sorting, empty results, pool-to-note return navigation, event/map loading and laptop/mobile layouts. The built output was opened and checked. JavaScript syntax and unique HTML identifiers passed.

Build output: `dist/index.html`. No production deployment was performed. The optional stress slider, multi-asset comparison and full lifecycle simulator remain outside this revision, as specified in the approved change plan.

## Parcel map update — 25 September 2026

All eight SRN exposure views now use bundled public parcel polygons across seven regions. The visible grid and cell inspector are replaced by blue/red portfolio properties, hover insured values, a property picker/details panel, a fire-footprint toggle and four portfolio totals. Insurer membership, insured values, damage severities and fire footprints are illustrative. The source parcel datasets are geographic samples, not complete county inventories; source links are shown in property details. Multipart parcels retain their largest polygon. Missing site addresses remain explicitly missing.

`assets/parcels/sources.json` records provenance. `scripts/build-property-data.py` reproducibly compiles the bundled parcel samples into `assets/property-data.js`. Future insurer schedules can replace the holdings records and provider classifications can replace burn status. Current classification uses a representative interior point inside the modeled fire footprint. Modeled damage is burned insured value multiplied by the note's illustrative severity; it is distinct from both full insured value and treaty payout. Asset and pool event amounts derive from the same records. Current annual EL/returns and no-fee benchmarks remain unchanged.

Validation: all eight property schedules reconcile; unique membership, insured values, damage bounds, independent point/footprint classification and asset event totals pass. Existing financial/trading checks also pass. SRN2 property selection and fire overlay verified in the local browser. Build ships the map and data bundles; no production deployment performed.

## Expanded portfolio overview — 25 September 2026

The portfolio now opens with six metrics: total holdings plus cash, invested original capital, available cash, weighted annual net return, annual net economic income estimate, and annual expected loss in dollars and percent. Allocation uses market value including cash. Geographic and insurer concentration uses invested capital distributed by underlying pool collateral weights, combining shared SRNs without duplicating invested capital. The UI explicitly distinguishes those allocations from tranche loss exposure and insured property values.

Allocation, region, insurer, largest underlying position, and junior/equity concentration controls filter the position table. Cash produces an explicit non-security message and all filters can be cleared. Portfolio-wide totals remain visible when filtering. A 3/6/12-month cumulative income projection uses current expected returns, straight-line accrual and remaining-term caps, with no cash yield, reinvestment, price appreciation, or fees. It is labeled as projected economic return rather than historical performance or cash distributions.

Validation: financial regression checks pass; new tests reconcile total value, allocation and look-through sums, verify projection limits, and exercise direct/pool filter matching. Browser checks verified desktop layout, senior allocation filtering, clearing filters and changing projection horizon. No production deployment.
