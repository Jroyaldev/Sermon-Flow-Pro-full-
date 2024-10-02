// app/components/Dashboard/LeftSidebar.tsx

import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  PenTool, 
  Search, 
  FileText, 
  Eye, 
  Mic, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
// Remove Clerk imports

interface LeftSidebarProps {
  router: ReturnType<typeof useRouter>;
  user: {
    fullName: string;
    imageUrl: string;
    primaryEmailAddress: { emailAddress: string };
  };
  onSignOut: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ router, user, onSignOut }) => {
  // Remove Clerk hooks

  return (
    <div className="hidden md:flex flex-col w-72 bg-white border-r h-screen p-6">
      <div className="flex-grow">
        <nav className="space-y-2">
          {/* Dashboard Button */}
          <Button variant="ghost" className="w-full justify-start text-left text-black hover:bg-gray-100" size="lg">
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Dashboard
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>

          {/* Outline Button */}
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left text-black hover:bg-gray-100" 
            size="lg"
            onClick={() => router.push('/outline')}
          >
            <PenTool className="mr-2 h-5 w-5" />
            Outline
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>

          {/* Research Button */}
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

          {/* Write Draft Button */}
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left text-black hover:bg-gray-100" 
            size="lg"
            onClick={() => router.push('/write-draft')}
          >
            <FileText className="mr-2 h-5 w-5" />
            Write Draft
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>

          {/* Review Button */}
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left text-black hover:bg-gray-100" 
            size="lg"
            onClick={() => router.push('/review')}
          >
            <Eye className="mr-2 h-5 w-5" />
            Review
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>

          {/* Practice Button */}
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left text-black hover:bg-gray-100" 
            size="lg"
            onClick={() => router.push('/practice')}
          >
            <Mic className="mr-2 h-5 w-5" />
            Practice
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>
        </nav>
      </div>

      {/* User section at the bottom */}
      <div className="mt-auto">
        <div className="flex items-center space-x-2 mb-2">
          <img src={user.imageUrl} alt="User" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold">{user.fullName}</p>
            <p className="text-sm text-gray-500">{user.primaryEmailAddress.emailAddress}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-left text-black hover:bg-gray-100" 
          size="lg"
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default LeftSidebar;
