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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_name: string
          category: string
          content: string
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          language: string
          published_at: string | null
          slug: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_name?: string
          category?: string
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          language: string
          published_at?: string | null
          slug: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_name?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          language?: string
          published_at?: string | null
          slug?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      employer_profiles: {
        Row: {
          company_description: string | null
          company_logo_url: string | null
          company_name: string
          company_website: string | null
          created_at: string
          id: string
          referral_source: string | null
          target_countries: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_description?: string | null
          company_logo_url?: string | null
          company_name: string
          company_website?: string | null
          created_at?: string
          id?: string
          referral_source?: string | null
          target_countries?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_description?: string | null
          company_logo_url?: string | null
          company_name?: string
          company_website?: string | null
          created_at?: string
          id?: string
          referral_source?: string | null
          target_countries?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      global_metrics_config: {
        Row: {
          curve_strength: number
          id: string
          like_target_max: number
          like_target_min: number
          ramp_days: number
          updated_at: string
          view_target_max: number
          view_target_min: number
        }
        Insert: {
          curve_strength?: number
          id?: string
          like_target_max?: number
          like_target_min?: number
          ramp_days?: number
          updated_at?: string
          view_target_max?: number
          view_target_min?: number
        }
        Update: {
          curve_strength?: number
          id?: string
          like_target_max?: number
          like_target_min?: number
          ramp_days?: number
          updated_at?: string
          view_target_max?: number
          view_target_min?: number
        }
        Relationships: []
      }
      job_alerts: {
        Row: {
          country: string | null
          created_at: string | null
          frequency: string
          id: string
          is_active: boolean
          job_type: string | null
          keywords: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          frequency: string
          id?: string
          is_active?: boolean
          job_type?: string | null
          keywords?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          country?: string | null
          created_at?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          job_type?: string | null
          keywords?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      job_posts: {
        Row: {
          apply_click_count: number | null
          apply_email: string | null
          apply_text: string | null
          apply_url: string | null
          author_id: string
          career_level: Database["public"]["Enums"]["career_level"] | null
          category: string | null
          company_name: string
          content: string
          created_at: string
          english_level: Database["public"]["Enums"]["english_level"] | null
          expires_at: string | null
          fts: unknown
          hiring_status: Database["public"]["Enums"]["hiring_status"]
          id: string
          image_url: string | null
          job_type: Database["public"]["Enums"]["job_type"] | null
          korean_level: Database["public"]["Enums"]["korean_level"] | null
          like_target: number
          published_at: string | null
          rejection_reason: string | null
          review_status: Database["public"]["Enums"]["review_status"]
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          salary_negotiable: boolean | null
          salary_period: Database["public"]["Enums"]["salary_period"] | null
          slug: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          target_nationality: string
          title: string
          updated_at: string
          view_count: number
          view_target: number
          work_location_country: string | null
          work_location_type: Database["public"]["Enums"]["work_location_type"]
        }
        Insert: {
          apply_click_count?: number | null
          apply_email?: string | null
          apply_text?: string | null
          apply_url?: string | null
          author_id: string
          career_level?: Database["public"]["Enums"]["career_level"] | null
          category?: string | null
          company_name: string
          content: string
          created_at?: string
          english_level?: Database["public"]["Enums"]["english_level"] | null
          expires_at?: string | null
          fts?: unknown
          hiring_status?: Database["public"]["Enums"]["hiring_status"]
          id?: string
          image_url?: string | null
          job_type?: Database["public"]["Enums"]["job_type"] | null
          korean_level?: Database["public"]["Enums"]["korean_level"] | null
          like_target?: number
          published_at?: string | null
          rejection_reason?: string | null
          review_status?: Database["public"]["Enums"]["review_status"]
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_negotiable?: boolean | null
          salary_period?: Database["public"]["Enums"]["salary_period"] | null
          slug?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          target_nationality: string
          title: string
          updated_at?: string
          view_count?: number
          view_target?: number
          work_location_country?: string | null
          work_location_type: Database["public"]["Enums"]["work_location_type"]
        }
        Update: {
          apply_click_count?: number | null
          apply_email?: string | null
          apply_text?: string | null
          apply_url?: string | null
          author_id?: string
          career_level?: Database["public"]["Enums"]["career_level"] | null
          category?: string | null
          company_name?: string
          content?: string
          created_at?: string
          english_level?: Database["public"]["Enums"]["english_level"] | null
          expires_at?: string | null
          fts?: unknown
          hiring_status?: Database["public"]["Enums"]["hiring_status"]
          id?: string
          image_url?: string | null
          job_type?: Database["public"]["Enums"]["job_type"] | null
          korean_level?: Database["public"]["Enums"]["korean_level"] | null
          like_target?: number
          published_at?: string | null
          rejection_reason?: string | null
          review_status?: Database["public"]["Enums"]["review_status"]
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_negotiable?: boolean | null
          salary_period?: Database["public"]["Enums"]["salary_period"] | null
          slug?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          target_nationality?: string
          title?: string
          updated_at?: string
          view_count?: number
          view_target?: number
          work_location_country?: string | null
          work_location_type?: Database["public"]["Enums"]["work_location_type"]
        }
        Relationships: [
          {
            foreignKeyName: "job_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean
          name: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean
          name?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean
          name?: string | null
          type?: string
        }
        Relationships: []
      }
      seeker_profiles: {
        Row: {
          bio: string | null
          country_of_residence: string | null
          created_at: string
          display_name: string | null
          english_level: Database["public"]["Enums"]["english_level"] | null
          id: string
          is_profile_public: boolean | null
          korean_level: string | null
          linkedin_url: string | null
          nationality: string
          occupation: string | null
          phone: string | null
          portfolio_url: string | null
          preferred_categories: string[] | null
          preferred_contact_method: string | null
          preferred_countries: string[] | null
          preferred_job_types: string[] | null
          preferred_location_type:
            | Database["public"]["Enums"]["work_location_type"]
            | null
          referral_source: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          country_of_residence?: string | null
          created_at?: string
          display_name?: string | null
          english_level?: Database["public"]["Enums"]["english_level"] | null
          id?: string
          is_profile_public?: boolean | null
          korean_level?: string | null
          linkedin_url?: string | null
          nationality: string
          occupation?: string | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_categories?: string[] | null
          preferred_contact_method?: string | null
          preferred_countries?: string[] | null
          preferred_job_types?: string[] | null
          preferred_location_type?:
            | Database["public"]["Enums"]["work_location_type"]
            | null
          referral_source?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          country_of_residence?: string | null
          created_at?: string
          display_name?: string | null
          english_level?: Database["public"]["Enums"]["english_level"] | null
          id?: string
          is_profile_public?: boolean | null
          korean_level?: string | null
          linkedin_url?: string | null
          nationality?: string
          occupation?: string | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_categories?: string[] | null
          preferred_contact_method?: string | null
          preferred_countries?: string[] | null
          preferred_job_types?: string[] | null
          preferred_location_type?:
            | Database["public"]["Enums"]["work_location_type"]
            | null
          referral_source?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seeker_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      site_config: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          deleted_at: string | null
          deletion_reason: string | null
          email: string
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          marketing_consent: boolean
          marketing_consent_at: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          deletion_reason?: string | null
          email: string
          id: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          marketing_consent?: boolean
          marketing_consent_at?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          deletion_reason?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          marketing_consent?: boolean
          marketing_consent_at?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_like_count: { Args: { post_id: string }; Returns: number }
      hard_delete_user_account: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      increment_apply_click: { Args: { post_id: string }; Returns: undefined }
      increment_view_count: { Args: { post_id: string }; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
      is_employer: { Args: never; Returns: boolean }
      is_seeker: { Args: never; Returns: boolean }
      restore_user_account: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      soft_delete_user_account: {
        Args: { reason_param?: string; user_id_param: string }
        Returns: boolean
      }
      user_liked_post: { Args: { post_id: string }; Returns: boolean }
    }
    Enums: {
      career_level: "entry" | "mid" | "senior" | "any"
      english_level:
        | "native_advanced"
        | "intermediate"
        | "basic"
        | "not_required"
        | "not_specified"
      hiring_status: "hiring" | "closed"
      job_status: "draft" | "active" | "expired" | "closed"
      job_type:
        | "full_time"
        | "part_time"
        | "contract"
        | "freelance"
        | "internship"
        | "temporary"
      korean_level:
        | "native"
        | "advanced"
        | "intermediate"
        | "basic"
        | "not_required"
        | "not_specified"
      review_status: "pending" | "published" | "rejected"
      salary_period: "hourly" | "monthly" | "yearly"
      user_role: "seeker" | "employer" | "admin"
      work_location_type: "remote" | "hybrid" | "on_site"
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
      career_level: ["entry", "mid", "senior", "any"],
      english_level: [
        "native_advanced",
        "intermediate",
        "basic",
        "not_required",
        "not_specified",
      ],
      hiring_status: ["hiring", "closed"],
      job_status: ["draft", "active", "expired", "closed"],
      job_type: [
        "full_time",
        "part_time",
        "contract",
        "freelance",
        "internship",
        "temporary",
      ],
      korean_level: [
        "native",
        "advanced",
        "intermediate",
        "basic",
        "not_required",
        "not_specified",
      ],
      review_status: ["pending", "published", "rejected"],
      salary_period: ["hourly", "monthly", "yearly"],
      user_role: ["seeker", "employer", "admin"],
      work_location_type: ["remote", "hybrid", "on_site"],
    },
  },
} as const
