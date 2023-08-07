import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});

export const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(500).json({
      message: "Multer error",
      error: err.message,
    });
  }
};
