'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, ChevronRight, Settings, List, LayoutDashboard, Search, PenTool, FileText, Eye, Mic, BarChart2, Clock, Calendar, Activity, Menu, X, Undo2 } from 'lucide-react'
import SermonWorkflow, { SermonWorkflowRef } from '@/app/components/ConfigureWorkflow'
import { cn } from "@/lib/utils"
import AddTaskPopup from '@/app/components/AddTaskPopup'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import AddSermonForm from '@/app/components/AddSermonForm'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { redirect } from "next/navigation";
import DynamicUserButton from '@/components/DynamicUserButton';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date;
}

interface SermonData {
  title: string;
  date: Date;
  scripture: string;
  notes: string;
}

type WorkflowStep = {
  id: string;
  title: string;
  description: string;
}

type RecentActivity = {
  id: string;
  description: string;
  timestamp: Date;
};

export default function Dashboard() {

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Research for "Faith in Action"', completed: false, dueDate: new Date() },
    { id: '2', title: 'Outline "The Power of Prayer"', completed: false, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    { id: '3', title: 'Write draft for "Love Your Neighbor"', completed: false, dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
  ])
  const [currentDate, setCurrentDate] = useState('')
  const [showConfigureWorkflow, setShowConfigureWorkflow] = useState(false)
  const [notification, setNotification] = useState('')
  const [showAddTaskPopup, setShowAddTaskPopup] = useState(false)
  const workflowRef = useRef<SermonWorkflowRef>(null);
  const router = useRouter();
  const [bgColor, setBgColor] = useState('bg-white') // New state for background color
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAddSermonForm, setShowAddSermonForm] = useState(false)
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    { id: '1', title: 'Research', description: 'Gather materials and study the scripture' },
    { id: '2', title: 'Outline', description: 'Create a basic structure for the sermon' },
    { id: '3', title: 'Write', description: 'Develop the full content of the sermon' },
    { id: '4', title: 'Review', description: 'Edit and refine the sermon' },
    { id: '5', title: 'Practice', description: 'Rehearse the delivery of the sermon' },
  ]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: number | undefined }>({});
  const [taskTimeouts, setTaskTimeouts] = useState<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    setCurrentDate(date.toLocaleDateString('en-US', options))
  }, [])

  const handleAddTask = (newTask: Task) => {
    setTasks([...tasks, newTask])
    setShowAddTaskPopup(false)
    setNotification('Task added successfully!')
    setTimeout(() => setNotification(''), 3000)
  }

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newCompleted = !task.completed;
        if (newCompleted) {
          // Start the timer when task is completed
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
          // Store the interval ID
          setTaskTimeouts(prev => ({ ...prev, [`${taskId}-interval`]: interval }));
        } else {
          // If unchecked, immediately cancel the timer
          handleUndoTask(taskId);
        }
        return { ...task, completed: newCompleted };
      }
      return task;
    }));
  };

  const moveTaskToRecentActivity = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setRecentActivities(prev => {
        // Check if the activity already exists
        const activityExists = prev.some(activity => activity.id === task.id);
        
        if (activityExists) {
          // If it exists, don't add it again
          return prev;
        } else {
          // Add the new activity to the beginning of the array
          const newActivities = [{
            id: task.id,
            description: `Completed: ${task.title}`,
            timestamp: new Date()
          }, ...prev];

          // Keep only the last 5 activities
          return newActivities.slice(0, 5);
        }
      });

      // Remove the completed task from the tasks list
      setTasks(prev => prev.filter(t => t.id !== taskId));

      // Remove the task from completedTasks
      setCompletedTasks(prev => {
        const { [taskId]: _, ...rest } = prev;
        return rest;
      });

      // Clear the timeout and interval
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
  };

  const handleUndoTask = (taskId: string) => {
    // Clear the completion timer
    setCompletedTasks(prev => {
      const { [taskId]: _, ...rest } = prev;
      return rest;
    });

    // Clear any existing interval and timeout
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

    // Set the task back to uncompleted without changing its position in the list
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: false } : task
      )
    );
  };

  const handleSaveWorkflow = useCallback((newWorkflow: WorkflowStep[]) => {
    setWorkflowSteps(newWorkflow);
    setShowConfigureWorkflow(false);
    setNotification('Workflow saved successfully!');
    setTimeout(() => setNotification(''), 3000);
  }, []);

  const toggleBgColor = () => {
    setBgColor(prevColor => prevColor === 'bg-white' ? 'bg-gray-100' : 'bg-white')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleAddSermon = (sermonData: SermonData) => {
    console.log('New sermon data:', sermonData);
    
    // Create new tasks based on the current workflow
    const newTasks: Task[] = workflowSteps.map((step, index) => ({
      id: `${Date.now()}-${index + 1}`,
      title: `${step.title} for "${sermonData.title}"`,
      completed: false,
      dueDate: new Date(sermonData.date.getTime() - (workflowSteps.length - index - 1) * 7 * 24 * 60 * 60 * 1000)
    }));

    setTasks(prevTasks => [...prevTasks, ...newTasks]);
    setShowAddSermonForm(false);
    setNotification('Sermon added successfully!');
    setTimeout(() => setNotification(''), 3000);
  };

  const getColorForProgress = (progress: number) => {
    if (progress < 33) return '#7CB342'; // Muted Green
    if (progress < 66) return '#FBC02D'; // Muted Yellow
    return '#E57373'; // Muted Red
  };

  const LeftSidebar = (
    <div className="p-6 pt-20 md:pt-6 w-64 flex flex-col h-full relative"> {/* Added relative */}
      <nav className="space-y-2 flex-grow"> {/* Added flex-grow */}
        <Button variant="ghost" className="w-full justify-start text-left text-black hover:bg-gray-100" size="lg">
          <LayoutDashboard className="mr-2 h-5 w-5" />
          Dashboard
          <ChevronRight className="ml-auto h-5 w-5" />
        </Button>
        <Button variant="ghost" className="w-full justify-start text-left text-black hover:bg-gray-100" size="lg">
          <PenTool className="mr-2 h-5 w-5" />
          Outline
          <ChevronRight className="ml-auto h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-left text-black hover:bg-gray-100" 
          size="lg"
          onClick={() => router.push('/research')}
        >
          <Search className="mr-2 h-5 w-5" />
          Research
          <ChevronRight className="ml-auto h-5 w-5" />
        </Button>
        <Button variant="ghost" className="w-full justify-start text-left text-black hover:bg-gray-100" size="lg">
          <FileText className="mr-2 h-5 w-5" />
          Write Draft
          <ChevronRight className="ml-auto h-5 w-5" />
        </Button>
        <Button variant="ghost" className="w-full justify-start text-left text-black hover:bg-gray-100" size="lg">
          <Eye className="mr-2 h-5 w-5" />
          Review
          <ChevronRight className="ml-auto h-5 w-5" />
        </Button>
        <Button variant="ghost" className="w-full justify-start text-left text-black hover:bg-gray-100" size="lg">
          <Mic className="mr-2 h-5 w-5" />
          Practice
          <ChevronRight className="ml-auto h-5 w-5" />
        </Button>
      </nav>
      <DynamicUserButton />
    </div>
  )

  const RightSidebar = (
    <div className="p-6 pt-20 md:pt-6 w-64"> {/* Increased width */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Button className="w-full justify-start text-left" size="lg" onClick={() => setShowAddSermonForm(true)}>
            <PlusCircle className="mr-2 h-5 w-5" />
            New Sermon
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-left" 
            size="lg"
            onClick={() => setShowConfigureWorkflow(!showConfigureWorkflow)}
          >
            <Settings className="mr-2 h-5 w-5" />
            {showConfigureWorkflow ? 'Back to Dashboard' : 'Configure Workflow'}
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>
          <Button variant="outline" className="w-full justify-start text-left" size="lg">
            <List className="mr-2 h-5 w-5" />
            Manage Sermons
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-left" 
            size="lg"
            onClick={toggleBgColor}
          >
            <Settings className="mr-2 h-5 w-5" />
            Toggle Background
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="mt-8">
        <h4 className="text-sm font-semibold text-gray-500 mb-2">Recent Sermons</h4>
        <ul className="space-y-2">
          <li className="text-sm hover:bg-gray-100 p-2 rounded cursor-pointer">Faith in Action</li>
          <li className="text-sm hover:bg-gray-100 p-2 rounded cursor-pointer">The Power of Prayer</li>
          <li className="text-sm hover:bg-gray-100 p-2 rounded cursor-pointer">Love Your Neighbor</li>
        </ul>
      </div>
    </div>
  )

  const MobileMenu = (
    <div className={`fixed inset-0 bg-white z-50 ${isMobileMenuOpen ? 'block' : 'hidden'} overflow-y-auto`}>
      <div className="p-4">
        <Button variant="ghost" onClick={toggleMobileMenu} className="mb-4">
          <X className="h-6 w-6" />
        </Button>
        <nav className="space-y-4">
          <h3 className="text-lg font-bold mb-2">Navigation</h3>
          <Button variant="ghost" className="w-full justify-start text-left" size="lg">
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start text-left" size="lg" onClick={() => router.push('/research')}>
            <Search className="mr-2 h-5 w-5" />
            Research
          </Button>
          {/* ... Add other navigation items ... */}

          <h3 className="text-lg font-bold mt-6 mb-2">Quick Actions</h3>
          <Button className="w-full justify-start text-left" size="lg" onClick={() => setShowAddSermonForm(true)}>
            <PlusCircle className="mr-2 h-5 w-5" />
            New Sermon
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-left" 
            size="lg"
            onClick={() => {
              setShowConfigureWorkflow(!showConfigureWorkflow);
              toggleMobileMenu();
            }}
          >
            <Settings className="mr-2 h-5 w-5" />
            Configure Workflow
          </Button>
          <Button variant="outline" className="w-full justify-start text-left" size="lg">
            <List className="mr-2 h-5 w-5" />
            Manage Sermons
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-left" 
            size="lg"
            onClick={() => {
              toggleBgColor();
              toggleMobileMenu();
            }}
          >
            <Settings className="mr-2 h-5 w-5" />
            Toggle Background
          </Button>
        </nav>
      </div>
    </div>
  )

  const MainContent = (
    <div className={`p-4 md:p-10 space-y-6 w-full md:max-w-4xl mx-auto ${bgColor}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Welcome back, Pastor</h2>
        <div className="flex items-center">
          <Button variant="outline" size="sm" className="mr-2 md:hidden" onClick={toggleMobileMenu}>
            <Menu className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="md:hidden" onClick={() => setShowAddTaskPopup(true)}>
            <PlusCircle className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Calendar className="mr-2 h-4 w-4" />
            {currentDate}
          </Button>
        </div>
      </div>

      {showConfigureWorkflow ? (
        <SermonWorkflow 
          ref={workflowRef} 
          onClose={() => setShowConfigureWorkflow(false)} 
          onSave={handleSaveWorkflow}
          initialSteps={workflowSteps}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Task Manager</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAddTaskPopup(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center space-x-2 mb-2 p-2 hover:bg-gray-100 rounded"
                  >
                    <Checkbox
                      id={task.id}
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTask(task.id)}
                      className="w-5 h-5"
                    />
                    {completedTasks[task.id] !== undefined && (
                      <div className="w-8 h-8 relative">
                        <CircularProgressbar 
                          value={completedTasks[task.id] ?? 0} 
                          strokeWidth={50}
                          styles={buildStyles({
                            pathColor: getColorForProgress(completedTasks[task.id] ?? 0),
                            trailColor: 'transparent',
                          })}
                        />
                        <button 
                          className="absolute inset-0 flex items-center justify-center"
                          onClick={() => handleUndoTask(task.id)}
                        >
                          <Undo2 className="h-3 w-3 text-blue-500" />
                        </button>
                      </div>
                    )}
                    <label
                      htmlFor={task.id}
                      className={cn(
                        "flex-grow cursor-pointer",
                        task.completed ? "line-through text-gray-500" : "text-gray-700"
                      )}
                    >
                      {task.title}
                    </label>
                    <span className="text-sm text-gray-500">
                      {task.dueDate.toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

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
      )}
    </div>
  )

  return (
    <>
      <Layout 
        leftSidebar={LeftSidebar} 
        rightSidebar={RightSidebar}
        mainClassName={`flex-grow flex justify-center ${bgColor}`}
      >
        {MainContent}
        {/* Notification */}
        {notification && (
          <div className={`fixed bottom-4 right-4 ${
            notification.includes('Error') ? 'bg-red-500' : 'bg-green-500'
          } text-white px-4 py-2 rounded shadow-lg`}>
            {notification}
          </div>
        )}

        {/* Add Task Popup */}
        {showAddTaskPopup && (
          <AddTaskPopup onClose={() => setShowAddTaskPopup(false)} onAddTask={handleAddTask} />
        )}

        {/* Add Sermon Form */}
        {showAddSermonForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Add New Sermon</h2>
              <AddSermonForm
                onAddSermon={handleAddSermon}
                onCancel={() => setShowAddSermonForm(false)}
              />
            </div>
          </div>
        )}
      </Layout>
      {MobileMenu}
    </>
  )
}