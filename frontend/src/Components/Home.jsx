import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    const navigate = useNavigate();
    // const token = localStorage.getItem('token');
    const [alertMessage, setAlertMessage] = useState('');
    const storeduser = JSON.parse(localStorage.getItem("user"));

    const showAlert = useCallback((message) => {
        setAlertMessage(message);
        setTimeout(() => setAlertMessage(''), 3000);
    }, []);

    const handleCreateMatchClick = () => {
        if (storeduser) {
            navigate('/createroom');
        } else {
            showAlert('Please log in to create a match.');
        }
    };

    const handleWatchMatchClick = () => {
        navigate('/joinroom');
    };

    return (
        <div className="home-container">
            <h1>Welcome to ScoreSlam</h1>
            {alertMessage && <div className="custom-alert">{alertMessage}</div>}
            <div className="action-buttons">
                <button onClick={handleCreateMatchClick}>Create Match</button>
                <button onClick={handleWatchMatchClick}>Watch Match</button>
            </div>
        </div>
    );
};

export default Home;