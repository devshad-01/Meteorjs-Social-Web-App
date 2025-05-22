import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Login } from './Login';
import { Signup } from './Signup';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';

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
    <div className="container mx-auto py-8">
      {renderForm()}
    </div>
  );
};
