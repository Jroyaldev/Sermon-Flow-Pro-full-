import React, { useEffect } from 'react';
import { format, differenceInDays } from 'date-fns';

interface Task {
  id: string;
  title: string;
  completed_at: string | null;  // Changed from string to string | null
  status: 'active' | 'completed' | 'deleted';
}

interface RecentActivityProps {
  tasks: Task[];
  onTaskStatusUpdate: (id: string, status: 'active' | 'completed' | 'deleted') => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ tasks, onTaskStatusUpdate }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      tasks.forEach(task => {
        if (task.status === 'completed' && task.completed_at && differenceInDays(new Date(), new Date(task.completed_at)) >= 7) {
          onTaskStatusUpdate(task.id, 'deleted');
        }
      });
    }, 86400000); // Check once a day

    return () => clearInterval(interval);
  }, [tasks, onTaskStatusUpdate]);

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <span>{task.title}</span>
          {task.completed_at && (
            <span>Completed: {format(new Date(task.completed_at), 'yyyy-MM-dd')}</span>
          )}
          <button onClick={() => onTaskStatusUpdate(task.id, 'active')}>Restore</button>
        </li>
      ))}
    </ul>
  );
};

export default RecentActivity;