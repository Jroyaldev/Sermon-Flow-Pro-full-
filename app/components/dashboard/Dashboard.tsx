// app/components/dashboard/Dashboard.tsx

'use client'; // Ensures client-side rendering

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Supabase Client
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

// Utilities
import { cn } from "@/lib/utils";
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/lib/useTasks';

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

// Define initialWorkflowSteps
const initialWorkflowSteps: WorkflowStep[] = [
  { id: '1', title: 'Research', description: 'Gather materials and study the scripture', isSystemStep: true, daysBeforeSermon: 14 },
  { id: '2', title: 'Outline', description: 'Create a basic structure for the sermon', isSystemStep: true, daysBeforeSermon: 10 },
  { id: '3', title: 'Write', description: 'Develop the full content of the sermon', isSystemStep: true, daysBeforeSermon: 7 },
  { id: '4', title: 'Review', description: 'Edit and refine the sermon', isSystemStep: true, daysBeforeSermon: 3 },
  { id: '5', title: 'Practice', description: 'Rehearse the delivery of the sermon', isSystemStep: true, daysBeforeSermon: 1 },
];

const Dashboard: React.FC = () => {
  const { user, session, loading } = useAuth();
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  // State Hooks
  const [currentDate, setCurrentDate] = useState('');
  const [showConfigureWorkflow, setShowConfigureWorkflow] = useState(false);
  const [notification, setNotification] = useState('');
  const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
  const [bgColor, setBgColor] = useState('bg-white');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAddSermonForm, setShowAddSermonForm] = useState(false);
  const [recentSermons, setRecentSermons] = useState<{ title: string; id: string }[]>([]);
  const [selectedSermonId, setSelectedSermonId] = useState<string | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: number | undefined }>({});
  const [taskTimeouts, setTaskTimeouts] = useState<{ [key: string]: NodeJS.Timeout }>({});
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(initialWorkflowSteps);

  const workflowRef = useRef<SermonWorkflowRef>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    // Your initialization logic here
    setCurrentDate(getFormattedDate());
    checkOnboarding();
    fetchRecentSermons();

    // Set up Supabase auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [loading, user, router, supabase.auth]);

  // Helper functions
  const getFormattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const checkOnboarding = () => {
    // Implement your onboarding check logic here
    // For example:
    const isComplete = localStorage.getItem('onboardingComplete') === 'true';
    setOnboardingComplete(isComplete);
  };

  const fetchRecentSermons = async () => {
    // Implement your logic to fetch recent sermons
    // For example:
    const { data, error } = await supabase
      .from('sermons')
      .select('id, title')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching recent sermons:', error);
    } else if (data) {
      setRecentSermons(data);
    }
  };

  const toggleBgColor = () => {
    setBgColor(prevColor => prevColor === 'bg-white' ? 'bg-gray-100' : 'bg-white');
  };

  const handleToggleTask = (taskId: string) => {
    toggleTask(taskId);
  };

  // Add this function
  const handleEditTask = async (taskId: string, newTitle: string) => {
    // Implement the edit task logic here
    console.log('Editing task:', taskId, newTitle);
    // You might want to update this in your useTasks hook
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`flex flex-col min-h-screen ${bgColor}`}>
      <div className="flex flex-grow">
        <LeftSidebar router={router} onLogout={() => supabase.auth.signOut()} />
        <div className="flex-1 flex flex-col">
          <MainContent
            currentDate={currentDate}
            tasks={tasks}
            completedTasks={completedTasks}
            showAddTaskPopup={showAddTaskPopup}
            setShowAddTaskPopup={setShowAddTaskPopup}
            handleAddTask={addTask}
            handleToggleTask={handleToggleTask}
            handleDeleteTask={deleteTask}
            handleEditTask={handleEditTask}
            bgColor={bgColor}
            showConfigureWorkflow={showConfigureWorkflow}
            setShowConfigureWorkflow={setShowConfigureWorkflow}
            getColorForProgress={(progress: number) => {
              return progress < 50 ? 'red' : progress < 80 ? 'yellow' : 'green';
            }}
            showAddSermonForm={showAddSermonForm}
            setShowAddSermonForm={setShowAddSermonForm}
            handleAddSermon={(sermonData: SermonData) => {
              console.log('Adding sermon:', sermonData);
            }}
            workflowSteps={workflowSteps}
            handleSaveWorkflow={(newWorkflow: WorkflowStep[]) => {
              setWorkflowSteps(newWorkflow);
            }}
            recentActivities={recentActivities}
            recentSermons={recentSermons}
            handleUndoTask={(taskId: string) => {
              console.log('Undoing task:', taskId);
            }}
            handleAddSubtask={(taskId: string, subtaskTitle: string) => {
              console.log('Adding subtask:', taskId, subtaskTitle);
            }}
          />
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
      <MobileMenu
        isOpen={isMobileMenuOpen}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        router={router}
        setShowAddSermonForm={setShowAddSermonForm}
        setShowConfigureWorkflow={setShowConfigureWorkflow}
        toggleBgColor={toggleBgColor}
      />
      {showAddTaskPopup && (
        <AddTaskPopup
          onClose={() => setShowAddTaskPopup(false)}
          onAddTask={addTask}
        />
      )}
      {showAddSermonForm && (
        <AddSermonForm
          onAddSermon={(sermonData: SermonData) => {
            console.log('Adding sermon:', sermonData);
            setShowAddSermonForm(false);
          }}
          onCancel={() => setShowAddSermonForm(false)}
        />
      )}
      {showConfigureWorkflow && (
        <SermonWorkflow
          ref={workflowRef}
          onClose={() => setShowConfigureWorkflow(false)}
          onSave={(newWorkflow: WorkflowStep[]) => {
            setWorkflowSteps(newWorkflow);
            setShowConfigureWorkflow(false);
          }}
          initialSteps={initialWorkflowSteps}
          currentSteps={workflowSteps}
        />
      )}
      {selectedSermonId && (
        <SermonDetails
          sermonId={selectedSermonId}
          onClose={() => setSelectedSermonId(null)}
          onUpdate={(updatedSermon: Sermon) => {
            console.log('Updating sermon:', updatedSermon);
          }}
          onDelete={(sermonId: string) => {
            console.log('Deleting sermon:', sermonId);
            setSelectedSermonId(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;