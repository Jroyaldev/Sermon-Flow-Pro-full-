// app/components/Dashboard/SermonWorkflow.tsx

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Slider } from "@/components/ui/slider";
import { format, subDays } from 'date-fns';

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  isSystemStep: boolean;
  daysBeforeSermon: number;
};

interface SermonWorkflowProps {
  onClose: () => void;
  onSave: (steps: WorkflowStep[]) => void;
  initialSteps: WorkflowStep[];
  currentSteps: WorkflowStep[];
}

export interface SermonWorkflowRef {
  save: () => void;
}

const SermonWorkflow = forwardRef<SermonWorkflowRef, SermonWorkflowProps>(
  ({ onClose, onSave, initialSteps, currentSteps }, ref) => {
    const [steps, setSteps] = useState<WorkflowStep[]>(currentSteps || initialSteps);

    // Expose the save function to the parent component
    useImperativeHandle(ref, () => ({
      save: () => onSave(steps),
    }));

    const addStep = (index: number) => {
      const newStep: WorkflowStep = {
        id: Date.now().toString(),
        title: 'New Step',
        description: 'Description for the new step',
        isSystemStep: false,
        daysBeforeSermon: 7,
      };
      const newSteps = [...steps.slice(0, index + 1), newStep, ...steps.slice(index + 1)];
      setSteps(newSteps);
    };

    const updateStep = (index: number, updatedStep: Partial<WorkflowStep>) => {
      setSteps(prevSteps =>
        prevSteps.map((step, i) => (i === index ? { ...step, ...updatedStep } : step))
      );
    };

    const removeStep = (index: number) => {
      setSteps(prevSteps => prevSteps.filter((_, i) => i !== index));
    };

    const resetTemplate = () => {
      setSteps(initialSteps);
    };

    const formatDueDate = (daysBeforeSermon: number) => {
      if (daysBeforeSermon === 0) {
        return "Sunday (Sermon day)";
      } else if (daysBeforeSermon === 1) {
        return "Saturday (day before)";
      } else {
        const weeksBefore = Math.floor(daysBeforeSermon / 7);
        const dueDate = subDays(new Date(), daysBeforeSermon);
        const dayOfWeek = format(dueDate, 'EEEE');

        if (weeksBefore === 0) {
          return `${dayOfWeek} (week of sermon)`;
        } else if (weeksBefore === 1) {
          return `${dayOfWeek} (1 week before)`;
        } else {
          return `${dayOfWeek} (${weeksBefore} weeks before)`;
        }
      }
    };

    const handleDaysBeforeSermonChange = (stepId: string, value: number[]) => {
      setSteps(prevSteps =>
        prevSteps.map(step =>
          step.id === stepId ? { ...step, daysBeforeSermon: value[0] } : step
        )
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Configure Sermon Workflow</h2>
          <p className="mb-4 text-gray-600">
            These steps will be created as tasks when you add a new sermon. Due dates will be set automatically based on the days before the sermon for each step.
          </p>
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {index > 0 && (
                <div className="flex items-center justify-center my-2">
                  <button
                    onClick={() => addStep(index - 1)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    + Add Step
                  </button>
                </div>
              )}
              <div className={`mb-4 p-4 border rounded ${step.isSystemStep ? 'bg-gray-100' : ''}`}>
                <div className="flex items-center mb-2">
                  <span className="font-bold mr-2">{index + 1}.</span>
                  {step.isSystemStep ? (
                    <span className="flex-grow font-semibold">{step.title}</span>
                  ) : (
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => updateStep(index, { title: e.target.value })}
                      className="flex-grow p-2 border rounded"
                    />
                  )}
                  <span className="ml-2 text-sm text-gray-600">
                    {formatDueDate(step.daysBeforeSermon)}
                  </span>
                  <button
                    onClick={() => removeStep(index)}
                    className={`ml-2 ${step.isSystemStep ? 'text-black' : 'text-red-500'} hover:opacity-70 font-bold`}
                    title="Remove step"
                  >
                    ×
                  </button>
                </div>
                {step.isSystemStep ? (
                  <p className="text-gray-600">{step.description}</p>
                ) : (
                  <textarea
                    value={step.description}
                    onChange={(e) => updateStep(index, { description: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                )}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days before sermon: {step.daysBeforeSermon}
                  </label>
                  <Slider
                    value={[step.daysBeforeSermon]}
                    onValueChange={(value) => handleDaysBeforeSermonChange(step.id, value)}
                    max={28}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </React.Fragment>
          ))}
          <div className="flex items-center justify-center mt-4">
            <button
              onClick={() => addStep(steps.length - 1)}
              className="text-blue-500 hover:text-blue-700"
            >
              + Add Final Step
            </button>
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={resetTemplate}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Reset Template
            </button>
            <div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded mr-2 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(steps)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Workflow
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SermonWorkflow.displayName = 'SermonWorkflow';

export default SermonWorkflow;
