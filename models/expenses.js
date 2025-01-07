const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    patient_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient',
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        enum:['consultation','Medicine','Tests','Other'],
        required:true,
    },
    date:{
        type:Date,
        default:Date.now(),
    },
})

module.exports = mongoose.model("Expense",expenseSchema);