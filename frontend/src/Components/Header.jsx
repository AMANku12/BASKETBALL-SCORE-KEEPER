import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'

const Header = () => {

//   const {username, logout}= useContext(UserContext);
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
  const handlelogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUsername("");
  }

  return (
    <div className='header'>
      <h2>⚽MatchHub</h2>
      {
        username ? (
          <div className="username">
            <h3>{username}</h3>
            <button onClick={handlelogout}>Logout</button>
          </div>
        ):(
          <div className="login">
            <button id='loginbtn' onClick={handleLogin}>Login</button>
          </div>
        )
      }
      
    </div>
  )
}

export default Header
