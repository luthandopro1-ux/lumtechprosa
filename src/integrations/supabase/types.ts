export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      milestones: {
        Row: {
          created_at: string
          description: string | null
          engineer_approved: boolean
          id: string
          ordinal: number
          payout_amount_cents: number
          project_id: string
          proof_notes: string | null
          qs_approved: boolean
          status: Database["public"]["Enums"]["milestone_status"]
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          engineer_approved?: boolean
          id?: string
          ordinal?: number
          payout_amount_cents: number
          project_id: string
          proof_notes?: string | null
          qs_approved?: boolean
          status?: Database["public"]["Enums"]["milestone_status"]
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          engineer_approved?: boolean
          id?: string
          ordinal?: number
          payout_amount_cents?: number
          project_id?: string
          proof_notes?: string | null
          qs_approved?: boolean
          status?: Database["public"]["Enums"]["milestone_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_verified: boolean
          nhbrc_number: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean
          nhbrc_number?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean
          nhbrc_number?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget_cents: number
          builder_fee_cents: number
          builder_id: string | null
          client_fee_cents: number
          contractor_supplies_material: boolean
          created_at: string
          description: string | null
          id: string
          kzn_region: string
          owner_id: string
          professional_fee_cents: number
          status: Database["public"]["Enums"]["project_status"]
          tier: number
          title: string
          tradesafe_id: string | null
          use_inhouse_professionals: boolean
        }
        Insert: {
          budget_cents: number
          builder_fee_cents?: number
          builder_id?: string | null
          client_fee_cents?: number
          contractor_supplies_material?: boolean
          created_at?: string
          description?: string | null
          id?: string
          kzn_region: string
          owner_id: string
          professional_fee_cents?: number
          status?: Database["public"]["Enums"]["project_status"]
          tier: number
          title: string
          tradesafe_id?: string | null
          use_inhouse_professionals?: boolean
        }
        Update: {
          budget_cents?: number
          builder_fee_cents?: number
          builder_id?: string | null
          client_fee_cents?: number
          contractor_supplies_material?: boolean
          created_at?: string
          description?: string | null
          id?: string
          kzn_region?: string
          owner_id?: string
          professional_fee_cents?: number
          status?: Database["public"]["Enums"]["project_status"]
          tier?: number
          title?: string
          tradesafe_id?: string | null
          use_inhouse_professionals?: boolean
        }
        Relationships: []
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
          role: Database["public"]["Enums"]["app_role"]
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
      vouchers: {
        Row: {
          created_at: string
          id: string
          is_redeemed: boolean
          project_id: string
          redeemed_at: string | null
          supplier_id: string | null
          value_cents: number
          voucher_code: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_redeemed?: boolean
          project_id: string
          redeemed_at?: string | null
          supplier_id?: string | null
          value_cents: number
          voucher_code: string
        }
        Update: {
          created_at?: string
          id?: string
          is_redeemed?: boolean
          project_id?: string
          redeemed_at?: string | null
          supplier_id?: string | null
          value_cents?: number
          voucher_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "vouchers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "client" | "builder" | "professional" | "supplier" | "admin"
      milestone_status:
        | "pending"
        | "active"
        | "awaiting_signoff"
        | "approved"
        | "paid"
      project_status:
        | "draft"
        | "funded"
        | "active"
        | "completed"
        | "disputed"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["client", "builder", "professional", "supplier", "admin"],
      milestone_status: [
        "pending",
        "active",
        "awaiting_signoff",
        "approved",
        "paid",
      ],
      project_status: [
        "draft",
        "funded",
        "active",
        "completed",
        "disputed",
        "cancelled",
      ],
    },
  },
} as const
