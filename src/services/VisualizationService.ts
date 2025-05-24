
import { CapitalGrowthData, ActiveOperation } from "@/integrations/supabase/client";

/**
 * Gets capital growth data for visualization
 */
export async function getUserCapitalGrowth(userId: string): Promise<CapitalGrowthData[]> {
  try {
    // Mock implementation for now
    const result: CapitalGrowthData[] = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      result.unshift({
        date: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`,
        value: Math.random() * 5 + 1
      });
    }
    
    return result;
  } catch (error) {
    console.error("Error fetching capital growth data:", error);
    return [];
  }
}

/**
 * Gets active operations data for visualization
 */
export async function getUserActiveOperations(userId: string): Promise<ActiveOperation[]> {
  try {
    // Mock implementation for now
    return [
      {
        id: '1',
        coin: 'PEPE',
        entryPrice: 0.00000125,
        currentPrice: 0.00000135,
        percentChange: 8,
        direction: 'buy',
        amount: 0.15,
        timestamp: new Date()
      },
      {
        id: '2',
        coin: 'BONK',
        entryPrice: 0.00000135,
        currentPrice: 0.00000145,
        percentChange: 7.4,
        direction: 'buy',
        amount: 0.2,
        timestamp: new Date()
      }
    ];
  } catch (error) {
    console.error("Error fetching active operations:", error);
    return [];
  }
}
