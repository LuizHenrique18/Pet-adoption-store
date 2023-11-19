const router = require("express").Router();
const UserController = require("../controllers/UserController");

// Helpers
const verifyToken = require("../helpers/virify-token");
const { imageUpload } = require("../helpers/upload-image");

router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.get("/token", UserController.checkToken);
router.get("/:id", UserController.getUserId);
router.patch(
  "/edit",
  verifyToken,
  imageUpload.single("image"),
  UserController.editUser
);

module.exports = router;
