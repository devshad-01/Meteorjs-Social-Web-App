import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Login } from './Login';
import { Signup } from './Signup';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';
import HeaderLayout from './HeaderLayout';
import Logo from './Logo';

export const Authentication = () => {
  const [formType, setFormType] = useState('login');
  const [token, setToken] = useState(null);

  // Extract token from URL for password reset
  useEffect(() => {
    const parsedUrl = new URL(window.location.href);
    const pathParts = parsedUrl.pathname.split('/');
    
    if (pathParts.includes('reset-password')) {
      const tokenIndex = pathParts.indexOf('reset-password') + 1;
      if (tokenIndex < pathParts.length) {
        setToken(pathParts[tokenIndex]);
        setFormType('resetPassword');
      }
    }
  }, []);

  const toggleForm = (formName) => {
    setFormType(formName || (formType === 'login' ? 'signup' : 'login'));
  };

  const renderForm = () => {
    switch (formType) {
      case 'signup':
        return <Signup toggleForm={() => toggleForm('login')} />;
      case 'forgotPassword':
        return <ForgotPassword toggleToLogin={() => toggleForm('login')} />;
      case 'resetPassword':
        return <ResetPassword token={token} toggleToLogin={() => toggleForm('login')} />;
      case 'login':
      default:
        return <Login toggleForm={toggleForm} />;
    }
  };

  return (
    <HeaderLayout>
      <div className="max-w-md mx-auto mt-6 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center mb-6">
            <Logo size={48} />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              {formType === 'login' && 'Welcome Back'}
              {formType === 'signup' && 'Create Account'}
              {formType === 'forgotPassword' && 'Reset Your Password'}
              {formType === 'resetPassword' && 'Set New Password'}
            </h2>
            <p className="mt-1 text-center text-gray-600">
              {formType === 'login' && 'Sign in to access your account'}
              {formType === 'signup' && 'Join our community today'}
              {formType === 'forgotPassword' && "We'll send you a reset link"}
              {formType === 'resetPassword' && 'Enter your new password below'}
            </p>
          </div>
          {renderForm()}
        </div>
      </div>
    </HeaderLayout>
  );
};
