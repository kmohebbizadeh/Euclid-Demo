# Euclid demo: revised recommendations

## Purpose and agreed assumptions

The demo follows the PowerPoint pitch and visualizes the intended platform. Open directly into a populated investment workspace. Keep the existing institutional design, portfolio, marketplace and asset-detail structure. Use concise labels and optional tooltips; do not add onboarding or an educational walkthrough.

For this revision, net return means annual collateral income plus insurance spread minus annual expected loss, with **no fee deductions**. Use the user's illustrative pricing benchmarks: approximately 9% net return at 1% EL and 21% net return at 3% EL. A convenient reference line is net return (%) = 3 + 6 × EL (%). This is a demo assumption, not a validated market pricing rule. Apply it approximately to underlying SRNs; derive SRP/tranche economics from their cash flows and loss scenarios rather than forcing every tranche onto that line.

This plan supersedes the implementation and design recommendations in EUCLID_DEMO_REVIEW.md. Its numerical audit remains evidence of the original demo, not the proposed revised values. Implemented on 25 September 2026. See EUCLID_DEMO_IMPLEMENTATION.md for final assumptions, delivered changes and verification.

## 1. Rebuild a coherent numerical dataset

### SRN pricing

Keep current annual ELs as illustrative inputs initially, and recalibrate insurance spreads to support the reference returns below. With the existing 3.75% collateral-yield assumption, spread = target net return + EL − 3.75%. These are reference values before any deliberate asset-specific variation.

| Note | Annual EL | Reference net return, no fees | Implied insurance spread |
|---|---:|---:|---:|
| SRN 1 | 1.00% | 9.00% | 6.25% |
| SRN 2 | 3.48% | 23.88% | 23.61% |
| SRN 3 | 2.65% | 18.90% | 17.80% |
| SRN 4 | 2.80% | 19.80% | 18.85% |
| SRN 5 | 3.30% | 22.80% | 22.35% |
| SRN 6 | 2.70% | 19.20% | 18.15% |
| SRN 7 | 3.15% | 21.90% | 21.30% |
| SRN 8 | 1.75% | 13.50% | 11.50% |

Keep contractual spreads fixed after the hypothetical issuance. Changes in current EL should change expected return on the existing note. Use the benchmark to construct internally consistent example issuance terms; do not automatically reset coupons every time monitoring EL changes. If prices stay near par after repricing the dataset, define the entire scenario consistently with those issuance terms and the current risk view.

Label the simplified metric “Annual net return” with concise help specifying “collateral yield + insurance spread − expected loss; fees excluded; measured on par.” Keep market price separate. A price-based expected yield would need its own cash-flow calculation; it is not this simplified metric.

### Pool and tranche economics

- Recalculate both pools from the revised SRN income and expected losses. If the reference SRN returns above are used exactly, current notional-weighted underlying net returns become **17.8320% for SRP 1** and **21.3492% for SRP 2**, before the tranche waterfall and excluding cash/reserve income. These are underlying pool metrics, not the return of every tranche.
- Establish one common set of hypothetical pool loss scenarios. Allocate each scenario through equity, junior and senior, then calculate tranche EL and impairment probabilities from the same distribution. Do not calculate a tranche's expected loss by applying a waterfall only to the pool's average loss.
- Choose coherent senior and junior coupons supported by underlying income. Calculate equity return from the residual after debt distributions, losses and any reserve changes. Include no fee deduction. Do not extrapolate the SRN reference line mechanically to high-EL equity.
- Reconcile expected-loss dollars and distribution dollars across pool and tranches. Explain any retained cash or reserve movement.
- Derive coverage ratios and concentrations from holdings and balances. Define warning and breach thresholds rather than hard-coding Pass/Watch labels.
- Define outstanding equity units and reconcile equity NAV per unit to residual pool value. Keep market price distinct from NAV.
- Include each cash asset once. Define whether an event reserve is restricted cash or a liability. Remove fee deductions and accrued-fee balances from the active demo scenario under the user's no-fee assumption.
- Distinguish the coupon benchmark from actual collateral yield; use explicit, fixed demo assumptions for each.

### Events, principal and dates

- Use one event record per note for every screen. Resolve SRN 2's $12.61M versus $18.4M damage discrepancy and SRN 5's $99.05M versus $28.6M discrepancy.
- Select a consistent illustrative outcome for each event, then align exposure, trigger inputs, damage, payout and asset state. Retain the generated outputs only if they fit the intended examples; otherwise recalibrate the example inputs transparently rather than patching the displayed totals.
- Calculate treaty payout as min(limit, max(0, contractual modeled damage − attachment)). Scale the note's loss by the investor's or pool's participation.
- Distinguish provisional event estimates, booked reserves and finalized payouts. At finalization, update principal factor, collateral and NAV consistently. Do not treat annual EL as a realized loss.
- Keep current-event results separate from hypothetical stress scenarios.
- Use one fixed scenario date throughout. Correct month counting, remove future observations from historical series and reconcile seasonal remaining EL with full-term EL. Explicitly date observations and forecasts.
- Replace “Capital still in term,” which currently prorates market value by elapsed time, with an actual principal or collateral measure.
- Separate principal held, acquisition cost and market value. Calculate portfolio loss and income dollars before choosing a consistent percentage denominator.

## 2. Refine the portfolio screen

- Keep the populated portfolio as the landing page.
- Lead with market value, principal held, annual net return and annual expected loss, with consistent dollar/percentage bases.
- Add a compact recent-changes area: EL revisions, assets with events under review and upcoming maturities. Every item should open the relevant asset.
- Use recognizable names such as “Berkeley Hills Wildfire · SRN 2,” with treaty IDs underneath.
- Keep direct SRNs and SRP tranches visually distinct. Show key investment figures before secondary program detail.
- Add a compact concentration view if space permits. Include direct and pooled exposure without double-counting investment value; avoid implying that several California wildfire assets eliminate shared risk.

## 3. Refine SRN detail pages

- Put the asset identity and the user's position at the top, alongside price, annual net return, current EL and event status.
- Group the remaining content into market terms, risk history, exposure and event impact. Use section navigation or tabs to make long pages easy to explore.
- Keep the map prominent within the exposure section. Make insured properties, event footprint and selected-property information visually distinct.
- Move map bounds, coordinates, grid resolution and technical provenance into expandable detail.
- Retain underwriting/current EL comparisons with dated observations, clear axes and concise annotations tied to actual scenario changes.
- Group event damage, attachment, payout and the user's potential loss into one compact panel. Indicate the event's status and last update.
- Keep the frozen contractual trigger version separate from the changing monitoring model. Expose detailed methods on demand.
- Use “No active event” or “Not applicable” for irrelevant event telemetry rather than zeros that imply failed detection or instantaneous response.
- If useful, add a compact collateral summary and reconciled recent cash movements within the asset page. No separate administration application is required.

## 4. Refine SRP detail pages

- Lead with the selected tranche's holding, price, expected return, EL, attachment and status. Follow with pool-level information.
- Retain the capital-structure visual, clearly separating distribution priority from loss priority. Highlight the selected tranche everywhere.
- Show a clearly labeled stress result with loss dollars and remaining principal for each tranche.
- Show underlying holdings, weights, EL contributions and the pool's participation in event payouts. Label whole-treaty payouts separately if retained.
- Make coverage and concentration tests reproducible, and explain why a compliant test is on Watch when applicable.
- Improve pool charts with readable axes, units and dates. Keep collateral value as a percentage of par separate from tranche price and equity NAV per unit.
- Make an interactive stress control optional after the core numbers and screens are complete.

## 5. Improve the marketplace and trading

- Keep the SRN/SRP tabs and consistent columns for price, EL, annual net return, maturity and availability.
- Add sorting and a small set of useful filters: geography, maturity and tranche/product type. Keep multi-asset comparison optional.
- Label debt prices per $100 par and equity prices per unit. Show bid/ask and indicative quote state consistently.
- Use “Request quote” rather than “Request.” Clearly distinguish opening the full asset page from expanding quick pricing details.
- Have simulated fills update holdings, cash, inventory, market value and sell eligibility. Repeated sales must not exceed remaining holdings.
- Keep RFQs separate from filled trades. Do not change holdings when a quote is requested.
- Align price times quantity with consideration; apply principal factors consistently after any loss. Include no transaction or management fee deductions.
- Distinguish trade settlement from insurance-trigger settlement.
- Use fixed illustrative quotes with an explicit snapshot time, or implement expiry/refresh. Avoid a permanent “15 min” validity label on stale quotes.
- Provide a reliable reset that restores the starting portfolio, event state and session trade log.

## 6. Presentation and visual polish

- Preserve the restrained navy/white palette and existing brand identity.
- Increase small labels and secondary text; improve contrast and whitespace. Use monospace for values and identifiers, not every sentence.
- Use consistent precision and formatting: percentage rates, basis-point changes, dollar prices, unit counts and monetary totals.
- Keep primary actions in predictable positions and selected assets/tranches clearly highlighted.
- Preserve the originating portfolio, marketplace filters or parent pool when navigating back. Open a newly selected asset at its intended starting position.
- Render financial summaries immediately. Avoid full-page reloads and repeated map generation when switching views. Prevent another asset's placeholder content from flashing during loading.
- Use concise loading, empty-result and map-unavailable states. Retain useful financial content if external map tiles fail.
- Standardize Euclid Labs/Euclid Risk naming and remove outdated wireframe language.
- Use a restrained persistent demo indicator. Identify illustrative programs, ratings and model outputs accurately, with detailed assumptions available on demand.
- Support keyboard navigation, visible focus, modal focus containment and focus return.
- Verify laptop, projector/large-screen and narrow-screen layouts. Prioritize readability in a live pitch setting.

## 7. Implementation order and acceptance

| Order | Work | Acceptance |
|---|---|---|
| 1 | Financial assumptions and common dataset | No fees deducted; SRNs broadly follow the agreed EL/return relationship; fixed terms, current risk and market marks are distinct. |
| 2 | Numerical reconciliation | All eight notes and six tranches agree across views; pool cash flows and loss allocations reconcile; dates and principal factors are coherent. |
| 3 | Screen hierarchy | Portfolio, SRN and SRP screens clearly visualize the capabilities described in the pitch; useful depth remains accessible. |
| 4 | Interaction consistency | Trades update balances once; RFQs do not; inventory constraints work; navigation and reset are reliable. |
| 5 | Visual polish and rehearsal | Readable charts and typography, stable loading, usable keyboard/screen layouts and smooth unscripted navigation across all assets. |

Keep onboarding, a guided teaching flow, a separate insurer portal, full issuance workflow and production integrations outside this revision. A full lifecycle simulator, interactive stress slider and multi-asset comparison remain optional enhancements after the core demo is convincing.
