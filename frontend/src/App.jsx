import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { RoleProvider, useRole } from './context/RoleContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BatchDetail from './pages/BatchDetail';
import Verify from './pages/Verify';
import VerificationLookup from './pages/VerificationLookup';
import { Sidebar } from './components/Sidebar';

const DashboardLayout = ({ children }) => (
  <div className="flex min-h-screen bg-cream-bg">
    <Sidebar />
    <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8 overflow-y-auto custom-scrollbar">
      {children}
    </main>
  </div>
);

const RoleGuard = ({ children }) => {
  const { activeRole } = useRole();
  const { role } = useParams();
  
  if (!activeRole) {
    return <Navigate to="/login" replace />;
  }
  
  const expectedSlug = activeRole.name.toLowerCase().replace(' ', '-');
  if (role !== expectedSlug) {
    return <Navigate to={`/dashboard/${expectedSlug}`} replace />;
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
  return (
    <RoleProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard/:role" element={
            <RoleGuard>
              <Dashboard />
            </RoleGuard>
          } />
          
          <Route path="/dashboard/:role/batch/:id" element={
            <RoleGuard>
              <BatchDetail />
            </RoleGuard>
          } />
          
          <Route path="/lookup" element={<VerificationLookup />} />
          <Route path="/verify/:id" element={<Verify />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </RoleProvider>
  );
}

export default App;
