// app/components/Dashboard/RightSidebar.tsx

import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Settings, 
  List, 
  ChevronRight 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RightSidebarProps {
  recentSermons: { title: string; id: string }[];
  setShowAddSermonForm: (value: boolean) => void;
  setShowConfigureWorkflow: (value: boolean) => void;
  toggleBgColor: () => void;
  router: ReturnType<typeof useRouter>;
  showConfigureWorkflow: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  recentSermons,
  setShowAddSermonForm,
  setShowConfigureWorkflow,
  toggleBgColor,
  router,
  showConfigureWorkflow,
}) => {
  return (
    <div className="hidden md:block p-6 pt-20 md:pt-6 w-64"> {/* Hidden on mobile */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {/* New Sermon Button */}
          <Button className="w-full justify-start text-left" size="lg" onClick={() => setShowAddSermonForm(true)}>
            <PlusCircle className="mr-2 h-5 w-5" />
            New Sermon
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>

          {/* Configure Workflow Button */}
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

          {/* Manage Sermons Button */}
          <Button 
            variant="outline" 
            className="w-full justify-start text-left" 
            size="lg"
            onClick={() => router.push('/manage-sermons')}
          >
            <List className="mr-2 h-5 w-5" />
            Manage Sermons
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>

          {/* Toggle Background Button */}
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

      {/* Recent Sermons Section */}
      <div className="mt-8">
        <h4 className="text-sm font-semibold text-gray-500 mb-2">Recent Sermons</h4>
        <ul className="space-y-2">
          {recentSermons.map((sermon) => (
            <li 
              key={sermon.id} 
              className="text-sm hover:bg-gray-100 p-2 rounded cursor-pointer"
            >
              {sermon.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RightSidebar;
