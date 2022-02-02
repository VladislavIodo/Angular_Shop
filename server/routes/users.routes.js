const express = require("express");
const router = express.Router()
const imageUpload = require("../middleware/image-upload")
const usersController = require("../controllers/users.controller");

router.post("/authorization",usersController.authenticationUsers);
router.post("/registration", imageUpload.single("avatar"), usersController.registrationUsers);
router.post("/registration/checkEmail", usersController.checkEmail);
router.put("/changeEmail", usersController.changeEmail);
router.put("/changePassword", usersController.changePassword);

module.exports = router;
