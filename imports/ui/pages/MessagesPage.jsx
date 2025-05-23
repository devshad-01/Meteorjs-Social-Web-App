import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import MessagesList from '../components/MessagesList';
import TabNavigation from '../components/TabNavigation';

const MessagesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TabNavigation />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <MessagesList />
      </div>
    </div>
  );
};

export default MessagesPage;
