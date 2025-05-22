import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Authentication } from './components/Authentication';
import { UserProfile } from './components/UserProfile';

export const App = () => {
  const user = useTracker(() => Meteor.user());
  const isLoading = useTracker(() => Meteor.loggingIn());

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Meteor Social Web App</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading...</p>
          </div>
        ) : user ? (
          <UserProfile />
        ) : (
          <Authentication />
        )}
      </main>
    </div>
  );
};
