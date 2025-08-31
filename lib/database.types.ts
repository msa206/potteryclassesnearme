export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cities: {
        Row: {
          id: number
          city: string
          state: string
          city_slug: string
          state_slug: string
          slug: string
          lat: number | null
          lng: number | null
          intro_mdx_path: string | null
        }
        Insert: {
          id?: number
          city: string
          state: string
          city_slug: string
          state_slug: string
          slug: string
          lat?: number | null
          lng?: number | null
          intro_mdx_path?: string | null
        }
        Update: {
          id?: number
          city?: string
          state?: string
          city_slug?: string
          state_slug?: string
          slug?: string
          lat?: number | null
          lng?: number | null
          intro_mdx_path?: string | null
        }
      }
      providers: {
        Row: {
          id: string
          name: string
          provider_slug: string
          website: string | null
          phone: string | null
          full_address: string
          street: string
          city: string
          state: string
          zip: string
          lat: number | null
          lng: number | null
          review_count: number | null
          rating: number | null
          working_hours: string | null
          source_url: string | null
          city_slug: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          provider_slug?: string
          website?: string | null
          phone?: string | null
          full_address: string
          street: string
          city: string
          state: string
          zip: string
          lat?: number | null
          lng?: number | null
          review_count?: number | null
          rating?: number | null
          working_hours?: string | null
          source_url?: string | null
          city_slug: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          provider_slug?: string
          website?: string | null
          phone?: string | null
          full_address?: string
          street?: string
          city?: string
          state?: string
          zip?: string
          lat?: number | null
          lng?: number | null
          review_count?: number | null
          rating?: number | null
          working_hours?: string | null
          source_url?: string | null
          city_slug?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      zip_mappings: {
        Row: {
          zip: string
          city: string
          state: string
          lat: number
          lng: number
          city_slug: string
        }
        Insert: {
          zip: string
          city: string
          state: string
          lat: number
          lng: number
          city_slug: string
        }
        Update: {
          zip?: string
          city?: string
          state?: string
          lat?: number
          lng?: number
          city_slug?: string
        }
      }
      providers_raw: {
        Row: {
          name: string | null
          site: string | null
          phone_number: string | null
          full_address: string | null
          street: string | null
          city: string | null
          state: string | null
          postal_code: string | null
          review_count: number | null
          review_stars: number | null
          working_hours: string | null
          latitude: number | null
          longitude: number | null
          source_url: string | null
        }
        Insert: {
          name?: string | null
          site?: string | null
          phone_number?: string | null
          full_address?: string | null
          street?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          review_count?: number | null
          review_stars?: number | null
          working_hours?: string | null
          latitude?: number | null
          longitude?: number | null
          source_url?: string | null
        }
        Update: {
          name?: string | null
          site?: string | null
          phone_number?: string | null
          full_address?: string | null
          street?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          review_count?: number | null
          review_stars?: number | null
          working_hours?: string | null
          latitude?: number | null
          longitude?: number | null
          source_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      slugify: {
        Args: {
          txt: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}