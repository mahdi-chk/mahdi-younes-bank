import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import AddClient from './pages/agent/AddClient';
import ClientList from './pages/agent/ClientList';
import AddAccount from './pages/agent/AddAccount';
import CompteList from './pages/agent/CompteList';
import AgentDashboard from './pages/agent/AgentDashboard';
import Dashboard from './pages/client/Dashboard';
import Virement from './pages/client/Virement';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/change-password" element={
            <ProtectedRoute>
              <Layout>
                <ChangePassword />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Routes AGENT_GUICHET */}
          <Route path="/agent/dashboard" element={
            <ProtectedRoute requiredRole="AGENT_GUICHET">
              <Layout>
                <AgentDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/agent/clients" element={
            <ProtectedRoute requiredRole="AGENT_GUICHET">
              <Layout>
                <ClientList />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/agent/add-client" element={
            <ProtectedRoute requiredRole="AGENT_GUICHET">
              <Layout>
                <AddClient />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/agent/comptes" element={
            <ProtectedRoute requiredRole="AGENT_GUICHET">
              <Layout>
                <CompteList />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/agent/add-account" element={
            <ProtectedRoute requiredRole="AGENT_GUICHET">
              <Layout>
                <AddAccount />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Routes CLIENT */}
          <Route path="/client/dashboard" element={
            <ProtectedRoute requiredRole="CLIENT">
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/client/virement" element={
            <ProtectedRoute requiredRole="CLIENT">
              <Layout>
                <Virement />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
