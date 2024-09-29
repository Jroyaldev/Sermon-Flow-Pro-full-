"use client";

import AddSermonFormClient from '@/app/components/AddSermonFormClient'

export interface SermonData {
  title: string;
  date: Date;
  scripture: string;
  notes: string;
}

export interface AddSermonFormProps {
  onAddSermon: (sermonData: SermonData) => void;
  onCancel: () => void;
}

export default function AddSermonForm(props: AddSermonFormProps) {
  return <AddSermonFormClient {...props} />
}