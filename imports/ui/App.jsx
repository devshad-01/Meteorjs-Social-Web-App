import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { AppRoutes } from './routes/index';

export const App = () => {
  const isLoading = useTracker(() => Meteor.loggingIn());

  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading...</p>
          </div>
        ) : (
          <AppRoutes />
        )}
      </main>
    </div>
  );
};
