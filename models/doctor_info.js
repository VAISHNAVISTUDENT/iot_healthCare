const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
    Name: {
        type: String,
        required: true,
    },
    Gender: {
        type: Number, // 0: Male, 1: Female, 2: Other
    },
    Age: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
    },
    Contact: {
        Phone: String,
        Email: String,
        Address: String,
    },
    Qualification: {
        type: String, // e.g., "MBBS, MD"
    },
    Specialization: {
        type: String, // e.g., "Cardiology", "Neurology", etc.
    },
    Experience: {
        type: Number, // in years
    },
    Availability: {
        days: [String], // e.g., ["Monday", "Wednesday", "Friday"]
        time: {
            start: String, // e.g., "09:00"
            end: String    // e.g., "17:00"
        }
    },
    Department: {
        type: String, // e.g., "Emergency", "Surgery", etc.
    },
    ConsultationFee: {
        type: Number,
    },
    Patients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient"
        }
    ],
    Status: {
        type: String,
        enum: ["Available", "On Leave", "In Surgery", "Unavailable"],
        default: "Available"
    }
}, { timestamps: true });

const DoctorModel = mongoose.model("Doctor", DoctorSchema);
module.exports = DoctorModel;