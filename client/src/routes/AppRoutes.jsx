import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Home from '../pages/Home';
import Features from '../pages/Features';
import Pricing from '../pages/Pricing';
import Dashboard from '../pages/Dashboard';
import Workspace from '../pages/Workspace';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import Team from '../pages/Team';
import ResetPassword from '../pages/ResetPassword';
import AllTasks from '../pages/AllTasks';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

      {/* Protected app routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tasks" element={<AllTasks />} />
      <Route path="/team" element={<Team />} />
      <Route path="/projects/:projectId" element={<Workspace />} />
      <Route path="/profile" element={<Profile />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
