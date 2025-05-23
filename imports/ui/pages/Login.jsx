import React from 'react';
import AuthForm from '../components/AuthForm';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';

const Login= () => {
    const navigate = useNavigate();

    const handleLogin = ({ email, password }) => {
        Meteor.loginWithPassword(email, password, (err) => {
            if (err) {
                alert(err.reason || "Login failed");
            } else {
                navigate('/');
            }
        });
    };

    return <AuthForm type="login" onSubmit={handleLogin} />;
};

export default Login;
