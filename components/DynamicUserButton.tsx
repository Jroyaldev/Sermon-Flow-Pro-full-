'use client'

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface DynamicUserButtonProps {
  user: {
    imageUrl: string;
  };
}

export default function DynamicUserButton({ user }: DynamicUserButtonProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname === '/dashboard';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isDashboard) {
    return null; // Don't render the button on non-dashboard pages
  }

  const handleSignOut = async () => {
    // Implement your sign out logic here
    // For example:
    // await supabase.auth.signOut();
    router.push('/sign-in');
  };

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-16 h-16 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <img src={user.imageUrl} alt="User" className="w-full h-full object-cover" />
      </button>
      {isMenuOpen && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-2">
          <button 
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}