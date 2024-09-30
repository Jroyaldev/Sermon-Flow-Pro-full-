// app/components/Dashboard/AddTaskPopup.tsx

import { Button } from "@/components/ui/button";
import { useState } from 'react';

interface AddTaskPopupProps {
  onClose: () => void;
  onAddTask: (task: any) => void;
}

const AddTaskPopup: React.FC<AddTaskPopupProps> = ({ onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = () => {
    if (title.trim() === '') return;
    onAddTask({ title, dueDate: dueDate ? new Date(dueDate) : undefined });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Task</Button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskPopup;
