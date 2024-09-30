import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Database } from '@/types/supabase'

type Task = Database['public']['Tables']['tasks']['Insert']

interface AddTaskPopupProps {
  onClose: () => void
  onAddTask: (task: Task) => void
}

export default function AddTaskPopup({ onClose, onAddTask }: AddTaskPopupProps) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAddTask({
        title: title.trim(),
        completed: false,
        dueDate: dueDate || undefined  // Change null to undefined
      })
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            className="mb-4"
          />
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-end">
            <Button type="button" onClick={onClose} variant="outline" className="mr-2">
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </div>
        </form>
      </div>
    </div>
  )
}