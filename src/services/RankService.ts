
import { Rank } from './CommissionTypes';

/**
 * Maps rank to commission percentage based on the system configuration
 */
export const rankCommissionPercentages: Record<Rank, number> = {
  'V1': 2,
  'V2': 2,
  'V3': 2,
  'V4': 2,
  'V5': 2,
  'V6': 2,
  'V7': 4,
  'V8': 4,
};

/**
 * Returns the minimum rank required to receive a specific rank's commission
 */
export function getMinimumRankRequired(rank: Rank): Rank {
  return rank;
}

/**
 * Convert string rank to numeric value for comparison
 */
export function rankToNumber(rank: Rank | null): number {
  if (!rank) return 0;
  return parseInt(rank.substring(1), 10);
}

/**
 * Check if a rank qualifies for a specific commission level
 */
export function isRankQualified(userRank: Rank | null, requiredRank: Rank): boolean {
  if (!userRank) return false;
  return rankToNumber(userRank) >= rankToNumber(requiredRank);
}
