const mongoose = require("mongoose");
const transaction = require("./transaction");
const Schema = mongoose.Schema;

const walletSchema = new Schema({
    patient_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient',
    },
    balance:{
        type:Number,
        default:0,
    },
    transactions:[
        {amount:Number,
            type:{ 
                type:String, 
                enum:['Debit','Credit'],
            },
                description:String,
                date:{
                    type:Date,
                    default:Date.now(),
                }
            }
        ]
})

module.exports = mongoose.model("Wallet",walletSchema);