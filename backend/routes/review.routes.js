const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const { authCustomer, authSeller } = require("../middlewares/auth.middleware");

// Customer routes
router.post("/orders/:orderId/review", authCustomer, reviewController.submitReview);

// Public routes (no auth needed for viewing reviews)
router.get("/sellers/:sellerId/reviews", reviewController.getSellerReviews);
router.get("/products/:productId/reviews", reviewController.getProductReviews);

// Seller routes
router.post("/reviews/:reviewId/response", authSeller, reviewController.sellerResponse);

module.exports = router;