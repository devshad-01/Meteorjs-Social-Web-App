import React, { useState, useEffect } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

export const VerifyEmail = () => {
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const user = useTracker(() => Meteor.user());

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    
    if (token) {
      Accounts.verifyEmail(token, (err) => {
        setVerifying(false);
        if (err) {
          console.error('Email verification error:', err);
          setError(err.reason || 'Verification failed');
        } else {
          setSuccess(true);
        }
      });
    } else {
      setVerifying(false);
      setError('No verification token provided');
    }
  }, []);

  const sendVerificationEmail = () => {
    if (user && user.emails && !user.emails[0].verified) {
      Meteor.call('sendVerificationEmail', (err) => {
        if (err) {
          setError(err.reason || 'Failed to send verification email');
        } else {
          setSuccess(true);
        }
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Email Verification</h2>
      
      {verifying && (
        <div className="text-center text-gray-600">
          Verifying your email...
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          {user && !user.emails[0].verified && (
            <button
              onClick={sendVerificationEmail}
              className="block w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Resend Verification Email
            </button>
          )}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Your email has been verified successfully!
          <a
            href="/"
            className="block text-center mt-4 text-green-600 hover:text-green-800"
          >
            Go to Homepage
          </a>
        </div>
      )}
    </div>
  );
};
