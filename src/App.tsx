import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import { CombatProvider } from './contexts/CombatContext';
import MainLayout from './components/Layout/MainLayout';
import Landing from './pages/Auth/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CharacterCreation from './pages/Auth/CharacterCreation';
import Dashboard from './pages/Dashboard';
import Quests from './pages/Quests';
import Inventory from './pages/Inventory';
import Profile from './pages/Profile';
import Adventure from './pages/Adventure';
import Combat from './pages/Combat';

// Import หน้าทดสอบของเรา
import LoginTest from './pages/LoginTest';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-mystical-900 to-primary-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-mystical-900 to-primary-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* --- เพิ่ม Route สำหรับหน้าทดสอบตรงนี้ --- */}
        <Route path="/logintest" element={<LoginTest />} />

        {/* Character Creation (Special Case) */}
        <Route path="/character-creation" element={
          <ProtectedRoute>
            <CharacterCreation />
          </ProtectedRoute>
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <GameProvider>
              <CombatProvider>
                <MainLayout />
              </CombatProvider>
            </GameProvider>
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="quests" element={<Quests />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="equipment" element={<div className="p-8 text-center"><h1 className="text-2xl">Equipment System Coming Soon!</h1></div>} />
          <Route path="shop" element={<div className="p-8 text-center"><h1 className="text-2xl">Shop Coming Soon!</h1></div>} />
          <Route path="profile" element={<Profile />} />
          <Route path="adventure" element={<Adventure />} />
          <Route path="combat" element={<Combat />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
