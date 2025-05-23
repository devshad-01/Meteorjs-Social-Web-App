// /imports/ui/components/HeaderLayout.jsx
import React from 'react';
import { FiHome, FiPlusSquare, FiMessageCircle, FiUser } from 'react-icons/fi';

const HeaderLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Top Header */}
            <header className="bg-blue-600 text-white py-4 shadow-md">
                <div className="container mx-auto px-4">
                    <h1 className="text-xl font-bold">Meteor Social Web App</h1>
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-grow p-6">{children}</main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md">
                <div className="flex justify-around items-center h-16 max-w-xl mx-auto">
                    <button className="flex flex-col items-center text-gray-700 hover:text-blue-500">
                        <FiHome size={24} />
                        <span className="text-sm">Home</span>
                    </button>
                    <button className="flex flex-col items-center text-gray-700 hover:text-blue-500">
                        <FiPlusSquare size={24} />
                        <span className="text-sm">Post</span>
                    </button>
                    <button className="flex flex-col items-center text-gray-700 hover:text-blue-500">
                        <FiMessageCircle size={24} />
                        <span className="text-sm">Messages</span>
                    </button>
                    <button className="flex flex-col items-center text-gray-700 hover:text-blue-500">
                        <FiUser size={24} />
                        <span className="text-sm">Profile</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default HeaderLayout;
