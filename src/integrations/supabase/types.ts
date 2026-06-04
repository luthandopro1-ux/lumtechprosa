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
      admin_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          payload: Json | null
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          payload?: Json | null
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          payload?: Json | null
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: []
      }
      boq_requests: {
        Row: {
          created_at: string
          deliverable_url: string | null
          delivered_at: string | null
          fee_cents: number
          id: string
          notes: string | null
          paid_at: string | null
          project_id: string
          requested_by: string
          service_type: Database["public"]["Enums"]["boq_service_type"]
          status: Database["public"]["Enums"]["boq_request_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deliverable_url?: string | null
          delivered_at?: string | null
          fee_cents: number
          id?: string
          notes?: string | null
          paid_at?: string | null
          project_id: string
          requested_by: string
          service_type: Database["public"]["Enums"]["boq_service_type"]
          status?: Database["public"]["Enums"]["boq_request_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deliverable_url?: string | null
          delivered_at?: string | null
          fee_cents?: number
          id?: string
          notes?: string | null
          paid_at?: string | null
          project_id?: string
          requested_by?: string
          service_type?: Database["public"]["Enums"]["boq_service_type"]
          status?: Database["public"]["Enums"]["boq_request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "boq_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_ledger: {
        Row: {
          amount_cents: number
          boq_request_id: string | null
          created_at: string
          created_by: string | null
          entry_type: Database["public"]["Enums"]["escrow_entry_type"]
          id: string
          memo: string | null
          milestone_id: string | null
          project_id: string | null
        }
        Insert: {
          amount_cents: number
          boq_request_id?: string | null
          created_at?: string
          created_by?: string | null
          entry_type: Database["public"]["Enums"]["escrow_entry_type"]
          id?: string
          memo?: string | null
          milestone_id?: string | null
          project_id?: string | null
        }
        Update: {
          amount_cents?: number
          boq_request_id?: string | null
          created_at?: string
          created_by?: string | null
          entry_type?: Database["public"]["Enums"]["escrow_entry_type"]
          id?: string
          memo?: string | null
          milestone_id?: string | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escrow_ledger_boq_request_id_fkey"
            columns: ["boq_request_id"]
            isOneToOne: false
            referencedRelation: "boq_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escrow_ledger_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escrow_ledger_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
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
          contractor_net_cents: number
          contractor_supplies_material: boolean
          created_at: string
          description: string | null
          escrow_balance_cents: number
          id: string
          kzn_region: string
          owner_id: string
          platform_fee_cents: number
          platform_fee_pct: number
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
          contractor_net_cents?: number
          contractor_supplies_material?: boolean
          created_at?: string
          description?: string | null
          escrow_balance_cents?: number
          id?: string
          kzn_region: string
          owner_id: string
          platform_fee_cents?: number
          platform_fee_pct?: number
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
          contractor_net_cents?: number
          contractor_supplies_material?: boolean
          created_at?: string
          description?: string | null
          escrow_balance_cents?: number
          id?: string
          kzn_region?: string
          owner_id?: string
          platform_fee_cents?: number
          platform_fee_pct?: number
          professional_fee_cents?: number
          status?: Database["public"]["Enums"]["project_status"]
          tier?: number
          title?: string
          tradesafe_id?: string | null
          use_inhouse_professionals?: boolean
        }
        Relationships: []
      }
      supplier_documents: {
        Row: {
          doc_type: string
          file_url: string
          id: string
          supplier_id: string
          uploaded_at: string
        }
        Insert: {
          doc_type: string
          file_url: string
          id?: string
          supplier_id: string
          uploaded_at?: string
        }
        Update: {
          doc_type?: string
          file_url?: string
          id?: string
          supplier_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_documents_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          agreement_signed: boolean
          approved_at: string | null
          approved_by: string | null
          banking_account_holder: string | null
          banking_account_no: string | null
          banking_bank: string | null
          banking_branch_code: string | null
          categories: Database["public"]["Enums"]["supplier_category"][]
          company_name: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          physical_address: string | null
          registration_no: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["supplier_status"]
          tax_no: string | null
          updated_at: string
          user_id: string
          voucher_code: string | null
          voucher_expires_at: string | null
          voucher_issued_at: string | null
        }
        Insert: {
          agreement_signed?: boolean
          approved_at?: string | null
          approved_by?: string | null
          banking_account_holder?: string | null
          banking_account_no?: string | null
          banking_bank?: string | null
          banking_branch_code?: string | null
          categories?: Database["public"]["Enums"]["supplier_category"][]
          company_name: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          physical_address?: string | null
          registration_no?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["supplier_status"]
          tax_no?: string | null
          updated_at?: string
          user_id: string
          voucher_code?: string | null
          voucher_expires_at?: string | null
          voucher_issued_at?: string | null
        }
        Update: {
          agreement_signed?: boolean
          approved_at?: string | null
          approved_by?: string | null
          banking_account_holder?: string | null
          banking_account_no?: string | null
          banking_bank?: string | null
          banking_branch_code?: string | null
          categories?: Database["public"]["Enums"]["supplier_category"][]
          company_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          physical_address?: string | null
          registration_no?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["supplier_status"]
          tax_no?: string | null
          updated_at?: string
          user_id?: string
          voucher_code?: string | null
          voucher_expires_at?: string | null
          voucher_issued_at?: string | null
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
      generate_supplier_voucher_code: { Args: never; Returns: string }
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
      boq_request_status:
        | "pending_payment"
        | "paid"
        | "in_review"
        | "delivered"
        | "cancelled"
      boq_service_type: "preliminary" | "detailed"
      escrow_entry_type:
        | "deposit"
        | "milestone_release"
        | "platform_fee"
        | "professional_fee"
        | "boq_fee"
        | "refund"
        | "adjustment"
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
      supplier_category:
        | "building_materials"
        | "hardware"
        | "electrical"
        | "plumbing"
        | "roofing"
        | "concrete"
        | "steel"
        | "timber"
        | "paint"
        | "aluminium"
        | "glass"
        | "solar_equipment"
        | "plant_hire"
        | "tool_hire"
        | "safety_equipment"
      supplier_status: "pending" | "approved" | "suspended" | "rejected"
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
      boq_request_status: [
        "pending_payment",
        "paid",
        "in_review",
        "delivered",
        "cancelled",
      ],
      boq_service_type: ["preliminary", "detailed"],
      escrow_entry_type: [
        "deposit",
        "milestone_release",
        "platform_fee",
        "professional_fee",
        "boq_fee",
        "refund",
        "adjustment",
      ],
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
      supplier_category: [
        "building_materials",
        "hardware",
        "electrical",
        "plumbing",
        "roofing",
        "concrete",
        "steel",
        "timber",
        "paint",
        "aluminium",
        "glass",
        "solar_equipment",
        "plant_hire",
        "tool_hire",
        "safety_equipment",
      ],
      supplier_status: ["pending", "approved", "suspended", "rejected"],
    },
  },
} as const
