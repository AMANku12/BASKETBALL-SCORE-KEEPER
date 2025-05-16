import {io} from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_URL; 

const socket = io(URL, {
    autoConnect:false,
    withCredentials:true
});

socket.on("connect",()=>{
    console.log("Connected to server with socket ID:", socket.id); 

})

socket.on("connect_error", (err) => {
    console.error("Connection error:", err);
    // Handle connection errors more robustly (e.g., display a message to the user, retry connection)
});

socket.on("disconnect", ()=>{
    console.log(socket.id, "DISCONNECTED");
})


export default socket; 