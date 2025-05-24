
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates the user's wallet balance after a trade
 */
export async function updateUserWalletBalance(userId: string, feeAmount: number): Promise<{success: boolean, message: string}> {
  try {
    // For test users, simulate a successful wallet update
    if (userId.startsWith('test-')) {
      console.log(`Test user detected: ${userId}. Simulating wallet update.`);
      return { success: true, message: "Wallet balance updated successfully (simulated)" };
    }
    
    // Get current wallet balance
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('balance_sol')
      .eq('user_id', userId)
      .single();
      
    if (walletError) {
      console.error("Error fetching wallet:", walletError);
      return { success: false, message: "Failed to fetch wallet" };
    }
    
    if (wallet.balance_sol < feeAmount) {
      // Insufficient balance - disable copy trading
      await supabase
        .from('copy_settings')
        .update({ is_active: false })
        .eq('user_id', userId);
        
      return { 
        success: false, 
        message: `Insufficient balance (${wallet.balance_sol} SOL) to pay fee (${feeAmount} SOL)` 
      };
    }
    
    // Deduct fee from wallet balance
    const { error: updateError } = await supabase
      .from('wallets')
      .update({ 
        balance_sol: wallet.balance_sol - feeAmount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
      
    if (updateError) {
      console.error("Error updating wallet balance:", updateError);
      return { success: false, message: "Failed to update wallet balance" };
    }
    
    // Record the transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'fee',
        amount_sol: feeAmount,
        description: 'Performance fee for copy trading'
      });
      
    if (transactionError) {
      console.error("Error recording transaction:", transactionError);
    }
    
    return { success: true, message: "Wallet balance updated successfully" };
  } catch (error) {
    console.error("Error in updateUserWalletBalance:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}
