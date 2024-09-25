"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WorkflowChart from './WorkflowChart';

interface WorkflowStep {
  id: string;
  name: string;
  dayOfWeek: string;
  weeksBeforeSermon: number;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ConfigureWorkflow() {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  
  useEffect(() => {
    // Load saved steps from local storage when component mounts
    const savedSteps = localStorage.getItem('workflowSteps');
    if (savedSteps) {
      setSteps(JSON.parse(savedSteps));
    } else {
      // If no saved steps, use default steps
      const defaultSteps = [
        { id: '1', name: 'Research', dayOfWeek: 'Monday', weeksBeforeSermon: 3 },
        { id: '2', name: 'Outline', dayOfWeek: 'Wednesday', weeksBeforeSermon: 2 },
        { id: '3', name: 'Write Draft', dayOfWeek: 'Monday', weeksBeforeSermon: 1 },
        { id: '4', name: 'Review', dayOfWeek: 'Thursday', weeksBeforeSermon: 1 },
        { id: '5', name: 'Practice', dayOfWeek: 'Saturday', weeksBeforeSermon: 0 },
      ];
      setSteps(defaultSteps);
    }
  }, []);

  const handleUpdateStep = (stepId: string, field: keyof WorkflowStep, value: string | number) => {
    setSteps(steps.map(step =>
      step.id === stepId ? { ...step, [field]: value } : step
    ));
  };

  const handleSave = () => {
    localStorage.setItem('workflowSteps', JSON.stringify(steps));
    console.log("Workflow Saved"); // Replace toast with console.log
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Configure Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {steps.map(step => (
            <li key={step.id} className="flex items-center justify-between space-x-2">
              <span>{step.name}</span>
              <div className="flex items-center space-x-2">
                <Select
                  value={step.dayOfWeek}
                  onValueChange={(value: string) => handleUpdateStep(step.id, 'dayOfWeek', value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map(day => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={step.weeksBeforeSermon.toString()}
                  onValueChange={(value: string) => handleUpdateStep(step.id, 'weeksBeforeSermon', parseInt(value))}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select weeks" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4].map(week => (
                      <SelectItem key={week} value={week.toString()}>
                        {week === 0 ? 'Sermon week' : `${week} week${week > 1 ? 's' : ''} before`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </li>
          ))}
        </ul>
        <WorkflowChart steps={steps} />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="ml-auto">Save Workflow</Button>
      </CardFooter>
    </Card>
  );
}