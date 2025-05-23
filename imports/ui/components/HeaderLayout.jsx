import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiPlusSquare, FiMessageCircle, FiUser, FiMenu, FiX, FiChevronUp } from 'react-icons/fi';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import Logo from './Logo';

const HeaderLayout = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const location = useLocation();
    const user = useTracker(() => Meteor.user());
    
    const isActive = (path) => location.pathname === path;
    
    // Toggle mobile menu
    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    
    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    // Detect scroll position to show/hide scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Top Header */}
            <header className="py-3 shadow-md sticky top-0 z-10 bg-white">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Logo size={32} className="mr-2" />
                        <h1 className="text-lg font-bold hidden xs:block text-gray-900">Meteor Social</h1>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden sm:flex space-x-6">
                        <Link to="/" className={`font-medium hover:text-primary-600 transition ${isActive('/') ? 'text-primary-700' : 'text-gray-700'}`}>
                            Home
                        </Link>
                        <Link to="/messages" className={`font-medium hover:text-primary-600 transition ${isActive('/messages') ? 'text-primary-700' : 'text-gray-700'}`}>
                            Messages
                        </Link>
                        <Link to="/profile" className={`font-medium hover:text-primary-600 transition ${isActive('/profile') ? 'text-primary-700' : 'text-gray-700'}`}>
                            Profile
                        </Link>
                        {!user ? (
                            <Link to="/login" className="font-medium hover:text-primary-600 transition text-gray-700">
                                Login
                            </Link>
                        ) : (
                            <button 
                                onClick={() => Meteor.logout()}
                                className="font-medium hover:text-primary-600 transition text-gray-700"
                            >
                                Logout
                            </button>
                        )}
                    </nav>
                    
                    {/* Mobile Menu Button */}
                    <button onClick={toggleMobileMenu} className="sm:hidden text-gray-900">
                        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
                
                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="sm:hidden bg-gray-100 py-2 px-4 shadow-inner-top transition-all">
                        <div className="flex flex-col space-y-3">
                            <Link 
                                to="/" 
                                className="text-gray-900 hover:text-primary-700 py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link 
                                to="/messages" 
                                className="text-gray-900 hover:text-primary-700 py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Messages
                            </Link>
                            <Link 
                                to="/profile" 
                                className="text-gray-900 hover:text-primary-700 py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Profile
                            </Link>
                            {!user ? (
                                <Link 
                                    to="/login" 
                                    className="text-gray-900 hover:text-primary-700 py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            ) : (
                                <button 
                                    onClick={() => {
                                        Meteor.logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-gray-900 hover:text-primary-700 py-2 text-left"
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Page Content */}
            <main className="flex-grow p-4 md:p-6 pt-4">{children}</main>

            {/* Bottom Navigation - Mobile Only */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md sm:hidden safe-bottom">
                <div className="flex justify-around items-center h-16 max-w-xl mx-auto">
                    <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-primary-600' : 'text-gray-600'} hover:text-primary-500`}>
                        <FiHome size={24} />
                        <span className="text-xs mt-1">Home</span>
                    </Link>
                    <Link to="/messages" className={`flex flex-col items-center ${isActive('/messages') ? 'text-primary-600' : 'text-gray-600'} hover:text-primary-500`}>
                        <FiMessageCircle size={24} />
                        <span className="text-xs mt-1">Messages</span>
                    </Link>
                    <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-primary-500 relative">
                        <div className="absolute -top-5 bg-primary-600 rounded-full p-3 shadow-lg border-4 border-white">
                            <FiPlusSquare size={24} className="text-white" />
                        </div>
                        <span className="text-xs mt-1 pt-6">Post</span>
                    </Link>
                    <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile') ? 'text-primary-600' : 'text-gray-600'} hover:text-primary-500`}>
                        <FiUser size={24} />
                        <span className="text-xs mt-1">Profile</span>
                    </Link>
                </div>
            </nav>
            
            {/* Scroll to top button */}
            {showScrollTop && (
                <button 
                    onClick={scrollToTop}
                    className="fixed bottom-20 right-4 sm:bottom-4 bg-primary-600 text-white p-2 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity z-10"
                    aria-label="Scroll to top"
                >
                    <FiChevronUp size={24} />
                </button>
            )}
        </div>
    );
};

export default HeaderLayout;
