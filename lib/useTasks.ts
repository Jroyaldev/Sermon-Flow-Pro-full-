import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/hooks/useAuth';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  created_at: string;
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { session } = useAuth();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data || []);
    }
  };

  const addTask = async (title: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, user_id: session?.user.id }])
      .select();

    if (error) {
      console.error('Error adding task:', error);
    } else if (data) {
      setTasks([...tasks, data[0]]);
    }
  };

  const toggleTask = async (taskId: string) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;

    const { error } = await supabase
      .from('tasks')
      .update({ completed: !taskToUpdate.completed })
      .eq('id', taskId);

    if (error) {
      console.error('Error toggling task:', error);
    } else {
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ));
    }
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
    } else {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  return { tasks, addTask, toggleTask, deleteTask };
}