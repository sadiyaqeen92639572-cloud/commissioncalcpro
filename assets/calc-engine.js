/*
 * Shared commission/split/net-proceeds/closing-cost math.
 * Buyer-agent-coverage toggle reflects the Aug 17 2024 NAR settlement: buyer-agent
 * compensation is no longer standard MLS-listed seller cost, it's negotiated separately.
 * "yes" = seller covers it in full (traditional model, still common), "no" = seller pays
 * only their own listing agent, "concession" = seller covers a custom partial amount.
 */

function calcCommission({ salePrice, listingAgentPct, buyerAgentCoverage, buyerAgentPct, concessionPct }) {
  salePrice = Number(salePrice) || 0;
  listingAgentPct = Number(listingAgentPct) || 0;
  buyerAgentPct = Number(buyerAgentPct) || 0;
  concessionPct = Number(concessionPct) || 0;

  const listingAgentFee = salePrice * (listingAgentPct / 100);
  let buyerAgentFeePaidBySeller = 0;
  let coverageNote = '';

  if (buyerAgentCoverage === 'yes') {
    buyerAgentFeePaidBySeller = salePrice * (buyerAgentPct / 100);
    coverageNote = 'Seller covers the buyer\'s agent fee in full, same as the traditional pre-2024 model.';
  } else if (buyerAgentCoverage === 'no') {
    buyerAgentFeePaidBySeller = 0;
    coverageNote = 'Seller pays only their own listing agent. Since the Aug 17, 2024 NAR settlement, the buyer\'s agent fee is negotiated separately between the buyer and their agent — it is no longer automatically added to the seller\'s cost.';
  } else if (buyerAgentCoverage === 'concession') {
    buyerAgentFeePaidBySeller = salePrice * (concessionPct / 100);
    coverageNote = `Seller offers a ${concessionPct}% concession toward the buyer's agent fee as a negotiating point, not the full ${buyerAgentPct}% traditional rate.`;
  }

  const totalSellerPaid = listingAgentFee + buyerAgentFeePaidBySeller;

  return {
    listingAgentFee,
    buyerAgentFeePaidBySeller,
    totalSellerPaid,
    effectivePct: salePrice > 0 ? (totalSellerPaid / salePrice) * 100 : 0,
    coverageNote
  };
}

function calcSplit({ commissionAmount, agentSplitPct }) {
  commissionAmount = Number(commissionAmount) || 0;
  agentSplitPct = Number(agentSplitPct) || 0;
  const agentTakeHome = commissionAmount * (agentSplitPct / 100);
  const brokerageKeeps = commissionAmount - agentTakeHome;
  return { agentTakeHome, brokerageKeeps };
}

function calcNetProceeds({ salePrice, mortgagePayoff, totalCommission, otherClosingCostsPct }) {
  salePrice = Number(salePrice) || 0;
  mortgagePayoff = Number(mortgagePayoff) || 0;
  totalCommission = Number(totalCommission) || 0;
  otherClosingCostsPct = Number(otherClosingCostsPct) || 0;
  const otherClosingCosts = salePrice * (otherClosingCostsPct / 100);
  const netProceeds = salePrice - mortgagePayoff - totalCommission - otherClosingCosts;
  return { otherClosingCosts, netProceeds };
}

function calcSellerClosingCosts({ salePrice, totalCommission, otherClosingCostsPct }) {
  salePrice = Number(salePrice) || 0;
  totalCommission = Number(totalCommission) || 0;
  otherClosingCostsPct = Number(otherClosingCostsPct) || 0;
  const otherClosingCosts = salePrice * (otherClosingCostsPct / 100);
  const totalClosingCosts = totalCommission + otherClosingCosts;
  return { otherClosingCosts, totalClosingCosts, totalClosingCostsPct: salePrice > 0 ? (totalClosingCosts / salePrice) * 100 : 0 };
}

function fmtUSD(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}
function fmtPct(n) {
  return n.toFixed(2) + '%';
}

if (typeof module !== 'undefined') {
  module.exports = { calcCommission, calcSplit, calcNetProceeds, calcSellerClosingCosts, fmtUSD, fmtPct };
}
