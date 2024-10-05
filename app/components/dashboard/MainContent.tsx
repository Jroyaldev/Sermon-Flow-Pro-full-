// app/components/Dashboard/MainContent.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Activity, PlusCircle, BarChart2, Clock, Undo2, ChevronDown, ChevronUp } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { cn } from "@/lib/utils";
import SermonWorkflow, { WorkflowStep } from './SermonWorkflow'; // Import WorkflowStep type
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import React from 'react';

type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

// Update the Task type to include a possible 'content' field
type Task = {
  id: string;
  title: string;
  content?: string; // Add this line
  completed: boolean;
  created_at: string;
  dueDate?: string;
  subtasks?: Subtask[];
};

interface MainContentProps {
  currentDate: string;
  tasks: Task[];
  completedTasks: { [key: string]: number | undefined };
  showAddTaskPopup: boolean;
  setShowAddTaskPopup: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddTask: (title: string) => Promise<void>;
  handleToggleTask: (taskId: string) => void;
  handleDeleteTask: (taskId: string) => Promise<void>; // Add this line
  handleEditTask: (taskId: string, newTitle: string) => void;
  bgColor: string;
  showConfigureWorkflow: boolean;
  setShowConfigureWorkflow: (value: boolean) => void;
  getColorForProgress: (progress: number) => string;
  showAddSermonForm: boolean;
  setShowAddSermonForm: (value: boolean) => void;
  handleAddSermon: (sermonData: any) => void;
  workflowSteps: WorkflowStep[];
  handleSaveWorkflow: (newWorkflow: WorkflowStep[]) => void;
  recentActivities: any[];
  recentSermons: any[];
  handleUndoTask: (taskId: string) => void;
  handleAddSubtask: (taskId: string, subtaskTitle: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  currentDate,
  tasks,
  completedTasks,
  showAddTaskPopup,
  setShowAddTaskPopup,
  handleAddTask,
  handleToggleTask,
  handleDeleteTask, // Add this line
  handleEditTask,
  bgColor,
  showConfigureWorkflow,
  setShowConfigureWorkflow,
  getColorForProgress,
  showAddSermonForm,
  setShowAddSermonForm,
  handleAddSermon,
  workflowSteps,
  handleSaveWorkflow,
  recentActivities,
  recentSermons,
  handleUndoTask,
  handleAddSubtask,
}) => {
  console.log('Tasks received in MainContent:', JSON.stringify(tasks, null, 2));

  const [expandedTasks, setExpandedTasks] = useState<{ [key: string]: boolean }>({});
  const [newSubtaskTitles, setNewSubtaskTitles] = useState<{ [key: string]: string }>({});

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleSubtaskTitleChange = (taskId: string, title: string) => {
    setNewSubtaskTitles(prev => ({ ...prev, [taskId]: title }));
  };

  const handleSubtaskSubmit = (taskId: string) => {
    const subtaskTitle = newSubtaskTitles[taskId];
    if (subtaskTitle && subtaskTitle.trim() !== '') {
      handleAddSubtask(taskId, subtaskTitle.trim());
      setNewSubtaskTitles(prev => ({ ...prev, [taskId]: '' }));
    }
  };

  const formatDueDate = (dueDate: string | undefined) => {
    if (!dueDate) return '';
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getTaskDisplay = (task: Task | string) => {
    console.log('Task being displayed:', JSON.stringify(task, null, 2));
    if (typeof task === 'string') {
      try {
        const parsedTask = JSON.parse(task);
        return parsedTask.title || 'Untitled Task';
      } catch (e) {
        console.error('Error parsing task:', e);
        return task;
      }
    }
    return task.title || 'Untitled Task';
  };

  return (
    <div className={`p-4 md:p-10 space-y-6 w-full md:max-w-4xl mx-auto ${bgColor}`}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Welcome back, Pastor</h2>
        <div className="flex items-center">
          {/* Current Date Display */}
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Calendar className="mr-2 h-4 w-4" />
            {currentDate}
          </Button>
        </div>
      </div>

      {/* Dashboard Content */}
      <>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Sermons Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sermons</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          {/* Avg. Preparation Time Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Preparation Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5 hours</div>
              <p className="text-xs text-muted-foreground">-2 hours from last month</p>
            </CardContent>
          </Card>

          {/* Upcoming Sermons Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Sermons</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Next on Sunday</p>
            </CardContent>
          </Card>
        </div>

        {/* Task Manager Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Task Manager</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowAddTaskPopup(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {tasks.map((task) => (
                <div key={typeof task === 'string' ? JSON.parse(task).id : task.id} className="mb-4">
                  <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                    <Checkbox
                      id={typeof task === 'string' ? JSON.parse(task).id : task.id}
                      checked={typeof task === 'string' ? JSON.parse(task).completed : task.completed}
                      onCheckedChange={() => handleToggleTask(typeof task === 'string' ? JSON.parse(task).id : task.id)}
                      className="w-5 h-5"
                    />
                    {completedTasks[typeof task === 'string' ? JSON.parse(task).id : task.id] !== undefined && (
                      <div className="w-8 h-8 relative">
                        <CircularProgressbar 
                          value={completedTasks[typeof task === 'string' ? JSON.parse(task).id : task.id] ?? 0} 
                          strokeWidth={50}
                          styles={buildStyles({
                            pathColor: getColorForProgress(completedTasks[typeof task === 'string' ? JSON.parse(task).id : task.id] ?? 0),
                            trailColor: 'transparent',
                          })}
                        />
                        <button 
                          className="absolute inset-0 flex items-center justify-center"
                          onClick={() => handleUndoTask(typeof task === 'string' ? JSON.parse(task).id : task.id)}
                        >
                          <Undo2 className="h-3 w-3 text-blue-500" />
                        </button>
                      </div>
                    )}
                    <label
                      htmlFor={typeof task === 'string' ? JSON.parse(task).id : task.id}
                      className={cn(
                        "flex-grow cursor-pointer",
                        (typeof task === 'string' ? JSON.parse(task).completed : task.completed) ? "line-through text-gray-500" : "text-gray-700"
                      )}
                    >
                      {getTaskDisplay(task)}
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTaskExpansion(typeof task === 'string' ? JSON.parse(task).id : task.id)}
                    >
                      {expandedTasks[typeof task === 'string' ? JSON.parse(task).id : task.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>

                  {expandedTasks[typeof task === 'string' ? JSON.parse(task).id : task.id] && (
                    <div className="ml-8 mt-2">
                      {task.subtasks && task.subtasks.map((subtask: Subtask) => (
                        <div key={subtask.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                          <Checkbox
                            id={subtask.id}
                            checked={subtask.completed}
                            onCheckedChange={() => handleToggleTask(task.id)} // Remove subtask.id
                            className="w-4 h-4"
                          />
                          <label
                            htmlFor={subtask.id}
                            className={cn(
                              "flex-grow cursor-pointer text-sm",
                              subtask.completed ? "line-through text-gray-400" : "text-gray-600"
                            )}
                          >
                            {subtask.title}
                          </label>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2 p-2">
                        <Input
                          type="text"
                          placeholder="New subtask"
                          value={newSubtaskTitles[typeof task === 'string' ? JSON.parse(task).id : task.id] || ''}
                          onChange={(e) => handleSubtaskTitleChange(typeof task === 'string' ? JSON.parse(task).id : task.id, e.target.value)}
                          className="flex-grow"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSubtaskSubmit(typeof task === 'string' ? JSON.parse(task).id : task.id)}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{activity.description}</span>
                  <span className="text-sm text-gray-500 ml-auto">
                    {activity.timestamp.toLocaleTimeString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </>
    </div>
  );
};

export default MainContent;