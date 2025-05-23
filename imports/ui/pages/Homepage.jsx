import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import PostsList from '../components/PostsList';
import HeaderLayout from '../components/HeaderLayout';

const Homepage = () => {
    const user = useTracker(() => Meteor.user());

    return (
        <HeaderLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 bg-white p-5 rounded-lg shadow-sm">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                        {user 
                            ? `Welcome, ${user.username || user.profile?.name || user.emails[0].address}` 
                            : 'Welcome to Meteor Social'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {user 
                            ? "Here's your feed. Share your thoughts or check out what others are saying!" 
                            : "Sign in to create posts and connect with others"}
                    </p>
                </div>
                
                <PostsList />
            </div>
        </HeaderLayout>
    );
};

export default Homepage;
