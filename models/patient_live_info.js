const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const LivePatient = new Schema({
    Temp:{
        type: String,
        required : true,
    },
    Heart_Beat:{
        type: Number,
        required : true,
    }
});

const livePatient = mongoose.model("LivePatient" , LivePatient);
module.exports = livePatient;