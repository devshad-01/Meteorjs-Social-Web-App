import React, { useState } from 'react';
import { Login } from './Login';
import { Signup } from './Signup';

export const Authentication = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="container mx-auto py-8">
      {showLogin ? (
        <Login toggleForm={toggleForm} />
      ) : (
        <Signup toggleForm={toggleForm} />
      )}
    </div>
  );
};
