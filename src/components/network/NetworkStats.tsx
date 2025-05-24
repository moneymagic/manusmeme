
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, ArrowUpRight } from 'lucide-react';

interface NetworkStatsProps {
  totalMembers: number;
  totalVolume: number;
  averageRank: number;
}

const NetworkStats: React.FC<NetworkStatsProps> = ({
  totalMembers,
  totalVolume,
  averageRank
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Members</p>
              <p className="text-2xl font-bold text-white mt-1">{totalMembers}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Volume</p>
              <p className="text-2xl font-bold text-white mt-1">{totalVolume} SOL</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Average Rank</p>
              <p className="text-2xl font-bold text-white mt-1">V{averageRank}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-3 rounded-lg">
              <ArrowUpRight className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkStats;
