const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const Apperror = require("./Apperror");
// console.log("hey i am image");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.originalUrl.includes("places")) {
      cb(null, "images/places");
    } else {
      cb(null, "images/users");
    }
  },
  filename: (req, file, cb) => {
    // console.log("helllo", file, req.originalUrl);
    const ext = file.mimetype.split("/")[1];
    let filenam;
    if (req.originalUrl.includes("places")) {
      filenam = `places-${uuidv4()}-${Date.now()}.${ext}`;
    } else {
      filenam = `user-${uuidv4()}-${Date.now()}.${ext}`;
    }

    cb(null, filenam);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Apperror("file type .png,.jpg,.jpeg is allowed", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.userFileUpload = upload.single("image");
exports.uploadPlaceImage = upload.single("imageUrl");
