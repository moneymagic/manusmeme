
import { supabase } from "@/integrations/supabase/client";
import { RankingProgress } from "@/integrations/supabase/client";

/**
 * Helper function to format a rank number as a string (e.g., 1 -> "V1")
 */
export function formatRank(rankNumber: number | null): string {
  if (rankNumber === null || rankNumber <= 0) {
    return "V1";
  }
  return `V${rankNumber}`;
}

/**
 * Gets affiliate data and rank information for a user
 */
export async function getUserAffiliateData(userId: string): Promise<{
  currentRank: string;
  volumeToNextRank: number;
  qualifiedDirects: number;
  totalDirects: number;
}> {
  try {
    console.log(`Fetching affiliate data for user: ${userId}`);
    
    // Get affiliates data for rank and network
    const { data: affiliateData, error: affiliateError } = await supabase
      .from('affiliates')
      .select('rank, volume_personal, volume_network, direct_referrals_count, total_referrals')
      .eq('user_id', userId)
      .single();
      
    if (affiliateError) {
      console.error("Error fetching affiliate data:", affiliateError);
      return { 
        currentRank: "V1", 
        volumeToNextRank: 0, 
        qualifiedDirects: 0, 
        totalDirects: 0 
      };
    }
    
    // Get rank requirements for next rank
    const currentRankNumber = affiliateData?.rank || 1;
    const currentRank = formatRank(currentRankNumber);
    const nextRankNumber = currentRankNumber + 1;
    
    console.log(`Current rank: ${currentRank} (${currentRankNumber})`);
    
    const { data: nextRankReqs, error: rankError } = await supabase
      .from('rank_requirements')
      .select('volume_required, direct_referrals_required')
      .eq('rank', nextRankNumber)
      .single();
      
    if (rankError && rankError.code !== 'PGRST116') {
      console.error("Error fetching rank requirements:", rankError);
      return { 
        currentRank, 
        volumeToNextRank: 0, 
        qualifiedDirects: 0, 
        totalDirects: affiliateData?.direct_referrals_count || 0 
      };
    }
    
    // Calculate volume needed for next rank
    const currentVolume = affiliateData?.volume_network || 0;
    const volumeRequired = nextRankReqs?.volume_required || 0;
    const volumeToNextRank = Math.max(0, volumeRequired - currentVolume);
    
    console.log(`Volume - Current: ${currentVolume}, Required: ${volumeRequired}, To next rank: ${volumeToNextRank}`);
    
    // Count qualified directs (same rank)
    const { data: qualifiedDirectsData, error: qualifiedError } = await supabase
      .from('affiliates')
      .select('count')
      .eq('sponsor_id', userId)
      .gte('rank', currentRankNumber)
      .single();
      
    if (qualifiedError && qualifiedError.code !== 'PGRST116') {
      console.error("Error fetching qualified directs:", qualifiedError);
      return { 
        currentRank, 
        volumeToNextRank, 
        qualifiedDirects: 0, 
        totalDirects: affiliateData?.direct_referrals_count || 0 
      };
    }
    
    const qualifiedDirects = qualifiedDirectsData?.count || 0;
    const totalDirects = affiliateData?.direct_referrals_count || 0;
    
    console.log(`Directs - Qualified: ${qualifiedDirects}, Total: ${totalDirects}`);
    
    return {
      currentRank,
      volumeToNextRank,
      qualifiedDirects,
      totalDirects
    };
  } catch (error) {
    console.error("Error in getUserAffiliateData:", error);
    return { 
      currentRank: "V1", 
      volumeToNextRank: 0, 
      qualifiedDirects: 0, 
      totalDirects: 0 
    };
  }
}

/**
 * Gets ranking progress for visualization
 */
export async function getUserRankingProgress(userId: string): Promise<RankingProgress | null> {
  try {
    // Implement actual data retrieval from Supabase here
    return {
      currentRank: 2,
      nextRank: 3,
      currentVolume: 80,
      requiredVolume: 120,
      directReferrals: 1,
      requiredDirectReferrals: 2
    };
  } catch (error) {
    console.error("Error fetching ranking progress:", error);
    return null;
  }
}
