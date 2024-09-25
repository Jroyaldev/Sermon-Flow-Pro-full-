"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { ArrowRight, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import WorkflowChart from "./WorkflowChart";

interface WorkflowStep {
  number: number;
  name: string;
  color: string;
  day: string;
  weeks: number;
  defaultDay: string;
  defaultWeeks: number;
}

export interface SermonWorkflowRef {
  saveWorkflow: () => void;
}

const SermonWorkflow = forwardRef<SermonWorkflowRef, { onClose?: () => void }>((props, ref) => {
  const defaultSteps: WorkflowStep[] = [
    { number: 1, name: "Outline", color: "bg-blue-500", defaultDay: "Mon", defaultWeeks: 3, day: "Mon", weeks: 3 },
    { number: 2, name: "Research", color: "bg-green-500", defaultDay: "Tue", defaultWeeks: 2, day: "Tue", weeks: 2 },
    { number: 3, name: "Write Draft", color: "bg-yellow-500", defaultDay: "Wed", defaultWeeks: 1, day: "Wed", weeks: 1 },
    { number: 4, name: "Review", color: "bg-orange-500", defaultDay: "Thu", defaultWeeks: 1, day: "Thu", weeks: 1 },
    { number: 5, name: "Practice", color: "bg-red-500", defaultDay: "Fri", defaultWeeks: 0, day: "Fri", weeks: 0 },
  ];

  const [taskSchedule, setTaskSchedule] = useState<WorkflowStep[]>(() => {
    if (typeof window !== 'undefined') {
      const savedWorkflow = localStorage.getItem('sermonWorkflow');
      return savedWorkflow ? JSON.parse(savedWorkflow) : defaultSteps;
    }
    return defaultSteps;
  });

  useEffect(() => {
    localStorage.setItem('sermonWorkflow', JSON.stringify(taskSchedule));
  }, [taskSchedule]);

  useImperativeHandle(ref, () => ({
    saveWorkflow: () => {
      localStorage.setItem('sermonWorkflow', JSON.stringify(taskSchedule));
      console.log("Saving workflow:", taskSchedule);
    }
  }));

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeksOptions = [
    { value: 0, label: "Sermon week" },
    { value: 1, label: "1 week before" },
    { value: 2, label: "2 weeks before" },
    { value: 3, label: "3 weeks before" },
  ];

  const handleDayChange = (index: number, day: string) => {
    const newSchedule = [...taskSchedule];
    newSchedule[index].day = day;
    setTaskSchedule(newSchedule);
  };

  const handleWeekChange = (index: number, weeks: number) => {
    const newSchedule = [...taskSchedule];
    newSchedule[index].weeks = weeks;
    setTaskSchedule(newSchedule);
  };

  // Add this helper function to calculate days before sermon
  const calculateDaysBefore = (taskDay: string, taskWeeks: number): number => {
    const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const sermonDay = "Sun"; // Assuming the sermon is always on Sunday
    
    const taskDayIndex = daysOrder.indexOf(taskDay);
    const sermonDayIndex = daysOrder.indexOf(sermonDay);
    
    let daysDifference = sermonDayIndex - taskDayIndex;
    if (daysDifference <= 0) {
      daysDifference += 7;
    }
    
    return taskWeeks * 7 + daysDifference;
  };

  const handleSaveAndClose = () => {
    if (ref && typeof ref !== 'function' && ref.current) {
      ref.current.saveWorkflow();
    }
    if (props.onClose) {
      props.onClose();
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Sermon Workflow</h2>
        <Button onClick={handleSaveAndClose}>
          <Save className="w-4 h-4 mr-2" />
          Save and Close
        </Button>
      </div>
      
      {/* Task Scheduling */}
      <div className="space-y-6">
        {taskSchedule.map((task, index) => (
          <div key={task.number} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full ${task.color} flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">{task.number}</span>
              </div>
              <span className="text-lg font-medium">{task.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={task.day} onValueChange={(value) => handleDayChange(index, value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={task.weeks.toString()} onValueChange={(value) => handleWeekChange(index, parseInt(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select week" />
                </SelectTrigger>
                <SelectContent>
                  {weeksOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm font-medium text-gray-600 w-40">
                {calculateDaysBefore(task.day, task.weeks)} days before sermon
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Visual Timeline */}
      <div className="mt-10">
        <WorkflowChart steps={taskSchedule} />
      </div>
    </div>
  );
});

SermonWorkflow.displayName = 'SermonWorkflow';

export default SermonWorkflow;