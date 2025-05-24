
import { supabase } from "@/integrations/supabase/client";
import { Rank, Upline } from "./CommissionService";

/**
 * Retrieves the upline chain for a specific user from the database
 * @param userId User ID for which to fetch the uplines
 * @returns Array of upline objects with ID and rank information
 */
export async function getUplines(userId: string): Promise<Upline[]> {
  try {
    // Query the uplines table to get the user's upline chain
    // We use the any type here as a workaround since the uplines table
    // is new and not yet in the TypeScript definitions
    const { data: uplineData, error: uplineError } = await supabase
      .from('uplines' as any)
      .select('upline_id, position')
      .eq('user_id', userId)
      .order('position', { ascending: true })
      .limit(8);
      
    if (uplineError) {
      console.error("Error fetching uplines:", uplineError);
      return [];
    }
    
    // If no uplines found, return empty array
    if (!uplineData || uplineData.length === 0) {
      return [];
    }
    
    // Extract the upline IDs - using unknown as intermediate step for type safety
    const safeUplineData = uplineData as unknown;
    const typedUplineData = safeUplineData as Array<{upline_id: string, position: number}>;
    const uplineIds = typedUplineData.map(item => item.upline_id);
    
    // Query profiles to get ranks for all uplines in a single query
    const { data: profileData, error: profileError } = await supabase
      .from('affiliates')
      .select('user_id, rank')
      .in('user_id', uplineIds);
      
    if (profileError) {
      console.error("Error fetching upline profiles:", profileError);
      return [];
    }
    
    // Map upline data with ranks - using unknown as intermediate step for type safety
    const uplines: Upline[] = (safeUplineData as Array<{upline_id: string, position: number}>).map(upline => {
      // Find the corresponding profile data
      const profile = profileData?.find(p => p.user_id === upline.upline_id);
      
      // Map the numeric rank to the string rank format (V1, V2, etc.)
      let stringRank: Rank | null = null;
      if (profile && profile.rank) {
        stringRank = `V${profile.rank}` as Rank;
      }
      
      return {
        id: upline.upline_id,
        rank: stringRank
      };
    });
    
    return uplines;
  } catch (error) {
    console.error("Unexpected error in getUplines:", error);
    return [];
  }
}

/**
 * Sets upline relationships for a user in the database
 * @param userId User ID for which to set uplines
 * @param uplineData Array of upline data with position and upline_id
 */
export async function setUplines(
  userId: string, 
  uplineData: Array<{ position: number; upline_id: string }>
): Promise<{ success: boolean; message: string }> {
  try {
    // First, delete any existing upline relationships
    const { error: deleteError } = await supabase
      .from('uplines' as any)
      .delete()
      .eq('user_id', userId);
      
    if (deleteError) {
      console.error("Error deleting existing uplines:", deleteError);
      return { success: false, message: "Failed to update upline relationships" };
    }
    
    // Prepare the data for insertion
    const uplinesToInsert = uplineData.map(item => ({
      user_id: userId,
      upline_id: item.upline_id,
      position: item.position
    }));
    
    // Insert new upline relationships
    const { error: insertError } = await supabase
      .from('uplines' as any)
      .insert(uplinesToInsert);
      
    if (insertError) {
      console.error("Error inserting uplines:", insertError);
      return { success: false, message: "Failed to create upline relationships" };
    }
    
    return { success: true, message: "Upline relationships updated successfully" };
  } catch (error) {
    console.error("Unexpected error in setUplines:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}
