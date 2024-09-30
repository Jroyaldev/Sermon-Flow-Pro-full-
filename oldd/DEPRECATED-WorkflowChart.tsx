import React from 'react';
import { Mic } from 'lucide-react';

interface WorkflowStep {
  number: number;
  name: string;
  color: string;
  day: string;
  weeks: number;
}

interface WorkflowChartProps {
  steps: WorkflowStep[];
}

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const WorkflowChart: React.FC<WorkflowChartProps> = ({ steps }) => {
  if (!steps || steps.length === 0) {
    return <div>No workflow steps defined.</div>;
  }

  return (
    <div className="mt-8 border rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 bg-gray-100">
        {daysOfWeek.map((day) => (
          <div key={day} className="p-2 text-center font-medium border-r last:border-r-0">{day}</div>
        ))}
      </div>
      {[3, 2, 1, 0].map((week) => (
        <div key={week} className="grid grid-cols-7 border-t">
          {daysOfWeek.map((day) => (
            <div key={`${week}-${day}`} className="p-2 border-r last:border-r-0 min-h-[60px] flex items-center justify-center">
              {week === 0 && day === "Sun" ? (
                <div className="flex flex-col items-center justify-center">
                  <Mic className="h-6 w-6 text-black" /> {/* Changed to black */}
                  <span className="text-xs font-medium mt-1">Sermon</span>
                </div>
              ) : (
                steps.filter(step => step.weeks === week && step.day === day).map(step => (
                  <div
                    key={step.number}
                    className={`w-8 h-8 ${step.color} rounded-full flex items-center justify-center`}
                  >
                    <span className="text-white text-xs font-bold">{step.number}</span>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WorkflowChart;