import React, { useState, useEffect, useCallback } from 'react';
import socket from '../socket'; //  Use the hook
import { useNavigate } from 'react-router-dom';
import '../styles/JoinRoom.css';

const JoinRoom = () => {
    const [fullName, setFullName] = useState('');
    const [roomKey, setRoomKey] = useState('');
    const navigate = useNavigate();
    const [joinError, setJoinError] = useState('');
     const [isLoading, setIsLoading] = useState(false);

    //  *useCallback for Memoization*
    const handleJoinedRoom = useCallback(
        (payload) => {
            console.log('Joined room:', payload);
            setIsLoading(false);
            navigate('/matchroom', {
                state: {
                    roomData: payload.room,
                    guestname: fullName,
                    isOwner: payload.isOwner,
                },
            });
        },
        [navigate, fullName]
    );

    useEffect(() => {
        const handleJoinRoomError = (error) => {
            setJoinError(error.message || "Failed to join the room")
            setIsLoading(false);
        }
        socket.on('joined_room', handleJoinedRoom);
        socket.on("error", handleJoinRoomError)

        return () => {
            socket.off('joined_room', handleJoinedRoom);
            socket.off("error", handleJoinRoomError);
        };
    }, [handleJoinedRoom]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!fullName || !roomKey){
            setJoinError("Please enter your name and the room key");
            return;
        }
        setIsLoading(true);
        setJoinError('');
        const guestdata = { fullname: fullName, roomKey: roomKey };
        console.log('request for joining room', guestdata);
        const token = localStorage.getItem('token');
        socket.emit('join_room', { guestdata, token });
    };

    return (
        <div className="join-room-container">
            <h1>Please Enter the following details to enter a room</h1>
             {joinError && <div className="join-error">{joinError}</div>}
            <div className="join-room-form">
                <form onSubmit={handleSubmit}>
                    <div className="join-input-group join-input-name">
                        <input
                            type="text"
                            placeholder="Enter your name..."
                            value={fullName}
                            name="fullname"
                            onChange={(e) => {
                                setFullName(e.target.value);
                            }}
                            required
                        />
                    </div>
                    <div className="join-input-group join-input-key">
                        <input
                            type="text"
                            placeholder="Enter the room key..."
                            value={roomKey}
                            name="roomKey"
                            onChange={(e) => {
                                setRoomKey(e.target.value);
                            }}
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Joining...' :'Join Room'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default JoinRoom;
