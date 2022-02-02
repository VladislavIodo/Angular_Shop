const express = require("express");
const router = express.Router()
const imageUpload = require("../middleware/image-upload")
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const offersController = require("../controllers/offers.controller");

router.get("/", offersController.getOffers);
router.get("/offers/:id", offersController.getOfferDetails);
router.post("/", authMiddleware, roleMiddleware(['admin']), imageUpload.single("image"), offersController.addProduct);
router.get("/:id", offersController.getOfferById);
router.delete("/delete/:id", authMiddleware, roleMiddleware(['admin']), offersController.deleteProduct);
router.put("/edit/:id", authMiddleware, roleMiddleware(['admin']), imageUpload.single("image"), offersController.editProduct);

module.exports = router;
