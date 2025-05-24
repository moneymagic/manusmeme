
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Define types for our commission service logic
type Rank = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8';

interface Upline {
  id: string;
  rank: Rank | null;
}

interface CommissionDistribution {
  [userId: string]: number;
}

// Maps rank to commission percentage based on the system configuration
const rankCommissionPercentages: Record<Rank, number> = {
  'V1': 2,
  'V2': 2,
  'V3': 2,
  'V4': 2,
  'V5': 2,
  'V6': 2,
  'V7': 4,
  'V8': 4,
};

// Returns the minimum rank required to receive a specific rank's commission
function getMinimumRankRequired(rank: Rank): Rank {
  return rank;
}

// Convert string rank to numeric value for comparison
function rankToNumber(rank: Rank | null): number {
  if (!rank) return 0;
  return parseInt(rank.substring(1), 10);
}

// Check if a rank qualifies for a specific commission level
function isRankQualified(userRank: Rank | null, requiredRank: Rank): boolean {
  if (!userRank) return false;
  return rankToNumber(userRank) >= rankToNumber(requiredRank);
}

// Distributes commission across a chain of uplines based on their ranks
function distributeCommission(uplines: Upline[]): CommissionDistribution {
  const distribution: CommissionDistribution = {};
  const rankLevels: Rank[] = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8'];
  let totalDistributed = 0;
  
  // Initialize all uplines with 0% commission
  uplines.forEach(upline => {
    distribution[upline.id] = 0;
  });

  // Process each rank level
  rankLevels.forEach(rankLevel => {
    const requiredRank = getMinimumRankRequired(rankLevel);
    const commissionPercentage = rankCommissionPercentages[rankLevel];
    let distributed = false;
    
    // Find the first upline that qualifies for this rank level
    for (let i = 0; i < uplines.length; i++) {
      const upline = uplines[i];
      if (isRankQualified(upline.rank, requiredRank)) {
        // Assign commission to this upline
        distribution[upline.id] = (distribution[upline.id] || 0) + commissionPercentage;
        totalDistributed += commissionPercentage;
        distributed = true;
        break;
      }
    }
  });
  
  // Calculate residual amount and assign it to the memeflow platform
  const residual = 20 - totalDistributed;
  if (residual > 0) {
    distribution['memeflow'] = (distribution['memeflow'] || 0) + residual;
  }

  return distribution;
}

// Calculate the actual SOL amount each upline receives
function calculateCommissionAmounts(distribution: CommissionDistribution, totalProfit: number): Record<string, number> {
  const result: Record<string, number> = {};
  
  // Calculate the network fee (20% of total profit)
  const networkFee = totalProfit * 0.2;
  
  Object.entries(distribution).forEach(([userId, percentage]) => {
    // Convert percentage to decimal and multiply by network fee
    result[userId] = (percentage / 100) * totalProfit;
  });
  
  return result;
}

// Process a trade commission
function processTradeCommission(uplines: Upline[], profitAmount: number) {
  // Calculate performance fee (30% of profit)
  const performanceFee = profitAmount * 0.3;
  
  // Calculate master trader fee (10% of profit) 
  const masterTraderFee = profitAmount * 0.1;
  
  // Calculate network fee (20% of profit)
  const networkFee = profitAmount * 0.2;
  
  // Calculate remaining profit after fees
  const remainingProfit = profitAmount - performanceFee;
  
  // Calculate distribution percentages
  const distribution = distributeCommission(uplines);
  
  // Calculate actual SOL amounts
  const commissionAmounts = calculateCommissionAmounts(distribution, profitAmount);
  
  // Calculate total distributed
  const totalDistributed = Object.values(commissionAmounts).reduce((sum, amount) => sum + amount, 0);
  
  return {
    profitAmount,
    performanceFee,
    masterTraderFee,
    networkFee,
    remainingProfit,
    distribution,
    commissionAmounts,
    totalDistributed
  };
}

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") as string
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the current user from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Get the JWT token from the Authorization header
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token or user not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Parse the request body
    const { copyTradeId, profit } = await req.json()
    
    if (!copyTradeId || !profit) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: copyTradeId, profit' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get the copy trade details
    const { data: copyTradeData, error: copyTradeError } = await supabase
      .from('copy_trades')
      .select('*')
      .eq('id', copyTradeId)
      .single()

    if (copyTradeError || !copyTradeData) {
      return new Response(
        JSON.stringify({ error: 'Copy trade not found', details: copyTradeError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Fetch the user's upline chain (simplified version)
    // In a real system, you would traverse the affiliate structure recursively
    const { data: affiliateData, error: affiliateError } = await supabase
      .from('affiliates')
      .select('user_id, sponsor_id, rank')
      .eq('user_id', user.id)
      .single()

    if (affiliateError) {
      return new Response(
        JSON.stringify({ error: 'Error fetching affiliate data', details: affiliateError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get sponsors recursively (simplified for this example)
    // In a real implementation, you would fetch the entire upline chain
    const uplines: Upline[] = [];
    let currentSponsorId = affiliateData.sponsor_id;
    
    // Just as a simple demonstration, we'll create some mock uplines
    // In a real system, you'd recursively fetch the actual upline data
    if (currentSponsorId) {
      uplines.push({ 
        id: currentSponsorId, 
        rank: 'V3' as Rank // Mock rank for demonstration
      });
      
      // Add more mock uplines for demonstration
      uplines.push({ id: 'sponsor2', rank: 'V1' as Rank });
      uplines.push({ id: 'sponsor3', rank: 'V5' as Rank });
      uplines.push({ id: 'sponsor4', rank: 'V2' as Rank });
      uplines.push({ id: 'sponsor5', rank: 'V7' as Rank });
    }

    // Process the commission distribution
    const commissionResult = processTradeCommission(uplines, profit);

    // In a real system, you would save the commission distribution to the database
    // and possibly trigger payments or notifications

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Commission distribution processed successfully',
        result: commissionResult
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Error processing commission distribution:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
