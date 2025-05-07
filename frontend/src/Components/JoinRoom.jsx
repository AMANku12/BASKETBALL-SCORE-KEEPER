import React, { useEffect, useState } from 'react'
import socket from "../socket"
import { useNavigate } from 'react-router-dom';

const JoinRoom = () => {
    const [fullname, setFullname] = useState("");
    const [roomKey, setRoomKey] = useState("");
    const navigate = useNavigate();

    useEffect(()=>{
        socket.on("joined_room", (payload)=>{
            console.log("joined room",payload);
            console.log("guestname",fullname);
            navigate("/matchroom", {state:{roomData: payload, guestname:fullname, isowner:false}});
        })

        return ()=>{
            socket.off("joined_room");
        }
    },[fullname,navigate]);

    const handleSubmit = (e)=>{
        e.preventDefault();
        const guestdata = { fullname: fullname, roomKey : roomKey}
        console.log("request for joining room", guestdata);
        socket.emit("join_room",guestdata );
    }

  return (
    <div>
        <h1>Please Enter the following details to enter a room</h1>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder='Enter your name...' value={fullname} name="fullname" onChange={(e)=>{setFullname(e.target.value)}}/>
            <input type="text" placeholder='Enter the roomkey...' value={roomKey} name='roomKey' onChange={(e)=>{setRoomKey(e.target.value)}}/>
            <button type='submit'>Join Room</button>
        </form>
    </div>
    
  )
}

export default JoinRoom
