"use client";

import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from 'lucide-react';

export interface SermonWorkflowRef {
  saveWorkflow: () => void;
}

interface ConfigureWorkflowProps {
  onClose: () => void;
  onSave: (steps: Step[]) => void;
  initialSteps: Step[];
}

interface Step {
  id: string;
  title: string;
  description: string;
}

const ConfigureWorkflow = forwardRef<SermonWorkflowRef, ConfigureWorkflowProps>((props, ref) => {
  const [steps, setSteps] = useState<Step[]>(props.initialSteps);

  const addStep = () => {
    const newStep: Step = {
      id: String(steps.length + 1),
      title: `New Step ${steps.length + 1}`,
      description: 'Description for the new step',
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (id: string, field: keyof Step, value: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const saveWorkflow = () => {
    console.log('Saving workflow:', steps);
    props.onSave(steps);
    props.onClose();
  };

  useImperativeHandle(ref, () => ({
    saveWorkflow
  }));

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Configure Workflow</h2>
      {steps.map((step, index) => (
        <Card key={step.id} className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor={`step-title-${step.id}`} className="font-bold">
                Step {index + 1}
              </Label>
              <Button variant="ghost" size="sm" onClick={() => removeStep(step.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Input
              id={`step-title-${step.id}`}
              value={step.title}
              onChange={(e) => updateStep(step.id, 'title', e.target.value)}
              className="mb-2"
            />
            <Input
              value={step.description}
              onChange={(e) => updateStep(step.id, 'description', e.target.value)}
            />
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-between mt-4">
        <Button onClick={addStep}>Add Step</Button>
        <div>
          <Button onClick={saveWorkflow} className="mr-2">Save</Button>
          <Button onClick={props.onClose} variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  );
});

ConfigureWorkflow.displayName = 'ConfigureWorkflow';

export default ConfigureWorkflow;