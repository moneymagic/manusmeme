
import { supabase } from "@/integrations/supabase/client";

/**
 * Records a copy trade in the database
 */
export async function recordCopyTrade(
  userId: string, 
  traderAddress: string,
  token: string,
  entryPrice: number,
  exitPrice: number,
  profit: number,
  feePaid: number,
  isSuccessful: boolean
): Promise<string | null> {
  try {
    // For test users, simulate a successful record creation
    if (userId.startsWith('test-')) {
      console.log(`Test user detected: ${userId}. Simulating trade record.`);
      const mockId = `test-trade-${Date.now()}`;
      return mockId;
    }
    
    const { data, error } = await supabase
      .from('copy_trades')
      .insert({
        user_id: userId,
        trader_address: traderAddress,
        token_symbol: token,
        entry_price: entryPrice,
        exit_price: exitPrice,
        profit_sol: profit,
        fee_paid_sol: feePaid,
        is_successful: isSuccessful
      })
      .select('id')
      .single();
      
    if (error) {
      console.error("Error recording copy trade:", error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error("Error in recordCopyTrade:", error);
    return null;
  }
}
