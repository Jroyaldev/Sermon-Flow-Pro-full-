import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  dayOfWeek: string;
  weeksBeforeSermon: number;
}

interface NewSermonPopupProps {
  onClose: () => void;
  onAddSermon: (sermonTitle: string, sermonDate: Date, tasks: Task[]) => void;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date;
}

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const NewSermonPopup: React.FC<NewSermonPopupProps> = ({ onClose, onAddSermon }) => {
  const [sermonTitle, setSermonTitle] = useState('');
  const [sermonDate, setSermonDate] = useState('');
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedWorkflow = localStorage.getItem('sermonWorkflow');
      if (savedWorkflow) {
        const parsedWorkflow = JSON.parse(savedWorkflow);
        console.log("Loaded workflow:", parsedWorkflow);
        setWorkflow(parsedWorkflow);
      } else {
        console.log("No saved workflow found");
        setError("No workflow configuration found. Please configure your workflow first.");
      }
    } catch (err) {
      console.error("Error loading workflow:", err);
      setError("Error loading workflow configuration.");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log("Form submitted");
    if (!sermonTitle || !sermonDate) {
      console.log("Missing title or date");
      setError("Please enter both sermon title and date.");
      return;
    }

    if (workflow.length === 0) {
      console.log("No workflow steps");
      setError("No workflow steps found. Please configure your workflow first.");
      return;
    }

    try {
      console.log("Creating sermon:", sermonTitle, sermonDate);
      const sermonDateObj = new Date(sermonDate);
      const tasks = workflow.map(step => {
        const taskDate = new Date(sermonDateObj);
        taskDate.setDate(taskDate.getDate() - (step.weeksBeforeSermon * 7));
        while (taskDate.getDay() !== daysOfWeek.indexOf(step.dayOfWeek)) {
          taskDate.setDate(taskDate.getDate() - 1);
        }
        return {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          title: `${step.name} for "${sermonTitle}"`,
          completed: false,
          dueDate: taskDate
        };
      });

      console.log("Generated tasks:", tasks);
      console.log("Calling onAddSermon function");
      onAddSermon(sermonTitle, sermonDateObj, tasks);
      console.log("onAddSermon function called");
    } catch (err) {
      console.error("Error creating sermon:", err);
      setError("An error occurred while creating the sermon. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>New Sermon</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="sermonTitle">Sermon Title</Label>
              <Input
                id="sermonTitle"
                value={sermonTitle}
                onChange={(e) => setSermonTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="sermonDate">Sermon Date</Label>
              <Input
                id="sermonDate"
                type="date"
                value={sermonDate}
                onChange={(e) => setSermonDate(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Add Sermon</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewSermonPopup;