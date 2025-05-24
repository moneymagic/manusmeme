
import { Upline, CommissionDistribution } from './CommissionTypes';
import { 
  rankCommissionPercentages, 
  getMinimumRankRequired, 
  isRankQualified 
} from './RankService';

/**
 * Distributes commission across a chain of uplines based on their ranks
 * Uses compression: if an upline doesn't have the required rank for a level,
 * the commission flows up to the next qualified upline.
 * 
 * @param uplines Array of upline members sorted from closest to furthest
 * @returns Object mapping user IDs to their commission percentages
 */
export function distributeCommission(uplines: Upline[]): CommissionDistribution {
  const distribution: CommissionDistribution = {};
  const rankLevels = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8'] as const;
  let totalDistributed = 0;
  
  // Initialize all uplines with 0% commission
  uplines.forEach(upline => {
    distribution[upline.id] = 0;
  });

  // Process each rank level
  rankLevels.forEach(rankLevel => {
    const requiredRank = getMinimumRankRequired(rankLevel);
    const commissionPercentage = rankCommissionPercentages[rankLevel];
    let distributed = false;
    
    // Find the first upline that qualifies for this rank level
    for (let i = 0; i < uplines.length; i++) {
      const upline = uplines[i];
      if (isRankQualified(upline.rank, requiredRank)) {
        // Assign commission to this upline
        distribution[upline.id] = (distribution[upline.id] || 0) + commissionPercentage;
        totalDistributed += commissionPercentage;
        distributed = true;
        break;
      }
    }
    
    // If no upline qualified for this rank level, leave the percentage undistributed
    // It will be assigned to the memeflow platform later
  });
  
  // Calculate residual amount and assign it to the memeflow platform
  const residual = 20 - totalDistributed;
  if (residual > 0) {
    distribution['memeflow'] = (distribution['memeflow'] || 0) + residual;
  }

  return distribution;
}

/**
 * Calculates the actual SOL amount each upline receives based on the distribution percentages
 * @param distribution Commission distribution percentages
 * @param totalProfit Total profit amount in SOL
 * @returns Object mapping user IDs to their commission amounts in SOL
 */
export function calculateCommissionAmounts(
  distribution: CommissionDistribution, 
  totalProfit: number
): Record<string, number> {
  const result: Record<string, number> = {};
  
  // Calculate the network fee (20% of total profit)
  const networkFee = totalProfit * 0.2;
  
  Object.entries(distribution).forEach(([userId, percentage]) => {
    // Convert percentage to decimal and multiply by network fee
    result[userId] = (percentage / 100) * totalProfit;
  });
  
  return result;
}
