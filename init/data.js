const doctors = [
    {
        name: "Dr. Ayesha Khan",
        consultationPrice: 500,
        gender:"female",
        specialisation: "Cardiology",
    },
    {
        name: "Dr. Ravi Sharma",
        consultationPrice: 700,
        gender:"male",
        specialisation: "Orthopedics",
    },
    {
        name: "Dr. Priya Patel",
        consultationPrice: 400,
        gender:"female",
        specialisation: "Dermatology",
    },
    {
        name: "Dr. Vikram Singh",
        consultationPrice: 600,
        gender:"male",
        specialisation: "Neurology",
    },
    {
        name: "Dr. Anjali Mehta",
        consultationPrice: 300,
        gender:"female",
        specialisation: "Pediatrics",
    },
    {
        name: "Dr. Kabir Gupta",
        consultationPrice: 800,
        gender:"male",
        specialisation: "Gastroenterology",
    },
    {
        name: "Dr. Sanjana Roy",
        consultationPrice: 750,
        gender:"female",
        specialisation: "Endocrinology",
    },
    {
        name: "Dr. Arjun Das",
        consultationPrice: 450,
        gender:"male",
        specialisation: "Psychiatry",
    },
    {
        name: "Dr. Neha Verma",
        consultationPrice: 650,
        gender:"female",
        specialisation: "Gynecology",
    },
    {
        name: "Dr. Rohan Malhotra",
        consultationPrice: 550,
        gender:"male",
        specialisation: "Ophthalmology",
    },
    {
        name: "Dr. Ishita Sen",
        consultationPrice: 400,
        gender:"female",
        specialisation: "ENT (Ear, Nose, Throat)",
    },
    {
        name: "Dr. Sameer Bhatt",
        consultationPrice: 850,
        gender:"male",
        specialisation: "Oncology",
    },
    {
        name: "Dr. Parul Aggarwal",
        consultationPrice: 600,
        gender:"female",
        specialisation: "Nephrology",
    },
    {
        name: "Dr. Meera Iyer",
        consultationPrice: 500,
        gender:"female",
        specialisation: "Pulmonology",
    },
    {
        name: "Dr. Ankit Jain",
        consultationPrice: 700,
        gender:"male",
        specialisation: "General Surgery",
    },
    {
        name: "Dr. Sneha Chatterjee",
        consultationPrice: 300,
        gender:"female",
        specialisation: "General Physician",
    },
    {
        name: "Dr. Rajiv Kapoor",
        consultationPrice: 1000,
        gender:"male",
        specialisation: "Plastic Surgery",
    },
    {
        name: "Dr. Pooja Reddy",
        consultationPrice: 400,
        gender:"female",
        specialisation: "Psychology",
    },
    {
        name: "Dr. Rahul Bose",
        consultationPrice: 750,
        gender:"male",
        specialisation: "Urology",
    },
    {
        name: "Dr. Veena Kaur",
        consultationPrice: 500,
        gender:"female",
        specialisation: "Rheumatology",
    },
];



///////////////////////////////////////////////
const patients = [
    { username: "David Johnson", email: "david.johnson@example.com", walletbalance: 2000 },
    { username: "Emma Watson", email: "emma.watson@example.com", walletbalance: 3000 },
    { username: "Liam Brown", email: "liam.brown@example.com", walletbalance: 2500 },
    { username: "Sophia Martinez", email: "sophia.martinez@example.com", walletbalance: 1800 },
    { username: "Oliver Garcia", email: "oliver.garcia@example.com", walletbalance: 2200 },
];


const appointments =  [
    {
        patient_Id: '6770f1098003baa9023ffac3',
        doctor_Id: '6770f1098003baa9023ffabe',
        discount_applied: false,
        discount: 0.0, // No discount
        date_of_appointment: new Date(),
        transaction_id: "tx789012",   
    },

    {
        patient_Id: '6770f1098003baa9023ffac4',
        doctor_Id: '6770f1098003baa9023ffac0',
        discount_applied: true,
        discount: 0.2, // 20% discount
        date_of_appointment: new Date(),
        transaction_id: "tx123456",
    },
]


////////////////////////////////////////
const transactions = [
    {
        transaction_id: "TXN003",
        patient_id: "63b34d8c6f92e522e0e1c999", // Replace with actual ObjectId
        doctor_id: "63b34d8c6f92e522e0e1c888", // Replace with actual ObjectId
        amount: 700,
        discount: 0.1,
        final_amount: 630,
    },
    {
        transaction_id: "TXN004",
        patient_id: "63b34d8c6f92e522e0e1c777", // Replace with actual ObjectId
        doctor_id: "63b34d8c6f92e522e0e1c666", // Replace with actual ObjectId
        amount: 500,
        discount: 0.05,
        final_amount: 475,
    },
    {
        transaction_id: "TXN005",
        patient_id: "63b34d8c6f92e522e0e1c555", // Replace with actual ObjectId
        doctor_id: "63b34d8c6f92e522e0e1c444", // Replace with actual ObjectId
        amount: 300,
        discount: 0.2,
        final_amount: 240,
    },
];


module.exports = { doctors,patients,transactions,appointments};



