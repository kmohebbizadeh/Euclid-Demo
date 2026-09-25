# Euclid Labs demo review and recommended change plan

Reviewed September 24, 2026. Scope: the current local demo, eight SRNs, two SRPs and all six tranches. This is a review and implementation plan; the demo has not been edited.

## Recommendation

This demo follows the PowerPoint pitch. Its audience already has the explanation of Euclid, SRNs, SRPs and the business model. Its job is to make the proposed platform tangible: show the portfolio, assets, risk information and transactions a user would interact with. Keep the existing institutional visual style and product structure. Prioritize coherent numbers, strong screen hierarchy, responsive interactions and presentation reliability.

The design criterion is whether the audience can immediately recognize the product described in the pitch and see how it would be used. Several figures currently contradict one another, and important investment information competes with secondary technical detail. Correct those issues while preserving the depth that makes the platform convincing. An onboarding flow, introductory explainer and guided educational walkthrough are outside this scope.

## 1. Offering context for the review (not proposed in-app copy)

Euclid connects carriers and MGUs seeking capacity with institutional investors seeking exposure to insurance risk. A fully collateralized reinsurance transaction is financed through a **Structured Risk Note (SRN)**. Investors can hold notes directly, or invest in a **Structured Risk Pool (SRP)** that holds several notes and issues senior, junior and equity interests. A manager selects and replaces eligible assets. Euclid's infrastructure supports issuance, risk monitoring, collateral visibility, administration, distributions, settlement and secondary transactions.

The distinctive benefits to demonstrate are:

- **Defined settlement:** a composite trigger and agreed methodology determine the contractual payment. The model, contract version and evidence should make the result reproducible. Basis risk remains a relevant distinction between the contractual payment and the cedent's actual loss.
- **Ongoing visibility:** investors and cedents can see changes in expected loss, collateral and transaction status throughout the investment.
- **Selectable exposure:** investors can choose an individual note or a tranche of a managed pool, with visibly different income and loss priorities.
- **Reusable capacity:** eligible capital can return to new transactions after expiry or resolution, subject to losses, reserves and reinvestment rules.

The current demo covers investor holdings, indicative secondary pricing, risk monitoring and a static waterfall. That is a suitable scope for visualizing the platform after the pitch. Collateral administration, settlement finality and reinvestment can be represented through compact product fields or activity records where useful; their limited presence does not require building a full lifecycle simulation, primary-issuance workflow or separate cedent portal in this revision.

The current VC deck describes a $10M pilot followed by more SRNs, a first SRP and later marketplace expansion. The demo's eight notes and two pools should therefore be framed as an **illustrative platform scenario**, not evidence of completed issuances or operating scale. The $10M pilot and the demo's hypothetical balances serve different purposes.

### Source interpretation

I used the External Docs folder, as instructed by the Euclid Labs project's AGENTS.md: the VC deck, investor deck, business plan, technology stack, Parametric Triggers, Why Buy Euclid Treaty and the Delos proposal. I also checked recent project discussion on investor/insurance positioning and fees.

Some source material differs: monitoring is described as monthly, quarterly or continuous; the older business plan emphasizes an integrated originator/manager, while the newer VC deck also emphasizes an open platform. The demo should show actual update timestamps and separate the initial operating model from the longer-term platform vision. Avoid copying an unqualified update-frequency claim into the UI.

The current VC fee model says pilot fees are waived; post-pilot SRN structuring is 2% of issued limit paid by the carrier; SRP management is 1.5% of capital annually; performance fees are negotiated per pool. Do not reintroduce the superseded fixed performance fee/hurdle from earlier discussions.

## 2. First pass: make the pitched platform tangible

Assume the presenter has already explained the offering. Open directly into a populated portfolio. Use concise financial labels, contextual help on demand and credible asset information; reserve the main screen space for the product.

| Screen / area | Recommended adjustment | Purpose in a post-pitch demonstration |
|---|---|---|
| Portfolio | Keep it as the landing screen. Lead with market value, principal held, annual expected return and annual expected loss on consistent bases. Add a compact recent-changes or event-status area. | Establish an active, usable investment workspace immediately. |
| Holdings | Use recognizable asset names, consistent values, visible SRN/tranche badges and clear row actions. Preserve the existing portfolio depth. | Let the presenter find and open a relevant example quickly. |
| SRN detail | Put the asset identity, holding, price, return, current EL and event status at the top. Organize deeper content into market terms, risk history, exposure map and event impact. | Make one asset feel like an investment the user can monitor and transact in. |
| Expected-loss charts | Retain underwriting versus current comparisons; add correct dates, clear units and concise change annotations. Use tooltips for definitions. | Visually substantiate the pitch's claim of ongoing risk visibility. |
| Exposure map | Keep it prominent in the risk section with a clear overlay legend and selected-property information. Move map coordinates, grid resolution and technical provenance into expandable detail. | Preserve one of the strongest visual demonstrations without overwhelming the financial information. |
| Event impact | Group modeled damage, attachment, payout, status and the user's potential loss in one compact panel. Distinguish provisional from finalized amounts. | Make the effect on the asset visible without adding an instructional sequence. |
| SRP detail | Lead with the selected tranche and its holding/quote, followed by the pool, capital structure, underlying assets and coverage tests. Highlight selection consistently. | Show that investors can evaluate and select different exposures within the same pool. |
| Waterfall | Keep the visual capital structure. Show a clearly labeled scenario and loss allocation by tranche. An interactive stress control is optional after the core screens are polished. | Make tranche behavior tangible while leaving the presenter in control of the explanation. |
| Marketplace | Keep SRN/SRP tabs. Align price, EL, return, term and availability columns. Use “Request quote” in full. Add useful sorting and a small number of filters. | Make asset discovery and trading look like a coherent product. |
| Trading | Make simulated fills update holdings, cash and inventory consistently; make the trade log reflect those changes. | Ensure the product behaves as the audience expects when the presenter clicks. |
| Collateral and activity | If needed to support the pitch, add a concise collateral status and a few reconciled distribution/settlement/reinvestment records within existing asset pages. | Show evidence of administration without expanding into another application. |
| Presentation reliability | Load key values immediately, preserve navigation context and provide a reliable reset to the starting portfolio. | Support a smooth live demonstration and ad hoc questions. |
| Demo identification | Use a restrained, persistent demo indicator and accurate labels for illustrative data. Keep detailed assumptions available on demand. | Preserve credibility without cluttering screens with repeated disclaimers. |

### Scope decisions

- Remove the proposed onboarding introduction, SRN/SRP teaching diagram and guided walkthrough.
- Keep the current portfolio, marketplace and asset-detail structure; improve its hierarchy and consistency.
- Do not add a separate insurer portal or require a full settlement/reinvestment simulation for this pass.
- Keep financial concepts such as EL, attachment and tranches in the interface. Clarify ambiguous units or labels through concise help rather than explanatory paragraphs.
- Treat an interactive stress slider, multi-asset comparison and a deeper collateral ledger as optional enhancements. Build them only after the existing demonstration is coherent and polished.
- Make the populated example portfolio ready to explore in any order. A hidden presenter reset or saved starting state is more valuable here than a mandatory product tour.

## 3. Numerical findings requiring correction

### P0: one asset has different event losses in different views

The detail pages for owned notes calculate event damage from generated exposure and a composite index. Pool tables use a separate list of fixed damage estimates. These are not the same source.

| Asset | Detail-page damage | Pool-table damage | Detail-page treaty payout | Pool-table treaty payout |
|---|---:|---:|---:|---:|
| SRN 1 | $11,765,836 | $11,800,000 | $0 | $0 |
| SRN 2 | $12,607,569 | $18,400,000 | $3,607,569 | $9,400,000 |
| SRN 3 | $0 | $0 | $0 | $0 |
| SRN 4 | $0 | $0 | $0 | $0 |
| SRN 5 | $99,050,541 | $28,600,000 | $40,000,000 | $16,600,000 |
| SRN 6 | $6,800,000 | $6,800,000 | $0 | $0 |
| SRN 7 | $14,200,000 | $14,200,000 | $4,200,000 | $4,200,000 |
| SRN 8 | $0 | $0 | $0 | $0 |

SRN 1 agrees at the displayed $11.8M precision but still duplicates its source. SRNs 6–8 use fixed market assumptions; those are not independently generated or validated event estimates.

The layer calculation itself is correct: `min(limit, max(0, damage − attachment))`. The input disagreement is the major defect.

Pools also show the **whole underlying treaty payout**, not the pool's participation in it. Add separate columns or an explicit toggle. For example, a pool holding $12M of a $30M note bears 40% of the note's loss, not 100%.

If the existing detail-page event model becomes the common source, the pro-rata current event losses would be $14M for SRP 1 and approximately $15.376M for SRP 2. The pool tables currently imply $5.810M and $10.088M respectively when scaled by ownership. These are conditional, pre-reserve scenario calculations, not booked losses. They must not be confused with the separate, deliberately chosen $7.6M/$12.5M stress examples.

SRN 5 can show a modeled full-limit payout alongside a 1.0000 principal factor and a 97.90 price because the event remains “under review.” The demo needs to explain whether that price predates the event, discounts a provisional estimate or represents another scenario. At finalization, principal, collateral, NAV and holdings must reconcile to the settled loss. Do not automatically book an unverified event as final.

Source: [event calculation](/Users/kiyan/Documents/GitHub/Euclid-Demo/euclid-loss-determination.html:2374), [separate pool estimates](/Users/kiyan/Documents/GitHub/Euclid-Demo/euclid-loss-determination.html:2987).

### P0: pool returns and expected losses do not reconcile to their tranches

| Metric | SRP 1 | SRP 2 |
|---|---:|---:|
| Collateral par | $50,000,000 | $50,000,000 |
| Collateral market value | $49,709,000 | $49,624,000 |
| Collateral value / par | 99.418% | 99.248% |
| Asset value under current formula | $51,539,000 | $51,434,000 |
| Underlying weighted annual EL | 2.4720% | 3.0582% |
| Underlying annual expected-loss dollars | $1,236,000 | $1,529,100 |
| Sum of tranche annual expected-loss dollars | $1,001,000 | $1,506,600 |
| Unexplained loss allocation difference | $235,000 | $22,500 |
| Underlying weighted expected return | 9.7820% | 11.3926% |
| Balance-weighted tranche expected return | 10.6680% | 12.4028% |
| Tranche return dollars above underlying return dollars | $443,000/year | $505,100/year |

Collateral marks, weighted underlying EL, weighted underlying return, and displayed rounded history endpoints reconcile. The tranche economics are independently entered. They have no cash-flow or loss-distribution calculation explaining the differences above. Extra income, reserves or differing metric definitions would need explicit reconciliation; none is implemented. Treat these as unresolved economic inconsistencies, not rounding issues.

Debt tranche returns satisfy their displayed arithmetic. Equity returns of 21.30% and 23.95% are fixed assumptions, not the output of the residual waterfall described on screen. Calculate expected tranche losses from one shared set of pool loss scenarios and calculate distributions from common available cash after expenses. Show fees and the effect of coverage tests. A single deterministic stress is insufficient to validate an expected-loss percentage.

The current VC deck's 1.5% management fee would be $750K annually on each $50M capital base if those terms apply. It is not visibly included in the demo's annual return formulas. Define gross versus net return and which fees apply to these hypothetical pools; do not silently impose fee terms or a fixed performance fee.

Source: [pool calculations](/Users/kiyan/Documents/GitHub/Euclid-Demo/euclid-loss-determination.html:2582), [tranche assumptions](/Users/kiyan/Documents/GitHub/Euclid-Demo/euclid-loss-determination.html:1047).

### P0: coverage tests and equity NAV need defined formulas

- Senior collateral coverage is hard-coded at **127.4%** and **119.2%**. Simple collateral-par/senior-balance calculations produce **166.67%** and **178.57%**; collateral-market-value/senior-balance produces **165.70%** and **177.23%**. A haircut or other denominator could justify another ratio, but no such definition exists in the demo. Define the contractual test before choosing its number.
- Current test cushions are arithmetically correct against their entered inputs. Senior protection of 40%/44% and largest geography/program shares of 28%/26% reconcile to the capital structure and holdings.
- SRP 2 has two “Watch” tests despite both satisfying the stated limits. That may be intentional, but no watch threshold explains why geography is Watch while the identical carrier concentration is Pass. Define warning and breach rules independently.
- Seasonal weights of 64% and 71% are fixed assumptions. The common note seasonality curve assigns 80.42% to July–October and 82.08% to July–November. Either document a different pool-specific meaning/model or derive the figures consistently.
- Equity NAV per unit ($9.72/$9.08) has no outstanding-unit count or residual NAV reconciliation. Add units outstanding, liabilities, reserves and a bridge from pool assets to equity value. Market price and NAV must remain separate fields.
- The asset-value formula adds cash and reserves. State whether reserves are separately funded restricted assets or a designation within cash; adding a cash designation twice would overstate value. Define whether claim reserves are assets, restrictions or liabilities in each displayed measure.

### P0: the time basis is inconsistent

- The calculation date is **September 1, 2026**, but month counting includes all of September as elapsed. SRN 1 therefore shows 15 months remaining when 16 monthly periods remain at that timestamp. Every active instrument is advanced by one monthly period under the same convention.
- Quote timestamps say September 24; risk sections say September 2026; seven of eight SRN histories include October, November or December 2026 as historical observations. Both pool EL histories also end in October. SRN 7 is the only direct-note history without a future observation at the stated date.
- SRN 3's full-term current EL card is **3.975%**, but its seasonally integrated curve starts at **4.8429%**. SRN 8's card is **2.625%**, while the curve starts at **3.3979%**. The straight annual-rate-times-years formula and seasonal curve differ for partial-year terms. Use one definition or explicitly name them as different measures.
- The chart's “current” marker consequently advances to October even though the page says September.

Choose a fixed scenario date, store explicit observation dates, and label future projections separately. Calculate remaining risk from that date with a documented day/month convention. Do not fix this only by changing the date label.

Source: [dates and runoff](/Users/kiyan/Documents/GitHub/Euclid-Demo/euclid-loss-determination.html:2172), [quarterly history labeling](/Users/kiyan/Documents/GitHub/Euclid-Demo/euclid-loss-determination.html:2876).

### P0/P1: portfolio labels do not match their financial meaning

- The seven seeded holdings sum to **$23.2M of notional**. Their quoted market values sum to **$23,045,250**. These totals recalculate correctly. “Total invested” assumes this notional also equals acquisition cost; there is no cost-basis field.
- **“Capital still in term” = $14,853,235** is market value multiplied by each asset's fraction of term remaining. It is not outstanding principal, restricted collateral or withdrawable cash. Replace it with actual funded principal/collateral or a plainly labeled risk measure. Time passing alone does not establish a release of principal in this demo.
- **2.41% weighted EL** and **10.31% weighted expected return** reproduce the current code's market-value-weighted averages. They are averages of rates defined on note/tranche principal, not directly calculated portfolio dollar loss or cash yield. The seeded annual expected-loss dollars are **$560,730**, equivalent to **2.4169% of $23.2M par** or **2.4332% of quoted market value**. Choose a denominator and use it consistently.
- Returns use collateral yield + spread − annualized EL, without purchase-price effects, accrued income, fees or a dated cash-flow schedule. Rename “Total return” to a clearly defined annual estimate on par, or calculate a price-based expected yield. Avoid presenting it as realized performance or yield to maturity.
- Coupons say “SOFR + spread,” while calculations use a field called collateral yield. SOFR is an overnight secured financing benchmark; it is not automatically identical to the yield earned by a collateral portfolio. Separate benchmark rate, coupon and collateral yield, and label demo rate assumptions. [New York Fed definition](https://www.newyorkfed.org/markets/reference-rates/sofr).

Source: [portfolio aggregation](/Users/kiyan/Documents/GitHub/Euclid-Demo/euclid-loss-determination.html:2591).

### P1: model, price and probability inputs are assumptions

All eight annual EL rates and all four debt-tranche return equations recalculate correctly. The supplied expected-loss dollars, attachment/impairment probabilities, prices, ratings, risk spreads and event inputs have no imported actuarial output or transaction documents establishing their accuracy as real assets.

The demo names Verisk Touchstone and a wildfire model version, but the inspected code uses generated exposure, fixed EL assumptions and an internal 85%/5%/5%/5% composite. A real Verisk product name does not establish that these are its outputs. Label the model as illustrative and reserve vendor attribution for a sourced model run. Verisk does document its wildfire model, but that is separate from validating this demo's data. [Verisk model documentation](https://docs.risksolutions.verisk.com/TouchstoneRe/12.0/ts-tsre_all/help_tsre_getting-started_model-us-wf.html).

The composite multiplies total exposure by a burned-cell **count** share and fixed telemetry scores. It is not the same as summing value-weighted property losses. The underlying cell-loss engine produces $8.085M/$6.684M/$70.033M for SRNs 1/2/5, versus the headline $11.766M/$12.608M/$99.051M. The visible inspector currently reports exposure and burn state rather than a loss contribution, so this is a model-definition/provenance issue, not an additional visible payout table error. Remove obsolete single-loss-engine claims and retain one explicit contractual method. The response-effectiveness input should also be visible or derivable; the displayed station, engine and water figures do not calculate it.

No-event assets should show “No active event” or “Not applicable” for event telemetry, instead of 0% detection and zero-second response implying failed sensors or instantaneous response.

## 4. Second pass: fine-tuning and polish

### Functional polish

1. **Make simulated trading coherent.** A test purchase of $500K SRN 6 at 98.55 correctly calculates $492,750 and creates a settled trade, but leaves holdings, available amount and sell eligibility unchanged. Implement session holdings/cash/inventory updates, or label the interaction only as an order demonstration. Recommendation: implement a complete session simulation with a reset button.
2. **Enforce cumulative capacity.** Repeated sales currently see the original position amount. Purchases see the original inventory. Update balances after each fill and validate quantities again at submission. Quote requests must not change holdings.
3. **Separate trade settlement from event settlement.** “Trades settle instantly” and “Trigger settlement: 7–24 days” describe different processes. Use separate labels, and show what starts the event settlement clock.
4. **Use actual demo quote state.** Static September 24 timestamps and a permanent “15 min” label do not expire. Either add working quote expiry/refresh behavior or call them fixed illustrative quotes.
5. **Preserve navigation context.** An underlying note opened from a pool should return to that pool/tranche, with a breadcrumb to the originating portfolio or marketplace. Preserve search, filters and scroll position on Back. Show the top of a newly opened asset.
6. **Avoid full reloads for every route.** They rerun the synthetic map generation and briefly expose SRN 1 placeholder content on other assets. Render basic terms immediately and load map diagnostics separately. Cache deterministic results or precompute the example data.
7. **Handle map failures without blocking the financial story.** Retain a concise fallback and a usable exposure summary. Replace technical fallback language with a concise product status message.
8. **Improve keyboard behavior.** Add modal focus containment and focus return; use descriptive row/button labels; fix the focus style that references undefined `--navy-300`. Confirm all table actions work without a pointer.

### Visual and editorial polish

- Preserve the restrained navy, white and serif/monospace identity. Improve hierarchy rather than introducing a new visual theme.
- Increase small 8–10px labels and dense secondary text. Use monospace for numbers and identifiers, regular sans-serif for explanatory text. Raise contrast where small gray labels are hard to read.
- Prioritize the first-screen data grid around investment decisions, retaining detailed information below. Give each asset a recognizable name such as “Berkeley Hills Wildfire · SRN 2,” with the treaty ID as secondary text.
- Use a persistent selected-tranche summary and section navigation on long detail pages. Put technical map boundaries and repeated quote fields behind disclosure controls.
- Add axes, units, dates and accessible summaries to pool charts. Separate observations from forecasts; do not label all minima “mitigation” without data supporting that attribution.
- Use consistent precision: percentages to two decimals, changes in basis points, clear debt prices per $100 par, equity prices in dollars per unit. Offer exact values on demand where rounded millions conceal changes.
- Separate “Price,” “NAV per unit,” “Collateral value as % of par” and “Principal factor.” They are not interchangeable.
- Replace “1 priority / 2 priority / 3 priority” with “Paid first / second / residual,” and identify loss absorption separately. Retain the existing explanation of losses reaching equity first.
- Use one restrained persistent demo indicator, with local qualification for hypothetical carrier programs and indicative ratings where needed. Avoid repeating long disclaimers across panels.
- Standardize Euclid Labs versus Euclid Risk naming and the manager's displayed legal/illustrative identity. Remove “wireframe for structural review only” from a presentation-ready demo.
- Provide useful empty search results, an obvious reset-demo action and simple, specific loading/error messages.
- Validate laptop and narrow-screen layouts with usable horizontal table scrolling or column prioritization. Desktop visuals were inspected; the browser's viewport override did not change its reported 1600px layout, so smaller breakpoints are a remaining verification item, not a claimed pass.

## 5. Recommended implementation plan

| Order | Priority | Work package | Completion criteria |
|---|---|---|---|
| 1 | P0 | **Define the demo's financial conventions and common dataset.** Fix scenario date, units, cost basis versus par, provisional versus final events, gross/net return, fee treatment, reserve accounting and the intended role of the eight notes/two pools. | Every metric has a meaning, unit, denominator, timestamp and source/assumption. Contract trigger versions and monitoring versions are distinct. No invented vendor outputs or rating claims. |
| 2 | P0 | **Reconcile all calculations.** Replace duplicate event inputs; compute participation losses, term/runoff, portfolio totals, pool coverage, NAV and tranche distributions from shared inputs. | All 14 securities agree across screens; no future observation appears as history; pool/tranche dollars reconcile; reserves and fees are included exactly once; scenario loss conserves dollars through every layer. |
| 3 | P1 | **Refine the product screens.** Improve portfolio hierarchy, SRN summaries, selected-tranche emphasis, risk charts, map presentation and event-impact panels. Keep the existing navigation structure. | After the pitch, the audience can recognize the promised capabilities in the actual screens. The presenter can open any asset and immediately locate its investment, risk and event information. No onboarding or educational flow is added. |
| 4 | P1 | **Complete the interaction model.** Implement simulated fills and cash/holdings updates, capacity constraints, RFQ state, quote freshness, parent breadcrumbs, preserved filters and reset. Add basic sorting; treat multi-asset comparison as optional. | Buy and sell affect the correct balances once; repeated trades cannot exceed capacity; RFQs leave balances unchanged; Back restores the user's context. |
| 5 | P2 | **Polish and verify.** Improve typography, chart labeling, precision, loading behavior, accessibility and smaller screens; remove obsolete calculations and update deployment instructions. | Review every route, all 14 securities and representative stress levels; verify keyboard/modal behavior, map failure, clean reset and a post-pitch presentation rehearsal with flexible navigation. |

### Checks to use during implementation

- For each SRN, verify EL dollars/rate/limit, layer boundaries, payout cap, event state, principal factor, dates, remaining risk, quote units and trade consideration.
- For each pool, verify holdings total, weights, market value, cash, restricted assets/liabilities, fees, coverage tests and concentration limits. Show all reconciliations in dollars before formatting.
- For each tranche, verify layer width against balance, income allocation, loss allocation and NAV. Check zero loss, equity exhaustion, junior exhaustion, full pool loss and reserve/test-breach behavior.
- Verify that a repeated view of the same asset uses the same values, including direct ownership and pool look-through. Show the pool's participation separately from whole-treaty loss.
- Verify scenario dates at inception, month boundaries and maturity. Include SRN 3 and SRN 8 to catch partial-year seasonality errors.
- Exercise both notional-based and unit-based trades, minimum/maximum/invalid quantities, repeated sells, quote expiry, RFQs, reload and logout/reset.
- Keep the production demo unchanged until the first two packages give a coherent scenario to present. A full origination workbench, live execution, production identity/custody integrations and additional perils are later projects, not prerequisites for this post-pitch product-visualization pass. A separate cedent view, full lifecycle simulation and educational walkthrough are also outside the core revision.

## 6. Audit scope and evidence

I inspected the current HTML and its formulas, independently executed the deterministic numerical model for the five owned SRNs, recalculated all eight note and six tranche records, and checked both pool aggregations. Basic ranges, bid ≤ mark ≤ ask, minimum ≤ availability, direct/debt return arithmetic, pool capitalization and layer widths passed. The issues above are cross-view inconsistencies, incomplete economic definitions and user-flow defects that those basic checks cannot catch.

Browser review covered portfolio, marketplace, representative SRN/SRP/equity pages and a local simulated purchase. The rendered SRN 5 page confirms $99.1M damage and $40.0M payout. No order or external quote request was transmitted. The demo source already had local changes when reviewed; this review did not modify them.

This validates arithmetic and internal consistency to the extent stated. It does **not** validate synthetic asset prices, actuarial probabilities, expected losses, ratings, sensor data or trigger coefficients against real transactions or licensed model output. No such supporting asset-level dataset was present in the demo.

Reviewed source SHA-256: `998a722eaade8959b52d389cc13d5f2d0122c029a193f6887bf6ed90ce0d186f`.

### Source files

- [Current demo](/Users/kiyan/Documents/GitHub/Euclid-Demo/euclid-loss-determination.html)
- [External Docs](</Users/kiyan/Library/CloudStorage/GoogleDrive-kmohebbizadeh@gmail.com/.shortcut-targets-by-id/1GjArR7eQ4Y4xq1YAVhd6KchzaVwf07NI/Euclid Labs/External Docs>)
- [VC deck](</Users/kiyan/Library/CloudStorage/GoogleDrive-kmohebbizadeh@gmail.com/.shortcut-targets-by-id/1GjArR7eQ4Y4xq1YAVhd6KchzaVwf07NI/Euclid Labs/External Docs/Euclid Labs Deck - VC.pptx>)
- [Business plan](</Users/kiyan/Library/CloudStorage/GoogleDrive-kmohebbizadeh@gmail.com/.shortcut-targets-by-id/1GjArR7eQ4Y4xq1YAVhd6KchzaVwf07NI/Euclid Labs/External Docs/Euclid Business Plan.docx>)
- [Parametric Triggers](</Users/kiyan/Library/CloudStorage/GoogleDrive-kmohebbizadeh@gmail.com/.shortcut-targets-by-id/1GjArR7eQ4Y4xq1YAVhd6KchzaVwf07NI/Euclid Labs/External Docs/Parametric Triggers.docx>)
- [Technology stack](</Users/kiyan/Library/CloudStorage/GoogleDrive-kmohebbizadeh@gmail.com/.shortcut-targets-by-id/1GjArR7eQ4Y4xq1YAVhd6KchzaVwf07NI/Euclid Labs/External Docs/Euclid's Technology Stack.docx>)
- [Why Buy Euclid Treaty](</Users/kiyan/Library/CloudStorage/GoogleDrive-kmohebbizadeh@gmail.com/.shortcut-targets-by-id/1GjArR7eQ4Y4xq1YAVhd6KchzaVwf07NI/Euclid Labs/External Docs/Why Buy Euclid Treaty.docx>)


## Appendix: every asset checked

These are the current seeded assumptions and recalculated outputs, not approved corrected pricing. “Return” is the demo’s annual estimate; the limitations and needed corrections are above.

### All eight SRNs: economics

| Asset / region | Attachment / limit | Underwriting EL → current EL | Annual EL dollars | Collateral + spread | Return | Attachment probability |
|---|---:|---:|---:|---:|---:|---:|
| SRN 1 · Berkeley Hills | $30.000M / $35.000M | 1.10% → 1.00% | $350,000 | 3.75% + 4.65% | 7.40% | 2.40% |
| SRN 2 · Berkeley Hills | $9.000M / $30.000M | 3.74% → 3.48% | $1,044,000 | 3.75% + 12.27% | 12.54% | 14.80% |
| SRN 3 · Mill Valley | $20.000M / $25.000M | 2.20% → 2.65% | $662,500 | 3.75% + 7.60% | 8.70% | 6.30% |
| SRN 4 · Truckee | $16.000M / $28.000M | 2.50% → 2.80% | $784,000 | 3.75% + 9.40% | 10.35% | 8.90% |
| SRN 5 · Los Angeles | $12.000M / $40.000M | 2.80% → 3.30% | $1,320,000 | 3.75% + 11.60% | 12.05% | 12.60% |
| SRN 6 · Napa Valley | $18.000M / $32.000M | 2.40% → 2.70% | $864,000 | 3.75% + 8.70% | 9.75% | 7.40% |
| SRN 7 · San Diego | $10.000M / $45.000M | 2.90% → 3.15% | $1,417,500 | 3.75% + 10.85% | 11.45% | 11.20% |
| SRN 8 · Ventura County | $25.000M / $38.000M | 1.60% → 1.75% | $665,000 | 3.75% + 6.90% | 8.90% | 4.80% |

### All eight SRNs: position, quote and dates

Bid, mark and ask are per $100 par. Remaining months/EL below reproduce the existing date calculation; they require the time-basis corrections described above.

| Asset | Held notional / market value | Bid / mark / ask | Available / minimum | Start → maturity | Remaining months / EL |
|---|---:|---:|---:|---|---:|
| SRN 1 | $3,200,000 / $3,212,800 | 100.28 / 100.40 / 100.52 | $2,200,000 / $250,000 | 2026-01-01 → 2027-12-31 | 15 / 1.15% |
| SRN 2 | $4,600,000 / $4,547,100 | 98.70 / 98.85 / 99.00 | $1,400,000 / $500,000 | 2025-10-01 → 2028-09-30 | 24 / 6.96% |
| SRN 3 | $2,400,000 / $2,428,800 | 101.02 / 101.20 / 101.38 | $2,800,000 / $250,000 | 2026-04-01 → 2027-09-30 | 12 / 2.65% |
| SRN 4 | $1,800,000 / $1,791,900 | 99.35 / 99.55 / 99.75 | $3,600,000 / $100,000 | 2026-03-01 → 2028-02-29 | 17 / 3.26% |
| SRN 5 | $4,100,000 / $4,013,900 | 97.78 / 97.90 / 98.02 | $4,300,000 / $250,000 | 2025-07-01 → 2027-06-30 | 9 / 1.07% |
| SRN 6 | $0 / $0 | 98.25 / 98.40 / 98.55 | $3,500,000 / $500,000 | 2026-02-01 → 2028-01-31 | 16 / 3.13% |
| SRN 7 | $0 / $0 | 101.07 / 101.25 / 101.43 | $2,100,000 / $250,000 | 2025-11-01 → 2027-10-31 | 13 / 3.56% |
| SRN 8 | $0 / $0 | 98.90 / 99.10 / 99.30 | $4,800,000 / $100,000 | 2026-05-01 → 2027-10-31 | 13 / 1.98% |

### All six SRP tranches: economics

Pool 1 matures December 31, 2028; Pool 2 matures September 30, 2028. All current factors are 1.0000. Ratings are explicitly demonstration assumptions. Tranche expected losses and equity returns remain unreconciled to pool economics.

| Tranche | Balance | Loss attachment–detachment | Underwriting → current EL | Coupon / distribution | Expected return | Impairment probability |
|---|---:|---:|---:|---|---:|---:|
| SRP 1 Senior | $30,000,000 | 40–100% | 0.42% → 0.35% | SOFR + 3.65% | 7.10% | 0.80% |
| SRP 1 Junior | $12,000,000 | 16–40% | 2.18% → 2.40% | SOFR + 11.10% | 12.50% | 5.60% |
| SRP 1 Equity | $8,000,000 | 0–16% | 6.85% → 7.60% | Residual cash flow | 21.30% | 18.40% |
| SRP 2 Senior | $28,000,000 | 44–100% | 0.55% → 0.62% | SOFR + 4.70% | 7.88% | 1.30% |
| SRP 2 Junior | $13,000,000 | 18–44% | 3.25% → 3.85% | SOFR + 14.20% | 14.15% | 8.90% |
| SRP 2 Equity | $9,000,000 | 0–18% | 8.10% → 9.25% | Residual cash flow | 23.95% | 24.60% |

### All six SRP tranches: quote and ownership

Debt prices are per $100 par. Equity quotes and NAV are dollars per unit; equity availability/minimums are units.

| Tranche | Held notional or units / market value | Bid / mark / ask | Available / minimum | Equity NAV per unit |
|---|---:|---:|---:|---:|
| SRP 1 Senior | $4,400,000 / $4,408,800 | 100.05 / 100.20 / 100.35 | $8,000,000 / $500,000 | — |
| SRP 1 Junior | $0 / $0 | 98.40 / 98.75 / 99.10 | $4,000,000 / $250,000 | — |
| SRP 1 Equity | 0 units / $0 | $9.35 / $9.65 / $9.90 | 600,000 units / 25,000 units | $9.72 |
| SRP 2 Senior | $0 / $0 | 99.52 / 99.70 / 99.88 | $7,500,000 / $500,000 | — |
| SRP 2 Junior | $2,700,000 / $2,641,950 | 97.50 / 97.85 / 98.20 | $3,200,000 / $250,000 | — |
| SRP 2 Equity | 0 units / $0 | $8.55 / $8.90 / $9.25 | 720,000 units / 25,000 units | $9.08 |

### Checks that passed

- Eight note return equations and four debt-tranche return equations match their displayed inputs. Equity returns remain fixed residual assumptions.
- Both pools contain $50M of underlying par; tranche balances also total $50M. Layer widths match balances with no gaps or overlaps.
- SRP 1’s $7.6M stress goes entirely to its $8M equity. SRP 2’s $12.5M stress allocates $9M to equity and $3.5M to junior. These match the coded loss order.
- All marks fall within bid/ask. All minimum orders fit the initial available inventory. The seeded holdings and pool participations do not exceed the corresponding SRN limits.
- The displayed quote consideration formula is correct for both units and notional; it still needs principal-factor/accrual conventions and state updates for settled trades.
- Pool EL and collateral NAV history endpoints match the current rounded pool summaries; their observation dates require correction.

[Complete numeric audit data](/Users/kiyan/Documents/GitHub/Euclid-Demo/EUCLID_DEMO_NUMERIC_AUDIT.json) includes all seeded asset fields, computed terms, quotes, pool reconciliations and generated event totals.
