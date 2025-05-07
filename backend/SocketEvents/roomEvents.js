const jwt = require("jsonwebtoken");
const Rooms = require("../Models/Rooms.js")

module.exports = (socket, io)=>{
    socket.on("create_room", async(data)=>{
        const token = data.token;
        // console.log(roomData)

        if(!token){
            socket.emit("error", {message:"No token provided"});
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            console.log("Authorized user:", decoded);
            const newRoom = await Rooms.create({
                roomKey: data.roomData.roomKey,
                ownername: data.roomData.fullname,
                teams:{
                    team1: {teamName: data.roomData.team1, score:0},
                    team2: {teamName: data.roomData.team2, score:0}
                },
                matchdate: data.roomData.date,
                matchtimings: data.roomData.time,
                users: [data.roomData.fullname]
            })
            console.log("new room created:", newRoom);
            console.log("new user", newRoom.users);
            socket.join(data.roomData.roomKey)
            socket.emit("room_created", newRoom);
        } catch (error) {
            console.error("Error creating room:", error);
            socket.emit("error", {message: error.message});
        }
    })

    socket.on("update_scores", async(scoreData)=>{
        try {
            const updateQuery = {}
            updateQuery[`teams.${scoreData.team}.score`] = scoreData.newScore;
            console.log(updateQuery);
            const updatedRoom = await Rooms.findByIdAndUpdate(scoreData.DBroomId, 
                {$set: updateQuery},
                {new: true}
            );
            if(updatedRoom){
                console.log(updatedRoom.teams);
                io.to(scoreData.roomKey).emit("scores_upadated", updatedRoom.teams);
            }else{
                console.log(scoreData.DBroomId, "-no such room id in DB");
            }
        } catch (error) {
            console.error("Error updating scores:", error);
            socket.emit("error", {message: error.message});
        }
    })

    socket.on("join_room", async(data)=>{
        const room = await Rooms.findOne({roomKey: data.roomKey});
        console.log("new join room request from",socket.id);
        if(!room){
            socket.emit("error", {message:"Wrong room key"});
            return ;
        }
        try {
            room.users.push(data.fullname);
            await room.save();
            console.log("new user added", room.users);
            socket.join(data.roomKey);
            socket.emit("joined_room", room);
        } catch (error) {
            console.log("error in joining the room:",error);
            socket.emit("error", {message: error.message});
        }
    })

    socket.on("send_message", async(data)=>{
        try {
            const room =await Rooms.findById(data.roomDBid);
            room.messages.push({ username: data.username, message: data.message});
            await room.save();
            console.log("new message:",room.messages);
            io.to(room.roomKey).emit("message_sent", {username:data.username, message:data.message});
        } catch (error) {
            console.log("error in sending message:",error);
            socket.emit("error", {message: error.message});
        }
    })
}