import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

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
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Profile</h2>
        {!isEditing && (
          <button
            onClick={handleEditProfile}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="flex items-start space-x-6 mb-6">
        <img
          src={user.profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.emails[0].address)}&background=random`}
          alt="Profile"
          className="w-24 h-24 rounded-full"
        />
        
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="flex-1">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{user.profile?.name || 'No name set'}</h3>
            <p className="text-gray-600 mb-4">{user.profile?.bio || 'No bio added yet'}</p>
            <p className="text-gray-700">
              <strong>Email:</strong> {user.emails[0].address}
              {!user.emails[0].verified && (
                <>
                  {' '}
                  <span className="text-yellow-600">(Unverified)</span>
                  <button
                    onClick={sendVerificationEmail}
                    className="ml-2 text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Verify Now
                  </button>
                </>
              )}
            </p>
            <p className="text-gray-700">
              <strong>Member since:</strong>{' '}
              {user.profile?.createdAt?.toLocaleDateString() || 'Unknown'}
            </p>
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};
