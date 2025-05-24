
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface NetworkMember {
  user: string;
  level: number;
  volume: number;
  rank: string;
  referrals: number;
}

interface NetworkMembersTableProps {
  members: NetworkMember[];
}

const NetworkMembersTable: React.FC<NetworkMembersTableProps> = ({ members }) => {
  return (
    <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Network Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-400 py-3 px-4">User</th>
                <th className="text-left text-gray-400 py-3 px-4">Level</th>
                <th className="text-left text-gray-400 py-3 px-4">Rank</th>
                <th className="text-left text-gray-400 py-3 px-4">Volume</th>
                <th className="text-left text-gray-400 py-3 px-4">Referrals</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <span className="text-white">{member.user}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full w-fit">
                      Level {member.level}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full w-fit">
                      {member.rank}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-white">{member.volume} SOL</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-white">{member.referrals}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkMembersTable;
