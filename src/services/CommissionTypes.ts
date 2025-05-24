
/**
 * Type definitions for commission service
 */

export type Rank = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8';

export interface Upline {
  id: string;
  rank: Rank | null;
}

export interface CommissionDistribution {
  [userId: string]: number;
}

export interface CommissionResult {
  profitAmount: number;
  performanceFee: number;
  masterTraderFee: number;
  networkFee: number;
  remainingProfit: number;
  distribution: CommissionDistribution;
  commissionAmounts: Record<string, number>;
  totalDistributed: number;
}
