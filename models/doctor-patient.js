const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorpatientSchema = new Schema({
    rel_id:{
       type:String,
       required:true, 
    },
    patient_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'patient',
        required:true,
    },
    doctor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'doctor',
        required:true,
    },
    first_time:{
        type:Boolean,
        default:true,
    }
})

module.exports  = mongoose.model("Doctor-Patient",doctorpatientSchema);