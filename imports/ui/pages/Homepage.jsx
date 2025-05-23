// /imports/ui/pages/Homepage.jsx
import React from 'react';
import { Meteor } from 'meteor/meteor';
import HeaderLayout from '../components/HeaderLayout';

const Homepage = () => {
    const user = Meteor.user();

    const handleLogout = () => {
        Meteor.logout();
    };

    return (
        <HeaderLayout>
            <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
                <h1 className="text-2xl font-bold mb-4">
                    Welcome, {user?.emails[0]?.address}
                </h1>
                <p className="text-gray-600">
                    Here’s your feed. You can post, message or view profile below.
                </p>
                <button
                    onClick={handleLogout}
                    className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>
        </HeaderLayout>
    );
};

export default Homepage;
