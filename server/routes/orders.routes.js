const express = require("express");
const router = express.Router()
const ordersController = require("../controllers/orders.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.put("/ordering", authMiddleware, ordersController.buyProduct);
router.get("/orders", authMiddleware, ordersController.getOrders);
router.put("/editStatus/:id", ordersController.editStatus);

module.exports = router;
