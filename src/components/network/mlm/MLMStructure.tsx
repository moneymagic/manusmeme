
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import RankDistributionTable from './RankDistributionTable';
import CommissionExample from './CommissionExample';
import RankRequirementsTable from './RankRequirementsTable';
import CompressionExplanation from './CompressionExplanation';
import { Rank } from '@/services/CommissionTypes';
import { CommissionResult } from '@/services/CommissionTypes';

interface MLMStructureProps {
  rankRequirements: Record<Rank, { sol: number, linesWithRank: Rank | null }>;
  profitExample: number;
  performanceFee: number;
  masterTraderFee: number;
  networkFee: number;
  distributionExample: string[];
}

const MLMStructure: React.FC<MLMStructureProps> = ({ 
  rankRequirements,
  profitExample,
  performanceFee,
  masterTraderFee,
  networkFee,
  distributionExample
}) => {
  return (
    <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Unilevel Matrix with Rank Compression</CardTitle>
        <p className="text-gray-400">20% of performance fee distributed via rank-based top-down compression</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <RankDistributionTable profitExample={profitExample} />
          <CommissionExample 
            profitExample={profitExample}
            performanceFee={performanceFee}
            masterTraderFee={masterTraderFee}
            networkFee={networkFee}
            distributionExample={distributionExample}
          />
        </div>
        
        <div className="mt-6">
          <RankRequirementsTable rankRequirements={rankRequirements} />
        </div>
        
        <CompressionExplanation />
      </CardContent>
    </Card>
  );
};

export default MLMStructure;
