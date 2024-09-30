// app/components/Dashboard/MobileMenu.tsx

import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  PenTool, 
  Search, 
  FileText, 
  Eye, 
  Mic, 
  PlusCircle, 
  Settings, 
  List, 
  ChevronRight, 
  X 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import MobileUserMenu from './MobileUserMenu';

interface MobileMenuProps {
  isOpen: boolean;
  toggleMobileMenu: () => void;
  router: ReturnType<typeof useRouter>;
  setShowAddSermonForm: (value: boolean) => void;
  setShowConfigureWorkflow: React.Dispatch<React.SetStateAction<boolean>>;
  toggleBgColor: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  toggleMobileMenu,
  router,
  setShowAddSermonForm,
  setShowConfigureWorkflow,
  toggleBgColor,
}) => {
  const handleNavigation = (path: string) => {
    router.push(path);
    toggleMobileMenu();
  };

  return (
    <div className={`fixed inset-0 bg-white z-50 ${isOpen ? 'flex' : 'hidden'} flex-col`}>
      <div className="flex-grow overflow-y-auto p-4">
        {/* Close Button */}
        <Button variant="ghost" onClick={toggleMobileMenu} className="mb-4">
          <X className="h-6 w-6" />
        </Button>

        <nav className="space-y-4">
          <h3 className="text-lg font-bold mb-2">Navigation</h3>

          {/* Dashboard Button */}
          <Button variant="ghost" className="w-full justify-start text-left" size="lg" onClick={() => handleNavigation('/')}>
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Dashboard
          </Button>

          {/* Outline Button */}
          <Button variant="ghost" className="w-full justify-start text-left" size="lg" onClick={() => handleNavigation('/outline')}>
            <PenTool className="mr-2 h-5 w-5" />
            Outline
          </Button>

          {/* Research Button */}
          <Button variant="ghost" className="w-full justify-start text-left" size="lg" onClick={() => handleNavigation('/research')}>
            <Search className="mr-2 h-5 w-5" />
            Research
          </Button>

          {/* Write Draft Button */}
          <Button variant="ghost" className="w-full justify-start text-left" size="lg" onClick={() => handleNavigation('/write-draft')}>
            <FileText className="mr-2 h-5 w-5" />
            Write Draft
          </Button>

          {/* Review Button */}
          <Button variant="ghost" className="w-full justify-start text-left" size="lg" onClick={() => handleNavigation('/review')}>
            <Eye className="mr-2 h-5 w-5" />
            Review
          </Button>

          {/* Practice Button */}
          <Button variant="ghost" className="w-full justify-start text-left" size="lg" onClick={() => handleNavigation('/practice')}>
            <Mic className="mr-2 h-5 w-5" />
            Practice
          </Button>

          <h3 className="text-lg font-bold mt-6 mb-2">Quick Actions</h3>

          {/* New Sermon Button */}
          <Button className="w-full justify-start text-left" size="lg" onClick={() => { setShowAddSermonForm(true); toggleMobileMenu(); }}>
            <PlusCircle className="mr-2 h-5 w-5" />
            New Sermon
          </Button>

          {/* Configure Workflow Button */}
          <Button 
            variant="outline" 
            className="w-full justify-start text-left" 
            size="lg"
            onClick={() => { setShowConfigureWorkflow(prev => !prev); toggleMobileMenu(); }}
          >
            <Settings className="mr-2 h-5 w-5" />
            Configure Workflow
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>

          {/* Manage Sermons Button */}
          <Button 
            variant="outline" 
            className="w-full justify-start text-left" 
            size="lg"
            onClick={() => { router.push('/manage-sermons'); toggleMobileMenu(); }}
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
            onClick={() => { toggleBgColor(); toggleMobileMenu(); }}
          >
            <Settings className="mr-2 h-5 w-5" />
            Toggle Background
            <ChevronRight className="ml-auto h-5 w-5" />
          </Button>
        </nav>
      </div>

      {/* Add MobileUserMenu at the bottom */}
      <div className="p-4 border-t">
        <MobileUserMenu />
      </div>
    </div>
  );
};

export default MobileMenu;
