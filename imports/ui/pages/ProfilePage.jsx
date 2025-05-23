import React from 'react';
import { UserProfile } from '../components/UserProfile';
import TabNavigation from '../components/TabNavigation';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TabNavigation />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <UserProfile />
      </div>
    </div>
  );
};

export default ProfilePage;
