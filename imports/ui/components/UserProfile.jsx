import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { FiEdit2, FiUser, FiMail, FiCalendar, FiLogOut, FiCheck, FiX, FiImage, FiAward, FiCreditCard } from 'react-icons/fi';
import { VerificationBadge } from './VerificationBadge';
import { VerificationPlans } from './VerificationPlans';

export const UserProfile = () => {
  const { user, isLoading } = useTracker(() => {
    // Subscribe to both user data publications
    const userSub = Meteor.subscribe('userData');
    const allUsersSub = Meteor.subscribe('allUsers');
    
    return {
      user: Meteor.user(),
      isLoading: !userSub.ready() || !allUsersSub.ready()
    };
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [showVerificationPlans, setShowVerificationPlans] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleLogout = () => {
    Meteor.logout((err) => {
      if (err) {
        console.error('Logout error', err);
        setError('Failed to logout. Please try again.');
      }
    });
  };

  useEffect(() => {
    // Clear success and error messages after 5 seconds
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleEditProfile = () => {
    setName(user?.profile?.name || '');
    setBio(user?.profile?.bio || '');
    setAvatar(user?.profile?.avatar || '');
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await Meteor.callAsync('updateUserProfile', { name, bio, avatar });
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.reason || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Simple validation for file size and type
    if (file.size > 1024 * 1024) {
      setError('Image too large. Maximum size is 1MB.');
      return;
    }
    
    if (!file.type.match('image.*')) {
      setError('Only image files are allowed.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const sendVerificationEmail = async () => {
    setIsSubmitting(true);
    try {
      await Meteor.callAsync('sendVerificationEmail');
      setSuccess('Verification email sent. Please check your inbox.');
    } catch (err) {
      setError(err.reason || 'Failed to send verification email');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // For testing, will be replaced with payment flow later
  const toggleVerification = async () => {
    setIsSubmitting(true);
    try {
      await Meteor.callAsync('toggleAccountVerification');
      setSuccess(user?.profile?.isVerified ? 'Account verification removed' : 'Account verified successfully');
    } catch (err) {
      setError(err.reason || 'Failed to toggle verification status');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show verification plans
  const handleShowVerificationPlans = () => {
    setShowVerificationPlans(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-md mb-6"></div>
            <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-6"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded-md"></div>
              <div className="h-12 bg-gray-200 rounded-md"></div>
              <div className="h-12 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
        <h2 className="text-xl text-gray-700 mb-2">Not Logged In</h2>
        <p className="text-gray-500 mb-4">Please log in to view your profile</p>
        <a href="/login" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Go to Login
        </a>
      </div>
    </div>
  );

  const isVerified = user.profile?.isVerified || false;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-6 sm:p-8 text-white">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white p-1 mr-4 sm:mr-6 shadow-lg">
                <img
                  src={user.profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.emails?.[0]?.address || 'User')}&background=random`}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold text-white">{user.profile?.name || user.username || 'User'}</h2>
                  <VerificationBadge isVerified={isVerified} className="ml-2" />
                </div>
                <p className="text-blue-100">{user.emails?.[0]?.address || 'No email'}</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEditProfile}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg font-medium shadow-sm hover:bg-blue-50 transition-colors"
              >
                <FiEdit2 className="mr-2" /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mx-4 sm:mx-8 mt-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start">
            <FiX className="mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mx-4 sm:mx-8 mt-4 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md flex items-start">
            <FiCheck className="mr-2 mt-0.5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* Profile Content */}
        <div className="p-4 sm:p-8">
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself"
                  rows="4"
                />
              </div>
              
              <div>
                <label htmlFor="avatar" className="block text-gray-700 font-medium mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gray-100 overflow-hidden">
                    <img 
                      src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.emails?.[0]?.address || 'User')}&background=random`} 
                      alt="Avatar preview" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center px-4 py-2 bg-white border border-blue-500 rounded-lg text-blue-500 cursor-pointer hover:bg-blue-50 transition-colors">
                      <FiImage className="mr-2" />
                      <span>Choose image</span>
                      <input
                        type="file"
                        id="avatar"
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Max size: 1MB. JPG, PNG or GIF.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="border-b pb-4 mb-4">
                <h3 className="text-gray-700 font-medium mb-2">About</h3>
                <p className="text-gray-600">{user.profile?.bio || 'No bio added yet'}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <FiUser className="mr-3 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Username</p>
                    <p>{user.username || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <FiMail className="mr-3 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <div className="flex items-center flex-wrap">
                      <p>{user.emails?.[0]?.address || 'No email'}</p>
                      {user.emails?.[0] && !user.emails[0].verified && (
                        <div className="ml-2 flex items-center">
                          <span className="text-yellow-600 text-sm">(Unverified)</span>
                          <button
                            onClick={sendVerificationEmail}
                            disabled={isSubmitting}
                            className="ml-2 text-blue-600 hover:text-blue-800 text-sm underline disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? 'Sending...' : 'Verify Now'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <FiCalendar className="mr-3 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Member since</p>
                    <p>{user.profile?.createdAt ? new Date(user.profile.createdAt).toLocaleDateString() : 
                        user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 
                        'Unknown'}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <FiAward className="mr-3 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Account Status</p>
                    <div className="flex items-center">
                      {isVerified ? (
                        <span className="text-green-600 text-sm flex items-center">
                          <FiCheck className="mr-1" /> Verified Account
                          {user.profile?.verificationDate && (
                            <span className="text-gray-500 text-xs ml-2">
                              (Since {new Date(user.profile.verificationDate).toLocaleDateString()})
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-gray-600 text-sm">Standard Account</span>
                      )}
                      
                      {!isVerified && (
                        <button
                          onClick={handleShowVerificationPlans}
                          className="ml-3 flex items-center text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          <FiCreditCard className="mr-1" /> Get Verified
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t px-4 py-4 sm:px-8 sm:py-5">
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FiLogOut className="mr-2" /> Log Out
          </button>
        </div>
      </div>
      
      {/* Verification Plans */}
      {showVerificationPlans && !isVerified && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800">Verification Plans</h2>
            <button 
              onClick={() => setShowVerificationPlans(false)} 
              className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
          <VerificationPlans />
        </div>
      )}
    </div>
  );
};
