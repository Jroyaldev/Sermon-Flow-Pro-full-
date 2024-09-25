"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { ArrowUp, ArrowDown, GripVertical } from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  dayOfWeek: string;
  weeksBeforeSermon: number;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ConfigureWorkflow() {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    const savedSteps = localStorage.getItem('workflowSteps');
    if (savedSteps) {
      setSteps(JSON.parse(savedSteps));
    } else {
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
    setHasChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem('workflowSteps', JSON.stringify(steps));
    setHasChanges(false);
    console.log("Workflow Saved: Your workflow has been successfully saved.");
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSteps(items);
    setHasChanges(true);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Configure Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Workflow Timeline</h3>
          <div className="relative h-12 bg-gray-200 rounded-full overflow-hidden">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="absolute h-full flex items-center justify-center text-xs font-bold text-white"
                style={{
                  left: `${(index / steps.length) * 100}%`,
                  width: `${(1 / steps.length) * 100}%`,
                  backgroundColor: `hsl(${(index * 360) / steps.length}, 70%, 50%)`,
                }}
              >
                {step.name}
              </div>
            ))}
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-4">Adjust Workflow Steps</h3>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="steps">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {steps.map((step, index) => (
                  <Draggable key={step.id} draggableId={step.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow"
                      >
                        <span {...provided.dragHandleProps}>
                          <GripVertical className="text-gray-400" />
                        </span>
                        <span className="w-1/4 font-semibold">{step.name}</span>
                        <div className="flex items-center space-x-2 w-3/4">
                          <Select
                            value={step.dayOfWeek}
                            onValueChange={(value) => handleUpdateStep(step.id, 'dayOfWeek', value)}
                          >
                            <SelectTrigger className="w-[150px]">
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
                            onValueChange={(value) => handleUpdateStep(step.id, 'weeksBeforeSermon', parseInt(value))}
                          >
                            <SelectTrigger className="w-[180px]">
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
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="ml-auto" disabled={!hasChanges}>
          {hasChanges ? 'Save Changes' : 'No Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
}