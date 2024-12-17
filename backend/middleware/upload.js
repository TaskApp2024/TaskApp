const multer = require('multer');
const path = require('path');

// Define storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Files will be stored in the 'uploads/' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename using timestamp
    },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Unsupported file type'), false); // Reject other file types
    }
};

// Create multer instance with storage options and file filter
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 }, // Maximum file size: 1MB
});

module.exports = upload;
