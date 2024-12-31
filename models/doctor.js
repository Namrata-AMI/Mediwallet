const mongosee = require("mongoose");
const Schema = mongosee.Schema;

const doctorSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    consultationPrice:{
        type:Number,
        required:true,
        min:[0,'Consultation fee can not be -ve'],
    },
    gender:{
        type:String,
        genre:['male','female'],
        required:true,
    },
    specialisation:{
        type:String,
        required:true,
    },
})

module.exports = mongosee.model("Doctor",doctorSchema);