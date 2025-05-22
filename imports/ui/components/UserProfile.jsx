import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

export const UserProfile = () => {
  const user = useTracker(() => Meteor.user());
  
  const handleLogout = () => {
    Meteor.logout((err) => {
      if (err) {
        console.error('Logout error', err);
      }
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
      
      <div className="mb-4">
        <p className="text-gray-700"><strong>Email:</strong> {user.emails[0].address}</p>
      </div>
      
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
      >
        Log Out
      </button>
    </div>
  );
};
