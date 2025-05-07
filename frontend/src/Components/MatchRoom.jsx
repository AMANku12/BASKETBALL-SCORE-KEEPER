import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import socket from "../socket"

const MatchRoom = () => {
    const location = useLocation();
    const data = location.state;
    console.log(data);
    const [score, setScore] = useState({
        team1: data.roomData.teams.team1.score, team2: data.roomData.teams.team1.score
    });
    const [messages, setMessages] = useState(data.roomData.messages);
    const [messageInput, setMessageInput] = useState(''); 

    useEffect(() => {
        socket.on("scores_upadated", (data) => {
            console.log("scores updated", data);
            
            setScore(prev => ({
                team1: data.team1.score ?? prev.team1, // Use previous value if null
                team2: data.team2.score ?? prev.team2
            }));
        });

        socket.on("message_sent", (payload)=>{
            console.log("new message", payload.messages);

            setMessages(prevMessages => [...prevMessages, payload])
        })
    
        // Cleanup listener on unmount
        return () => {
            socket.off("scores_upadated");
            socket.off("message_sent");
        }
    }, []); // Empty array = runs once on mount

    const handleScoreChange = (team, change) => {
        console.log("update score clicked:", team, change);
        const scoreData = {
            roomKey: data.roomData.roomKey,
            team: team,
            newScore: score[team] + change,
            DBroomId: data.roomData._id
        }
        console.log(data.roomData._id);
        socket.emit("update_scores", scoreData);
    }

    const handleSendMessage = ()=>{
        if(messageInput.trim()!==""){
          const messageData = {
            username: data.isowner ? data.roomData.ownername : data.guestname,
            message: messageInput,
            roomDBid: data.roomData._id,
          }
          socket.emit("send_message", messageData);
          setMessageInput('');
        }
      } 

    return (
        <div>
            <h1>Welcome To The Match Room</h1>
            <h4>RoomId: {data.roomData.roomKey}</h4>
            <p>Owner: {data.roomData.ownername}</p>
            <p>You have joined as: {data.isowner ? data.roomData.ownername  : data.guestname }
                <span> ({data.isowner ? 'Owner' : 'Guest' })</span>
            </p>

            <div className="scoreboard">
                <h4>Scoreboard</h4>
                <div className="score-display">
                <div className="team-score">
                    <div className="team-name">{data.roomData.teams.team1.teamName}</div>
                    <div className="score-value">{score.team1}</div>
                </div>
                <div className="score-divider">:</div>
                <div className="team-score">
                    <div className="team-name">{data.roomData.teams.team2.teamName}</div>
                    <div className="score-value">{score.team2}</div>
                </div>
                </div>
            </div>

            {data.isowner && (
            <div className="score-controls">
              <div className="team-controls">
                <div className="control-buttons">
                  <button className="increment" onClick={() => handleScoreChange("team1", 1)}>+1 Team A</button>
                  <button className="decrement" onClick={() => handleScoreChange("team1", -1)}>-1 Team A</button>
                </div>
              </div>
              <div className="team-controls">
                <div className="control-buttons">
                  <button className="increment" onClick={() => handleScoreChange("team2", 1)}>+1 Team B</button>
                  <button className="decrement" onClick={() => handleScoreChange("team2", -1)}>-1 Team B</button>
                </div>
              </div>
            </div>
            )}
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
    )
}

export default MatchRoom
