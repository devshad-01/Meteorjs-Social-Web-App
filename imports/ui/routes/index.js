// Simple routes file to avoid the app crashing
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

// Import pages
import Homepage from '../pages/Homepage';
import ProfilePage from '../pages/ProfilePage';
import MessagesPage from '../pages/MessagesPage';
import { Authentication } from '../components/Authentication';

export const AppRoutes = () => {
  const user = useTracker(() => Meteor.user());
  
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/messages" element={user ? <MessagesPage /> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Authentication />} />
    </Routes>
  );
};
