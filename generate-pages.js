const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://commissioncalcpro.com';
const LAST_REVIEWED = '2026-08-14';
const GSC_TAG = 'Zy97BXFfloEJYL3fbclF9Rp-NLbyUuzG5FKGp2-DbgE';
const ORG = {
  '@type': 'Organization',
  name: 'Gesmine-Invest Limited',
  legalName: 'Gesmine-Invest Limited',
  url: DOMAIN,
  identifier: { '@type': 'PropertyValue', propertyID: 'UK Company Number', value: '14120136' },
  address: { '@type': 'PostalAddress', streetAddress: 'Hardy House, 269 Poynders Gardens', addressLocality: 'London', postalCode: 'SW4 8PQ', addressCountry: 'GB' }
};
const stateData = require('./data/state-commission-ranges.json');

function webApp(fields) {
  return Object.assign({
    '@type': 'WebApplication',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    dateModified: LAST_REVIEWED,
    author: ORG,
    publisher: ORG,
    version: `2026-08-v1`
  }, fields);
}

function layout({ title, description, canonicalPath, h1, subtitle, jsonLd, bodyHtml }) {
  const canonical = `${DOMAIN}${canonicalPath}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary_large_image">
<meta name="google-site-verification" content="${GSC_TAG}" />
<link rel="stylesheet" href="/assets/styles.css">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<header>
<a href="/">CommissionCalcPro</a>
<h1>${h1}</h1>
<p>${subtitle}</p>
<p class="reviewed-badge">Last reviewed ${LAST_REVIEWED}</p>
</header>
<nav class="crumbs"><a href="/">Home</a> / ${h1}</nav>
<main>
${bodyHtml}
</main>
<footer>
<p>CommissionCalcPro is published by Gesmine-Invest Limited, registered UK company number 14120136, registered office at Hardy House, 269 Poynders Gardens, London, United Kingdom, SW4 8PQ.</p>
<p><a href="/about/">About</a> · <a href="/privacy/">Privacy</a> · <a href="/changelog/">Changelog</a> · &copy; 2026 CommissionCalcPro. Estimates only — not legal, tax, or financial advice.</p>
</footer>
<script src="/assets/calc-engine.js"></script>
</body>
</html>
`;
}

function faqJsonLd(items) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a }
    }))
  };
}

function write(dir, html) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('wrote', dir);
}

// ---- nar-settlement-explained ----
{
  const faq = faqJsonLd([
    ['When did the NAR settlement take effect?', 'August 17, 2024. NAR agreed to a $418 million settlement and sweeping changes to MLS policy.'],
    ['Does the seller have to pay the buyer\'s agent now?', 'No. That fee is negotiated separately between buyer and buyer\'s agent. About 35% of sellers still choose to cover it as a concession, but it is optional.'],
    ['What else changed?', 'Compensation offers were removed from MLS listings/data feeds entirely, and buyer\'s agents must now sign written agreements with buyers before touring homes.']
  ]);
  const body = `
<section>
<h2>What the 2024 NAR settlement actually changed</h2>
<p>Effective <strong>August 17, 2024</strong>, the National Association of Realtors settled a set of antitrust lawsuits for $418 million and agreed to change how commission offers work across the MLS system nationwide.</p>
<h3>1. Buyer-agent compensation is off the MLS</h3>
<p>Sellers' agents can no longer list how much they're offering a buyer's agent directly on the MLS. Compensation fields were stripped from MLS data feeds and listing displays entirely.</p>
<h3>2. Sellers are no longer automatically on the hook for both agents</h3>
<p>Before the settlement, the standard practice was: seller pays their own agent, and that agent's commission included an amount passed to the buyer's agent. Now, the buyer's agent fee is negotiated directly between buyer and agent — a seller can still choose to cover it as part of the deal, but it's a negotiating point, not a default.</p>
<h3>3. Buyers need a signed agreement before touring</h3>
<p>Real estate agents must now have a written buyer-representation agreement in place before showing homes, spelling out how that agent gets paid.</p>
<h3>What this means for your numbers</h3>
<p>Any commission calculator that assumes "seller always pays 5-6% total" is describing the old model. Use the toggle on the <a href="/">commission calculator</a> to see your number under "seller covers it," "seller doesn't," or a negotiated concession.</p>
</section>
<section>
<h2>FAQ</h2>
${faq.mainEntity.map(q => `<h3>${q.name}</h3><p>${q.acceptedAnswer.text}</p>`).join('\n')}
</section>`;
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', headline: 'The 2024 NAR Settlement, Explained', datePublished: '2026-08-14', dateModified: LAST_REVIEWED, author: ORG, publisher: ORG },
    faq,
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: DOMAIN + '/' },
      { '@type': 'ListItem', position: 2, name: 'NAR Settlement Explained', item: DOMAIN + '/nar-settlement-explained/' }
    ]},
    ORG
  ]};
  write('nar-settlement-explained', layout({
    title: 'The 2024 NAR Settlement Explained — What Sellers Actually Owe Now',
    description: 'What changed on August 17, 2024: buyer-agent commission is off the MLS and no longer automatically paid by the seller. Here\'s what it means for your sale.',
    canonicalPath: '/nar-settlement-explained/',
    h1: 'The 2024 NAR Settlement, Explained',
    subtitle: 'What actually changed for sellers, and what didn\'t.',
    jsonLd, bodyHtml: body
  }));
}

// ---- net-proceeds-calculator ----
{
  const body = `
<form id="calc-form">
  <label>Sale price ($) <input type="number" id="salePrice" value="450000" min="0" step="1000"></label>
  <label>Remaining mortgage payoff ($) <input type="number" id="mortgagePayoff" value="200000" min="0" step="1000"></label>
  <label>Total commission ($) <input type="number" id="totalCommission" value="24750" min="0" step="100"></label>
  <label>Other closing costs (%) <input type="number" id="otherPct" value="1.5" min="0" max="10" step="0.1"></label>
  <button type="submit" class="submit-btn">Calculate net proceeds</button>
</form>
<div id="results-block">
  <div class="result-amount" id="r-net">$0</div>
  <div class="result-row"><span>Other closing costs</span><span id="r-other">$0</span></div>
  <p class="privacy-note">This is an estimate. Not a Comparative Market Analysis or a substitute for a title company's settlement statement.</p>
</div>
<section>
<h2>How this is calculated</h2>
<p class="privacy-note">net_proceeds = sale_price − mortgage_payoff − total_commission − (sale_price × other_closing_costs_pct)</p>
<p>Get your commission number from the <a href="/">commission calculator</a> first — it accounts for whether you're covering the buyer's agent fee under the 2024 NAR settlement rules.</p>
</section>
<script>
document.getElementById('calc-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const r = calcNetProceeds({
    salePrice: document.getElementById('salePrice').value,
    mortgagePayoff: document.getElementById('mortgagePayoff').value,
    totalCommission: document.getElementById('totalCommission').value,
    otherClosingCostsPct: document.getElementById('otherPct').value
  });
  document.getElementById('r-net').textContent = fmtUSD(r.netProceeds);
  document.getElementById('r-other').textContent = fmtUSD(r.otherClosingCosts);
  document.getElementById('results-block').classList.add('visible');
});
</script>`;
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    webApp({ name: 'Net Proceeds Calculator' }),
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: DOMAIN + '/' },
      { '@type': 'ListItem', position: 2, name: 'Net Proceeds Calculator', item: DOMAIN + '/net-proceeds-calculator/' }
    ]},
    ORG
  ]};
  write('net-proceeds-calculator', layout({
    title: 'Net Proceeds Calculator — What You Actually Walk Away With',
    description: 'Estimate your net proceeds after mortgage payoff, commission, and closing costs when selling your home.',
    canonicalPath: '/net-proceeds-calculator/',
    h1: 'Net Proceeds Calculator',
    subtitle: 'Sale price minus mortgage, commission, and closing costs.',
    jsonLd, bodyHtml: body
  }));
}

// ---- seller-closing-cost-calculator ----
{
  const body = `
<form id="calc-form">
  <label>Sale price ($) <input type="number" id="salePrice" value="450000" min="0" step="1000"></label>
  <label>Total commission ($) <input type="number" id="totalCommission" value="24750" min="0" step="100"></label>
  <label>Other closing costs (%) <input type="number" id="otherPct" value="1.5" min="0" max="10" step="0.1"></label>
  <button type="submit" class="submit-btn">Calculate closing costs</button>
</form>
<div id="results-block">
  <div class="result-amount" id="r-total">$0</div>
  <div class="result-row"><span>Other closing costs</span><span id="r-other">$0</span></div>
  <div class="result-row"><span>As % of sale price</span><span id="r-pct">0%</span></div>
</div>
<section>
<h2>What's typically included</h2>
<p>Seller closing costs usually include commission (the biggest line item, see the <a href="/">commission calculator</a>) plus title fees, transfer taxes, prorated property taxes, and any negotiated buyer credits. Sellers commonly pay 6-10% of sale price total including commission.</p>
</section>
<script>
document.getElementById('calc-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const r = calcSellerClosingCosts({
    salePrice: document.getElementById('salePrice').value,
    totalCommission: document.getElementById('totalCommission').value,
    otherClosingCostsPct: document.getElementById('otherPct').value
  });
  document.getElementById('r-total').textContent = fmtUSD(r.totalClosingCosts);
  document.getElementById('r-other').textContent = fmtUSD(r.otherClosingCosts);
  document.getElementById('r-pct').textContent = fmtPct(r.totalClosingCostsPct);
  document.getElementById('results-block').classList.add('visible');
});
</script>`;
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    webApp({ name: 'Seller Closing Cost Calculator' }),
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: DOMAIN + '/' },
      { '@type': 'ListItem', position: 2, name: 'Seller Closing Cost Calculator', item: DOMAIN + '/seller-closing-cost-calculator/' }
    ]},
    ORG
  ]};
  write('seller-closing-cost-calculator', layout({
    title: 'Seller Closing Cost Calculator — Commission Plus Everything Else',
    description: 'Estimate total seller closing costs including commission, title fees, and transfer taxes.',
    canonicalPath: '/seller-closing-cost-calculator/',
    h1: 'Seller Closing Cost Calculator',
    subtitle: 'Commission is the biggest line item — see the full picture.',
    jsonLd, bodyHtml: body
  }));
}

// ---- commission-split-calculator ----
{
  const body = `
<form id="calc-form">
  <label>Total commission ($) <input type="number" id="commissionAmount" value="24750" min="0" step="100"></label>
  <label>Agent's split (%) <input type="number" id="agentSplitPct" value="70" min="0" max="100" step="1"></label>
  <button type="submit" class="submit-btn">Calculate split</button>
</form>
<div id="results-block">
  <div class="result-row"><span>Agent take-home</span><span id="r-agent">$0</span></div>
  <div class="result-row"><span>Brokerage keeps</span><span id="r-broker">$0</span></div>
</div>
<section>
<h2>Typical splits</h2>
<p>A common split is 70/30 (agent/brokerage), but traditional brokerages often keep 30-50%, leaving the agent 50-70%. Splits vary by brokerage model — 100%-commission brokerages charge flat desk fees instead.</p>
</section>
<script>
document.getElementById('calc-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const r = calcSplit({
    commissionAmount: document.getElementById('commissionAmount').value,
    agentSplitPct: document.getElementById('agentSplitPct').value
  });
  document.getElementById('r-agent').textContent = fmtUSD(r.agentTakeHome);
  document.getElementById('r-broker').textContent = fmtUSD(r.brokerageKeeps);
  document.getElementById('results-block').classList.add('visible');
});
</script>`;
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    webApp({ name: 'Commission Split Calculator' }),
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: DOMAIN + '/' },
      { '@type': 'ListItem', position: 2, name: 'Commission Split Calculator', item: DOMAIN + '/commission-split-calculator/' }
    ]},
    ORG
  ]};
  write('commission-split-calculator', layout({
    title: 'Real Estate Commission Split Calculator — Agent vs Brokerage',
    description: 'Calculate how much of the commission goes to the agent vs the brokerage under any split percentage.',
    canonicalPath: '/commission-split-calculator/',
    h1: 'Commission Split Calculator',
    subtitle: 'Agent take-home vs brokerage cut, at any split.',
    jsonLd, bodyHtml: body
  }));
}

// ---- buyer-agent-commission ----
{
  const faq = faqJsonLd([
    ['Who pays the buyer\'s agent commission?', 'Since the Aug 2024 NAR settlement, it\'s negotiated directly between the buyer and their agent — not automatically paid by the seller. Buyers sign a representation agreement upfront specifying how their agent gets paid.'],
    ['Can a seller still offer to cover it?', 'Yes — sellers can still offer a concession toward the buyer\'s agent fee as a negotiating point, but it\'s no longer the MLS-listed default.'],
    ['What if the buyer can\'t afford to pay their agent directly?', 'Some buyers negotiate the fee into the purchase offer, roll it into closing costs, or ask the seller for a concession. It varies by deal.']
  ]);
  const body = `
<section>
<h2>Who pays the buyer's agent now?</h2>
<p>Before August 2024, the standard model was simple: the seller's agent commission included a portion earmarked for the buyer's agent, listed right on the MLS. That's gone.</p>
<p>Now, buyer's agents are required to sign a written agreement with their buyer before showing homes, spelling out how that agent gets paid — directly by the buyer, negotiated into the offer, or via a seller concession if one is offered.</p>
<p>Use the <a href="/">commission calculator</a>'s toggle to model your specific scenario — seller covers it, doesn't, or offers a partial concession.</p>
</section>
<section>
<h2>FAQ</h2>
${faq.mainEntity.map(q => `<h3>${q.name}</h3><p>${q.acceptedAnswer.text}</p>`).join('\n')}
</section>`;
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    faq,
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: DOMAIN + '/' },
      { '@type': 'ListItem', position: 2, name: 'Buyer Agent Commission', item: DOMAIN + '/buyer-agent-commission/' }
    ]},
    ORG
  ]};
  write('buyer-agent-commission', layout({
    title: 'Who Pays the Buyer\'s Agent Commission? (2024 Rules)',
    description: 'Since the 2024 NAR settlement, buyer-agent commission is negotiated separately, not automatically paid by the seller. Here\'s how it works now.',
    canonicalPath: '/buyer-agent-commission/',
    h1: 'Who Pays the Buyer\'s Agent Commission?',
    subtitle: 'It changed in 2024 — here\'s the current rule.',
    jsonLd, bodyHtml: body
  }));
}

// ---- realtor-fees-by-state (single hub page, no per-state URLs) ----
{
  const rows = Object.entries(stateData.states).map(([slug, s]) => {
    const srcText = s.sources.length
      ? s.sources.map(src => `${src.name} (${src.survey_date}${src.sample_size ? ', n=' + src.sample_size : ''}): ${src.avg_pct}%`).join('; ')
      : 'No state-specific source cited yet — national range shown';
    return `<tr><td>${s.name}</td><td>${s.range_low_pct}% – ${s.range_high_pct}%</td><td>${srcText}</td></tr>`;
  }).join('\n');
  const natRows = stateData.national_sources.map(s =>
    `<tr><td>${s.name}</td><td>${s.survey_date}</td><td>n=${s.sample_size}${s.sample_note ? ' (' + s.sample_note + ')' : ''}</td><td>${s.avg_pct}%</td></tr>`
  ).join('\n');
  const body = `
<div class="source-range-note">${stateData.note}</div>
<section>
<h2>National survey figures</h2>
<table><tr><th>Source</th><th>Survey date</th><th>Sample</th><th>National avg</th></tr>${natRows}</table>
</section>
<section>
<h2>Commission ranges by state</h2>
<table><tr><th>State</th><th>Range</th><th>Cited source(s)</th></tr>${rows}</table>
<p class="formula-footnote">Last updated ${stateData.last_updated}. States without a cited source show the national range only — we do not publish invented state figures.</p>
</section>
<section>
<h2>Use the calculator</h2>
<p>These ranges show what surveys report — your actual rate is whatever you negotiate with your agent. Run your own numbers in the <a href="/">commission calculator</a>.</p>
</section>`;
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Dataset', name: 'Real Estate Commission Ranges by State', dateModified: stateData.last_updated },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: DOMAIN + '/' },
      { '@type': 'ListItem', position: 2, name: 'Realtor Fees by State', item: DOMAIN + '/realtor-fees-by-state/' }
    ]},
    ORG
  ]};
  write('realtor-fees-by-state', layout({
    title: 'Realtor Fees by State — Sourced Ranges, Not One Made-Up Number',
    description: 'Real estate commission ranges by state, sourced from multiple surveys with sample size and date shown — not a single unsourced average.',
    canonicalPath: '/realtor-fees-by-state/',
    h1: 'Realtor Fees by State',
    subtitle: 'Ranges with sources, not one number presented as fact.',
    jsonLd, bodyHtml: body
  }));
}

// ---- about ----
{
  const body = `
<section>
<h2>About CommissionCalcPro</h2>
<p>CommissionCalcPro is published by Gesmine-Invest Limited, registered UK company number 14120136, registered office at Hardy House, 269 Poynders Gardens, London, United Kingdom, SW4 8PQ. This site provides free calculators for real estate commission, net proceeds, and closing costs, built to reflect the current rules following the August 2024 NAR settlement.</p>
<h3>Sourcing methodology</h3>
<p>We don't publish a single "average commission" figure. NAR does not release official per-state averages, so every number on this site traces to a named referral-company survey with its sample size and survey date shown — see <a href="/realtor-fees-by-state/">realtor fees by state</a> for the full sourced ranges. Site content last reviewed ${LAST_REVIEWED}.</p>
<p>We are not a brokerage, not a licensed real estate agent, and not a party to any transaction. Calculators here provide estimates for informational purposes — always confirm numbers with your actual listing agreement and a licensed professional.</p>
<h3>Affiliate disclosure</h3>
<p>Some links on this site may be affiliate links, meaning we may earn a fee if you're referred to a partner service. This does not affect the numbers our calculators produce.</p>
</section>`;
  const jsonLd = { '@context': 'https://schema.org', '@graph': [ORG] };
  write('about', layout({
    title: 'About CommissionCalcPro',
    description: 'Who publishes CommissionCalcPro and how our calculators work.',
    canonicalPath: '/about/',
    h1: 'About',
    subtitle: '',
    jsonLd, bodyHtml: body
  }));
}

// ---- privacy ----
{
  const body = `
<section>
<h2>Privacy Policy</h2>
<p>Calculator inputs are processed entirely in your browser and are not sent to our servers.</p>
<p>If you submit the quote-request form, we collect your name, email, ZIP code, and estimated sale price to connect you with a local agent or partner. We do not sell this information to unrelated third parties.</p>
<p>Last updated 2026-08-14.</p>
</section>`;
  const jsonLd = { '@context': 'https://schema.org', '@graph': [ORG] };
  write('privacy', layout({
    title: 'Privacy Policy — CommissionCalcPro',
    description: 'How CommissionCalcPro handles your data.',
    canonicalPath: '/privacy/',
    h1: 'Privacy Policy',
    subtitle: '',
    jsonLd, bodyHtml: body
  }));
}

// ---- changelog ----
{
  const body = `
<section>
<h2>Changelog</h2>
<ul>
<li><strong>2026-08-14</strong> — Site launched: commission calculator with buyer-agent-coverage toggle (NAR settlement), net proceeds, closing cost, and split calculators; realtor fees by state hub with sourced ranges.</li>
</ul>
</section>`;
  const jsonLd = { '@context': 'https://schema.org', '@graph': [ORG] };
  write('changelog', layout({
    title: 'Changelog — CommissionCalcPro',
    description: 'What changed on CommissionCalcPro and when.',
    canonicalPath: '/changelog/',
    h1: 'Changelog',
    subtitle: '',
    jsonLd, bodyHtml: body
  }));
}

console.log('Done.');
