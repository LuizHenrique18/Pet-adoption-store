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
router.get("/petadoption", PetController.petAdoption)
router.get("/pet:id", PetController.getPeById)
router.delete("/:id", verifyToken, PetController.removePetById)
router.patch("/:id", verifyToken, imageUpload.array('images'),PetController.updatePatch)
router.patch("/schedule/:id", verifyToken, PetController.schedule)
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption)

module.exports = router;
