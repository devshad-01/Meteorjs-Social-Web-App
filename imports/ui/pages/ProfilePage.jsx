import React from 'react';
import { UserProfile } from '../components/UserProfile';
import HeaderLayout from '../components/HeaderLayout';

const ProfilePage = () => {
  return (
    <HeaderLayout>
      <UserProfile />
    </HeaderLayout>
  );
};

export default ProfilePage;
