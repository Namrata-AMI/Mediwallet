const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const flash = require("connect-flash");
const path = require("path");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const User = require("./models/user");
const dbUrl = "mongodb://127.0.0.1:27017/Mediwallet";
const Doctor = require("./models/doctor");
const Appointment = require("./models/appointment");
const Patient = require("./models/patient");
const pdf = require('html-pdf');



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
//app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const sessionOptions = {
    secret: "Mediwalletapp123",         // oour secret
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());                          


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));  

passport.serializeUser(User.serializeUser());          // to serialise the user session when on website//
passport.deserializeUser(User.deserializeUser());      // to deserialise the user session when not using website//


app.use((req,res,next)=>{
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
    res.locals.newUser = req.user;        // here we are storing the current user session //
    console.log(res.locals.newUser);
    next();
});

app.use(cors());


app.get("/app",(req,res)=>{
    return res.render("lists/index.ejs");
})


// signup route //
app.get("/app/signup",async(req,res)=>{
    return res.render("User/signup.ejs");
});

app.post("/app/signup",async(req,res)=>{
        let{username,email,walletbalance,password} = req.body;
        try{
            const newUser = new User ({username,email});
            const registeredUser = await User.register(newUser,password);
            if(walletbalance<300){
                req.flash("error","minimum balanace required to 300 rupees.");
            }
            const newPatient = new Patient({
                username,
                email,
                walletbalance:parseInt(walletbalance),   
                user:registeredUser._id,
            });
            await newPatient.save();

            console.log(registeredUser);
            req.login(registeredUser,(err)=>{
                if(err){
                return next(err);
            }
            req.flash("success","Welcome to Mediwallet !");
            return res.redirect("/app/appointment");
        });
    }
    catch(err){
        if(err === 11000){
            req.flash("error","User already exists choose another!!");
        }
        else{
            req.flash("error",err.message);
        }
        return res.redirect("/app/signup");
    }
})


//login rooute
app.get("/app/login",(req,res)=>{
    res.render("User/login.ejs");
});

app.post("/app/login",passport.authenticate("local",{failureRedirect:"/app/login",failureFlash:true}),(req,res)=>{
    req.flash("sucess","welcome to Mediwallet !");
    return res.redirect("/app/appointment");
})


// appointment //
app.get("/app/appointment",async(req,res)=>{
    if (!req.isAuthenticated()) {
        return res.redirect("/app/login"); 
    }
    let doctors = await Doctor.find({});
    const patients = await Patient.findOne({ user: req.user._id });
    res.render("lists/appointment.ejs",{doctors,patients});
});


app.get("/app/add-funds/:patientid",async(req,res)=>{
    const patientId = req.params.patientid;
    req.flash("error","funds not less than 300" );
    res.render("lists/addfund.ejs",{patientId});
})


app.post("/app/add-funds/:patientid", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/app/login"); 
    }

    //const userId = req.user._id;  // currently authenticated user's ID
    const { amount } = req.body;   //amount to add from the request body

    //console.log("amount added :" , {amount});

    if (!amount || amount < 300) {
        req.flash("error", "Minimum amount rupess 300.");
        return res.redirect("/app/add-funds");
    }

    const patient_Id = req.params.patientid;

    try {
        // Find the user and update the walletbalance by adding the specified amount
        const updatedPatient = await Patient.findByIdAndUpdate(
            patient_Id, 
            { $inc: { walletbalance: amount } },  // Use $inc to increment the walletbalance
            { new: true }  // This ensures the updated document is returned
        );

        if (!mongoose.Types.ObjectId.isValid(patient_Id)) {
            req.flash("error", "Invalid Patient ID.");
            return res.redirect("/app/appointment");
        }

        if (!updatedPatient) {
            req.flash("error", "Patient not found.");
            return res.redirect("/app/appointment");
        }

        req.flash("success", `Successfully added ${amount} to your wallet!`);
        return res.redirect("/app/appointment"); 
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong. Please try again.");
        return res.redirect("/app/appointment");
    }
});


/// appointment confirmed //
app.get('/app/note/:appointmentId', async (req, res) => {
    const appointmentId = req.params.appointmentId;
    const appointment = await Appointment.findById(appointmentId).populate('patient_Id').populate('doctor_Id');
    res.render('lists/note.ejs', { appointment });
});


/// appointment confirming //
app.get("/app/:doctorId/:patientId", async (req, res) => {
    const doctorid = req.params.doctorId;
    const patientid = req.params.patientId;

    const isfirstappoint = await Appointment.findOne({ patientid, doctorid });
    
    const doctor = await Doctor.findById(doctorid);

    const patient = await Patient.findById(patientid);

    let discount = 0;
    let discountedPrice;

    if (!isfirstappoint) {
        req.flash("success", "Discount on first appointment!!!!");
        discount = 0.2; // 20% discount
    }
    else{
        discount = 0;
    }

    discountedPrice = doctor.consultationPrice * (1 - discount);
    
        if (patient.walletbalance >= discountedPrice) {
            patient.walletbalance -= discountedPrice;
            await patient.save();

            const appointment = new Appointment({
                patient_Id: patientid,
                doctor_Id: doctorid,
                discount_applied: true,
            });

            const appointmentDate = new Date();
            appointmentDate.setDate(appointmentDate.getDate() + 2);

            const randomHour = Math.floor(Math.random() * (19 - 10 + 1)) + 10;  // Random hour between 10 and 19
            const randomMinute = Math.floor(Math.random() * 60); 

            appointmentDate.setHours(randomHour, randomMinute, 0, 0);

            appointment.appointmentDate = appointmentDate;
            const appointmentDone = await appointment.save();

            const formattedDate = appointmentDate.toLocaleString(); 
            
            req.flash("success", `Appointment Booked! Date & Time : ${formattedDate}`);
            return res.redirect(`/app/note/${appointmentDone._id}`);  
        } 
        else {
            req.flash("error", "Insufficient balance.");
            return res.redirect(`/app/add-funds/${patientid}`);
        }
});



main()
.then((res)=>{
    console.log(res);
    console.log("working db")
})
.catch((err)=>{
    console.log(err);
    console.log("db error")
});
async function main(){
    await mongoose.connect(dbUrl);   
}

app.listen(8080,()=>{
    console.log("server is starting..");
})