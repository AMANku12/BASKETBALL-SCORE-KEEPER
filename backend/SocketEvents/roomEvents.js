const jwt = require("jsonwebtoken");
const Rooms = require("../Models/Rooms.js")
const cookie = require("cookie");

module.exports = (socket, io)=>{
    socket.on("create_room", async(data)=>{
        // const token = data.token;
        // console.log(roomData)
        const cookies = socket.handshake.headers.cookie;
        const parsedCookies = cookie.parse(cookies || "");
        const token = parsedCookies.token;
        console.log("raw cookie" , cookies)
        console.log("token", token);

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
                ownerId: decoded.userId,
                teams:{
                    team1: {teamName: data.roomData.team1, score:0},
                    team2: {teamName: data.roomData.team2, score:0}
                },
                fouls:{team1:0, team2:0},
                timeouts:{team1:0, team2:0},
                quarter:1,
                matchdate: data.roomData.date,
                timer:0,
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
        console.log("update score request", scoreData);
        const cookies = socket.handshake.headers.cookie;
        const parsedCookies = cookie.parse(cookies || "");
        const token = parsedCookies.token;

            const updateQuery = {}
            if(!token){
                socket.emit("error", {message:"No token provided"});
                return;
            }
            try{
                const decoded = jwt.verify(token, process.env.JWT_KEY);

                updateQuery[`teams.${scoreData.team}.score`] = scoreData.newScore;
                console.log("updateQuery", updateQuery);
                const updatedRoom = await Rooms.findByIdAndUpdate(scoreData.DBroomId, 
                    {$set: updateQuery},
                    {new: true}
                );
                if(updatedRoom){
                    console.log(updatedRoom.teams);
                    io.to(scoreData.roomKey).emit("scores_updated", updatedRoom.teams);
                }else{
                    console.log(scoreData.DBroomId, "-no such room id in DB");
                }
        } catch (error) {
            console.error("Error updating scores:", error);
            socket.emit("error", {message: error.message});
        }
    })

    socket.on("join_room", async(data)=>{
        const cookies = socket.handshake.headers.cookie;
        const parsedCookies = cookie.parse(cookies || "");
        const token = parsedCookies.token;

        // console.log("token, roomkey", token, data.guestdata.roomKey);

        const room = await Rooms.findOne({roomKey: data.guestdata.roomKey}).lean(); // .lean() to get a plain JS object instead of Mongoose document
            console.log("new join room request from",socket.id);
            console.log("room data", room);
            if(!room){
                socket.emit("error", {message:"Wrong room key"});
                return ;
            }
        if(!token){
            try {
                await Rooms.findByIdAndUpdate(
                    room._id,
                    { $addToSet: { users: data.guestdata.fullname } },
                    { new: true }
                );
                console.log("new user added", room.users);
                socket.join(data.guestdata.roomKey);
                socket.emit("joined_room", {room:room, isOwner:false});
            } catch (error) {
                console.log("error in joining the room:",error);
                socket.emit("error", {message: error.message});
            }
        }else{
            try {
                const decoded = jwt.verify(token, process.env.JWT_KEY);

                if(room.ownerId.toString() === decoded.userId.toString()){
                    console.log("owner joined the room", decoded.userId);
                    socket.join(data.guestdata.roomKey);
                    socket.emit("joined_room", {room:room, isOwner:true});
                } else {
                    await Rooms.findByIdAndUpdate(
                        room._id,
                        { $addToSet: { users: data.guestdata.fullname } },
                        { new: true }
                    );
                    console.log("new user added", room.users);
                    socket.join(data.guestdata.roomKey);
                    socket.emit("joined_room", {room:room, isOwner:false});
                }
            } catch (error) {
                
                console.log("error in joining the room:",error);
                socket.emit("error", {message: error.message});
            }
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