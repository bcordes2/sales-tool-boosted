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
      manufcover: {
        Row: {
          manufacturer: string
          areacode: number
          delivery: string | null
          city: string | null
          state1: string | null
        }
        Insert: {
          manufacturer: string
          areacode: number
          delivery?: string | null
          city?: string | null
          state1?: string | null
        }
        Update: {
          manufacturer?: string
          areacode?: number
          delivery?: string | null
          city?: string | null
          state1?: string | null
        }
        Relationships: []
      }
      manufinfo: {
        Row: {
          key: number
          manufacturer: string
          website: string | null
          margin: string | null
          designtool: string | null
          logininfo: string | null
          coveragemap: string | null
          primaryrto: string | null
          primaryrtolink: string | null
          phonenumber: string | null
          rating: number | null
        }
        Insert: {
          key?: number
          manufacturer: string
          website?: string | null
          margin?: string | null
          designtool?: string | null
          logininfo?: string | null
          coveragemap?: string | null
          primaryrto?: string | null
          primaryrtolink?: string | null
          phonenumber?: string | null
          rating?: number | null
        }
        Update: {
          key?: number
          manufacturer?: string
          website?: string | null
          margin?: string | null
          designtool?: string | null
          logininfo?: string | null
          coveragemap?: string | null
          primaryrto?: string | null
          primaryrtolink?: string | null
          phonenumber?: string | null
          rating?: number | null
        }
        Relationships: []
      }
      trusstypes: {
        Row: {
          manufacturer: string
          product: string
          price: number | null
        }
        Insert: {
          manufacturer: string
          product: string
          price?: number | null
        }
        Update: {
          manufacturer?: string
          product?: string
          price?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      trussfilter: {
        Args: {
          zipcode_input: number
          trusstype_input: string
        }
        Returns: {
          c_manufacturer: string
          p_margin: string
          p_primaryrto: string
          p_primaryrtolink: string
          p_phonenumber: string
          c_leadtime: string
          c_zipcode: number
          p_coverage: string
          c_city: string
          c_state: string
          p_website: string
          p_tool: string
          p_login: string
          pt_product: string
          pt_price: number
          p_rating: number
        }[]
      }
      manufacturerfilter: {
        Args: {
          manufacturer_input: string
        }
        Returns: {
          key: number
          manufacturer: string
          website: string
          margin: string
          designtool: string
          logininfo: string
          coveragemap: string
          primaryrto: string
          primaryrtolink: string
          phonenumber: string
          rating: number
        }[]
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

// Type helpers for RPC function return types
export type TrussFilterResult = Database['public']['Functions']['trussfilter']['Returns'][0]
export type ManufacturerFilterResult = Database['public']['Functions']['manufacturerfilter']['Returns'][0]

