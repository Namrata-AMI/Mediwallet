require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const flash = require("connect-flash");
const fs = require("fs");
const path = require("path");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const User = require("./models/user");
const dbUrl = process.env.DB_URL;
const Doctor = require("./models/doctor");
const Appointment = require("./models/appointment");
const Patient = require("./models/patient");
const Wallet = require("./models/wallet");
const Bill = require("./models/bill.js");
const multer = require("multer");
//const {storage} = require("./cloudconfig.js");
//const upload = multer({storage});
const upload = require("./cloudconfig.js")
const MongoStore = require("connect-mongo");
const { processMedicalBill } = require("./GeminiService.js");

const {isLoggedIn} = require("./middleware.js");
const user = require("./models/user");



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
//app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,            // our secret
    },
    touchAfter : 24 * 3600,
});

const sessionOptions = {
    secret: "Mediwalletapp123",         // oour secret
    resave:false,
    saveUninitialized:true,
    store: MongoStore.create({
        mongoUrl: dbUrl, 
        collectionName: "sessions",
    }),
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());   
app.use(express.json());



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



/// test or check gen ai ////////////////////////////////////////////////
/*app.post("/generate", async (req, res) => {
    console.log("Received request body:", req.body); // Debugging line
    const { prompt } = req.body;

    if (!prompt) {
        console.error("Error: prompt is required");
        return res.render("index",{})
    }

    try {
        const response = await generateResponse(prompt);
        res.json({ response });
        console.log(response);
    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});*/


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
            const newPatient = new Patient({
                username,
                email, 
                walletbalance:0, 
                user:registeredUser._id,
            });
            await newPatient.save();

            console.log(registeredUser);
            req.login(registeredUser,(err)=>{
                if(err){
                return next(err);
            }
            req.flash("success","Welcome to Mediwallet !");
            return res.redirect("/app");
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
    req.flash("success","welcome to Mediwallet !");
    return res.redirect("/app");
})

///////////// wallet details ////////
app.get("/app/wallet/:newuserr",isLoggedIn, async(req,res)=>{
    const newUserid = req.params.newuserr;
    const patient = await Patient.findOne({user : newUserid});
    const walletdetails = await Wallet.findOne({patient_Id:patient._id});
    if(!walletdetails){
        req.flash("error","no record before, Please add funds to wallet!");
        return res.redirect(`/app/add-funds/${patient._id}`);
    }
    const newWallet = walletdetails.transactions.map(transaction=>{
        return {
            amount:transaction.amount,
            type:transaction.type,
            description:transaction.description,
            date:transaction.date.toISOString().split('T')[0],
        }
    });
    const count = await Bill.countDocuments({ userId: user});
    console.log("walllet details :...",Wallet);
    return res.render("lists/wallet.ejs",{patient,newWallet,count});  
})

// appointment //
app.get("/app/appointment", isLoggedIn ,async(req,res)=>{
    if (!req.user) {
        return res.redirect("/app/login"); 
    }
    let doctors = await Doctor.find({});
    const patients = await Patient.findOne({ user: req.user._id });
    res.render("lists/appointment.ejs",{doctors,patients});
});


// add funds //
app.get("/app/add-funds/:patientid", isLoggedIn ,async(req,res)=>{
    const patientId = req.params.patientid;
    req.flash("error","funds not less than 300" );
    res.render("lists/addfund.ejs",{patientId});
})

// add funds //
app.post("/app/add-funds/:patientid", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/app/login"); 
    }

    const patient_Id = req.params.patientid;
    //const userId = req.user._id;  // currently authenticated user's ID
    const { amount } = req.body;   //amount to add from the request body

    //console.log("amount added :" , {amount});

    if (!amount || amount < 300) {
        req.flash("error", "Minimum amount rupess 300.");
        return res.redirect(`/app/add-funds/${patient_Id}`);
    }

    try {
        // Find the user and update the walletbalance by adding the specified amount
        const updatedPatient = await Patient.findByIdAndUpdate(
            patient_Id, 
            { $inc: { walletbalance: amount } },  // Use $inc to increment the walletbalance
            { new: true }  // This ensures the updated document is returned
        );

        const patient = await Patient.findById(patient_Id);

        /*const updateWallet = new Wallet({   // saving the wallet
             patient_Id: patient_Id ,
             balance: patient.walletbalance,
             transactions:[{
                        amount:amount,
                        type:'Credit',
                        description:`${amount} is added to wallet.`,
                        date:Date.now(),
             }],
        });

        await updateWallet.save();*/

        const wallet = await Wallet.findOneAndUpdate(
            { patient_Id },
            {
                $inc: { balance: amount },
                $push: {
                    transactions: {
                        amount,
                        type: 'Credit',
                        description: `${amount} is added to wallet.`,
                        date: new Date(),
                    },
                },
            },
            { upsert: true, new: true }
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



/// appointment confirmed pdf //
app.get('/app/note/:appointmentId', isLoggedIn ,async (req, res) => {
    const appointmentId = req.params.appointmentId;
    const appointment = await Appointment.findById(appointmentId).populate('patient_Id').populate('doctor_Id');
    res.render("lists/note.ejs", { appointment });

});


/// show doctors details  //
app.get("/app/:doctorId/:patientId", isLoggedIn, async (req, res) => {
    const doctorid = req.params.doctorId;
    const patientid = req.params.patientId;

    if (!mongoose.Types.ObjectId.isValid(doctorid) || !mongoose.Types.ObjectId.isValid(patientid)) {
        req.flash("error", "Invalid ID format.");
        return res.redirect("/app");
    }
    const doctor = await Doctor.findById(doctorid);
    const patient = await Patient.findById(patientid);
    res.render("lists/doctor_info.ejs",{doctor,patient});
});


///////// confirm appointment ////////////// 
app.post("/app/:doctorId/:patientId",async(req,res)=>{
    const doctorid = req.params.doctorId;
    const patientid = req.params.patientId;

    const patient = await Patient.findById(patientid);
    const doctor = await Doctor.findById(doctorid);

    let discount = 0;
    let discountedPrice;

    const isfirstappoint = await Appointment.findOne({ patient_Id: patientid, doctor_Id: doctorid });

    if(patient.walletbalance < doctor.consultationPrice){
        req.flash("error","Recharge Your wallet !");
        return res.redirect(`/app/add-funds/${patientid}`);
    }

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

        /*const updateWallet = new Wallet({   // saving the wallet
            patient_Id: patientid ,
            balance: patient.walletbalance,
            transactions:[{
                       amount:discountedPrice,
                       type:'Debit',
                       description:`${patient.walletbalance} is deducted to wallet.`,
                       date:Date.now(),
            }],
        });
        await updateWallet.save();*/

        //console.log(updateWallet.description);
       const updatedWallet = await Wallet.findOneAndUpdate(
        { patient_Id: patientid },
        {
            $set: { balance: patient.walletbalance },
            $push: {
                transactions: {
                    amount: discountedPrice,
                    type: 'Debit',
                    description: `Consultation with ${doctor.name}`,
                    date: Date.now(),
                }
            }
        },
        { new: true , upsert:true} // Returns the updated document
    );
        console.log(updatedWallet);
        

        console.log(patient.walletbalance);

        patient.save();

        const formattedDate = appointmentDate.toLocaleString(); 
        
        req.flash("success", `Appointment Booked! Date & Time : ${formattedDate}`);
        return res.redirect(`/app/note/${appointmentDone._id}`);  
    } 
    else {
        req.flash("error", "Insufficient balance.");
        return res.redirect(`/app/add-funds/${patientid}`);
    }
});




/////////////////////// AI analaysis  ///////////////////////
app.get("/app/analysis", isLoggedIn ,(req,res)=>{
    const analysisRes = req.session.analaysisRes || [];
    req.session.analysisRes = null ; // clear sessiion after display //
    res.render("lists/analysis.ejs",{analysisRes});
})


/*app.post("/app/analysis",upload.single("file"), isLoggedIn ,async(req,res)=>{
    try{

        if(!req.file){
            req.flash("error","File not uploaded, Plaese upload again !");
            return res.redirect("/app/analysis");
        }
        const pdfPath = req.file.path;
        console.log("Analysing the document...........  " , pdfPath); 

        const analysisRes = await processMedicalBill(pdfPath);

        req.session.analysisRes = analysisRes;  // stroing the result  session 

        res.redirect("/app/analysis");
    }
    catch(e){
        console.log(e);
        req.flash("error",e.message);
        res.redirect("/app/analysis");
    }
})*/



app.post("/app/analysis", upload.single("file"), async (req, res) => {
    if (!req.file) {
        req.flash("error", "File not uploaded, please try again!");
        return res.redirect("/app/analysis");
    }

    try {
        const filePath = req.file.path || req.file.url; // Use Cloudinary URL if available
        console.log("Processing:", filePath);

        // Process the bill (ensure processMedicalBill supports Cloudinary URLs)
        const analysisResults = await processMedicalBill(filePath);

        // Only delete local files, not Cloudinary URLs
        if (!filePath.startsWith("http")) {
            fs.unlinkSync(filePath);
        }

        res.render("lists/analysis.ejs", { analysisRes: analysisResults });
    } catch (error) {
        console.error("Error processing the bill:", error);
        req.flash("error", "Failed to analyze the bill.");
        return res.redirect("/app/analysis");
    }
});
  
///////////////////////// Track Expenses ////////////////////////////
app.get("/app/track_expense", (req, res) => {
    res.render("lists/track_expenses.ejs");
});


////// Upload bills ///////
app.get("/app/bill",isLoggedIn, (req, res) => {
    res.render("lists/bill.ejs");
});


app.post("/app/bill", isLoggedIn , upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            req.flash("error", "No file uploaded!");
            return res.redirect("/app/bill"); 
        }

        const { description, amount } = req.body;
        if (!description || !amount) {
            req.flash("error", "Please fill all details.");
            return res.redirect("/app/bill");
        }

        const newBill = new Bill({
            fileUrl: req.file.path,
            patient_Id: req.user ? req.user._id : null,
            description,
            amount,
        });

        await newBill.save();
        req.flash("success", "Bill uploaded successfully!");
        return res.redirect("/app");

    } catch (error) {
        console.error("Error uploading bill:", error);
        req.flash("error", "Error processing the bill.");
        return res.redirect("/app/bill"); 
    }
});






//// logout ////
app.get("/app/logout", async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you looged out!");
        res.redirect("/app");
    })
})

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