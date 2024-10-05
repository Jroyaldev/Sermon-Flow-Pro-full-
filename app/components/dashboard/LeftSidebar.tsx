// app/components/dashboard/LeftSidebar.tsx

'use client';

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

// Supabase Client
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

interface LeftSidebarProps {
  router: ReturnType<typeof useRouter>;
  onLogout: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ router, onLogout }) => {
  const supabase = createClientComponentClient<Database>();

  /**
   * Handles the sign-out process using Supabase.
   * After signing out, it triggers the onLogout callback.
   */
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      // Optionally, display a notification to the user
    } else {
      onLogout();
    }
  };

  return (
    <div className="hidden md:flex flex-col w-72 bg-white border-r h-screen p-6">
      {/* Navigation Section */}
      <div className="flex-grow">
        <nav className="space-y-2">
          {/* Dashboard Button */}
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left text-black hover:bg-gray-100" 
            size="lg"
            onClick={() => router.push('/dashboard')}
          >
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

      {/* Custom Data Section (Placeholder for Future Use) */}
      {/* You can add custom components or data here later */}
      {/* Example:
          <div className="my-custom-section">
            <CustomComponent />
          </div>
      */}

      {/* Sign Out Button */}
      <div className="mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-left text-black hover:bg-gray-100" 
          size="lg"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default LeftSidebar;
