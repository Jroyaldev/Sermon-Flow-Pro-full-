import React from 'react';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  due_date: string | null;
  status: 'active' | 'completed' | 'deleted';
}

interface TaskListProps {
  tasks: Task[];
  onTaskStatusUpdate: (id: string, status: 'active' | 'completed' | 'deleted') => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskStatusUpdate }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={() => onTaskStatusUpdate(task.id, task.status === 'active' ? 'completed' : 'active')}
          />
          <span>{task.title}</span>
          {task.due_date && (
            <span>Due: {format(new Date(task.due_date), 'yyyy-MM-dd')}</span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;