
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets the wallet balance for a user
 */
export async function getUserBalance(userId: string): Promise<number> {
  try {
    console.log(`Fetching wallet balance for user: ${userId}`);
    
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('balance_sol')
      .eq('user_id', userId)
      .single();
      
    if (walletError) {
      console.error("Error fetching wallet:", walletError);
      throw new Error("Failed to fetch wallet data");
    }

    const balance = wallet?.balance_sol || 0;
    console.log(`User balance: ${balance} SOL`);
    
    return balance;
  } catch (error) {
    console.error("Error in getUserBalance:", error);
    return 0;
  }
}

/**
 * Checks if a user is active based on their balance
 */
export async function isUserActive(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('is_user_active', { user_id_param: userId });
    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error("Error checking user active status:", error);
    return false;
  }
}
