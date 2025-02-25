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
      advice_models: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      agent_collected_data: {
        Row: {
          agent_id: string
          collected_at: string | null
          confidence: number | null
          content: Json
          created_at: string | null
          data_type: string
          id: string
          sentiment: number | null
          source: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          collected_at?: string | null
          confidence?: number | null
          content: Json
          created_at?: string | null
          data_type: string
          id?: string
          sentiment?: number | null
          source: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          collected_at?: string | null
          confidence?: number | null
          content?: Json
          created_at?: string | null
          data_type?: string
          id?: string
          sentiment?: number | null
          source?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_metrics: {
        Row: {
          id: string
          metadata: Json | null
          metric_type: string
          model_id: string | null
          timestamp: string | null
          value: number
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_type: string
          model_id?: string | null
          timestamp?: string | null
          value: number
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_type?: string
          model_id?: string | null
          timestamp?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "financial_metrics_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "financial_models"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_models: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          parameters: Json
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parameters?: Json
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parameters?: Json
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      market_analysis: {
        Row: {
          current_ma: number
          difference: number
          id: string
          previous_ma: number
          timestamp: string
          trend: string
          window_size: number
        }
        Insert: {
          current_ma: number
          difference: number
          id?: string
          previous_ma: number
          timestamp?: string
          trend: string
          window_size: number
        }
        Update: {
          current_ma?: number
          difference?: number
          id?: string
          previous_ma?: number
          timestamp?: string
          trend?: string
          window_size?: number
        }
        Relationships: []
      }
      positions: {
        Row: {
          amount: number
          average_entry_price: number
          created_at: string | null
          id: string
          pair_id: string
          unrealized_pnl: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          average_entry_price: number
          created_at?: string | null
          id?: string
          pair_id: string
          unrealized_pnl?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          average_entry_price?: number
          created_at?: string | null
          id?: string
          pair_id?: string
          unrealized_pnl?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_login_at: string | null
          last_name: string | null
          preferred_language: string
          role: Database["public"]["Enums"]["user_role"] | null
          status: Database["public"]["Enums"]["user_status"] | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_login_at?: string | null
          last_name?: string | null
          preferred_language?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_login_at?: string | null
          last_name?: string | null
          preferred_language?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
        }
        Relationships: []
      }
      risk_settings: {
        Row: {
          created_at: string | null
          daily_loss_notification: boolean | null
          id: string
          max_daily_loss: number
          max_leverage: number | null
          max_position_size: number
          portfolio_allocation_limit: number | null
          position_size_calculation: string | null
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          risk_reward_target: number | null
          stop_loss_percentage: number | null
          take_profit_percentage: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          daily_loss_notification?: boolean | null
          id?: string
          max_daily_loss: number
          max_leverage?: number | null
          max_position_size: number
          portfolio_allocation_limit?: number | null
          position_size_calculation?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          risk_reward_target?: number | null
          stop_loss_percentage?: number | null
          take_profit_percentage?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          daily_loss_notification?: boolean | null
          id?: string
          max_daily_loss?: number
          max_leverage?: number | null
          max_position_size?: number
          portfolio_allocation_limit?: number | null
          position_size_calculation?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          risk_reward_target?: number | null
          stop_loss_percentage?: number | null
          take_profit_percentage?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      simulated_trades: {
        Row: {
          ai_analysis: Json | null
          ai_confidence: number | null
          amount: number
          closed_at: string | null
          created_at: string | null
          entry_price: number
          exit_price: number | null
          id: string
          pair_id: string
          pnl: number | null
          simulation_type: string | null
          status: Database["public"]["Enums"]["trade_status"] | null
          strategy: string | null
          trade_duration: unknown | null
          type: Database["public"]["Enums"]["trade_type"]
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          ai_confidence?: number | null
          amount: number
          closed_at?: string | null
          created_at?: string | null
          entry_price: number
          exit_price?: number | null
          id?: string
          pair_id: string
          pnl?: number | null
          simulation_type?: string | null
          status?: Database["public"]["Enums"]["trade_status"] | null
          strategy?: string | null
          trade_duration?: unknown | null
          type: Database["public"]["Enums"]["trade_type"]
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          ai_confidence?: number | null
          amount?: number
          closed_at?: string | null
          created_at?: string | null
          entry_price?: number
          exit_price?: number | null
          id?: string
          pair_id?: string
          pnl?: number | null
          simulation_type?: string | null
          status?: Database["public"]["Enums"]["trade_status"] | null
          strategy?: string | null
          trade_duration?: unknown | null
          type?: Database["public"]["Enums"]["trade_type"]
          user_id?: string
        }
        Relationships: []
      }
      trades: {
        Row: {
          ai_analysis: Json | null
          ai_confidence: number | null
          amount: number
          created_at: string | null
          executed_at: string | null
          id: string
          limit_price: number | null
          order_type: Database["public"]["Enums"]["order_type"] | null
          pair_id: string
          price: number
          status: Database["public"]["Enums"]["trade_status"] | null
          stop_price: number | null
          type: Database["public"]["Enums"]["trade_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          ai_confidence?: number | null
          amount: number
          created_at?: string | null
          executed_at?: string | null
          id?: string
          limit_price?: number | null
          order_type?: Database["public"]["Enums"]["order_type"] | null
          pair_id: string
          price: number
          status?: Database["public"]["Enums"]["trade_status"] | null
          stop_price?: number | null
          type: Database["public"]["Enums"]["trade_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          ai_confidence?: number | null
          amount?: number
          created_at?: string | null
          executed_at?: string | null
          id?: string
          limit_price?: number | null
          order_type?: Database["public"]["Enums"]["order_type"] | null
          pair_id?: string
          price?: number
          status?: Database["public"]["Enums"]["trade_status"] | null
          stop_price?: number | null
          type?: Database["public"]["Enums"]["trade_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_pair_id_fkey"
            columns: ["pair_id"]
            isOneToOne: false
            referencedRelation: "trading_pairs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_pairs: {
        Row: {
          base_asset: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_price: number | null
          min_trade_amount: number
          price_change_24h: number | null
          price_precision: number | null
          quantity_precision: number | null
          quote_asset: string
          symbol: string
          updated_at: string | null
          volume_24h: number | null
        }
        Insert: {
          base_asset: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_price?: number | null
          min_trade_amount: number
          price_change_24h?: number | null
          price_precision?: number | null
          quantity_precision?: number | null
          quote_asset: string
          symbol: string
          updated_at?: string | null
          volume_24h?: number | null
        }
        Update: {
          base_asset?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_price?: number | null
          min_trade_amount?: number
          price_change_24h?: number | null
          price_precision?: number | null
          quantity_precision?: number | null
          quote_asset?: string
          symbol?: string
          updated_at?: string | null
          volume_24h?: number | null
        }
        Relationships: []
      }
      trading_signals: {
        Row: {
          confidence: number
          created_at: string | null
          executed_at: string | null
          id: string
          metadata: Json | null
          pair_id: string | null
          price: number
          signal_type: string
          status: string | null
          strategy: string
          volume: number | null
        }
        Insert: {
          confidence: number
          created_at?: string | null
          executed_at?: string | null
          id?: string
          metadata?: Json | null
          pair_id?: string | null
          price: number
          signal_type: string
          status?: string | null
          strategy: string
          volume?: number | null
        }
        Update: {
          confidence?: number
          created_at?: string | null
          executed_at?: string | null
          id?: string
          metadata?: Json | null
          pair_id?: string | null
          price?: number
          signal_type?: string
          status?: string | null
          strategy?: string
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trading_signals_pair_id_fkey"
            columns: ["pair_id"]
            isOneToOne: false
            referencedRelation: "trading_pairs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          status: string
          type: string
          updated_at: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          type: string
          updated_at?: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          type?: string
          updated_at?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          available_balance: number
          balance: number
          created_at: string
          id: string
          locked_balance: number
          name: string
          status: Database["public"]["Enums"]["wallet_status"]
          type: Database["public"]["Enums"]["wallet_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          available_balance?: number
          balance?: number
          created_at?: string
          id?: string
          locked_balance?: number
          name: string
          status?: Database["public"]["Enums"]["wallet_status"]
          type?: Database["public"]["Enums"]["wallet_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          available_balance?: number
          balance?: number
          created_at?: string
          id?: string
          locked_balance?: number
          name?: string
          status?: Database["public"]["Enums"]["wallet_status"]
          type?: Database["public"]["Enums"]["wallet_type"]
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
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "viewer" | "trader" | "admin" | "super_admin"
      order_type: "market" | "limit" | "stop" | "stop_limit"
      risk_level: "conservative" | "moderate" | "aggressive"
      subscription_tier: "free" | "basic" | "premium" | "enterprise"
      trade_status: "pending" | "executed" | "cancelled" | "failed"
      trade_type: "buy" | "sell" | "short" | "long"
      user_role: "admin" | "trader" | "analyst" | "super_admin"
      user_status: "active" | "suspended" | "pending"
      wallet_status: "active" | "suspended" | "closed"
      wallet_type: "spot" | "margin" | "futures"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
