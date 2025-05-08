const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new mongoose.Schema({
    roomKey:{
        type: String,
        required: true,
        unique: true,
        index: true // for faster lookups
    },
    ownername:{
        type:String,
        required: true
    },
    ownerId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true  
    },
    teams:{
        type:Object,
        required: true
    },
    fouls: {
        type: Object,
        default: { team1: 0, team2: 0 }
    },
    timeouts: {
        type: Object,
        default: { team1: 0, team2: 0 }
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
    },
    quarter: {
        type: Number,
        default: 1,
        max: 4
    },
    timer: {
        type: Number, // Timer in seconds
    }
})

const Rooms = mongoose.model("Rooms", roomSchema);
module.exports = Rooms;