import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

  return (
    <div>
        <h1>Welcome to ScoreSlam</h1>
        <button onClick={()=>{token ? navigate("/createroom") : 
          alert("Please log in to create a match.")}}>Create Match</button>
        <button onClick={()=>{navigate("/joinroom")}}>Watch Match</button>    
    </div>
  )
}

export default Home
