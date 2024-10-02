export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Sermon {
  id: string;
  title: string;
  scripture?: string;
  date: string;
  notes?: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface RecentActivity {
  id: string;
  description: string;
  activity_type: string;
  related_id?: string;
  user_id: string;
  created_at: string;
}