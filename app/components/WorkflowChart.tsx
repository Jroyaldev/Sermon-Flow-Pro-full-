import React from 'react';
import { Book } from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  dayOfWeek: string;
  weeksBeforeSermon: number;
}

interface WorkflowChartProps {
  steps: WorkflowStep[];
}

const colors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const dayAbbreviations = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function WorkflowChart({ steps }: WorkflowChartProps) {
  // Add a check to ensure steps is not undefined
  if (!steps || steps.length === 0) {
    return <div>No workflow steps defined.</div>;
  }

  const maxWeeks = Math.max(...steps.map(step => step.weeksBeforeSermon), 0);
  const stepColors = Object.fromEntries(steps.map((step, index) => [step.id, colors[index % colors.length]]));

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Workflow Timeline</h3>
      <div className="relative">
        <div className="flex mb-2">
          <div className="w-24"></div>
          <div className="flex-1 grid grid-cols-7 gap-2">
            {dayAbbreviations.map((abbr, index) => (
              <div key={index} className="text-center text-xs font-semibold text-gray-500">
                {abbr}
              </div>
            ))}
          </div>
        </div>

        {[...Array(maxWeeks + 1)].map((_, weekIndex) => (
          <div key={weekIndex} className="flex mb-4">
            <div className="w-24 text-sm text-gray-500 font-semibold">
              {weekIndex === maxWeeks ? 'Sermon week' : `${maxWeeks - weekIndex} week${maxWeeks - weekIndex > 1 ? 's' : ''} before`}
            </div>
            <div className="flex-1 grid grid-cols-7 gap-2">
              {daysOfWeek.map(day => (
                <div key={day} className="relative">
                  <div 
                    className={`h-8 ${weekIndex === maxWeeks && day === 'Sunday' ? '' : 'border border-gray-200'} relative`}
                  >
                    {weekIndex === maxWeeks && day === 'Sunday' ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Book className="w-6 h-6 text-black" />
                        <span className="text-xs font-bold text-black mt-1">Sermon</span>
                      </div>
                    ) : (
                      steps
                        .filter(step => step.dayOfWeek === day && step.weeksBeforeSermon === maxWeeks - weekIndex)
                        .map((step) => (
                          <div
                            key={step.id}
                            className={`absolute w-6 h-6 rounded-full ${stepColors[step.id]} -mt-3 -ml-3 flex items-center justify-center`}
                            style={{ top: '50%', left: '50%' }}
                            title={step.name}
                          >
                            <span className="text-white text-xs">{steps.findIndex(s => s.id === step.id) + 1}</span>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center space-x-2 mb-2">
            <div className={`w-4 h-4 rounded-full ${stepColors[step.id]}`}></div>
            <span>{step.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}