
import { getUserAffiliateData } from './AffiliateService';
import { getUserBalance, isUserActive } from './UserBalanceService';
import { getTradeHistory } from './TradeService';
import { rankCommissionPercentages } from './RankService';

/**
 * Retrieves all dashboard data for a user
 * @param userId The user ID to fetch dashboard data for
 * @returns Promise containing all dashboard data
 */
export async function getDashboardData(userId: string) {
  const [
    tradeHistory,
    affiliateData,
    balanceData
  ] = await Promise.all([
    getTradeHistory(userId),
    getUserAffiliateData(userId),
    getUserBalance(userId)
  ]);

  return {
    tradeHistory,
    networkStats: affiliateData,
    balanceData,
    referralData: rankCommissionPercentages,
    networkGrowth: [],
    revenueData: []
  };
}
