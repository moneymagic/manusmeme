
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { NetworkTabsData, OverviewTabContent, DownlineTabContent, MLMTabContent, Rank } from "@/components/network/TabComponents";

const NetworkPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Network overview data
  const networkStats = {
    totalMembers: 1247,
    totalVolume: 398,
    averageRank: 2.1,
    directReferrals: 23,
    totalCommissions: 4560,
    monthlyCommissions: 890,
    networkDepth: "∞",
    activeMembers: 1089
  };

  // Downline stats
  const downlineStats = {
    totalMembers: 121965,
    activeMembers: 4,
    inactiveMembers: 95,
    beginnerTeam: 583,
    intermediateTeam: 20,
    directDownlines: 4,
    maxTeamRequirement: 20,
    currentTeam: 2,
    maxDownlinesRequirement: 1500,
    currentDownlines: 621,
    maxDirectRequirement: 20,
    currentDirect: 4
  };

  // Network members data
  const networkData = [
    { 
      user: "Alex M.", 
      level: 1, 
      volume: 32,
      rank: "V2",
      referrals: 3
    },
    { 
      user: "Sarah K.", 
      level: 1, 
      volume: 105,
      rank: "V3", 
      referrals: 4
    },
    { 
      user: "Marcus T.", 
      level: 2, 
      volume: 25,
      rank: "V2",
      referrals: 1
    },
    { 
      user: "Lisa P.", 
      level: 2, 
      volume: 46,
      rank: "V2",
      referrals: 2
    },
    { 
      user: "John D.", 
      level: 3, 
      volume: 12,
      rank: "V1",
      referrals: 0
    }
  ];

  // MLM ranks and commission structure - Updated with new percentages
  const rankPercents: Record<Rank, number> = {
    V1: 2,
    V2: 4,
    V3: 6,
    V4: 8,
    V5: 11,
    V6: 14,
    V7: 17,
    V8: 20,
  };

  // Updated rank requirements according to new progression rules
  const rankRequirements: Record<Rank, { sol: number, linesWithRank: Rank | null }> = {
    V1: { sol: 0, linesWithRank: null },
    V2: { sol: 34, linesWithRank: 'V1' },
    V3: { sol: 60, linesWithRank: 'V2' },
    V4: { sol: 120, linesWithRank: 'V3' },
    V5: { sol: 200, linesWithRank: 'V4' },
    V6: { sol: 350, linesWithRank: 'V5' },
    V7: { sol: 550, linesWithRank: 'V6' },
    V8: { sol: 800, linesWithRank: 'V7' },
  };

  // Team members downline data
  const teamMembers = [
    { 
      id: '1', 
      username: '3gu***7u*', 
      joinDate: '2024-09-30', 
      teamSize: 1 
    },
    { 
      id: '2', 
      username: 'lea***sar', 
      joinDate: '2024-02-04', 
      teamSize: 14,
      rank: 2
    },
    { 
      id: '3', 
      username: 'Fab***der', 
      joinDate: '2024-01-16', 
      teamSize: 1,
      rank: 1
    },
    { 
      id: '4', 
      username: 'dud***yal', 
      joinDate: '2024-01-11', 
      teamSize: 1,
      rank: 1
    },
    { 
      id: '5', 
      username: 'Vip***ho', 
      joinDate: '2024-01-11', 
      teamSize: 11,
      rank: 1
    },
  ];

  // Top performing networkers
  const topPerformers = [
    { name: '9mF2...7x8s', level: 1, earnings: '₴ 1,250', referrals: 45 },
    { name: '3kR1...9pL4', level: 1, earnings: '₴ 980', referrals: 38 },
    { name: '8nQ7...2mK9', level: 2, earnings: '₴ 750', referrals: 29 },
    { name: '5vB6...1dF3', level: 1, earnings: '₴ 690', referrals: 25 },
    { name: '2hW9...6tG5', level: 3, earnings: '₴ 540', referrals: 22 },
  ];

  // Sample ranks for the rank table
  const levels = [
    { level: 1, members: 23, commission: '5%', earnings: '₴ 345' },
    { level: 2, members: 89, commission: '3%', earnings: '₴ 234' },
    { level: 3, members: 156, commission: '2%', earnings: '₴ 187' },
    { level: 4, members: 234, commission: '1%', earnings: '₴ 98' },
    { level: 5, members: 345, commission: '0.5%', earnings: '₴ 67' },
  ];

  // Consolidate all data needed for the tabs
  const tabsData: NetworkTabsData = {
    networkStats,
    networkData,
    downlineStats,
    teamMembers,
    rankPercents,
    rankRequirements,
    topPerformers,
    levels
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-8">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-white mb-6">Network</h1>

          <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8 bg-black/30">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-blue-600">Overview</TabsTrigger>
              <TabsTrigger value="downline" className="text-white data-[state=active]:bg-blue-600">Downline</TabsTrigger>
              <TabsTrigger value="mlm" className="text-white data-[state=active]:bg-blue-600">MLM Structure</TabsTrigger>
            </TabsList>
            
            {/* Network Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <OverviewTabContent data={tabsData} />
            </TabsContent>
            
            {/* Downline Details Tab */}
            <TabsContent value="downline" className="space-y-6">
              <DownlineTabContent data={tabsData} />
            </TabsContent>
            
            {/* MLM Structure Tab */}
            <TabsContent value="mlm" className="space-y-6">
              <MLMTabContent data={tabsData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default NetworkPage;
