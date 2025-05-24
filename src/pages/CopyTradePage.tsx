
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CopyTradeWallet from "@/components/copy-trade/CopyTradeWallet";
import CopyTradeSettings from "@/components/copy-trade/CopyTradeSettings";
import CopyTradeHistory from "@/components/copy-trade/CopyTradeHistory";
import { supabase } from "@/integrations/supabase/client";

const CopyTradePage = () => {
  const [activeTab, setActiveTab] = useState("wallet");
  const [walletData, setWalletData] = useState<{
    balance: number;
    depositAddress: string;
    isActive: boolean;
  }>({
    balance: 0,
    depositAddress: "",
    isActive: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setIsLoading(true);
        
        // Get user wallet data
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select('*')
          .single();
          
        if (walletError) throw walletError;
        
        // Get copy settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('copy_settings')
          .select('is_active')
          .maybeSingle();
          
        setWalletData({
          balance: walletData?.balance_sol || 0,
          depositAddress: walletData?.deposit_address || "Address not available",
          isActive: settingsData?.is_active || false
        });
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        toast({
          title: "Failed to load wallet data",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWalletData();
  }, [toast]);
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-8">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-white mb-6">Copy Trading</h1>
          
          <Tabs defaultValue="wallet" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8 bg-black/30">
              <TabsTrigger value="wallet" className="text-white data-[state=active]:bg-blue-600">
                Wallet
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-white data-[state=active]:bg-blue-600">
                Settings
              </TabsTrigger>
              <TabsTrigger value="history" className="text-white data-[state=active]:bg-blue-600">
                Trade History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="wallet">
              <CopyTradeWallet walletData={walletData} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="settings">
              <CopyTradeSettings walletData={walletData} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="history">
              <CopyTradeHistory isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default CopyTradePage;
