
import './App.css'
import { Button } from "@/components/ui/button"
import { ModeToggle } from './components/ModeToggle'


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme/theme-provider';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
// import Layout from './components/Layout';
// import Dashboard from './pages/Dashboard';
// import AdminDashboard from './pages/AdminDashboard';
// import Login from './pages/Login';
// import NotFound from './pages/NotFound';
// import Unauthorized from './pages/Unauthorized';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import { Login } from './components/Loign';
import TimesheetPage from './pages/TimesheetPage';

const App: React.FC = () => {
  console.log("env", import.meta.env.VITE_CLIENT_ID)
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
            {/* <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}> */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/timesheet" replace />} />
                <Route path="timesheet" element={<TimesheetPage />} />
                <Route path="dashboard/*" element={<Dashboard />} />
              </Route>
            {/* </Route> */}
            {/* <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<Layout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard/*" element={<AdminDashboard />} />
              </Route>
            </Route> */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
