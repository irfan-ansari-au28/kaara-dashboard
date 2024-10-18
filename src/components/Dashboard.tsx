import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Card, CardContent, CardHeader, CardTitle } from "@ui/card"

const DashboardOverview: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$45,231.89</div>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardContent>
    </Card>
    {/* Add more cards for other metrics */}
  </div>
);

const DashboardAnalytics: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Analytics</h2>
    {/* Add charts or analytics components here */}
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <Routes>
      <Route index element={<DashboardOverview />} />
      <Route path="overview" element={<DashboardOverview />} />
      <Route path="analytics" element={<DashboardAnalytics />} />
    </Routes>
  );
};

export default Dashboard;