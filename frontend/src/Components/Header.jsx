import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
    const [username, setUsername] = useState("");
    const userData = JSON.parse(localStorage.getItem("user"));

    useEffect(()=>{
        if(userData && userData.fullname){
            setUsername(userData.fullname);
        }
    }, [userData]);

    const navigate = useNavigate()
    const handleLogin = () => {
        navigate('/auth');
    }
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUsername("");
    }

    const handleTitleClick = () => {
        navigate('/');
    };

    return (
        <div className="header">
            <h2 onClick={handleTitleClick}>ScoreSlam</h2>
            {username ? (
                <div className="username">
                    <h3>{username}</h3>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div className="login">
                    <button id="loginbtn" onClick={handleLogin}>
                        Login
                    </button>
                </div>
            )}
        </div>
    );
};

export default Header;