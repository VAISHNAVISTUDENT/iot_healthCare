const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
    Name: {
        type: String,
        required: true,
    },
    Age: {
        type: Number,
        required: true,
    },
    Gender: {
        type: Number, // 0: Male, 1: Female, 2: Other
    },
    image: {
        type: String,
        required: true,
    },
    Contact: {
        Phone: String,
        Email: String,
        Address: String,
    },
    EmergencyContact: {
        Name: String,
        Relationship: String,
        Phone: String,
    },
    BloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    Allergies: [String],
    MedicalHistory: [
        {
            condition: String,
            diagnosisDate: Date,
            notes: String,
        }
    ],
    CurrentCondition: {
        notes: String,
        critical: {
            type: Boolean, // 0-> not critical 1->critical
            default: false,
        },
    },
    Prescription: [
        {
            medicine: String,
            Dose_Time: Number, // 0 -> Morning, 1 -> Afternoon, 2 -> Evening
            dosage: String,
            duration: String, // e.g., "5 days"
        }
    ],
    AssignedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    AdmissionDate: {
        type: Date,
    },
    DischargeDate: {
        type: Date,
    },
    RoomNumber: {
        type: String,
    },
    Status: {
        type: String,
        enum: ['Admitted', 'Discharged', 'Under Observation', 'ICU'],
        default: 'Admitted'
    },
}, { timestamps: true });

const PatientModel = mongoose.model("Patient", PatientSchema);
module.exports = PatientModel;