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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          details: Json
          id: string
          target_id: string
          target_type: string
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string
          details?: Json
          id?: string
          target_id: string
          target_type: string
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          details?: Json
          id?: string
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          created_at: string
          day: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          cover_url: string | null
          created_at: string
          excerpt: string
          id: string
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          cover_url?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          cover_url?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      class_settings: {
        Row: {
          active_link_mode: Database["public"]["Enums"]["class_link_mode"]
          class_time: string
          id: number
          meet_link: string
          monthly_class_time: string
          monthly_meet_link: string
          temporary_class_time: string
          temporary_meet_link: string
          updated_at: string
        }
        Insert: {
          active_link_mode?: Database["public"]["Enums"]["class_link_mode"]
          class_time?: string
          id?: number
          meet_link?: string
          monthly_class_time?: string
          monthly_meet_link?: string
          temporary_class_time?: string
          temporary_meet_link?: string
          updated_at?: string
        }
        Update: {
          active_link_mode?: Database["public"]["Enums"]["class_link_mode"]
          class_time?: string
          id?: number
          meet_link?: string
          monthly_class_time?: string
          monthly_meet_link?: string
          temporary_class_time?: string
          temporary_meet_link?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_post_comments: {
        Row: {
          author_name: string
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          author_name?: string
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_likes: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_name: string
          category: string
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          author_name?: string
          category?: string
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          author_name?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          caption: string
          created_at: string
          id: string
          url: string
        }
        Insert: {
          caption?: string
          created_at?: string
          id?: string
          url: string
        }
        Update: {
          caption?: string
          created_at?: string
          id?: string
          url?: string
        }
        Relationships: []
      }
      nimble_call_log: {
        Row: {
          created_at: string
          day: string
          id: string
          response: string
          slot: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day: string
          id?: string
          response?: string
          slot?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day?: string
          id?: string
          response?: string
          slot?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      physical_orders: {
        Row: {
          address: string
          admin_notes: string
          amount_paise: number
          cancelled_at: string | null
          city: string
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          delivered_at: string | null
          fulfillment_status: Database["public"]["Enums"]["order_fulfillment_status"]
          id: string
          item_name: string
          order_number: string
          payment_status: string
          pincode: string
          quantity: number
          state: string
          updated_at: string
        }
        Insert: {
          address?: string
          admin_notes?: string
          amount_paise: number
          cancelled_at?: string | null
          city?: string
          created_at?: string
          customer_email?: string
          customer_name: string
          customer_phone: string
          delivered_at?: string | null
          fulfillment_status?: Database["public"]["Enums"]["order_fulfillment_status"]
          id?: string
          item_name: string
          order_number?: string
          payment_status?: string
          pincode?: string
          quantity?: number
          state?: string
          updated_at?: string
        }
        Update: {
          address?: string
          admin_notes?: string
          amount_paise?: number
          cancelled_at?: string | null
          city?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          delivered_at?: string | null
          fulfillment_status?: Database["public"]["Enums"]["order_fulfillment_status"]
          id?: string
          item_name?: string
          order_number?: string
          payment_status?: string
          pincode?: string
          quantity?: number
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          registration: Json
          updated_at: string
        }
        Insert: {
          avatar_url?: string
          created_at?: string
          email?: string
          full_name?: string
          id: string
          phone?: string
          registration?: Json
          updated_at?: string
        }
        Update: {
          avatar_url?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
          registration?: Json
          updated_at?: string
        }
        Relationships: []
      }
      student_bans: {
        Row: {
          banned_by: string
          created_at: string
          reason: string
          user_id: string
        }
        Insert: {
          banned_by: string
          created_at?: string
          reason?: string
          user_id: string
        }
        Update: {
          banned_by?: string
          created_at?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_bans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_goals: {
        Row: {
          created_at: string
          done: boolean
          id: string
          kind: string
          period_key: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          done?: boolean
          id?: string
          kind: string
          period_key: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          done?: boolean
          id?: string
          kind?: string
          period_key?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_journal: {
        Row: {
          body: string
          created_at: string
          day: string
          id: string
          mood: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          day: string
          id?: string
          mood?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          day?: string
          id?: string
          mood?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_journal_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_notes: {
        Row: {
          body: string
          created_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          title?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          admin_notes: string
          amount_paise: number
          cancelled_at: string | null
          class_days: string[]
          created_at: string
          duration_days: number
          expires_at: string | null
          fulfilled_at: string | null
          fulfillment_status: Database["public"]["Enums"]["order_fulfillment_status"]
          id: string
          plan_code: string
          plan_name: string
          razorpay_order_id: string
          razorpay_payment_id: string | null
          source: string
          starts_at: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string
          amount_paise: number
          cancelled_at?: string | null
          class_days?: string[]
          created_at?: string
          duration_days: number
          expires_at?: string | null
          fulfilled_at?: string | null
          fulfillment_status?: Database["public"]["Enums"]["order_fulfillment_status"]
          id?: string
          plan_code: string
          plan_name: string
          razorpay_order_id: string
          razorpay_payment_id?: string | null
          source?: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string
          amount_paise?: number
          cancelled_at?: string | null
          class_days?: string[]
          created_at?: string
          duration_days?: number
          expires_at?: string | null
          fulfilled_at?: string | null
          fulfillment_status?: Database["public"]["Enums"]["order_fulfillment_status"]
          id?: string
          plan_code?: string
          plan_name?: string
          razorpay_order_id?: string
          razorpay_payment_id?: string | null
          source?: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_streak_rankings: {
        Args: { _period: string }
        Returns: {
          avatar_url: string
          days: number
          full_name: string
          user_id: string
        }[]
      }
      get_wakeup_streaks: {
        Args: never
        Returns: {
          avatar_url: string
          full_name: string
          streak_days: number
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_banned: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
      class_link_mode: "temporary" | "monthly"
      order_fulfillment_status:
        | "pending"
        | "processing"
        | "delivered"
        | "cancelled"
      subscription_status:
        | "pending"
        | "active"
        | "expired"
        | "failed"
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
      app_role: ["admin", "user"],
      class_link_mode: ["temporary", "monthly"],
      order_fulfillment_status: [
        "pending",
        "processing",
        "delivered",
        "cancelled",
      ],
      subscription_status: [
        "pending",
        "active",
        "expired",
        "failed",
        "cancelled",
      ],
    },
  },
} as const
