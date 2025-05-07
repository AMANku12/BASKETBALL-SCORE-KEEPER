import {io} from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_URL; 


const token = localStorage.getItem("token"); 
console.log("token", token);

const socket = io(URL, {
    autoConnect:true,
});

socket.on("connect",()=>{
    console.log("Connected to server with socket ID:", socket.id); 

})

export default socket;