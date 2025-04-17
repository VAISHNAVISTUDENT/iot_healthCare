const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LivePatientSchema = new Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    Temp: {
        type: Number, // better as a Number for comparisons
        required: true,
    },
    Heart_Beat: {
        type: Number,
        required: true,
    },
    SpO2: {
        type: Number,
    },
    RespirationRate: {
        type: Number,
    },
    BloodPressure: {
        systolic: Number,
        diastolic: Number,
    },
    Status: {
        type: String,
        enum: ["Normal", "Critical", "Alert"],
        default: "Normal"
    },
    recordedAt: {
        type: Date,
        default: Date.now,
    }
});

const LivePatient = mongoose.model("LivePatient", LivePatientSchema);
module.exports = LivePatient;
