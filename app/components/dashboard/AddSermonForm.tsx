// app/components/Dashboard/AddSermonForm.tsx

import { Button } from "@/components/ui/button";
import { useState } from 'react';

interface AddSermonFormProps {
  onAddSermon: (sermon: any) => void;
  onCancel: () => void;
}

const AddSermonForm: React.FC<AddSermonFormProps> = ({ onAddSermon, onCancel }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [scripture, setScripture] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (title.trim() === '' || date.trim() === '') return;
    onAddSermon({ title, date: new Date(date), scripture, notes });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Sermon</h2>
        <input
          type="text"
          placeholder="Sermon Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        />
        <input
          type="text"
          placeholder="Scripture"
          value={scripture}
          onChange={(e) => setScripture(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        />
        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Sermon</Button>
        </div>
      </div>
    </div>
  );
};

export default AddSermonForm;
