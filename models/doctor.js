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
    description:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    timings:{
        type:{
            days:{
                type:[String],
                default:['Monday','Tuesday'],
                required:true,
            },
            hours:{
                start:{
                    type:String,
                    required:true,
                },
                end:{
                    type:String,
                    required:true,
                }
            }
        },
        required:true,
    },
})

module.exports = mongosee.model("Doctor",doctorSchema);