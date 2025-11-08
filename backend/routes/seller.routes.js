const express = require("express");
const router = express.Router();

const body = require("express-validator");

const sellerController = require("../controllers/seller.controllers");
const {authSeller} = require("../middlewares/auth.middleware");

router.post("/register", sellerController.Register);
router.get("/verifySeller/:token", sellerController.VerifySeller); 
router.post("/login", sellerController.Login);
router.get("/logout", sellerController.Logout);


// seller initiate payment
router.post("/orders/:orderId/initiate-payment", authSeller, sellerController.InitiatePayment);
router.post("/orders/:orderId/verify-otp", authSeller, sellerController.VerifyOTP); // Seller enters OTP

module.exports = router;