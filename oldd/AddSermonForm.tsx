"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Update the import path to point to the new location of AddSermonFormClient
const AddSermonFormClient = dynamic(() => import('@/app/components/dashboard/AddSermonForm'), { ssr: false });

interface AddSermonFormProps {
  onAddSermon: (sermonData: any) => void;
  onCancel: () => void;
}

const AddSermonForm: React.FC<AddSermonFormProps> = ({ onAddSermon, onCancel }) => {
  return <AddSermonFormClient onAddSermon={onAddSermon} onCancel={onCancel} />;
};

export default AddSermonForm;