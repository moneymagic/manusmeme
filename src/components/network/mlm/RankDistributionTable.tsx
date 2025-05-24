
import React from 'react';
import { Rank } from '@/services/CommissionTypes';
import { rankCommissionPercentages } from '@/services/RankService';

interface RankDistributionTableProps {
  profitExample: number;
}

const RankDistributionTable: React.FC<RankDistributionTableProps> = ({ profitExample }) => {
  return (
    <div className="w-full md:w-1/2">
      <h3 className="text-white font-semibold mb-3">Bonus Distribution by Rank</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-gray-400 py-3 px-4">Rank</th>
              <th className="text-right text-gray-400 py-3 px-4">Percentage</th>
              <th className="text-right text-gray-400 py-3 px-4">Example ({profitExample} SOL profit)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(rankCommissionPercentages).map(([rank, percent]) => (
              <tr key={rank} className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3 px-4">
                  <div className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full w-fit">
                    {rank}
                  </div>
                </td>
                <td className="py-3 px-4 text-white text-right">
                  {percent}%
                </td>
                <td className="py-3 px-4 text-green-400 text-right font-medium">
                  {(percent * profitExample / 100).toFixed(2)} SOL
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankDistributionTable;
