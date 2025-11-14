const ReviewModel = require("../models/review.model");
const OrderModel = require("../models/order.model");
const SellerModel = require("../models/seller.model");
const ProductModel = require("../models/product.model");

// Submit review for completed order
module.exports.submitReview = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { rating, comment, images = [] } = req.body;
        const customerId = req.customer._id;

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Find order and verify it's completed and belongs to customer
        const order = await OrderModel.findOne({
            _id: orderId,
            customer: customerId,
            orderStatus: 'completed'
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found or not completed"
            });
        }

        // Check if review already exists
        const existingReview = await ReviewModel.findOne({ order: orderId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "Review already submitted for this order"
            });
        }

        // Create review
        const review = new ReviewModel({
            order: orderId,
            customer: customerId,
            seller: order.seller,
            product: order.product,
            rating,
            comment,
            images
        });

        await review.save();

        // Update seller rating stats
        await updateSellerRating(order.seller);

        // Update product rating stats
        await updateProductRating(order.product);

        res.status(201).json({
            success: true,
            review,
            message: "Review submitted successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Get reviews for a seller
module.exports.getSellerReviews = async (req, res) => {
    try {
        const { sellerId } = req.params;

        const reviews = await ReviewModel.find({ seller: sellerId })
            .populate('customer', 'name')
            .populate('product', 'title images')
            .sort({ createdAt: -1 });

        // Calculate rating summary
        const ratingSummary = await ReviewModel.aggregate([
            { $match: { seller: sellerId } },
            {
                $group: {
                    _id: '$seller',
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 },
                    ratingDistribution: {
                        $push: '$rating'
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            reviews,
            summary: ratingSummary[0] || {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: []
            },
            message: "Seller reviews fetched successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Get reviews for a product
module.exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await ReviewModel.find({ product: productId })
            .populate('customer', 'name')
            .sort({ createdAt: -1 });

        const ratingSummary = await ReviewModel.aggregate([
            { $match: { product: productId } },
            {
                $group: {
                    _id: '$product',
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            reviews,
            summary: ratingSummary[0] || {
                averageRating: 0,
                totalReviews: 0
            },
            message: "Product reviews fetched successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Seller responds to review
module.exports.sellerResponse = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { comment } = req.body;
        const sellerId = req.seller._id;

        const review = await ReviewModel.findOne({
            _id: reviewId,
            seller: sellerId
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        review.sellerResponse = {
            comment,
            respondedAt: new Date()
        };

        await review.save();

        res.status(200).json({
            success: true,
            review,
            message: "Response added successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Helper function to update seller rating
async function updateSellerRating(sellerId) {
    try {
        const ratingStats = await ReviewModel.aggregate([
            { $match: { seller: sellerId } },
            {
                $group: {
                    _id: '$seller',
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        if (ratingStats.length > 0) {
            await SellerModel.findByIdAndUpdate(sellerId, {
                'rating.average': Math.round(ratingStats[0].averageRating * 10) / 10,
                'rating.count': ratingStats[0].totalReviews
            });
        }
    } catch (error) {
        console.error("Error updating seller rating:", error);
    }
}

// Helper function to update product rating
async function updateProductRating(productId) {
    try {
        const ratingStats = await ReviewModel.aggregate([
            { $match: { product: productId } },
            {
                $group: {
                    _id: '$product',
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        if (ratingStats.length > 0) {
            await ProductModel.findByIdAndUpdate(productId, {
                'rating.average': Math.round(ratingStats[0].averageRating * 10) / 10,
                'rating.count': ratingStats[0].totalReviews
            });
        }
    } catch (error) {
        console.error("Error updating product rating:", error);
    }
}