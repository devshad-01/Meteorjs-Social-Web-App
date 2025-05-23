import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { FiEdit2, FiUser, FiMail, FiCalendar, FiLogOut, FiCheck, FiX } from 'react-icons/fi';

export const UserProfile = () => {
  const user = useTracker(() => Meteor.user());
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleLogout = () => {
    Meteor.logout((err) => {
      if (err) {
        console.error('Logout error', err);
        setError('Failed to logout. Please try again.');
      }
    });
  };

  const handleEditProfile = () => {
    setName(user.profile?.name || '');
    setBio(user.profile?.bio || '');
    setIsEditing(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    Meteor.call('updateUserProfile', { name, bio }, (err) => {
      if (err) {
        console.error('Profile update error:', err);
        setError(err.reason || 'Failed to update profile');
      } else {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
      }
    });
  };

  const sendVerificationEmail = () => {
    Meteor.call('sendVerificationEmail', (err) => {
      if (err) {
        setError(err.reason || 'Failed to send verification email');
      } else {
        setSuccess('Verification email sent. Please check your inbox.');
      }
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-6 sm:p-8 text-white">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white p-1 mr-4 sm:mr-6 shadow-lg">
                <img
                  src={user.profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.emails[0].address)}&background=random`}
                  alt="Profile"
                  className="w-full h-full rounded-full"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.profile?.name || user.username || 'User'}</h2>
                <p className="text-blue-100">{user.emails[0].address}</p>
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

              <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
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
                    <div className="flex items-center">
                      <p>{user.emails[0].address}</p>
                      {!user.emails[0].verified && (
                        <div className="ml-2 flex items-center">
                          <span className="text-yellow-600 text-sm">(Unverified)</span>
                          <button
                            onClick={sendVerificationEmail}
                            className="ml-2 text-blue-600 hover:text-blue-800 text-sm underline"
                          >
                            Verify Now
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
                    <p>{user.profile?.createdAt?.toLocaleDateString() || new Date(user.createdAt).toLocaleDateString() || 'Unknown'}</p>
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
    </div>
  );
};
