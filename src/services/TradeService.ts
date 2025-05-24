
import { supabase } from "@/integrations/supabase/client";

// Define explicit interfaces for trade data to avoid excessive type recursion
export interface TradeHistoryItem {
  id: string;
  token: string;
  date: Date;
  amount: number;
  type: string;
  status: string;
  profit: number;
}

export interface OpenTradeItem {
  id: string;
  token: string;
  openDate: Date;
  amount: number;
  currentValue: number;
  profitLoss: number;
}

/**
 * Retrieves the trade history for a user
 * @param userId User ID to fetch trade history for
 * @returns Promise containing the trade history items
 */
export async function getTradeHistory(userId: string): Promise<TradeHistoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('copy_trades')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching trade history:", error);
      return [];
    }

    // Transform the data to the expected format
    // Use the explicit type to avoid deep type instantiation
    return (data?.map(trade => ({
      id: trade.id,
      token: trade.token_symbol,
      date: new Date(trade.timestamp),
      amount: Number(trade.fee_paid_sol),
      type: trade.profit_sol > 0 ? 'BUY' : 'SELL',
      status: trade.is_successful ? 'COMPLETED' : 'FAILED',
      profit: Number(trade.profit_sol)
    })) || []) as TradeHistoryItem[];

  } catch (error) {
    console.error("Unexpected error in getTradeHistory:", error);
    return [];
  }
}

/**
 * Retrieves the open trades for a user
 * @param userId User ID to fetch open trades for
 * @returns Promise containing the open trade items
 */
export async function getOpenTrades(userId: string): Promise<OpenTradeItem[]> {
  // In a real application, this would fetch actual open trades
  // This is a mock implementation
  
  // Use the explicit type to avoid deep type instantiation
  const mockOpenTrades = [] as OpenTradeItem[];
  return mockOpenTrades;
}
