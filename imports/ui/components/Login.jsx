import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

export const Login = ({ toggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    Meteor.loginWithPassword(email, password, (err) => {
      setIsLoading(false);
      if (err) {
        console.error("Login error", err);
        setError(err.reason || 'Login failed');
      } else {
        setEmail('');
        setPassword('');
        setError('');
      }
    });
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <label htmlFor="password" className="block text-gray-700 font-medium">
              Password
            </label>
            <button
              type="button"
              onClick={() => toggleForm('forgotPassword')}
              className="text-xs text-primary-600 hover:text-primary-800"
            >
              Forgot Password?
            </button>
          </div>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p>
          Don't have an account?{' '}
          <button
            onClick={() => toggleForm('signup')}
            className="text-blue-500 hover:text-blue-700"
          >
            Sign Up
          </button>
        </p>
      </div>
    </>
  );
};
