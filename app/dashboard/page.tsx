'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, ChevronRight, Settings, List, LayoutDashboard, Search, PenTool, FileText, Eye, Mic, BarChart2, Clock, Calendar, Activity, ArrowUp, ArrowDown, GripVertical } from 'lucide-react'
import dynamic from 'next/dynamic';

const ConfigureWorkflow = dynamic(
  () => import('@/components/ConfigureWorkflow').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

type Task = {
  id: string
  title: string
  completed: boolean
  dueDate: Date
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Research for "Faith in Action"', completed: false, dueDate: new Date() },
    { id: '2', title: 'Outline "The Power of Prayer"', completed: false, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    { id: '3', title: 'Write draft for "Love Your Neighbor"', completed: false, dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
  ])
  const [newTask, setNewTask] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [showConfigureWorkflow, setShowConfigureWorkflow] = useState(false)

  useEffect(() => {
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    setCurrentDate(date.toLocaleDateString('en-US', options))
  }, [])

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }])
      setNewTask('')
    }
  }

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  return (
    <div className="flex h-screen bg-gray-100 font-semibold">
      {/* Left Sidebar */}
      <div className="w-64 bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Sermon Flow Pro</h1>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-left" size="lg">
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Dashboard
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>
          <Button variant="ghost" className="w-full justify-start text-left" size="lg">
            <Search className="mr-2 h-5 w-5" />
            Research
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>
          <Button variant="ghost" className="w-full justify-start text-left" size="lg">
            <PenTool className="mr-2 h-5 w-5" />
            Outline
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>
          <Button variant="ghost" className="w-full justify-start text-left" size="lg">
            <FileText className="mr-2 h-5 w-5" />
            Write Draft
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>
          <Button variant="ghost" className="w-full justify-start text-left" size="lg">
            <Eye className="mr-2 h-5 w-5" />
            Review
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>
          <Button variant="ghost" className="w-full justify-start text-left" size="lg">
            <Mic className="mr-2 h-5 w-5" />
            Practice
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 space-y-6 overflow-y-auto">
        {showConfigureWorkflow ? (
          <ConfigureWorkflow />
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Welcome back, Pastor</h2>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                {currentDate}
              </Button>
            </div>

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
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Input
                    placeholder="Add a new task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="flex-grow"
                  />
                  <Button onClick={handleAddTask}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
                <ScrollArea className="h-[200px]">
                  {tasks.map(task => (
                    <div key={task.id} className="flex items-center space-x-2 mb-2 p-2 hover:bg-gray-100 rounded">
                      <Checkbox
                        id={task.id}
                        checked={task.completed}
                        onCheckedChange={() => handleToggleTask(task.id)}
                      />
                      <label
                        htmlFor={task.id}
                        className={`flex-grow ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}
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
                  <li className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Completed outline for "Faith in Action"</span>
                  </li>
                  <li className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Started research for "The Power of Prayer"</span>
                  </li>
                  <li className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Practiced delivery for "Love Your Neighbor"</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-72 bg-white p-6 shadow-lg">
        <div className="space-y-6">
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full justify-start text-left" size="lg">
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
    </div>
  )
}