export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      aisles: {
        Row: {
          id: string
          label: string
          position: number
        }
        Insert: {
          id: string
          label: string
          position: number
        }
        Update: {
          id?: string
          label?: string
          position?: number
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: Database["public"]["Enums"]["staff_role"] | null
          created_at: string
          details: Json
          entity: string
          entity_id: string
          id: number
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: Database["public"]["Enums"]["staff_role"] | null
          created_at?: string
          details?: Json
          entity: string
          entity_id: string
          id?: never
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: Database["public"]["Enums"]["staff_role"] | null
          created_at?: string
          details?: Json
          entity?: string
          entity_id?: string
          id?: never
        }
        Relationships: []
      }
      challenges: {
        Row: {
          active: boolean
          description: string
          id: string
          target: number
          title: string
          window_weeks: number
        }
        Insert: {
          active?: boolean
          description: string
          id: string
          target: number
          title: string
          window_weeks: number
        }
        Update: {
          active?: boolean
          description?: string
          id?: string
          target?: number
          title?: string
          window_weeks?: number
        }
        Relationships: []
      }
      household_invites: {
        Row: {
          accepted_at: string | null
          email: string
          expires_at: string
          household_id: string
          id: string
          invited_by: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          email: string
          expires_at?: string
          household_id: string
          id?: string
          invited_by: string
          token?: string
        }
        Update: {
          accepted_at?: string | null
          email?: string
          expires_at?: string
          household_id?: string
          id?: string
          invited_by?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "household_invites_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "household_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          adults: number
          children: number
          cooking_time: Database["public"]["Enums"]["cooking_time"]
          created_at: string
          diet: Database["public"]["Enums"]["diet"]
          exclusions: string[]
          id: string
          meals_per_week: number
          name: string | null
          postal_code: string | null
          preferred_store_id: string | null
        }
        Insert: {
          adults?: number
          children?: number
          cooking_time?: Database["public"]["Enums"]["cooking_time"]
          created_at?: string
          diet?: Database["public"]["Enums"]["diet"]
          exclusions?: string[]
          id?: string
          meals_per_week?: number
          name?: string | null
          postal_code?: string | null
          preferred_store_id?: string | null
        }
        Update: {
          adults?: number
          children?: number
          cooking_time?: Database["public"]["Enums"]["cooking_time"]
          created_at?: string
          diet?: Database["public"]["Enums"]["diet"]
          exclusions?: string[]
          id?: string
          meals_per_week?: number
          name?: string | null
          postal_code?: string | null
          preferred_store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "households_preferred_store_id_fkey"
            columns: ["preferred_store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plan_items: {
        Row: {
          day: number
          id: string
          locked: boolean
          meal_plan_id: string
          recipe_id: string
          servings: number
          slot: Database["public"]["Enums"]["meal_slot"]
        }
        Insert: {
          day: number
          id?: string
          locked?: boolean
          meal_plan_id: string
          recipe_id: string
          servings: number
          slot: Database["public"]["Enums"]["meal_slot"]
        }
        Update: {
          day?: number
          id?: string
          locked?: boolean
          meal_plan_id?: string
          recipe_id?: string
          servings?: number
          slot?: Database["public"]["Enums"]["meal_slot"]
        }
        Relationships: [
          {
            foreignKeyName: "meal_plan_items_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_plan_items_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          cheapest_cents: number | null
          cheapest_store_id: string | null
          created_at: string
          household_id: string
          id: string
          reference_cents: number | null
          store_id: string
          total_cents: number | null
          validated_at: string | null
          week_start: string
        }
        Insert: {
          cheapest_cents?: number | null
          cheapest_store_id?: string | null
          created_at?: string
          household_id: string
          id?: string
          reference_cents?: number | null
          store_id: string
          total_cents?: number | null
          validated_at?: string | null
          week_start: string
        }
        Update: {
          cheapest_cents?: number | null
          cheapest_store_id?: string | null
          created_at?: string
          household_id?: string
          id?: string
          reference_cents?: number | null
          store_id?: string
          total_cents?: number | null
          validated_at?: string | null
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_cheapest_store_id_fkey"
            columns: ["cheapest_store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_plans_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_plans_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          href: string | null
          id: string
          kind: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          href?: string | null
          id?: string
          kind: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          href?: string | null
          id?: string
          kind?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          cents: number
          created_at: string
          flagged_aberrant: boolean
          id: number
          location_id: string | null
          moderated_by: string | null
          observed_at: string
          product_id: string
          receipt_id: string | null
          source: Database["public"]["Enums"]["price_source"]
          store_id: string
        }
        Insert: {
          cents: number
          created_at?: string
          flagged_aberrant?: boolean
          id?: never
          location_id?: string | null
          moderated_by?: string | null
          observed_at: string
          product_id: string
          receipt_id?: string | null
          source: Database["public"]["Enums"]["price_source"]
          store_id: string
        }
        Update: {
          cents?: number
          created_at?: string
          flagged_aberrant?: boolean
          id?: never
          location_id?: string | null
          moderated_by?: string | null
          observed_at?: string
          product_id?: string
          receipt_id?: string | null
          source?: Database["public"]["Enums"]["price_source"]
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prices_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "store_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prices_receipt_fk"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prices_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          aisle_id: string | null
          brand: string | null
          created_at: string
          ean: string | null
          id: string
          name: string
          off_synced_at: string | null
          quantity_label: string | null
        }
        Insert: {
          aisle_id?: string | null
          brand?: string | null
          created_at?: string
          ean?: string | null
          id?: string
          name: string
          off_synced_at?: string | null
          quantity_label?: string | null
        }
        Update: {
          aisle_id?: string | null
          brand?: string | null
          created_at?: string
          ean?: string | null
          id?: string
          name?: string
          off_synced_at?: string | null
          quantity_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_aisle_id_fkey"
            columns: ["aisle_id"]
            isOneToOne: false
            referencedRelation: "aisles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          household_id: string | null
          id: string
          is_household_owner: boolean
          notify_promos: boolean
          notify_thursday: boolean
          referral_code: string | null
          referred_by: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          household_id?: string | null
          id: string
          is_household_owner?: boolean
          notify_promos?: boolean
          notify_thursday?: boolean
          referral_code?: string | null
          referred_by?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          household_id?: string | null
          id?: string
          is_household_owner?: boolean
          notify_promos?: boolean
          notify_thursday?: boolean
          referral_code?: string | null
          referred_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      receipt_lines: {
        Row: {
          cents: number | null
          decision: Database["public"]["Enums"]["line_decision"]
          id: string
          match_confidence: number | null
          product_id: string | null
          raw_text: string
          receipt_id: string
        }
        Insert: {
          cents?: number | null
          decision?: Database["public"]["Enums"]["line_decision"]
          id?: string
          match_confidence?: number | null
          product_id?: string | null
          raw_text: string
          receipt_id: string
        }
        Update: {
          cents?: number | null
          decision?: Database["public"]["Enums"]["line_decision"]
          id?: string
          match_confidence?: number | null
          product_id?: string | null
          raw_text?: string
          receipt_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receipt_lines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipt_lines_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          created_at: string
          id: string
          location_id: string | null
          ocr_confidence: number | null
          photo_path: string
          purchased_at: string | null
          reviewed_by: string | null
          reward_days: number
          status: Database["public"]["Enums"]["receipt_status"]
          store_id: string | null
          total_cents: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_id?: string | null
          ocr_confidence?: number | null
          photo_path: string
          purchased_at?: string | null
          reviewed_by?: string | null
          reward_days?: number
          status?: Database["public"]["Enums"]["receipt_status"]
          store_id?: string | null
          total_cents?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string | null
          ocr_confidence?: number | null
          photo_path?: string
          purchased_at?: string | null
          reviewed_by?: string | null
          reward_days?: number
          status?: Database["public"]["Enums"]["receipt_status"]
          store_id?: string | null
          total_cents?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receipts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "store_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          id: string
          label: string
          pantry: boolean
          position: number
          product_id: string | null
          recipe_id: string
          units: number
        }
        Insert: {
          id?: string
          label: string
          pantry?: boolean
          position?: number
          product_id?: string | null
          recipe_id: string
          units: number
        }
        Update: {
          id?: string
          label?: string
          pantry?: boolean
          position?: number
          product_id?: string | null
          recipe_id?: string
          units?: number
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          cook_minutes: number | null
          created_at: string
          description: string | null
          diets: Database["public"]["Enums"]["diet"][]
          family: string
          id: string
          illustration: string | null
          prep_minutes: number | null
          published: boolean
          season_months: number[]
          seo_description: string | null
          seo_title: string | null
          servings: number
          slug: string
          steps: Json
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          cook_minutes?: number | null
          created_at?: string
          description?: string | null
          diets?: Database["public"]["Enums"]["diet"][]
          family?: string
          id?: string
          illustration?: string | null
          prep_minutes?: number | null
          published?: boolean
          season_months?: number[]
          seo_description?: string | null
          seo_title?: string | null
          servings?: number
          slug: string
          steps?: Json
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          cook_minutes?: number | null
          created_at?: string
          description?: string | null
          diets?: Database["public"]["Enums"]["diet"][]
          family?: string
          id?: string
          illustration?: string | null
          prep_minutes?: number | null
          published?: boolean
          season_months?: number[]
          seo_description?: string | null
          seo_title?: string | null
          servings?: number
          slug?: string
          steps?: Json
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          role: Database["public"]["Enums"]["staff_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          role: Database["public"]["Enums"]["staff_role"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          user_id?: string
        }
        Relationships: []
      }
      shopping_list_items: {
        Row: {
          added_by: string | null
          aisle_id: string | null
          checked: boolean
          checked_by: string | null
          est_cents: number | null
          id: string
          label: string
          list_id: string
          manual: boolean
          product_id: string | null
          quantity_label: string | null
          updated_at: string
        }
        Insert: {
          added_by?: string | null
          aisle_id?: string | null
          checked?: boolean
          checked_by?: string | null
          est_cents?: number | null
          id?: string
          label: string
          list_id: string
          manual?: boolean
          product_id?: string | null
          quantity_label?: string | null
          updated_at?: string
        }
        Update: {
          added_by?: string | null
          aisle_id?: string | null
          checked?: boolean
          checked_by?: string | null
          est_cents?: number | null
          id?: string
          label?: string
          list_id?: string
          manual?: boolean
          product_id?: string | null
          quantity_label?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_list_items_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_items_aisle_id_fkey"
            columns: ["aisle_id"]
            isOneToOne: false
            referencedRelation: "aisles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_items_checked_by_fkey"
            columns: ["checked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "shopping_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_lists: {
        Row: {
          created_at: string
          id: string
          meal_plan_id: string
          share_token: string | null
          store_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meal_plan_id: string
          share_token?: string | null
          store_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meal_plan_id?: string
          share_token?: string | null
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_lists_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: true
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_lists_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_locations: {
        Row: {
          city: string
          id: string
          label: string
          lat: number | null
          lng: number | null
          osm_id: string | null
          postal_code: string
          store_id: string
        }
        Insert: {
          city: string
          id?: string
          label: string
          lat?: number | null
          lng?: number | null
          osm_id?: string | null
          postal_code: string
          store_id: string
        }
        Update: {
          city?: string
          id?: string
          label?: string
          lat?: number | null
          lng?: number | null
          osm_id?: string | null
          postal_code?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_locations_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          active: boolean
          country: string
          drive_url: string | null
          id: string
          initials: string
          name: string
        }
        Insert: {
          active?: boolean
          country?: string
          drive_url?: string | null
          id: string
          initials: string
          name: string
        }
        Update: {
          active?: boolean
          country?: string
          drive_url?: string | null
          id?: string
          initials?: string
          name?: string
        }
        Relationships: []
      }
      streaks: {
        Row: {
          best_weeks: number
          current_weeks: number
          household_id: string
          last_validated_week: string | null
        }
        Insert: {
          best_weeks?: number
          current_weeks?: number
          household_id: string
          last_validated_week?: string | null
        }
        Update: {
          best_weeks?: number
          current_weeks?: number
          household_id?: string
          last_validated_week?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "streaks_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: true
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          bonus_days: number
          cancel_at_period_end: boolean
          current_period_end: string | null
          household_id: string
          interval: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: Database["public"]["Enums"]["plan_tier"]
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          bonus_days?: number
          cancel_at_period_end?: boolean
          current_period_end?: string | null
          household_id: string
          interval?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["plan_tier"]
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          bonus_days?: number
          cancel_at_period_end?: boolean
          current_period_end?: string | null
          household_id?: string
          interval?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["plan_tier"]
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: true
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenges: {
        Row: {
          challenge_id: string
          completed_at: string | null
          household_id: string
          progress: number
          started_at: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          household_id: string
          progress?: number
          started_at?: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          household_id?: string
          progress?: number
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_challenges_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      current_prices: {
        Row: {
          last_observed_at: string | null
          median_cents: number | null
          n: number | null
          product_id: string | null
          store_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prices_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: { r: Database["public"]["Enums"]["staff_role"] }
        Returns: boolean
      }
      is_premium: { Args: { h: string }; Returns: boolean }
      log_action: {
        Args: {
          p_action: string
          p_details?: Json
          p_entity: string
          p_entity_id: string
        }
        Returns: undefined
      }
      my_household_id: { Args: never; Returns: string }
      my_staff_role: {
        Args: never
        Returns: Database["public"]["Enums"]["staff_role"]
      }
      shared_list: { Args: { share: string }; Returns: Json }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      cooking_time: "moins_30" | "30_45" | "peu_importe"
      diet:
        | "omnivore"
        | "sans_porc"
        | "vegetarien"
        | "vegan"
        | "halal"
        | "sans_gluten"
      line_decision: "auto" | "accepte" | "corrige" | "ignore"
      meal_slot: "dejeuner" | "diner"
      plan_tier: "free" | "trial" | "premium"
      price_source: "open_prices" | "ticket" | "manual"
      receipt_status: "en_attente" | "en_revue" | "valide" | "rejete"
      staff_role: "admin" | "moderateur_prix" | "editeur" | "support"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      cooking_time: ["moins_30", "30_45", "peu_importe"],
      diet: [
        "omnivore",
        "sans_porc",
        "vegetarien",
        "vegan",
        "halal",
        "sans_gluten",
      ],
      line_decision: ["auto", "accepte", "corrige", "ignore"],
      meal_slot: ["dejeuner", "diner"],
      plan_tier: ["free", "trial", "premium"],
      price_source: ["open_prices", "ticket", "manual"],
      receipt_status: ["en_attente", "en_revue", "valide", "rejete"],
      staff_role: ["admin", "moderateur_prix", "editeur", "support"],
    },
  },
} as const

