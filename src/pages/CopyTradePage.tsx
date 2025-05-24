import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CopyTradeSettings from "@/components/copy-trade/CopyTradeSettings";
import CopyTradeHistory from "@/components/copy-trade/CopyTradeHistory";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const CopyTradePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [walletData, setWalletData] = useState({
    balance: 0,
    depositAddress: "",
    isActive: false
  });
  
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setIsLoading(true);
        
        // Simulação de chamada à API
        // Em um ambiente real, buscaríamos dados da carteira do usuário
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados simulados
        setWalletData({
          balance: 0.25,
          depositAddress: "5xyzAb123...",
          isActive: true
        });
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWalletData();
  }, []);
  
  return (
    <div className="premium-fade-in py-6">
      <div className="mb-8">
        <h1 className="h1">Copy Trading</h1>
        <p className="caption mt-2">Configure and monitor your copy trading settings</p>
      </div>
      
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="premium-tabs mb-6">
          <TabsTrigger value="settings" className="premium-tab">Settings</TabsTrigger>
          <TabsTrigger value="history" className="premium-tab">Trade History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <CopyTradeSettings walletData={walletData} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="history">
          <CopyTradeHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CopyTradePage;
