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
import Link from 'next/link';

interface LeftSidebarProps {
  router: ReturnType<typeof useRouter>;
  user: {
    fullName: string;
    imageUrl: string;
    primaryEmailAddress: { emailAddress: string };
  };
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ router, user }) => {
  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
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

        {/* Logout link */}
        <div className="px-4 py-2">
          <a
            href="/api/auth/logout"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </a>
        </div>

        {/* User section at the bottom */}
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center space-x-3">
            <img
              src={user.imageUrl}
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-sm">{user.fullName}</p>
              <p className="text-xs text-gray-500">{user.primaryEmailAddress.emailAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
