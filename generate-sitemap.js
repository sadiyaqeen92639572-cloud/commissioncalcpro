const fs = require('fs');
const DOMAIN = 'https://commissioncalcpro.com';

const paths = [
  '/', '/nar-settlement-explained/', '/net-proceeds-calculator/',
  '/seller-closing-cost-calculator/', '/commission-split-calculator/',
  '/realtor-fees-by-state/', '/buyer-agent-commission/', '/about/', '/privacy/', '/changelog/'
];

const today = new Date().toISOString().slice(0, 10);
const existing = paths.filter(p => fs.existsSync('.' + p + (p === '/' ? 'index.html' : 'index.html')));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${existing.map(p => `  <url><loc>${DOMAIN}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync('sitemap.xml', xml);
console.log(`sitemap.xml written with ${existing.length} URLs`);
