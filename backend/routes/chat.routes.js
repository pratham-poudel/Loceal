const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const { authCustomer, authSeller } = require("../middlewares/auth.middleware");

// Customer chat routes
router.get("/customer/orders/:orderId/messages", authCustomer, chatController.getChatMessages);
router.post("/customer/orders/:orderId/messages", authCustomer, chatController.sendMessage);

// Seller chat routes  
router.get("/seller/orders/:orderId/messages", authSeller, chatController.getChatMessages);
router.post("/seller/orders/:orderId/messages", authSeller, chatController.sendMessage);

module.exports = router;