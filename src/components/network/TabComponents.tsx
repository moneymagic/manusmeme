
import React from 'react';
import NetworkStats from './NetworkStats';
import NetworkMembersTable from './NetworkMembersTable';
import DownlineStats from './DownlineStats';
import MLMContent from './MLMContent';

export type Rank = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8';

export interface NetworkTabsData {
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
  networkData: {
    user: string;
    level: number;
    volume: number;
    rank: string;
    referrals: number;
  }[];
  downlineStats: {
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
  rankPercents: Record<Rank, number>;
  rankRequirements: Record<Rank, { sol: number; linesWithRank: Rank | null }>;
  topPerformers: {
    name: string;
    level: number;
    earnings: string;
    referrals: number;
  }[];
  levels: {
    level: number;
    members: number;
    commission: string;
    earnings: string;
  }[];
}

export const OverviewTabContent: React.FC<{ data: NetworkTabsData }> = ({ data }) => {
  return (
    <>
      <NetworkStats 
        totalMembers={data.networkStats.totalMembers} 
        totalVolume={data.networkStats.totalVolume} 
        averageRank={data.networkStats.averageRank}
      />
      <NetworkMembersTable members={data.networkData} />
    </>
  );
};

export const DownlineTabContent: React.FC<{ data: NetworkTabsData }> = ({ data }) => {
  return (
    <DownlineStats 
      stats={data.downlineStats} 
      teamMembers={data.teamMembers}
    />
  );
};

export const MLMTabContent: React.FC<{ data: NetworkTabsData }> = ({ data }) => {
  return (
    <MLMContent 
      networkStats={data.networkStats} 
      rankPercents={data.rankPercents}
      rankRequirements={data.rankRequirements}
      topPerformers={data.topPerformers}
      levels={data.levels}
    />
  );
};
