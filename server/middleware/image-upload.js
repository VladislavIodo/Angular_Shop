const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": ".jpg",
  "image/jpeg": ".jpeg",
  "image/png": ".png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPES[file.mimetype];
    const error = isValid ? null : new Error("error ---mime type invalid");
    return callback(error, "server/uploads");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    callback(null, `${Date.now()}_${name}`);
  }
});
const upload = multer({storage: storage});

module.exports = upload;
