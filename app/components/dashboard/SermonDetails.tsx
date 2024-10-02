// app/components/Dashboard/SermonDetails.tsx

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

type Sermon = Database['public']['Tables']['sermons']['Row'];

interface SermonDetailsProps {
  sermonId: string;
  onClose: () => void;
  onUpdate: (updatedSermon: Sermon) => void;
  onDelete: (sermonId: string) => void;
}

const SermonDetails: React.FC<SermonDetailsProps> = ({
  sermonId,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchSermon = async () => {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .eq('id', sermonId)
        .single();

      if (error) {
        console.error('Error fetching sermon:', error);
      } else {
        setSermon(data);
      }
    };

    fetchSermon();
  }, [sermonId, supabase]);

  const handleUpdate = async () => {
    if (!sermon) return;

    const { data, error } = await supabase
      .from('sermons')
      .update(sermon)
      .eq('id', sermonId)
      .select()
      .single();

    if (error) {
      console.error('Error updating sermon:', error);
    } else if (data) {
      onUpdate(data);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase.from('sermons').delete().eq('id', sermonId);

    if (error) {
      console.error('Error deleting sermon:', error);
    } else {
      onDelete(sermonId);
      onClose();
    }
  };

  if (!sermon) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? 'Edit Sermon' : 'Sermon Details'}
        </h2>
        {isEditing ? (
          <>
            <input
              type="text"
              value={sermon.title || ''}
              onChange={(e) => setSermon({ ...sermon, title: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="date"
              value={sermon.created_at ? sermon.created_at.split('T')[0] : ''}
              onChange={(e) => setSermon({ ...sermon, created_at: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
            />
            {/* Add more fields as needed */}
            <Button onClick={handleUpdate} className="bg-blue-500 text-white p-2 rounded mr-2">
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)} className="bg-gray-300 p-2 rounded">
              Cancel
            </Button>
          </>
        ) : (
          <>
            <p>
              <strong>Title:</strong> {sermon.title}
            </p>
            <p>
              <strong>Date:</strong>{' '}
              {sermon.created_at
                ? new Date(sermon.created_at).toLocaleDateString()
                : 'N/A'}
            </p>
            {/* Add more fields as needed */}
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white p-2 rounded mr-2 mt-4"
            >
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 text-white p-2 rounded mr-2 mt-4"
            >
              Delete
            </Button>
            <Button onClick={onClose} className="bg-gray-300 p-2 rounded mt-4">
              Close
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SermonDetails;
