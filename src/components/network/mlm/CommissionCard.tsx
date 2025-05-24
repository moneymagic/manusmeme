
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CommissionCardProps {
  monthlyCommissions?: number;
}

const CommissionCard: React.FC<CommissionCardProps> = ({ monthlyCommissions = 890 }) => {
  return (
    <Card className="bg-black/30 border-white/10 backdrop-blur-sm mt-6">
      <CardHeader>
        <CardTitle className="text-white">Your Commissions</CardTitle>
        <p className="text-gray-400">Earnings from the unilevel matrix</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-white">₴ {monthlyCommissions}</p>
          <p className="text-green-400">this month</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Today</span>
            <span className="text-white">₴ 67</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">This week</span>
            <span className="text-white">₴ 234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">This month</span>
            <span className="text-white">₴ 890</span>
          </div>
        </div>
        
        <div className="bg-black/40 rounded-lg p-4 border border-white/10 mt-4">
          <h4 className="text-white font-medium mb-2">Solana Integration</h4>
          <p className="text-gray-300 text-sm">
            All commissions are calculated and distributed automatically on the Solana blockchain,
            ensuring transparency, speed, and minimal fees.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionCard;
