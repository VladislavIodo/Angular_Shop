const express = require("express");
const router = express.Router();
const captchaController = require("../controllers/captcha.controller");

router.post("/captcha", captchaController.captchaTokenValidate);

module.exports = router;
