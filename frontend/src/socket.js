import {io} from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_URL; 

const socket = io(URL, {
    autoConnect:true,
});

socket.on("connect",()=>{
    console.log("Connected to server with socket ID:", socket.id); 

})

socket.on("connect_error", (err) => {
    console.error("Connection error:", err);
    // Handle connection errors more robustly (e.g., display a message to the user, retry connection)
});



export default socket;