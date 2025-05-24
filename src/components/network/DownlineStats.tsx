
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { Button } from "@/components/ui/button";
import { ChevronDown, Users } from 'lucide-react';

interface DownlineStatsProps {
  stats: {
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
    beginnerTeam: number;
    intermediateTeam: number;
    directDownlines: number;
    maxTeamRequirement: number;
    currentTeam: number;
    maxDownlinesRequirement: number;
    currentDownlines: number;
    maxDirectRequirement: number;
    currentDirect: number;
  };
  teamMembers: {
    id: string;
    username: string;
    joinDate: string;
    teamSize: number;
    rank?: number;
  }[];
}

interface RankIconProps {
  rank?: number;
}

const RankIcon: React.FC<RankIconProps> = ({ rank }) => {
  if (!rank) return null;
  
  return (
    <span className="inline-flex items-center justify-center ml-1">
      <svg className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </span>
  );
};

const DownlineStats: React.FC<DownlineStatsProps> = ({ stats, teamMembers }) => {
  // Utility function to calculate progress percentage
  const calculateProgress = (current: number, max: number): number => {
    return Math.min((current / max) * 100, 100);
  };

  // Utility function to format numbers
  const formatNumber = (num: number): string => {
    return num.toLocaleString('pt-BR');
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-blue-600/30 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Team Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <p className="text-3xl font-bold text-white">{formatNumber(stats.totalMembers)} <span className="text-sm font-normal text-white/70">people</span></p>
              <div className="text-sm text-white/70 mt-4">
                <p>Activated yesterday</p>
                <p>0 people</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-600/30 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Cumulative Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <p className="text-3xl font-bold text-white">183986 <span className="text-sm font-normal text-white/70">SOL</span></p>
              <div className="text-sm text-white/70 mt-4">
                <p>Profit for today</p>
                <p>0 SOL</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-black/30 border-white/10 backdrop-blur-sm mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Global Team</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Direct downline count</span>
                <span className="text-gray-300">({stats.currentDirect}/{stats.maxDirectRequirement})</span>
              </div>
              <Progress value={calculateProgress(stats.currentDirect, stats.maxDirectRequirement)} className="h-2 bg-gray-700" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Team count</span>
                <span className="text-gray-300">({formatNumber(stats.currentDownlines)}/{formatNumber(stats.maxDownlinesRequirement)})</span>
              </div>
              <Progress value={calculateProgress(stats.currentDownlines, stats.maxDownlinesRequirement)} className="h-2 bg-gray-700" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Team</span>
                <span className="text-gray-300">({stats.currentTeam}/{stats.maxTeamRequirement})</span>
              </div>
              <Progress value={calculateProgress(stats.currentTeam, stats.maxTeamRequirement)} className="h-2 bg-gray-700" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center">
            <span>Direct Downline</span>
            <ChevronDown className="ml-2 h-5 w-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50/10 rounded-lg p-4 mb-6">
            <p className="text-gray-300 text-sm">
              Data is counted once per hour and is counted daily
              according to Singapore time (UTC + 8).
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <p className="text-white font-bold text-xl">{stats.activeMembers} people</p>
                <p className="text-gray-300">Activated</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-xl">{stats.inactiveMembers} people</p>
                <p className="text-gray-300">Deactivated</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-white text-lg font-medium mb-4">Team (Activated)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg text-center">
                <p className="text-gray-300 mb-1">Beginner</p>
                <p className="text-white font-bold text-2xl">{stats.beginnerTeam} <span className="text-sm font-normal">people</span></p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg text-center">
                <p className="text-gray-300 mb-1">Intermediate</p>
                <p className="text-white font-bold text-2xl">{stats.intermediateTeam} <span className="text-sm font-normal">people</span></p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 mb-4">
              <h3 className="text-white text-lg font-medium">Direct downline details</h3>
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                All
              </Button>
            </div>

            <div className="space-y-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="border-b border-white/10 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-gray-300" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {member.username}
                          <RankIcon rank={member.rank} />
                        </p>
                        <p className="text-gray-400 text-sm">{member.joinDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300">Team count:</p>
                      <p className="text-white">{member.teamSize}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DownlineStats;
