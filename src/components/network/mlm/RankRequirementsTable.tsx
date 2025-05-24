
import React from 'react';
import { Rank } from '@/services/CommissionTypes';

interface RankRequirementsTableProps {
  rankRequirements: Record<Rank, { sol: number, linesWithRank: Rank | null }>;
}

const RankRequirementsTable: React.FC<RankRequirementsTableProps> = ({ rankRequirements }) => {
  return (
    <div>
      <h3 className="text-white font-semibold mb-3">Rank Requirements</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-gray-400 py-3 px-4">Rank</th>
              <th className="text-left text-gray-400 py-3 px-4">Profit Volume (SOL)</th>
              <th className="text-left text-gray-400 py-3 px-4">Required Lines</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(rankRequirements).map(([rank, req]) => (
              <tr key={rank} className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3 px-4">
                  <div className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full w-fit">
                    {rank}
                  </div>
                </td>
                <td className="py-3 px-4 text-white">{req.sol} SOL</td>
                <td className="py-3 px-4 text-white">
                  {req.linesWithRank ? `2 lines with ${req.linesWithRank}` : 'None'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankRequirementsTable;
