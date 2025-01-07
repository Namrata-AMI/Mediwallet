const doctors = [
        {
            name: "Dr. Ayesha Khan",
            consultationPrice: 500,
            gender: "female",
            specialisation: "Cardiology",
            description: "Experienced cardiologist with over 10 years of experience in heart health and treatment.",
            timings: {
                days: ["Monday", "Wednesday", "Friday"],
                hours: {
                    start: "09:00 AM",
                    end: "03:00 PM",
                },
            },
            address: "Heart Care Clinic, 45 Greenway Road, Delhi, India",
        },
        {
            name: "Dr. Ravi Sharma",
            consultationPrice: 700,
            gender: "male",
            specialisation: "Orthopedics",
            description: "Specialist in bone and joint care with a focus on sports injuries and arthritis management.",
            timings: {
                days: ["Tuesday", "Thursday", "Saturday"],
                hours: {
                    start: "10:00 AM",
                    end: "04:00 PM",
                },
            },
            address: "Joint Wellness Center, 123 MG Road, Bangalore, India",
        },
        {
            name: "Dr. Priya Patel",
            consultationPrice: 400,
            gender: "female",
            specialisation: "Dermatology",
            description: "Expert in skin, hair, and nail treatments with personalized skincare solutions.",
            timings: {
                days: ["Monday", "Friday"],
                hours: {
                    start: "11:00 AM",
                    end: "02:00 PM",
                },
            },
            address: "Glow Skin Clinic, 56 Nehru Place, Mumbai, India",
        },
        {
            name: "Dr. Vikram Singh",
            consultationPrice: 600,
            gender: "male",
            specialisation: "Neurology",
            description: "Neurologist specializing in treating disorders of the nervous system.",
            timings: {
                days: ["Wednesday", "Saturday"],
                hours: {
                    start: "08:00 AM",
                    end: "01:00 PM",
                },
            },
            address: "Neuro Care Center, 78 Park Street, Kolkata, India",
        },
        {
            name: "Dr. Anjali Mehta",
            consultationPrice: 300,
            gender: "female",
            specialisation: "Pediatrics",
            description: "Dedicated pediatrician offering comprehensive care for children of all ages.",
            timings: {
                days: ["Monday", "Tuesday", "Thursday"],
                hours: {
                    start: "09:30 AM",
                    end: "12:30 PM",
                },
            },
            address: "Happy Kids Clinic, 90 MG Avenue, Hyderabad, India",
        },
        {
            name: "Dr. Kabir Gupta",
            consultationPrice: 800,
            gender: "male",
            specialisation: "Gastroenterology",
            description: "Specialist in digestive system health with advanced diagnostic techniques.",
            timings: {
                days: ["Tuesday", "Thursday", "Friday"],
                hours: {
                    start: "10:00 AM",
                    end: "03:00 PM",
                },
            },
            address: "Digestive Wellness Center, 34 Sunrise Street, Pune, India",
        },
        {
            name: "Dr. Sanjana Roy",
            consultationPrice: 750,
            gender: "female",
            specialisation: "Endocrinology",
            description: "Expert in managing hormonal imbalances and endocrine disorders.",
            timings: {
                days: ["Monday", "Wednesday", "Saturday"],
                hours: {
                    start: "11:00 AM",
                    end: "04:00 PM",
                },
            },
            address: "Harmony Hormone Center, 101 Sector 22, Gurgaon, India",
        },
        {
            name: "Dr. Arjun Das",
            consultationPrice: 450,
            gender: "male",
            specialisation: "Psychiatry",
            description: "Compassionate psychiatrist focusing on mental health and well-being.",
            timings: {
                days: ["Tuesday", "Friday"],
                hours: {
                    start: "10:30 AM",
                    end: "02:30 PM",
                },
            },
            address: "Mind Peace Clinic, 67 Harmony Road, Jaipur, India",
        },
        {
            name: "Dr. Neha Verma",
            consultationPrice: 650,
            gender: "female",
            specialisation: "Gynecology",
            description: "Experienced gynecologist providing personalized care for women’s health.",
            timings: {
                days: ["Monday", "Thursday", "Saturday"],
                hours: {
                    start: "09:00 AM",
                    end: "01:00 PM",
                },
            },
            address: "Women's Health Center, 234 Pearl Street, Chennai, India",
        },
        {
            name: "Dr. Rohan Malhotra",
            consultationPrice: 550,
            gender: "male",
            specialisation: "Ophthalmology",
            description: "Eye specialist offering treatments and corrective vision procedures.",
            timings: {
                days: ["Wednesday", "Friday"],
                hours: {
                    start: "10:00 AM",
                    end: "01:00 PM",
                },
            },
            address: "Vision Care Clinic, 89 Light Avenue, Chandigarh, India",
        },
        {
            name: "Dr. Ankit Sharma",
            consultationPrice: 300,
            gender: "male",
            specialisation: "General Medicine",
            description: "Providing primary care and managing common illnesses with a holistic approach.",
            timings: {
                days: ["Monday", "Thursday"],
                hours: {
                    start: "09:00 AM",
                    end: "12:00 PM",
                },
            },
            address: "Health First Clinic, 76 Maple Avenue, Ahmedabad, India",
        },
        {
            name: "Dr. Swati Kapoor",
            consultationPrice: 900,
            gender: "female",
            specialisation: "Oncology",
            description: "Renowned oncologist focusing on the diagnosis and treatment of cancer.",
            timings: {
                days: ["Tuesday", "Friday"],
                hours: {
                    start: "10:00 AM",
                    end: "04:00 PM",
                },
            },
            address: "Cancer Care Center, 33 Rose Boulevard, Lucknow, India",
        },
        {
            name: "Dr. Manish Gupta",
            consultationPrice: 700,
            gender: "male",
            specialisation: "Urology",
            description: "Expert in urinary tract and male reproductive system treatments.",
            timings: {
                days: ["Wednesday", "Saturday"],
                hours: {
                    start: "11:00 AM",
                    end: "03:00 PM",
                },
            },
            address: "Uro Wellness Clinic, 54 Emerald Lane, Kochi, India",
        },
        {
            name: "Dr. Ruchi Chawla",
            consultationPrice: 600,
            gender: "female",
            specialisation: "Rheumatology",
            description: "Specialist in arthritis and other joint and autoimmune disorders.",
            timings: {
                days: ["Monday", "Friday"],
                hours: {
                    start: "10:00 AM",
                    end: "01:00 PM",
                },
            },
            address: "Joint Care Center, 91 Harmony Lane, Surat, India",
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
        discount: 0.2,
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
        patient_id: "63b34d8c6f92e522e0e1c999", // Replace with actual ObjectId
        doctor_id: "63b34d8c6f92e522e0e1c888", // Replace with actual ObjectId
        amount: 700,
        discount: 0.1,
        final_amount: 630,
    },
    {
        patient_id: "63b34d8c6f92e522e0e1c777", // Replace with actual ObjectId
        doctor_id: "63b34d8c6f92e522e0e1c666", // Replace with actual ObjectId
        amount: 500,
        discount: 0.05,
        final_amount: 475,
    },
    {
        patient_id: "63b34d8c6f92e522e0e1c555", // Replace with actual ObjectId
        doctor_id: "63b34d8c6f92e522e0e1c444", // Replace with actual ObjectId
        amount: 300,
        discount: 0.2,
        final_amount: 240,
    },
];



///////// Wallet data /////////
const wallets = [
    {
        "patient_Id": "6773ef8125b42da7c0e3bdb7",
        "balance": 1000,
        "transactions": [
          {
            "amount": 200,
            "type": "Credit",
            "description": "Payment for consultation",
            "date": "2025-01-01T12:00:00Z"
          },
          {
            "amount": 50,
            "type": "Debit",
            "description": "Payment for prescription",
            "date": "2025-01-01T12:30:00Z"
          }
        ]
      }      
]


module.exports = { doctors,patients,transactions,wallets,appointments};



