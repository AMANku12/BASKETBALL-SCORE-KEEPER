import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import socket from '../socket'; //  Use the hook
import '../styles/MatchRoom.css';

const MatchRoom = () => {
    const location = useLocation();
    const data = location.state;
    console.log(data);
    const [score, setScore] = useState({
        team1: data.roomData.teams.team1.score,
        team2: data.roomData.teams.team2.score,
    });
    const [messages, setMessages] = useState(data.roomData.messages);
    const [messageInput, setMessageInput] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const handleScoresUpdated = (updatedData) => {
            console.log('scores updated', updatedData);
            setScore((prevScore) => ({
                team1: updatedData.team1?.score ?? prevScore.team1,
                team2: updatedData.team2?.score ?? prevScore.team2,
            }));
        };

        const handleError = (errorData) => {
            console.error('Error updating scores:', errorData.message);
            setError(errorData.message || 'An error occurred while updating scores.');
        };

        const handleMessageSent = (payload) => {
            console.log('new message', payload.messages);
            setMessages((prevMessages) => [...prevMessages, payload]);
        };

        socket.on('scores_updated', handleScoresUpdated);
        socket.on('error', handleError);
        socket.on('message_sent', handleMessageSent);

        return () => {
            socket.off('scores_updated', handleScoresUpdated);
            socket.off('error', handleError);
            socket.off('message_sent', handleMessageSent);
        };
    }, []);

    const handleScoreChange = (team, change) => {
        console.log('update score clicked:', team, change);
        const token = localStorage.getItem('token');
        if(!token) {
            setError("No token provided. Please log in to update scores.");
            return;
        }
        const scoreData = {
            roomKey: data.roomData.roomKey,
            team: team,
            newScore: score[team] + change,
            DBroomId: data.roomData._id,
            token: token,
        };
        socket.emit('update_scores', scoreData );
    };

    const handleSendMessage = () => {
        if (messageInput.trim() !== '') {
            const messageData = {
                username: data.isOwner ? data.roomData.ownername : data.guestname,
                message: messageInput,
                roomDBid: data.roomData._id,
            };
            socket.emit('send_message', messageData);
            setMessageInput('');
        }
    };

    return (
        <div className="match-room-container">
            <h1>Welcome To The Match Room</h1>
             {error && <div className="error">{error}</div>}
            <div className="match-info">
                <p>RoomId: {data.roomData.roomKey}</p>
                <p>Owner: {data.roomData.ownername}</p>
                <p>Match Date: {data.roomData.matchdate.slice(0, 10)}</p>
                <p>Match Time: {data.roomData.matchtimings}</p>
                <p>
                    You have joined as: {data.isOwner ? data.roomData.ownername : data.guestname}
                    <span> ({data.isOwner ? 'Owner' : 'Guest'})</span>
                </p>
            </div>
            <div className="scoreboard">
    <h4>Live Scoreboard</h4>
    <div className="score-display">
        <div className="team-score">
            <div className="team-name" id='teama'>{data.roomData.teams.team1.teamName}</div>
            <div className="score-value">{score.team1}</div>
        </div>
        
        <div className="score-divider">:</div>
        
        <div className="team-score">
            <div className="team-name" id='teamb'>{data.roomData.teams.team2.teamName}</div>
            <div className="score-value">{score.team2}</div>
        </div>
    </div>
    
    {data.isOwner && (
        <div className="score-controls">
            <div className="team-controls">
                <div className="control-buttons">
                    <button className="increment" onClick={() => handleScoreChange('team1', 1)}>
                        +1
                    </button>
                    <button className="increment" onClick={() => handleScoreChange('team1', 2)}>
                        +2
                    </button>
                    <button className="increment" onClick={() => handleScoreChange('team1', 3)}>
                        +3
                    </button>
                </div>
            </div>
            
            <div className="team-controls">
                <div className="control-buttons">
                    <button className="decrement" onClick={() => handleScoreChange('team2', 1)}>
                        +1
                    </button>
                    <button className="decrement" onClick={() => handleScoreChange('team2', 2)}>
                        +2
                    </button>
                    <button className="decrement" onClick={() => handleScoreChange('team2', 3)}>
                        +3
                    </button>
                </div>
            </div>
        </div>
    )}
</div>
            <div className="chat-container">
                <h4>Chat</h4>
                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <p key={idx} className="message">
                            <span className="message-username">{msg.username}:</span>
                            <span className="message-text">{msg.message}</span>
                        </p>
                    ))}
                </div>
                <div className="chat-input">
                    <input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Write a comment..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default MatchRoom;
