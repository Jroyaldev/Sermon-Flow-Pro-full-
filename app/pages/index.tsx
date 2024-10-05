import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setTasks(data);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskStatusUpdate = async (id: string, status: string) => {
    try {
      await fetch(`/api/tasks?id=${id}&status=${status}`, { method: 'PATCH' });
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div>
      <h1>My Tasks</h1>
      <TaskList tasks={tasks} onTaskStatusUpdate={handleTaskStatusUpdate} />
    </div>
  );
};

export default HomePage;