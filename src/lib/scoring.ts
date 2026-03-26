import { FinancialData, CompanyProfile, StrategyWarranty, ConfidenceRating } from '../types';

/**
 * M3: The Confidence Scoring System (Algorithm)
 * Weighting:
 * Financial Health (Growth, Profit margins): 50%
 * Documentation Completeness (NIF, ID, Strategy): 30%
 * Financial Warranty/Security Deposit: 20%
 */
export function calculateConfidenceScore(
  financials: FinancialData | null,
  profile: CompanyProfile | null,
  strategy: StrategyWarranty | null
): ConfidenceRating {
  let financialHealth = 0;
  let documentation = 0;
  let warranty = 0;

  // 1. Financial Health (50%)
  if (financials) {
    // Profit margin score
    const margin = financials.revenue > 0 ? (financials.profit / financials.revenue) * 100 : 0;
    if (margin > 20) financialHealth = 50;
    else if (margin > 10) financialHealth = 40;
    else if (margin > 0) financialHealth = 30;
    else financialHealth = 10;
  }

  // 2. Documentation Completeness (30%)
  if (profile) {
    if (profile.companyName && profile.nifNumber) documentation += 10;
    if (profile.idCardUrl) documentation += 10;
  }
  if (strategy) {
    if (strategy.marketingStrategy && strategy.salesStrategy) documentation += 10;
  }

  // 3. Financial Warranty (20%)
  if (strategy && strategy.isWarrantyCertified) {
    warranty = 20;
  }

  const totalScore = financialHealth + documentation + warranty;
  
  let readiness: 'Low' | 'Medium' | 'High' = 'Low';
  if (totalScore > 80) readiness = 'High';
  else if (totalScore > 50) readiness = 'Medium';

  return {
    companyUid: profile?.ownerUid || '',
    score: totalScore,
    readiness,
    isPromoted: totalScore > 80,
    breakdown: {
      financialHealth,
      documentation,
      warranty
    },
    updatedAt: new Date().toISOString()
  };
}
