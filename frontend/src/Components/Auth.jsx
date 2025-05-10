import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import socket from "../socket";

const Auth = () => {
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true); // More descriptive name
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ fullname: '', email: '', password: '' });
    const [error, setError] = useState(''); // For displaying errors to the user
    const [showPassword, setShowPassword] = useState(false);


    const authRequest = async (url, data) => {
        try {
            const response = await axios.post(url, data, {withCredentials: true});
            const { message, user} = response.data;

            if (message === 'Success') {
                localStorage.setItem('user', JSON.stringify(user));
                // localStorage.setItem('token', token);
                alert("Login successful!"); // Optional: Show a success message
                navigate('/');
                socket.disconnect();
                socket.connect();  // reconnect to include new cookies
            } else {
                setError(message); // Set the error message
                alert(error)
            }
        } catch (err) {
            console.error('Authentication error:', err);
            setError('An unexpected error occurred. Please try again.');
            alert(error)
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        await authRequest(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, loginData);
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        await authRequest(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, registerData);
    };

    return (
        <div className="auth-container">
            {/* {error && <div className="auth-error">Error: {error}</div>}  Display errors to the user */}
            {isLoginMode ? (
                <div className="login">
                    <h2>Login</h2>
                    <form className="form" onSubmit={handleLoginSubmit}>
                        <input
                            type="email"
                            placeholder="Enter email"
                            className="form-input"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Enter password"
                            className="form-input"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        />
                        <button type="submit">Login</button>
                        <p>Don't have an account?</p>
                        <button type="button" onClick={() => setIsLoginMode(false)}>
                            Register
                        </button>
                    </form>
                </div>
            ) : (
                <div className="login">
                    <h2>Register</h2>
                    <form className="form" onSubmit={handleRegisterSubmit}>
                    <label htmlFor="fullname">Full Name</label>
                        <input
                            type="text"
                            id="fullname"
                            placeholder="Enter your full name"
                            className="form-input"
                            value={registerData.fullname}
                            onChange={(e) => setRegisterData({ ...registerData, fullname: e.target.value })}
                            required
                            autoComplete="name"
                        />
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="form-input"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            required
                            autoComplete="email"
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="Set a password"
                            className="form-input"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            required
                            minLength="6"
                        />
                        <button type="submit">Register</button>
                        <p>Already have an account?</p>
                        <button type="button" onClick={() => setIsLoginMode(true)}>
                            Login
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Auth;