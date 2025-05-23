import React from 'react';
import AuthForm from '../components/AuthForm';
import { Accounts } from 'meteor/accounts-base';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();

    const handleSignup = ({ email, password }) => {
        Accounts.createUser({ email, password }, (err) => {
            if (err) {
                alert(err.reason || "Signup failed");
            } else {
                navigate('/');
            }
        });
    };

    return <AuthForm type="signup" onSubmit={handleSignup} />;
};

export default Signup;
