const mongoose = require("mongoose");
const initData = require("./data.js");
const doctor = require("../models/doctor.js");
const patient = require("../models/patient.js");
const appointment = require("../models/appointment.js");
const dburl = "mongodb://127.0.0.1:27017/Mediwallet";

main()
.then((res)=>{
    console.log(res);
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(dburl);
}



const initDB = async()=>{
    await doctor.deleteMany({});
    initData.doctors = initData.doctors.map((obj)=>({
        ...obj,
        owner:'6606423fd4b7ebd8ad6efbc1',
    }));
    await doctor.insertMany(initData.doctors);
    console.log("data was initialised");
}

const initpatient = async()=>{
    await patient.deleteMany({});
    initData.patients = initData.patients.map((obj)=>({
        ...obj,
        owner:'6606423fd4b7ebd8ad6efbc2',
    }));
    await patient.insertMany(initData.patients);
    console.log("data was initialised");
}

const initappoint = async()=>{
    await appointment.deleteMany({});
    initData.appointments = initData.appointments.map((obj)=>({
        ...obj,
        owner:'6606423fd4b7ebd8ad6efbc2',
    }));
    await appointment.insertMany(initData.appointments);
    console.log("data was initialised");
}

initappoint();

initpatient();

initDB();
console.log(initData);