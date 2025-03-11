/*const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

require("dotenv").config();

cloudinary.config({    // config means make relation ==> joining our cloudinary a/c with our backened//
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'Mediwallet_dev',
        allowedFormats:['png','jpeg','jpg'],
    }
})


module.exports = {cloudinary,storage};*/






const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define local storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // Create folder if it doesn't exist
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Unique filename
    },
});

const upload = multer({ storage });

module.exports = upload;
