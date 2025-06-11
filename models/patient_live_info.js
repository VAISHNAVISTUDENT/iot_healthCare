const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LivePatientSchema = new Schema({
    selfId: {
        type:Number
    },
    pulse: {
        type: Number,
    },
    temp: {
        type: Number,
    },
    o2: {
        type: Number,
    },
    co2: {
        type: Number,
    },
    smoke: {
        type: Number,
    },
    voc: {
        type: Number,
    },
    recordedAt: {
        type: Date,
        default: Date.now,
    }
});

const LivePatient = mongoose.model("LivePatient", LivePatientSchema);
module.exports = LivePatient;
