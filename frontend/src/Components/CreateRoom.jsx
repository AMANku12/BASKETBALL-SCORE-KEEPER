import React, { useEffect, useState } from 'react'
import socket from "../socket";
import { useNavigate } from 'react-router-dom'

const CreateRoom = () => {

    const navigate = useNavigate();

    const [roomData, setRoomData] =useState({
        team1: "",
        team2: "",
        date: "",
        time: "",
        roomKey: "",
        isowner: true,
        fullname: JSON.parse(localStorage.getItem("user")).fullname || ""
    })

    const handleChange = (e)=>{
        setRoomData({...roomData, [e.target.name]: e.target.value})
    }

    useEffect(()=>{
      socket.on("error", (data)=>{
        console.log("error in creating room:",data.message);
        alert("Error in creating room");
      })
      socket.on("room_created", (data)=>{
        console.log("room created:", data); 
        navigate("/matchroom", { state: { roomData: data, isowner: true  } });
      })
    },[])

    const handleSubmit = (e)=>{
        e.preventDefault();
        // console.log(roomData);
        const token = localStorage.getItem("token");
        socket.emit("create_room", {roomData,token});
    }


  return (
    <div>
      <h1>Create a New Room</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='Team 1 name' name='team1' value={roomData.team1} onChange={handleChange}/>
        <input type="text" placeholder='Team 2 name' name='team2' value={roomData.team2} onChange={handleChange}/>
        <input type="date" placeholder='Match Date' name='date' value={roomData.date} onChange={handleChange}/>
        <input type="time" placeholder='Match Time' name='time' value={roomData.time} onChange={handleChange}/>
        <input type="text" placeholder='Room key' name='roomKey' value={roomData.roomKey} onChange={handleChange}/>
        <button type="submit">Create Room</button>
      </form>
    </div>
  )
}

export default CreateRoom
