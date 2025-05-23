// /imports/ui/pages/Homepage.jsx
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import PostsList from '../components/PostsList';
import TabNavigation from '../components/TabNavigation';

const Homepage = () => {
    const user = useTracker(() => Meteor.user());

    const handleLogout = () => {
        Meteor.logout();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <TabNavigation />
            <div className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">
                        {user ? `Welcome, ${user.username || user.profile?.name || user.emails[0].address}` : 'Welcome to Social App'}
                    </h1>
                    <p className="text-gray-600">
                        {user 
                            ? "Here's your feed. Create a post or check out what others are saying!" 
                            : "Sign in to create posts and use all features"}
                    </p>
                    {user && (
                        <button
                            onClick={handleLogout}
                            className="mt-4 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 text-sm"
                        >
                            Logout
                        </button>
                    )}
                </div>
                
                <PostsList />
            </div>
        </div>
    );
};

export default Homepage;
