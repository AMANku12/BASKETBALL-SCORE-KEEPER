import React, { useContext, useState } from 'react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'


const Auth = () => {

    const navigate = useNavigate();

    const [wanttologin,setWantToLogin] = useState(true);
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""    
    })
    const [registerData, setRegisterData] = useState({
        fullname: "",
        email: "",
        password: ""
    })

    const handleLoginSubmit = async(e)=>{
        e.preventDefault();
        try {
            const response =await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, loginData);
            // console.log(response.data);
            if(response.data.message==="Success"){
                localStorage.setItem("user",JSON.stringify(response.data.user));
                localStorage.setItem("token",response.data.token);
                alert("Login Complete");
                navigate("/")

            }else if(response.data.message==="User not found"){
                alert("User not found");
            }else if(response.data.message==="Incorrect Passoword"){
                alert("Incorrect Password");
            }
        } catch (error) {
            console.log("error occurred in registeration:", error);
            alert("ERROR");
        }
    }

    const handleRegisterSubmit = async(e)=>{
        e.preventDefault();
        try {
            const response =await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, registerData);
            console.log(response.data);
            if(response.data.message==="Success"){
                localStorage.setItem("user",JSON.stringify(response.data.user));
                localStorage.setItem("token",response.data.token);
                alert("Registeration Complete");
                navigate("/")
            }else if(response.data.message==="existing user"){
                alert("User allready exists");
            }
        } catch (error) {
            console.log("error occurred in registeration:", error);
            alert("ERROR");
        }
    }

  return (
    <div>
      {wanttologin ? (
        <div className="login">
            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit}>
                <input type="email" placeholder='Enter emailid' onChange={(e) => setLoginData({...loginData, email: e.target.value})}/>
                <input type="password" placeholder='Enter the password' onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
                <button type='submit'>Submit</button>
                <p>Don't have an account?</p>
                <button onClick={() => {setWantToLogin(false)}}>Register</button>
            </form>
        </div>
      ):(
        <div className="login">
            <h2>Register</h2>
            <form onSubmit={handleRegisterSubmit}>
                <input type="text" placeholder='Enter your name' onChange={(e)=> setRegisterData({...registerData, fullname: e.target.value})} />
                <input type="email" placeholder='Enter emailid' onChange={(e)=> setRegisterData({...registerData, email: e.target.value})}/>
                <input type="password" placeholder='Set a password' onChange={(e)=> setRegisterData({...registerData, password: e.target.value})}/>
                <button type='submit'>Submit</button>
                <p>Already have an account?</p>
                <button onClick={() => {setWantToLogin(true)}}>Login</button>
            </form>
        </div>
      )}
    </div>
    )
}

export default Auth
