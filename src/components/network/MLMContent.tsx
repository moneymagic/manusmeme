
import React, { useState } from 'react';
import { Rank, Upline } from '@/services/CommissionTypes';
import { processTradeCommission } from '@/services/CommissionService';
import MLMStatsCards from './mlm/MLMStatsCards';
import MLMStructure from './mlm/MLMStructure';
import TopPerformers from './mlm/TopPerformers';
import CommissionCard from './mlm/CommissionCard';

interface MLMContentProps {
  networkStats: {
    totalMembers: number;
    totalVolume: number;
    averageRank: number;
    directReferrals: number;
    totalCommissions: number;
    monthlyCommissions: number;
    networkDepth: string;
    activeMembers: number;
  };
  rankPercents: Record<Rank, number>;
  rankRequirements: Record<Rank, { sol: number, linesWithRank: Rank | null }>;
  topPerformers: { name: string; level: number; earnings: string; referrals: number; }[];
  levels: { level: number; members: number; commission: string; earnings: string; }[];
}

const MLMContent: React.FC<MLMContentProps> = ({ 
  networkStats,
  rankPercents,
  rankRequirements,
  topPerformers,
  levels
}) => {
  // Calculate commission distribution example for 100 SOL profit
  const profitExample = 100;
  const performanceFee = profitExample * 0.3;
  const masterTraderFee = profitExample * 0.1;
  const networkFee = profitExample * 0.2;
  
  // Sample upline for demonstration
  const [uplineSample, setUplineSample] = useState<Upline[]>([
    { id: "user1", rank: "V1" },
    { id: "user2", rank: "V3" },
    { id: "user3", rank: null },  // No rank
    { id: "user4", rank: "V2" },
    { id: "user5", rank: "V5" },
    { id: "user6", rank: null },  // No rank
    { id: "user7", rank: "V8" }
  ]);
  
  // Calculate commission distribution based on the sample upline
  const commissionResult = processTradeCommission(uplineSample, profitExample);
  
  // Generate example distribution text based on actual calculation
  const generateDistributionExample = () => {
    const results = [];
    let remainingPercentage = 20;
    
    Object.entries(commissionResult.distribution)
      .filter(([_, percentage]) => percentage > 0)
      .forEach(([userId, percentage]) => {
        const upline = uplineSample.find(u => u.id === userId);
        if (upline && upline.rank) {
          results.push(`${upline.rank} receives ${(percentage).toFixed(1)}% (${(commissionResult.commissionAmounts[userId]).toFixed(1)} SOL)`);
          remainingPercentage -= percentage;
        }
      });
    
    if (remainingPercentage > 0.1) {
      results.push(`Remaining ${remainingPercentage.toFixed(1)}% stays with the platform`);
    }
    
    return results;
  };
  
  const distributionExample = generateDistributionExample();

  return (
    <>
      <MLMStatsCards networkStats={networkStats} />
      
      <MLMStructure 
        rankRequirements={rankRequirements}
        profitExample={profitExample}
        performanceFee={performanceFee}
        masterTraderFee={masterTraderFee}
        networkFee={networkFee}
        distributionExample={distributionExample}
      />
      
      <TopPerformers topPerformers={topPerformers} />
      
      <CommissionCard monthlyCommissions={networkStats.monthlyCommissions} />
    </>
  );
};

export default MLMContent;
