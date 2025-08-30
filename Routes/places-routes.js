const express = require("express");
const router = express.Router();
const { uploadPlaceImage } = require("../file-upload");
const {
  getPlaceById,
  getplacebyUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../Controller/places-controller");
const { authProtect } = require("../Controller/user-controller");
router.get("/:pid", getPlaceById);

router.get("/users/:uid", getplacebyUserId);
router.use(authProtect);
router.post("/", uploadPlaceImage, createPlace);
router.patch("/:pid", updatePlace);
router.delete("/:pid", deletePlace);
module.exports = router;
