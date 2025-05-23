// filepath: /home/shad/Projects/Meteorjs-Social-Web-App/my-app/imports/ui/components/TabNavigation.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import Logo from './Logo';

const TabNavigation = () => {
  const location = useLocation();
  const user = useTracker(() => Meteor.user());

  // Define our tab items
  const tabs = [
    { 
      name: 'Home', 
      path: '/',
      protected: false 
    },
    { 
      name: 'Messages', 
      path: '/messages',
      protected: true 
    },
    { 
      name: 'Profile', 
      path: '/profile',
      protected: true 
    },
  ];

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center py-2">
          <Link to="/" className="mr-4 flex items-center">
            <Logo size={24} className="mr-2" />
            <span className="font-medium text-blue-600">Social Web</span>
          </Link>
          <div className="flex space-x-1 flex-grow">
            {tabs.map((tab) => {
              // Show login prompt for protected tabs when user is not logged in
              const isActive = location.pathname === tab.path;
              const isProtected = tab.protected && !user;
              
              return (
                <Link
                  key={tab.name}
                  to={isProtected ? '/login' : tab.path}
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } ${
                    isProtected ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center">
                    {tab.name}
                    {isProtected && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
