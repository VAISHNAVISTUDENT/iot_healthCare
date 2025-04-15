const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PatientScheme = new Schema({
    Name:{
        type: String,
        required : true,
    },
    Age:{
        type: Number,
        required : true,
    },
    image: {
        type: String,
        required:true,

        },
    Prescription:[
        {
            type:String,
            Dose_Time:Number, // 0->morning , 1->afternoon , 2->evening
        }
    ]
});

const patientScheme = mongoose.model("PatientScheme" , PatientScheme);
module.exports = patientScheme;