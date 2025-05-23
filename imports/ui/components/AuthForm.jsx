import React, { useState } from 'react';

const AuthForm = ({ type, onSubmit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("All fields are required");
            return;
        }
        setError(null);
        onSubmit({ email, password });
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {type === 'login' ? 'Login' : 'Create Account'}
            </h2>

            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@example.com"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                    />
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded flex items-center justify-center gap-2">
                    <i className={`bi bi-${type === 'login' ? 'box-arrow-in-right' : 'person-plus'}`}></i>
                    {type === ' login' ? 'Login' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
};

export default AuthForm;
