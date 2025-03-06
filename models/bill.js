const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const billSchema = new Schema({
    patient_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true, 
    },
    fileUrl: {
        type: String,
        required: true,
    },
    category: {
        type: [String],
        enum: ["Consultation", "Surgery", "Medicine", "Tests"],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0, 
    },
    date: {
        type: Date,
        default: Date.now, 
    },
});

module.exports = mongoose.model("Bill", billSchema);
