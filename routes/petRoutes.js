const Pet = require("../models/Pet");
const router = require("express").Router();

const PetController = require("../controllers/PetController");

// Helpers
const verifyToken = require("../helpers/virify-token");
const { imageUpload } = require("../helpers/upload-image");

router.post(
  "/create",
  verifyToken,
  imageUpload.array("images"),
  PetController.create
);
router.get("/", PetController.getAll);
router.get("/pets", PetController.getAllUserPets);

module.exports = router;
