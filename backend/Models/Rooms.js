const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomKey:{
        type: String,
        required: true,
        unique: true,
    },
    ownername:{
        type:String,
        required: true
    },
    teams:{
        type:Object,
        required: true
    },
    matchdate:{
        type:Date,
        required: true
    },
    matchtimings:{
        type:String,
        required: true
    },
    users:{
        type: Array,
    },
    messages:{
        type: Array
    }
})

const Rooms = mongoose.model("Rooms", roomSchema);
module.exports = Rooms;