const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const http = require('http');
const {Server} = require("socket.io");
const roomEvents = require("./SocketEvents/roomEvents.js")

const AuthRouter = require("./Routes/auth.route.js");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB", err)
})

const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: "*",
    }
})

app.get("/", (req,res)=>{
    res.send("backend server is running");
})

app.use("/api/auth", AuthRouter);

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    roomEvents(socket, io);
});

server.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})