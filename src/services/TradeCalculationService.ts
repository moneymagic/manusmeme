
import { supabase } from "@/integrations/supabase/client";

/**
 * Calculates the proportional amount for a follower's trade based on the master's trade
 */
export function calculateProportionalAmount(
  masterAmount: number,
  masterCapital: number,
  userCapital: number
): number {
  // If either capital is zero, return zero to avoid division by zero
  if (masterCapital <= 0 || userCapital <= 0) return 0;
  
  // Calculate the proportion
  const proportion = userCapital / masterCapital;
  
  // Return the proportional amount, rounded to 4 decimal places
  return Number((masterAmount * proportion).toFixed(4));
}
