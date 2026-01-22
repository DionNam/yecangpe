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
      employer_profiles: {
        Row: {
          id: string
          user_id: string
          company_name: string
          referral_source: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          referral_source?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          referral_source?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      global_metrics_config: {
        Row: {
          id: string
          view_target_min: number
          view_target_max: number
          like_target_min: number
          like_target_max: number
          ramp_days: number
          curve_strength: number
          updated_at: string
        }
        Insert: {
          id?: string
          view_target_min?: number
          view_target_max?: number
          like_target_min?: number
          like_target_max?: number
          ramp_days?: number
          curve_strength?: number
          updated_at?: string
        }
        Update: {
          id?: string
          view_target_min?: number
          view_target_max?: number
          like_target_min?: number
          like_target_max?: number
          ramp_days?: number
          curve_strength?: number
          updated_at?: string
        }
        Relationships: []
      }
      job_posts: {
        Row: {
          id: string
          author_id: string
          title: string
          content: string
          company_name: string
          target_nationality: string
          review_status: Database["public"]["Enums"]["review_status"]
          hiring_status: Database["public"]["Enums"]["hiring_status"]
          rejection_reason: string | null
          image_url: string | null
          view_count: number
          view_target: number
          like_target: number
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          content: string
          company_name: string
          target_nationality: string
          review_status?: Database["public"]["Enums"]["review_status"]
          hiring_status?: Database["public"]["Enums"]["hiring_status"]
          rejection_reason?: string | null
          image_url?: string | null
          view_count?: number
          view_target?: number
          like_target?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          content?: string
          company_name?: string
          target_nationality?: string
          review_status?: Database["public"]["Enums"]["review_status"]
          hiring_status?: Database["public"]["Enums"]["hiring_status"]
          rejection_reason?: string | null
          image_url?: string | null
          view_count?: number
          view_target?: number
          like_target?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      likes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          }
        ]
      }
      seeker_profiles: {
        Row: {
          id: string
          user_id: string
          nationality: string
          topik_level: number | null
          occupation: string | null
          referral_source: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nationality: string
          topik_level?: number | null
          occupation?: string | null
          referral_source?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nationality?: string
          topik_level?: number | null
          occupation?: string | null
          referral_source?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seeker_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          role: Database["public"]["Enums"]["user_role"] | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: Database["public"]["Enums"]["user_role"] | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_employer: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_seeker: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      hiring_status: "hiring" | "closed"
      review_status: "pending" | "published" | "rejected"
      user_role: "seeker" | "employer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
