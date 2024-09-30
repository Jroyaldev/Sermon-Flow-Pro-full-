export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          title: string
          completed: boolean
          created_at?: string
          dueDate?: string  // Make dueDate optional
        }
        Insert: {
          id?: string
          title: string
          completed?: boolean
          created_at?: string
          dueDate?: string  // Make dueDate optional
        }
        Update: {
          id?: string
          title?: string
          completed?: boolean
          created_at?: string
          dueDate?: string
        }
      }
      // Add other tables as necessary
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}