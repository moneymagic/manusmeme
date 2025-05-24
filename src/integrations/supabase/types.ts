export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      affiliate_commissions: {
        Row: {
          affiliate_id: string
          amount: number
          copied_trade_id: string | null
          created_at: string
          id: string
          level: number
          paid: boolean | null
          percentage: number
          transaction_hash: string | null
          updated_at: string
        }
        Insert: {
          affiliate_id: string
          amount: number
          copied_trade_id?: string | null
          created_at?: string
          id?: string
          level: number
          paid?: boolean | null
          percentage: number
          transaction_hash?: string | null
          updated_at?: string
        }
        Update: {
          affiliate_id?: string
          amount?: number
          copied_trade_id?: string | null
          created_at?: string
          id?: string
          level?: number
          paid?: boolean | null
          percentage?: number
          transaction_hash?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_commissions_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          created_at: string
          direct_referrals_count: number | null
          id: string
          max_rank_available: number | null
          personal_profit: number | null
          rank: number | null
          rank_qualified_referrals: Json | null
          referral_code: string
          sponsor_id: string | null
          total_earnings: number | null
          total_referrals: number | null
          updated_at: string
          user_id: string
          volume_network: number | null
          volume_personal: number | null
        }
        Insert: {
          created_at?: string
          direct_referrals_count?: number | null
          id?: string
          max_rank_available?: number | null
          personal_profit?: number | null
          rank?: number | null
          rank_qualified_referrals?: Json | null
          referral_code: string
          sponsor_id?: string | null
          total_earnings?: number | null
          total_referrals?: number | null
          updated_at?: string
          user_id: string
          volume_network?: number | null
          volume_personal?: number | null
        }
        Update: {
          created_at?: string
          direct_referrals_count?: number | null
          id?: string
          max_rank_available?: number | null
          personal_profit?: number | null
          rank?: number | null
          rank_qualified_referrals?: Json | null
          referral_code?: string
          sponsor_id?: string | null
          total_earnings?: number | null
          total_referrals?: number | null
          updated_at?: string
          user_id?: string
          volume_network?: number | null
          volume_personal?: number | null
        }
        Relationships: []
      }
      copy_settings: {
        Row: {
          allocated_capital_sol: number
          created_at: string
          id: string
          is_active: boolean
          trader_address: string
          updated_at: string
          user_id: string
        }
        Insert: {
          allocated_capital_sol?: number
          created_at?: string
          id?: string
          is_active?: boolean
          trader_address: string
          updated_at?: string
          user_id: string
        }
        Update: {
          allocated_capital_sol?: number
          created_at?: string
          id?: string
          is_active?: boolean
          trader_address?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      copy_trades: {
        Row: {
          entry_price: number
          exit_price: number
          fee_paid_sol: number
          id: string
          is_successful: boolean | null
          profit_sol: number
          timestamp: string
          token_symbol: string
          trader_address: string
          user_id: string
        }
        Insert: {
          entry_price: number
          exit_price: number
          fee_paid_sol: number
          id?: string
          is_successful?: boolean | null
          profit_sol: number
          timestamp?: string
          token_symbol: string
          trader_address: string
          user_id: string
        }
        Update: {
          entry_price?: number
          exit_price?: number
          fee_paid_sol?: number
          id?: string
          is_successful?: boolean | null
          profit_sol?: number
          timestamp?: string
          token_symbol?: string
          trader_address?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          updated_at: string
          username: string | null
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      rank_requirements: {
        Row: {
          bonus_percentage: number
          created_at: string
          direct_referrals_required: number
          id: string
          rank: number
          rank_name: string
          same_rank_referrals_required: number
          updated_at: string
          volume_required: number
        }
        Insert: {
          bonus_percentage?: number
          created_at?: string
          direct_referrals_required: number
          id?: string
          rank: number
          rank_name: string
          same_rank_referrals_required: number
          updated_at?: string
          volume_required: number
        }
        Update: {
          bonus_percentage?: number
          created_at?: string
          direct_referrals_required?: number
          id?: string
          rank?: number
          rank_name?: string
          same_rank_referrals_required?: number
          updated_at?: string
          volume_required?: number
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          admin_wallet_address: string
          affiliate_fee_percentage: number | null
          created_at: string
          id: string
          level_1_percentage: number | null
          level_2_percentage: number | null
          level_3_percentage: number | null
          level_4_percentage: number | null
          level_5_percentage: number | null
          level_6_percentage: number | null
          level_7_percentage: number | null
          level_8_percentage: number | null
          master_trader_fee_percentage: number | null
          min_active_balance: number | null
          min_maintenance_balance: number | null
          platform_fee_percentage: number | null
          updated_at: string
        }
        Insert: {
          admin_wallet_address: string
          affiliate_fee_percentage?: number | null
          created_at?: string
          id?: string
          level_1_percentage?: number | null
          level_2_percentage?: number | null
          level_3_percentage?: number | null
          level_4_percentage?: number | null
          level_5_percentage?: number | null
          level_6_percentage?: number | null
          level_7_percentage?: number | null
          level_8_percentage?: number | null
          master_trader_fee_percentage?: number | null
          min_active_balance?: number | null
          min_maintenance_balance?: number | null
          platform_fee_percentage?: number | null
          updated_at?: string
        }
        Update: {
          admin_wallet_address?: string
          affiliate_fee_percentage?: number | null
          created_at?: string
          id?: string
          level_1_percentage?: number | null
          level_2_percentage?: number | null
          level_3_percentage?: number | null
          level_4_percentage?: number | null
          level_5_percentage?: number | null
          level_6_percentage?: number | null
          level_7_percentage?: number | null
          level_8_percentage?: number | null
          master_trader_fee_percentage?: number | null
          min_active_balance?: number | null
          min_maintenance_balance?: number | null
          platform_fee_percentage?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount_sol: number
          created_at: string
          description: string | null
          id: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount_sol: number
          created_at?: string
          description?: string | null
          id?: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount_sol?: number
          created_at?: string
          description?: string | null
          id?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance_sol: number
          deposit_address: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_sol?: number
          deposit_address?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_sol?: number
          deposit_address?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_qualified_referrals: {
        Args: { user_id_param: string; target_rank: number }
        Returns: number
      }
      calculate_user_rank: {
        Args: { user_id_param: string }
        Returns: number
      }
      deposit_sol: {
        Args: { p_user_id: string; p_amount: number; p_description?: string }
        Returns: boolean
      }
      distribute_affiliate_commissions: {
        Args: {
          copied_trade_id_param: string
          profit_amount_param: number
          follower_user_id_param: string
        }
        Returns: undefined
      }
      is_user_active: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      process_trading_fee: {
        Args: {
          p_user_id: string
          p_trader_address: string
          p_token_symbol: string
          p_entry_price: number
          p_exit_price: number
          p_profit_sol: number
        }
        Returns: Json
      }
      update_affiliate_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      transaction_type: "deposit" | "fee" | "refund"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      transaction_type: ["deposit", "fee", "refund"],
    },
  },
} as const
