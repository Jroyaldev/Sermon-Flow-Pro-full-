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
          dueDate?: string
        }
        Insert: {
          id?: string
          title: string
          completed?: boolean
          created_at?: string
          dueDate?: string
        }
        Update: {
          id?: string
          title?: string
          completed?: boolean
          created_at?: string
          dueDate?: string
        }
      }
      sermons: {
        Row: {
          id: string
          title: string
          created_at: string
          // Add any other fields your sermons table has
        }
        Insert: {
          id?: string
          title: string
          created_at?: string
          // Add any other fields your sermons table has
        }
        Update: {
          id?: string
          title?: string
          created_at?: string
          // Add any other fields your sermons table has
        }
      }
      subtasks: {
        Row: {
          id: string
          task_id: string
          title: string
          completed: boolean
        }
        Insert: Omit<Database['public']['Tables']['subtasks']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['subtasks']['Row']>
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
  }
}