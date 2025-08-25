import multer from "multer";

// Use memory storage so files are stored in RAM as buffers
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/quicktime", // .mov
      "video/x-msvideo", // .avi
      "video/x-matroska", // .mkv
      "application/pdf",
      // audio
      "audio/webm",  // Chrome/Firefox recording
      "audio/mpeg",  // .mp3
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/mp4",   // iOS Safari recording
      "audio/m4a"    // AAC / Apple format
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG images and PDFs are allowed"));
    }
  },
});