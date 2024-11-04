import React, { useState, useEffect } from 'react';
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

const DashboardLeave: React.FC = () => {
  const [leaves, setLeaves] = useState<any[]>([]);

  useEffect(() => {
    const res = localStorage.getItem('Data');
    try {
      if (res) {
        const parsedData = JSON.parse(res);
        const leavesData = parsedData.filter((item: any) => !!item.hours && item.hours > 0); 
        setLeaves(leavesData);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Hours</th>
            <th className="border border-gray-300 px-4 py-2">Remark</th>
            <th className="border border-gray-300 px-4 py-2">Project ID</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length > 0 ? (
            leaves.map((leave, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{leave.date}</td>
                <td className="border border-gray-300 px-4 py-2">{leave.hours}</td>
                <td className="border border-gray-300 px-4 py-2">{leave.remark}</td>
                <td className="border border-gray-300 px-4 py-2">{leave.projectId}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="border border-gray-300 px-4 py-2 text-center">
                No leaves data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

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
      <Route path='leave' element={<DashboardLeave />} />
    </Routes>
  );
};

export default Dashboard;