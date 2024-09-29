'use client'

import { UserButton } from "@clerk/nextjs";
import { usePathname } from 'next/navigation';

export default function DynamicUserButton() {
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  if (!isDashboard) {
    return null; // Don't render the button on non-dashboard pages
  }

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <UserButton 
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "w-16 h-16" // Make the button larger
          }
        }}
      />
    </div>
  );
}