
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface CopyTrade {
  id: string;
  token_symbol: string;
  entry_price: number;
  exit_price: number;
  profit_sol: number;
  fee_paid_sol: number;
  is_successful: boolean;
  timestamp: string;
}

interface CopyTradeHistoryProps {
  isLoading: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const CopyTradeHistory = ({ isLoading }: CopyTradeHistoryProps) => {
  const [trades, setTrades] = useState<CopyTrade[]>([]);
  const [loadingTrades, setLoadingTrades] = useState(true);
  const [stats, setStats] = useState({
    totalTrades: 0,
    successfulTrades: 0,
    totalProfit: 0,
    totalFees: 0
  });
  
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoadingTrades(true);
        
        // Get copy trades
        const { data, error } = await supabase
          .from('copy_trades')
          .select('*')
          .order('timestamp', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setTrades(data as CopyTrade[]);
          
          // Calculate stats
          const successfulTrades = data.filter(trade => trade.is_successful);
          const totalProfit = data.reduce((sum, trade) => sum + trade.profit_sol, 0);
          const totalFees = data.reduce((sum, trade) => sum + trade.fee_paid_sol, 0);
          
          setStats({
            totalTrades: data.length,
            successfulTrades: successfulTrades.length,
            totalProfit,
            totalFees
          });
        }
      } catch (error) {
        console.error("Error fetching trade history:", error);
      } finally {
        setLoadingTrades(false);
      }
    };
    
    if (!isLoading) {
      fetchTrades();
    }
  }, [isLoading]);
  
  if (isLoading || loadingTrades) {
    return (
      <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex justify-center">
            <RefreshCw className="animate-spin text-white h-8 w-8" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4">
            <p className="text-gray-400 text-xs">Total Trades</p>
            <p className="text-white text-2xl font-bold">{stats.totalTrades}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4">
            <p className="text-gray-400 text-xs">Success Rate</p>
            <p className="text-white text-2xl font-bold">
              {stats.totalTrades > 0 
                ? `${Math.round((stats.successfulTrades / stats.totalTrades) * 100)}%` 
                : '0%'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4">
            <p className="text-gray-400 text-xs">Total Profit</p>
            <p className="text-white text-2xl font-bold">{stats.totalProfit.toFixed(4)} SOL</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4">
            <p className="text-gray-400 text-xs">Total Fees Paid</p>
            <p className="text-white text-2xl font-bold">{stats.totalFees.toFixed(4)} SOL</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Trade History Table */}
      <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Trade History</CardTitle>
          <CardDescription className="text-gray-400">
            Your recent copy trading activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trades.length > 0 ? (
            <Table>
              <TableHeader className="bg-black/40">
                <TableRow>
                  <TableHead className="text-gray-300">Token</TableHead>
                  <TableHead className="text-gray-300">Entry / Exit</TableHead>
                  <TableHead className="text-gray-300">Profit</TableHead>
                  <TableHead className="text-gray-300">Fee</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.id} className="border-gray-800">
                    <TableCell className="font-medium text-white">{trade.token_symbol}</TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">In: {trade.entry_price}</span>
                        <span className="text-gray-400 text-xs">Out: {trade.exit_price}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-green-400">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {trade.profit_sol.toFixed(4)} SOL
                      </div>
                    </TableCell>
                    <TableCell className="text-yellow-300">
                      {trade.fee_paid_sol.toFixed(4)} SOL
                    </TableCell>
                    <TableCell>
                      {trade.is_successful ? (
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500/30">
                          Successful
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-500/30">
                          Failed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs">
                      {formatDate(trade.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No trading history available</p>
              <p className="text-sm mt-2">Your copy trading activities will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CopyTradeHistory;
