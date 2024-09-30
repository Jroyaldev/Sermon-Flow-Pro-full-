// app/dashboard/page.tsx

import React from 'react';
import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('../components/dashboard/Dashboard'), { ssr: false });

const DashboardPage: React.FC = () => {
  return <Dashboard />;
};

export default DashboardPage;
