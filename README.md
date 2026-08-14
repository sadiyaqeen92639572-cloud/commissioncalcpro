# CommissionCalcPro

Real estate commission calculator suite — built around the 2024 NAR settlement rules.

Live: [commissioncalcpro.com](https://commissioncalcpro.com)

## What it does

Most commission calculators still assume the old "seller pays 5-6% total, full stop" model. Since the August 17, 2024 NAR settlement, buyer-agent compensation is no longer automatically owed by the seller — it's negotiated separately. This site's calculator is built around a 3-mode toggle (seller covers buyer agent: Yes / No / Concession %) that reflects the current rules, plus:

- Net proceeds calculator
- Seller closing cost calculator
- Commission split calculator
- Realtor fees by state — sourced ranges (Clever, FastExpert), not a single made-up average
- NAR settlement explainer

## Stack

Static HTML, no build pipeline. `generate-pages.js` generates the satellite pages from `data/state-commission-ranges.json`. `generate-sitemap.js` keeps `sitemap.xml` in sync. Deployed on Cloudflare Pages.

## Free Companion Tools

[Buyer's Agent Commission Checker](https://sadiyaqeen92639572-cloud.github.io/buyer-agent-commission-checker/) — quick free tool for "who pays the buyer's agent now?" using the same post-NAR-settlement 3-mode coverage logic (seller covers full / buyer pays / concession %). Good for a fast directional answer before using the full calculator above.
