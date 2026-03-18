const multer = require("multer");

// Use memory storage so the file is available as req.file.buffer
const storage = multer.memoryStorage();
const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024;

const upload = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES }, // 15 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

module.exports = upload;
