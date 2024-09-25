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

const WorkflowChart: React.FC<WorkflowChartProps> = ({ steps }) => {
  // Add a check to ensure steps is not undefined
  if (!steps || steps.length === 0) {
    return <div>No workflow steps defined.</div>;
  }

  const maxWeeks = Math.max(...steps.map(step => step.weeksBeforeSermon), 0);
  const stepColors = Object.fromEntries(steps.map((step, index) => [step.id, colors[index % colors.length]]));

  return (
    <div className="mt-8">
      {/* ... rest of the JSX ... */}
    </div>
  );
};

export default WorkflowChart;