const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
    },
    walletbalance:{
       type: Number,
       min:[0,"wallet balance can not be -ve"],
       required:true,   
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
    }
})

module.exports = mongoose.model("Patient",patientSchema);
