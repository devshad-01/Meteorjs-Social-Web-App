import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { Authentication } from './components/Authentication';
import { UserProfile } from './components/UserProfile';

// Create simple placeholder pages for the router
const HomePage = () => <div className="p-4">Home Page Content</div>;
const AboutPage = () => <div className="p-4">About Page Content</div>;

export const App = () => {
  const user = useTracker(() => Meteor.user());
  const isLoading = useTracker(() => Meteor.loggingIn());

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Meteor Social Web App</h1>
          
          {/* Navigation Links */}
          <nav className="mt-2">
            <ul className="flex space-x-4">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/profile" className="hover:underline">Profile</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading...</p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route 
              path="/profile" 
              element={user ? <UserProfile /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/profile" /> : <Authentication />} 
            />
          </Routes>
        )}
      </main>
    </div>
  );
};
