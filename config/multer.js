const multer = require('multer');
const path = require('path');


const generateRandomString = length => Math.random().toString(36).substring(2, 2 + length)
// Konfigurasi lokasi penyimpanan file dan nama file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder penyimpanan file
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now(); // Timestamp saat file di-upload
    const randomString = generateRandomString(30); // String acak 6 karakter
    const ext = path.extname(file.originalname); // Ekstensi asli file
    const newFileName = `${timestamp}-${randomString}${ext}`; // Gabungkan semuanya

    console.log(newFileName)
    cb(null, newFileName); // Nama baru untuk file
  }
});

// Filter untuk memeriksa tipe file
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Terima file
  } else {
    cb(new Error('Format file tidak diizinkan!'), false); // Tolak file
  }
};

// Konfigurasi multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // Maksimum ukuran file 1MB
  fileFilter: fileFilter,
});

module.exports = upload;
