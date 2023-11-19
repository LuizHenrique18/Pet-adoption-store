const multer = require("multer");
const path = require("path");

// where the photos will be safe
const imageStorage = multer.diskStorage({
  destination: function (req, res, cb) {},
});
