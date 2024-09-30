// app/components/Dashboard/Dashboard.tsx

'use client' // Ensures client-side rendering

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Supabase Client
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

// Utilities
import { cn } from "@/lib/utils";

// Custom Components
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MobileMenu from './MobileMenu';
import MainContent from './MainContent';
import Notification from './Notification';
import AddTaskPopup from './AddTaskPopup';
import AddSermonForm from './AddSermonForm';
import SermonWorkflow, { SermonWorkflowRef, WorkflowStep } from './SermonWorkflow';
import SermonDetails from './SermonDetails';

// Type Definitions
type Subtask = {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
};

type Task = Database['public']['Tables']['tasks']['Row'] & {
  subtasks?: Database['public']['Tables']['subtasks']['Row'][];
};

type Sermon = Database['public']['Tables']['sermons']['Row'];

interface SermonData {
  title: string;
  date: Date;
  scripture: string;
  notes: string;
}

type RecentActivity = {
  id: string;
  description: string;
  timestamp: Date;
};

const Dashboard: React.FC = () => {
  // Initialize Supabase client
  const supabase = createClientComponentClient<Database>();

  // Log Supabase URL for debugging
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL); 

  // State Hooks
  const [tasks, setTasks] = useState<Task[]>([]); // List of tasks
  const [currentDate, setCurrentDate] = useState(''); // Current date string
  const [showConfigureWorkflow, setShowConfigureWorkflow] = useState(false); // Toggle for workflow configuration
  const [notification, setNotification] = useState(''); // Notification messages
  const [showAddTaskPopup, setShowAddTaskPopup] = useState(false); // Toggle for Add Task popup
  const workflowRef = useRef<SermonWorkflowRef>(null); // Reference to SermonWorkflow component
  const router = useRouter(); // Next.js router for navigation
  const [bgColor, setBgColor] = useState('bg-white'); // Background color state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu toggle
  const [showAddSermonForm, setShowAddSermonForm] = useState(false); // Toggle for Add Sermon form
  const [recentSermons, setRecentSermons] = useState<{ title: string; id: string }[]>([]);
  const [selectedSermonId, setSelectedSermonId] = useState<string | null>(null);

  // Update the initial workflow steps
  const initialWorkflowSteps: WorkflowStep[] = [
    { id: '1', title: 'Research', description: 'Gather materials and study the scripture', isSystemStep: true, daysBeforeSermon: 14 },
    { id: '2', title: 'Outline', description: 'Create a basic structure for the sermon', isSystemStep: true, daysBeforeSermon: 10 },
    { id: '3', title: 'Write', description: 'Develop the full content of the sermon', isSystemStep: true, daysBeforeSermon: 7 },
    { id: '4', title: 'Review', description: 'Edit and refine the sermon', isSystemStep: true, daysBeforeSermon: 3 },
    { id: '5', title: 'Practice', description: 'Rehearse the delivery of the sermon', isSystemStep: true, daysBeforeSermon: 1 },
  ];

  // Workflow Steps State
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(initialWorkflowSteps);

  // Recent Activities State
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  // Completed Tasks and Timeouts for Progress Animation
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: number | undefined }>({});
  const [taskTimeouts, setTaskTimeouts] = useState<{ [key: string]: NodeJS.Timeout }>({});

  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  const onboardingTasks: Task[] = [
    {
      id: 'onboarding-1',
      title: 'Configure Workflow',
      completed: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'onboarding-2',
      title: 'Add your first sermon',
      completed: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'onboarding-3',
      title: 'Complete a task',
      completed: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'onboarding-4',
      title: 'Explore the dashboard',
      completed: false,
      created_at: new Date().toISOString(),
    },
  ];

  /**
   * Fetch tasks and recent sermons from Supabase when the component mounts.
   */
  useEffect(() => {
    const fetchTasks = async () => {
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
        setNotification('Error loading tasks. Please try again later.');
      } else if (tasksData) {
        // Fetch subtasks for each task
        const tasksWithSubtasks = await Promise.all(tasksData.map(async (task) => {
          const { data: subtasksData, error: subtasksError } = await supabase
            .from('subtasks')
            .select('*')
            .eq('task_id', task.id);

          if (subtasksError) {
            console.error('Error fetching subtasks:', subtasksError);
          }

          return {
            ...task,
            subtasks: subtasksData || [],
          } as Task; // Add type assertion here
        }));

        setTasks(tasksWithSubtasks);
      }
    };

    const fetchRecentSermons = async () => {
      const { data, error } = await supabase
        .from('sermons')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching recent sermons:', error);
        setNotification('Error loading recent sermons. Please try again later.');
      } else if (data) {
        setRecentSermons(data);
      }
    };

    fetchTasks();
    fetchRecentSermons();

    // Set current date in a readable format
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));

    // Check if onboarding is complete
    const isOnboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
    setOnboardingComplete(isOnboardingComplete);

    // If onboarding is not complete, load onboarding tasks
    if (!isOnboardingComplete) {
      setLocalTasks(onboardingTasks);
    }
  }, [supabase]);

  /**
   * Handle adding a new task to Supabase.
   */
  const handleAddTask = async (newTask: Database['public']['Tables']['tasks']['Insert']) => {
    console.log('Attempting to add task:', newTask);
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title: newTask.title,
        completed: newTask.completed || false,
        // Remove the dueDate field if it's not in your database schema
        // dueDate: newTask.dueDate || undefined,
      }])
      .select();

    if (error) {
      console.error('Error adding task:', error);
      setNotification(`Error adding task: ${error.message}`);
    } else if (data) {
      console.log('Task added successfully:', data[0]);
      setTasks([...tasks, data[0]]);
      setShowAddTaskPopup(false);
      setNotification('Task added successfully!');
    } else {
      console.error('No data returned after adding task');
      setNotification('Error adding task: No data returned');
    }
    
    // Clear notification after 3 seconds
    setTimeout(() => setNotification(''), 3000);
  };

  /**
   * Handle toggling the completion status of a task.
   */
  const handleToggleTask = async (taskId: string, subtaskId?: string) => {
    const isLocalTask = taskId.startsWith('onboarding-');
    
    if (isLocalTask) {
      setLocalTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.id === taskId) {
            if (subtaskId) {
              // Toggle subtask
              const updatedSubtasks = task.subtasks?.map((subtask: Subtask) =>
                subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
              );
              return { ...task, subtasks: updatedSubtasks };
            } else {
              // Toggle main task
              return { ...task, completed: !task.completed };
            }
          }
          return task;
        })
      );
      
      // Check if all onboarding tasks and their subtasks are completed
      const allCompleted = localTasks.every(task => 
        task.completed && task.subtasks?.every((subtask: Subtask) => subtask.completed)
      );
      if (allCompleted) {
        setOnboardingComplete(true);
        localStorage.setItem('onboardingComplete', 'true');
      }
    } else {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;

      const newCompleted = !taskToUpdate.completed;

      const { error } = await supabase
        .from('tasks')
        .update({ completed: newCompleted })
        .eq('id', taskId);

      if (error) {
        console.error('Error updating task:', error);
        setNotification('Error updating task. Please try again.');
      } else {
        setTasks(tasks.map(task => {
          if (task.id === taskId) {
            if (newCompleted) {
              // Start progress animation when task is marked as completed
              setCompletedTasks(prev => ({ ...prev, [taskId]: 0 }));
              const interval = setInterval(() => {
                setCompletedTasks(prev => {
                  const newValue = (prev[taskId] || 0) + 1;
                  if (newValue >= 100) {
                    clearInterval(interval);
                    const timeout = setTimeout(() => moveTaskToRecentActivity(taskId), 0);
                    setTaskTimeouts(prev => ({ ...prev, [taskId]: timeout }));
                    return prev;
                  }
                  return { ...prev, [taskId]: newValue };
                });
              }, 50);
              setTaskTimeouts(prev => ({ ...prev, [`${taskId}-interval`]: interval }));
            } else {
              // If unchecked, undo the task completion
              handleUndoTask(taskId);
            }
            return { ...task, completed: newCompleted };
          }
          return task;
        }));
      }
    }
  };

  /**
   * Move a completed task to recent activities and delete it from Supabase.
   */
  const moveTaskToRecentActivity = async (taskId: string) => {
    const isLocalTask = taskId.startsWith('onboarding-');
    
    if (isLocalTask) {
      const task = localTasks.find(t => t.id === taskId);
      if (task) {
        setRecentActivities(prev => [{
          id: task.id,
          description: `Completed: ${task.title}`,
          timestamp: new Date()
        }, ...prev].slice(0, 5));

        setLocalTasks(prev => prev.filter(t => t.id !== taskId));
      }
    } else {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        // Update recent activities state
        setRecentActivities(prev => {
          const activityExists = prev.some(activity => activity.id === task.id);
          
          if (activityExists) {
            return prev;
          } else {
            const newActivities = [{
              id: task.id,
              description: `Completed: ${task.title}`,
              timestamp: new Date()
            }, ...prev];

            // Keep only the latest 5 activities
            return newActivities.slice(0, 5);
          }
        });

        // Supabase Interaction: Deleting the task after completion
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', taskId);

        if (error) {
          console.error('Error deleting task:', error);
          setNotification('Error deleting task. Please try again.');
        } else {
          setTasks(prev => prev.filter(t => t.id !== taskId));
          setCompletedTasks(prev => {
            const { [taskId]: _, ...rest } = prev;
            return rest;
          });

          // Clear any existing timeouts or intervals
          if (taskTimeouts[taskId]) {
            clearTimeout(taskTimeouts[taskId]);
          }
          if (taskTimeouts[`${taskId}-interval`]) {
            clearInterval(taskTimeouts[`${taskId}-interval`]);
          }
          setTaskTimeouts(prev => {
            const { [taskId]: _, [`${taskId}-interval`]: __, ...rest } = prev;
            return rest;
          });
        }
      }
    }
  };

  /**
   * Handle undoing a task's completion.
   */
  const handleUndoTask = async (taskId: string) => {
    // Remove progress tracking
    setCompletedTasks(prev => {
      const { [taskId]: _, ...rest } = prev;
      return rest;
    });

    // Clear timeouts and intervals
    if (taskTimeouts[`${taskId}-interval`]) {
      clearInterval(taskTimeouts[`${taskId}-interval`]);
    }
    if (taskTimeouts[taskId]) {
      clearTimeout(taskTimeouts[taskId]);
    }
    setTaskTimeouts(prev => {
      const { [taskId]: _, [`${taskId}-interval`]: __, ...rest } = prev;
      return rest;
    });

    // Supabase Interaction: Update the task's completion status to false
    const { error } = await supabase
      .from('tasks')
      .update({ completed: false })
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task:', error);
      setNotification('Error updating task. Please try again.');
    } else {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, completed: false } : task
        )
      );
    }
  };

  /**
   * Handle saving the workflow steps.
   */
  const handleSaveWorkflow = useCallback((newWorkflow: WorkflowStep[]) => {
    setWorkflowSteps(newWorkflow);
    setShowConfigureWorkflow(false);
    setNotification('Workflow saved successfully!');
    setTimeout(() => setNotification(''), 3000);
  }, []);

  /**
   * Toggle the background color between white and gray.
   */
  const toggleBgColor = () => {
    setBgColor(prevColor => prevColor === 'bg-white' ? 'bg-gray-100' : 'bg-white');
  };

  /**
   * Toggle the mobile menu's visibility.
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  /**
   * Handle adding a new sermon along with its associated tasks.
   */
  const handleAddSermon = (sermonData: SermonData) => {
    console.log('New sermon data:', sermonData);
    
    // Create new tasks based on the current workflow steps
    const newTasks: Database['public']['Tables']['tasks']['Insert'][] = workflowSteps.map((step) => ({
      title: `${step.title} for "${sermonData.title}"`,
      completed: false,
      dueDate: new Date(sermonData.date.getTime() - step.daysBeforeSermon * 24 * 60 * 60 * 1000).toISOString(), // Due dates are set based on daysBeforeSermon
    }));

    // Supabase Interaction: Insert new tasks into 'tasks' table
    const insertTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .insert(newTasks)
        .select();

      if (error) {
        console.error('Error adding tasks:', error);
        setNotification('Error adding tasks. Please try again.');
      } else if (data) {
        setTasks(prevTasks => [...prevTasks, ...data]);
        setShowAddSermonForm(false);
        setNotification('Sermon and tasks added successfully!');
      }
    };

    insertTasks();
    setTimeout(() => setNotification(''), 3000);
  };

  /**
   * Determine the color of the progress bar based on progress percentage.
   */
  const getColorForProgress = (progress: number) => {
    if (progress < 33) return '#7CB342'; // Muted Green
    if (progress < 66) return '#FBC02D'; // Muted Yellow
    return '#E57373'; // Muted Red
  };

  const handleSermonClick = (sermonId: string) => {
    setSelectedSermonId(sermonId);
  };

  const handleUpdateSermon = (updatedSermon: Sermon) => {
    setRecentSermons(prevSermons =>
      prevSermons.map(sermon =>
        sermon.id === updatedSermon.id ? { ...sermon, title: updatedSermon.title } : sermon
      )
    );
  };

  const handleDeleteSermon = (sermonId: string) => {
    setRecentSermons(prevSermons => prevSermons.filter(sermon => sermon.id !== sermonId));
  };

  const handleAddSubtask = async (taskId: string, subtaskTitle: string) => {
    const newSubtask: Omit<Database['public']['Tables']['subtasks']['Row'], 'id'> = {
      task_id: taskId,
      title: subtaskTitle,
      completed: false,
    };

    // Insert the new subtask into the subtasks table
    const { data, error } = await supabase
      .from('subtasks')
      .insert(newSubtask)
      .select();

    if (error) {
      console.error('Error adding subtask:', error);
      setNotification('Error adding subtask. Please try again.');
    } else if (data) {
      // Update local state
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: [...(task.subtasks || []), data[0] as Database['public']['Tables']['subtasks']['Row']],
          };
        }
        return task;
      }));
      setNotification('Subtask added successfully!');
    }

    // Clear notification after 3 seconds
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden p-4 bg-white border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <button onClick={toggleMobileMenu}>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-grow flex">
        <LeftSidebar router={router} />

        {/* Center the main content */}
        <div className="flex-grow flex justify-center">
          <div className="w-full max-w-4xl px-4">
            <MainContent
              bgColor={bgColor}
              currentDate={currentDate}
              showConfigureWorkflow={showConfigureWorkflow}
              setShowConfigureWorkflow={setShowConfigureWorkflow}
              handleAddTask={handleAddTask}
              tasks={[...tasks, ...localTasks]}
              handleToggleTask={handleToggleTask}
              completedTasks={completedTasks}
              getColorForProgress={getColorForProgress}
              showAddTaskPopup={showAddTaskPopup}
              setShowAddTaskPopup={setShowAddTaskPopup}
              notification={notification}
              setNotification={setNotification}
              showAddSermonForm={showAddSermonForm}
              setShowAddSermonForm={setShowAddSermonForm}
              handleAddSermon={handleAddSermon}
              workflowSteps={workflowSteps}
              handleSaveWorkflow={handleSaveWorkflow}
              recentActivities={recentActivities}
              recentSermons={recentSermons}
              handleUndoTask={handleUndoTask}
              handleAddSubtask={handleAddSubtask}
            />
          </div>
        </div>

        <RightSidebar
          recentSermons={recentSermons}
          setShowAddSermonForm={setShowAddSermonForm}
          setShowConfigureWorkflow={setShowConfigureWorkflow}
          toggleBgColor={toggleBgColor}
          router={router}
          showConfigureWorkflow={showConfigureWorkflow}
        />
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          toggleMobileMenu={toggleMobileMenu} 
          router={router} 
          setShowAddSermonForm={setShowAddSermonForm}
          setShowConfigureWorkflow={setShowConfigureWorkflow}
          toggleBgColor={toggleBgColor}
        />
      )}

      {/* Notification Popup */}
      {notification && (
        <Notification message={notification} type={notification.includes('Error') ? 'error' : 'success'} />
      )}

      {/* Add Task Popup Modal */}
      {showAddTaskPopup && (
        <AddTaskPopup onClose={() => setShowAddTaskPopup(false)} onAddTask={handleAddTask} />
      )}

      {/* Add Sermon Form Modal */}
      {showAddSermonForm && (
        <AddSermonForm 
          onAddSermon={handleAddSermon}
          onCancel={() => setShowAddSermonForm(false)}
        />
      )}

      {/* Workflow Configuration Modal */}
      {showConfigureWorkflow && (
        <SermonWorkflow 
          ref={workflowRef} 
          onClose={() => setShowConfigureWorkflow(false)} 
          onSave={handleSaveWorkflow}
          initialSteps={initialWorkflowSteps}
          currentSteps={workflowSteps}
        />
      )}

      {/* Sermon Details Modal */}
      {selectedSermonId && (
        <SermonDetails
          sermonId={selectedSermonId}
          onClose={() => setSelectedSermonId(null)}
          onUpdate={handleUpdateSermon}
          onDelete={handleDeleteSermon}
        />
      )}
    </div>
  );
};

export default Dashboard;