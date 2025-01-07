const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
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
    amount:{
        type:Number,
        required:true,
        min:0,
    },
    discount:{
        type:Number,
        required:true,
        min:0,
    },
    final_amount:{
        type:Number,
        required:true,
    },    
},{
    timestamps:true,
});


transactionSchema.pre('save',function(next){
    this.final_amount = this.amount - (this.amount * this.discount);
    next();
})

module.exports = mongoose.model("Transaction",transactionSchema);