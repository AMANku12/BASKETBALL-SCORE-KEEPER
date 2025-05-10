import React, { useState, useEffect } from 'react';
import socket from '../socket';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateRoom.css';

const CreateRoom = () => {
    const navigate = useNavigate();
    const [roomData, setRoomData] = useState({
        team1: '',
        team2: '',
        date: '',
        time: '',
        roomKey: '',
        isOwner: true,
        fullname: JSON.parse(localStorage.getItem('user'))?.fullname || '', // Optional chaining
    });
    const [formError, setFormError] = useState(''); // For form-level errors

    useEffect(() => {
        const handleSocketError = (data) => {
            console.error('Error creating room:', data.message);
            setFormError(data.message || 'Error creating room.');
        };

        const handleRoomCreated = (data) => {
            console.log('Room created:', data);
            navigate('/matchroom', { state: { roomData: data, isOwner: true } });
        };

        socket.on('error', handleSocketError);
        socket.on('room_created', handleRoomCreated);

        return () => {
            socket.off('error', handleSocketError);
            socket.off('room_created', handleRoomCreated);
        };
    }, [navigate]);

    const handleChange = (e) => {
        setRoomData({ ...roomData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!roomData.team1 || !roomData.team2 || !roomData.date || !roomData.time || !roomData.roomKey) {
            setFormError('All fields are required.');
            return false;
        }
        setFormError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // const token = localStorage.getItem('token');
            socket.emit('create_room', { roomData});
        }
    };

    return (
        <div className="create-room-container">
            <h1>Create a New Room</h1>
            {formError && <div className="form-error">{formError}</div>}
            <div className="create-room-form">
                <form onSubmit={handleSubmit}>
                    <div className="input-group input-team1">
                        <input
                            type="text"
                            placeholder='Team 1 name'
                            name='team1'
                            value={roomData.team1}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group input-team2">
                        <input
                            type="text"
                            placeholder='Team 2 name'
                            name='team2'
                            value={roomData.team2}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group input-date">
                        <input
                            type="date"
                            placeholder='Match Date'
                            name='date'
                            value={roomData.date}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group input-time">
                        <input
                            type="time"
                            placeholder='Match Time'
                            name='time'
                            value={roomData.time}
                            onChange={handleChange}
                            
                        />
                    </div>
                    <div className="input-group input-key">
                        <input
                            type="text"
                            placeholder='Room key'
                            name='roomKey'
                            value={roomData.roomKey}
                            onChange={handleChange}
                            minLength={6}
                        />
                    </div>
                    <button type="submit">Create Room</button>
                </form>
            </div>
        </div>
    );
};

export default CreateRoom;
