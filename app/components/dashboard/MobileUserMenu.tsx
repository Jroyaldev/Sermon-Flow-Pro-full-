import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, ChevronUp, ChevronDown } from 'lucide-react';

interface MobileUserMenuProps {
  user: {
    fullName: string;
    imageUrl: string;
  };
  onSignOut: () => void;
}

const MobileUserMenu: React.FC<MobileUserMenuProps> = ({ user, onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center justify-between w-full p-2 rounded-lg bg-gray-100"
      >
        <div className="flex items-center space-x-2">
          <img src={user.imageUrl} alt="User" className="w-8 h-8 rounded-full" />
          <span className="font-semibold">{user.fullName}</span>
        </div>
        {isMenuOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      
      {isMenuOpen && (
        <div className="mt-2 w-full bg-white shadow-lg rounded-lg p-2">
          <Button 
            variant="ghost"
            className="w-full justify-start text-left text-black hover:bg-gray-100" 
            size="lg"
            onClick={onSignOut}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
          {/* Add more menu items as needed */}
        </div>
      )}
    </div>
  );
};

export default MobileUserMenu;