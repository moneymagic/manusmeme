
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getDashboardData } from "@/services/DashboardService";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { isUserActive } from "@/services/UserBalanceService";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    balance: 0,
    profitToday: 0,
    profitTotal: 0,
    currentRank: "V1",
    volumeToNextRank: 0,
    qualifiedDirects: 0,
    totalDirects: 0,
    tradeHistory: [],
    openTrades: [],
    isActive: false,
    capitalGrowth: [],
    activeOperations: [],
    rankingProgress: null
  });
  const { toast } = useToast();
  
  // For demo purposes, using a fixed user ID
  // In a real app, this would come from authentication
  const mockUserId = "d290f1ee-6c54-4b01-90e6-d701748f0851";
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await getDashboardData(mockUserId);
        const isActive = await isUserActive(mockUserId);
        
        setDashboardData({
          balance: data.balanceData || 0,
          profitToday: 0, // Calculate from trade history if needed
          profitTotal: 0, // Calculate from trade history if needed
          currentRank: data.networkStats?.currentRank || "V1",
          volumeToNextRank: data.networkStats?.volumeToNextRank || 0,
          qualifiedDirects: data.networkStats?.qualifiedDirects || 0,
          totalDirects: data.networkStats?.totalDirects || 0,
          tradeHistory: data.tradeHistory || [],
          openTrades: [],
          isActive,
          capitalGrowth: data.networkGrowth || [],
          activeOperations: [],
          rankingProgress: null
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);

  return (
    <DashboardLayout 
      balance={dashboardData.balance}
      isActive={dashboardData.isActive}
      isLoading={isLoading}
    />
  );
};

export default Dashboard;
