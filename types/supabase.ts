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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          church_name: string | null
          role: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          church_name?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          church_name?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          completed?: boolean
          created_at?: string
        }
      }
      subtasks: {
        Row: {
          id: string
          task_id: string
          title: string
          completed: boolean
        }
        Insert: {
          id?: string
          task_id: string
          title: string
          completed?: boolean
        }
        Update: {
          id?: string
          task_id?: string
          title?: string
          completed?: boolean
        }
      }
      sermons: {
        Row: {
          id: string
          title: string
          date: string
          scripture: string
          notes: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          date: string
          scripture: string
          notes: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          date?: string
          scripture?: string
          notes?: string
          created_at?: string
        }
      }
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}