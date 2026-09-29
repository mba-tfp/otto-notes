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
      feedback: {
        Row: {
          created_at: string
          id: string
          message: string | null
          rating: number | null
          screenshot_url: string | null
          severity: string | null
          subject: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          rating?: number | null
          screenshot_url?: string | null
          severity?: string | null
          subject?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          rating?: number | null
          screenshot_url?: string | null
          severity?: string | null
          subject?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      invites: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          email: string
          expires_at: string
          id: string
          requires_profile_completion: boolean | null
          role_to_assign: Database["public"]["Enums"]["team_member_role"]
          team_member_id: string | null
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          email: string
          expires_at: string
          id?: string
          requires_profile_completion?: boolean | null
          role_to_assign: Database["public"]["Enums"]["team_member_role"]
          team_member_id?: string | null
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          email?: string
          expires_at?: string
          id?: string
          requires_profile_completion?: boolean | null
          role_to_assign?: Database["public"]["Enums"]["team_member_role"]
          team_member_id?: string | null
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invites_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      referring_physicians: {
        Row: {
          active: boolean
          city: string | null
          clinic_name: string | null
          created_at: string
          first_name: string
          id: string
          last_name: string
          province: string | null
          specialty: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          city?: string | null
          clinic_name?: string | null
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          province?: string | null
          specialty?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          city?: string | null
          clinic_name?: string | null
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          province?: string | null
          specialty?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      release_notes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          release_date: string
          summary: string
          tag: Database["public"]["Enums"]["release_note_tag"]
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          release_date?: string
          summary: string
          tag?: Database["public"]["Enums"]["release_note_tag"]
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          release_date?: string
          summary?: string
          tag?: Database["public"]["Enums"]["release_note_tag"]
          title?: string
        }
        Relationships: []
      }
      release_notes_dismissed: {
        Row: {
          id: string
          last_seen_at: string
          user_id: string
        }
        Insert: {
          id?: string
          last_seen_at?: string
          user_id: string
        }
        Update: {
          id?: string
          last_seen_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          invited_at: string | null
          last_name: string
          role: Database["public"]["Enums"]["team_member_role"]
          status: Database["public"]["Enums"]["team_member_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          invited_at?: string | null
          last_name: string
          role?: Database["public"]["Enums"]["team_member_role"]
          status?: Database["public"]["Enums"]["team_member_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          invited_at?: string | null
          last_name?: string
          role?: Database["public"]["Enums"]["team_member_role"]
          status?: Database["public"]["Enums"]["team_member_status"]
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          include_clinic_name: boolean | null
          language: string | null
          last_name: string | null
          phone_country_code: string | null
          phone_number: string | null
          primary_location: string | null
          profile_completed: boolean | null
          role: string
          signature_email: string | null
          signature_preferred_name: string | null
          signature_specialty: string | null
          signature_title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          include_clinic_name?: boolean | null
          language?: string | null
          last_name?: string | null
          phone_country_code?: string | null
          phone_number?: string | null
          primary_location?: string | null
          profile_completed?: boolean | null
          role?: string
          signature_email?: string | null
          signature_preferred_name?: string | null
          signature_specialty?: string | null
          signature_title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          include_clinic_name?: boolean | null
          language?: string | null
          last_name?: string | null
          phone_country_code?: string | null
          phone_number?: string | null
          primary_location?: string | null
          profile_completed?: boolean | null
          role?: string
          signature_email?: string | null
          signature_preferred_name?: string | null
          signature_specialty?: string | null
          signature_title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_training_progress: {
        Row: {
          completed_video_ids: string[]
          created_at: string
          id: string
          legacy_prompt_seen: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_video_ids?: string[]
          created_at?: string
          id?: string
          legacy_prompt_seen?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_video_ids?: string[]
          created_at?: string
          id?: string
          legacy_prompt_seen?: boolean
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
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "physician" | "nurse" | "staff"
      release_note_tag: "new" | "improvement" | "fix"
      team_member_role: "admin" | "physician" | "nurse" | "staff"
      team_member_status: "pending" | "active" | "disabled"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "physician", "nurse", "staff"],
      release_note_tag: ["new", "improvement", "fix"],
      team_member_role: ["admin", "physician", "nurse", "staff"],
      team_member_status: ["pending", "active", "disabled"],
    },
  },
} as const
