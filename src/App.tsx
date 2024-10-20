
import './App.css'

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme/theme-provider';
import { AuthProvider } from './contexts/AuthContext';
// import Layout from './components/Layout';
// import Dashboard from './pages/Dashboard';
// import AdminDashboard from './pages/AdminDashboard';
// import Login from './pages/Login';
// import NotFound from './pages/NotFound';
// import Unauthorized from './pages/Unauthorized';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import { Login } from './components/Login';
import TimesheetPage from './pages/TimesheetPage';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

const App: React.FC = () => {
  console.log("env", import.meta.env.VITE_CLIENT_ID)
  const { accounts, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated();
  const [isLoading, setIsLoading] = useState(true)
  console.log(accounts)

  useEffect(() => {
    // Set loading to false once the initial auth check is complete
    if (inProgress === InteractionStatus.None) {
      setIsLoading(false)
    }
  }, [inProgress])

  // Show loading spinner during initial load or auth interactions
  if (isLoading || inProgress !== InteractionStatus.None) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <LoadingSpinner />
      </ThemeProvider>
    )
  }

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route
              path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
            />
            {/* <Route path="/" element={isAuthenticated ? <Layout /> : <Login />} /> */}
            {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
            {/* <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}> */}
            <Route path="/" element={isAuthenticated ? <Layout /> : <Login />}>
                <Route index element={<Navigate to="/timesheet"  />} />
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
