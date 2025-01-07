const mongosee = require("mongoose");
const Schema = mongosee.Schema;

const appointmentSchema = new Schema({
    patient_Id:{
        type:mongosee.Schema.Types.ObjectId,
        ref:'Patient',
        required:true,
    },
    doctor_Id:{
        type:mongosee.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true,
    },
    discount_applied:{
        type:Boolean,
        default:false,
    },
    discount:{
        type:Number,
        min:0,
    },
    date_of_appointment:{
        type:Date,
        default:Date.now,
    },
    transaction_id:{
        type:String,
        ref:'transaction',
    },
})

module.exports = mongosee.model("Appointment",appointmentSchema);