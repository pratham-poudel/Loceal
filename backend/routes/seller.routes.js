const express = require("express");
const router = express.Router();

const body = require("express-validator");

const sellerController = require("../controllers/seller.controllers");
const {authSeller} = require("../middlewares/auth.middleware");

router.post("/register", sellerController.Register);
router.get("/verifySeller/:token", sellerController.VerifySeller); 
router.post("/login", sellerController.Login);
router.get("/logout", sellerController.Logout);



// PRODUCT MANAGEMENT ROUTES
router.get("/products", authSeller, sellerController.GetProducts); // Get seller's products
router.post("/products", authSeller, sellerController.CreateProduct); // Add new product
router.get("/products/:productId", authSeller, sellerController.GetProductDetails); // Get single product
router.put("/products/:productId", authSeller, sellerController.UpdateProduct); // Update product
router.delete("/products/:productId", authSeller, sellerController.DeleteProduct); // Delete product
router.patch("/products/:productId/stock", authSeller, sellerController.UpdateStock); // Update stock only
router.patch("/products/:productId/availability", authSeller, sellerController.ToggleAvailability); // Toggle available/unavailable



// seller initiate payment
router.post("/orders/:orderId/initiate-payment", authSeller, sellerController.InitiatePayment);
router.post("/orders/:orderId/verify-otp", authSeller, sellerController.VerifyOTP); // Seller enters OTP

module.exports = router;