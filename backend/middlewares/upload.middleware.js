// backend/middlewares/upload.middleware.js
const multer = require('multer');
const path = require('path');

// 1. Define where to store files and how to name them
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Uploads will be saved locally inside the backend/uploads folder
  },
  filename: (req, file, cb) => {
    // Generate a unique filename: fieldname-timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// 2. Validate file types (Only allow common image formats for fraud evidence screenshots)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Only image files (.jpg, .jpeg, .png) are allowed as evidence attachments!'));
  }
};

// 3. Initialize multer with our rules (Limit file size to 5MB to optimize server memory)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;