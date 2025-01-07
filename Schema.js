const Joi = require('joi');
const transaction = require('./models/transaction');

////  wallet schema ////
module.exports.walletSchema =  Joi.object({
    balance : Joi.number().min(0).required(),
    transactions: Joi .array().items(
        Joi.object({
            amount:Joi.number().required(),
            type:Joi.string().valid('Credit','Debit').required(),
            description:Joi.string().required(),
            date:Joi.date().required(),
        })
    )
});


//// patient schema ////
module.exports.patientSchema = Joi.object({
    username: Joi.string().required,
    email: Joi.string().required(),
    walletbalance: Joi.number().required(),
});


///// expenses Schema ////
module.exports.expenseSchema = Joi.object({
    amount:Joi.number().required(),
    category:Joi.string().valid('consultation','Medicine','Tests','Other').required(),
    date:Joi.date().required(),
});


//// Doctor Schema /////
module.exports.doctorSchema = Joi.object({
    name:Joi.string().required(),
    consultationPrice: Joi.number().required(),
    gender: Joi.string().valid('male','female').required(),
    specialisation : Joi.string().required(),
    description: Joi.string().required(),
    address : Joi.string().required(),
    timings: Joi.string
});


//// appointment Schema //////
module.exports.appointmentSchema = Joi.object({
    discount_applied: Joi.boolean().required(),
    discount : Joi.number().required(),
    date_of_appointment: Joi.date().required(),
});




