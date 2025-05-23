import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { AppRoutes } from './routes/index';

export const App = () => {
  const isLoading = useTracker(() => Meteor.loggingIn());

  return (
    <div className="min-h-screen bg-gray-100 fade-in">
      <main className="pb-16 sm:pb-0"> {/* Add padding for mobile nav */}
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-pulse flex flex-col items-center text-primary-600">
              <div className="w-16 h-16 border-4 border-t-transparent border-primary-500 rounded-full animate-spin mb-4"></div>
              <p className="text-xl font-medium">Loading...</p>
            </div>
          </div>
        ) : (
          <AppRoutes />
        )}
      </main>
    </div>
  );
};
