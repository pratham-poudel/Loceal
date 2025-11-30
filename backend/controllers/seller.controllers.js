const SellerModel = require("../models/seller.model");
const OrderModel = require("../models/order.model");
const CustomerModel = require("../models/customer.model");
const MessageModel = require("../models/message.model");
const ProductModel = require("../models/product.model");


const jwt = require("jsonwebtoken");
const sendEmail = require("../libs/nodemailer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { getCoordinatesFromAddress } = require("../libs/geocoding");

module.exports.Register = async (req, res) => {
    try {
        const { name, email, password, phone, location, businessName } = req.body;

        const sellerExists = await SellerModel.findOne({ email: email });

        if (sellerExists) {
            return res.status(400).json({
                message: "Seller with this email already exists"
            })
        }

        const hashPassword = await SellerModel.hashPassword(password);

        const fullAddressObj = {
            street: location.street,
            city: location.city,
            state: location.state,
            pincode: location.pincode,
            country: "India",
            landmark: location.landmark
        };

        let coords = [0, 0];
        let formattedAddress = fullAddressObj;

        const geo = await getCoordinatesFromAddress(fullAddressObj);

        coords = geo.coordinates;

        formattedAddress = geo.address;
        console.log("Formatted Address:", formattedAddress);

        // console.log(coords)

        const seller = new SellerModel({
            name,
            email,
            password: hashPassword,
            phone,
            businessName,
            location: {
                type: "Point",
                coordinates: coords,
                address: {
                    street: formattedAddress.street,
                    city: formattedAddress.city,
                    state: formattedAddress.state,
                    pincode: formattedAddress.pincode,
                    country: formattedAddress.country,
                    landmark: formattedAddress.landmark || null
                }
            },
            isVerified: false
        });

        await seller.save();

        const token = seller.generateAuthToken();
        res.cookie("token", token);

        await sendEmail(email, "Welcome To Loceal, Verify Yourself",
            `  
            <html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #0F0E47; /* deep midnight blue background */
        }
        .container {
            width: 100%;
            text-align: center;
            padding: 20px;
        }
        .content {
            background-color: #272757; /* dark navy card */
            padding: 40px;
            margin: 20px auto;
            max-width: 600px;
            border-radius: 10px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
            text-align: left;
            color: #E8E8F0;
        }
        .title {
            font-size: 22px;
            font-weight: bold;
            color: #8686AC; /* accent title */
            text-align: center;
        }
        .message {
            font-size: 16px;
            color: #C9C9D8;
            margin-top: 10px;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 28px;
            background-color: #505081; /* indigo button */
            color: #FFFFFF;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
            transition: background 0.3s ease;
        }
        .button:hover {
            background-color: #8686AC; /* lighter hover effect */
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #A8A8C2;
            text-align: center;
        }
        /* Header Section */
        .header-table {
            background-color: #505081; /* muted indigo header */
            color: white;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <table width="100%" cellpadding="0" cellspacing="0" class="header-table">
            <tr>
                <td style="padding: 20px; font-size: 24px; font-weight: bold;">LOCEAL</td>
            </tr>
            <tr>
                <td style="font-size: 16px;">Local Deal</td>
            </tr>
        </table>

        <div class="content">
            <div class="title">VERIFICATION</div>
            <p class="message">Dear <b>${name}</b>,</p>
            <p class="message">Welcome to loceal.</p>

            <p class="message">Please verify your email address to activate your account.</p>

            <div style="text-align: center;">
                <a href="http://localhost:${process.env.FRONTEND_PORT}/seller/verifySeller/${token}" class="button">Verify Email</a>
            </div>

            <p class="footer">If you did not sign up for this, you can ignore this email.</p>
        </div>
    </div>
</body>
</html>
            `
        );

        res.status(201).json({
            message: "Seller registered successfully",
            seller,
            token
        })
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}

module.exports.VerifySeller = async (req, res) => {
    try {
        const token = req.params.token.trim();

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized. No token provided."
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded._id) {
            return res.status(401).json({
                message: "Unauthorized. Invalid token."
            })
        }

        const seller = await SellerModel.findById(decoded._id);

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found."
            })
        }

        seller.isVerified = true;
        await seller.save();

        res.status(200).json({
            message: "Seller verified successfully."
        })
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}

module.exports.Login = async (req, res) => {
    const { email, password } = req.body;

    const seller = await SellerModel.findOne({ email: email }).select("+password");

    if (!seller) {
        return res.status(400).json({
            message: "Seller not found"
        })
    }

    const validPassword = await seller.comparePassword(password);

    if (!validPassword) {
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }

    const token = seller.generateAuthToken();
    res.cookie("token", token);

    res.status(200).json({
        message: "Seller logged in successfully",
        seller,
        token
    });
}

module.exports.Logout = async (req, res) => {
    res.status(200).json({ message: "Seller logged out successfully" });
}


module.exports.GetProfile = async (req, res) => {
    try {
        res.json({
            success: true,
            seller: req.seller
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}


module.exports.GetProducts = async (req, res) => {
    try {
        const sellerId = req.seller._id;
        const { search = "", category = "" } = req.query;

        const query = {
            seller: sellerId
        };

        // Add search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        // Add category filter
        if (category) {
            query.category = category;
        }

        const products = await ProductModel.find(query)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            products,
            total: products.length,
            message: "Products fetched successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

module.exports.CreateProduct = async (req, res) => {
    try {
        const sellerId = req.seller._id;
        const {
            title,
            description,
            category,
            subCategory,
            price,
            unit,
            minimumOrder = 1,
            stock,
            expiryDate,
            tags = []
        } = req.body;

        // Basic validation
        if (!title || !description || !category || !price || !unit || !stock) {
            return res.status(400).json({
                success: false,
                message: "Title, description, category, price, unit, and stock are required"
            });
        }

        // Validate price and stock
        if (price < 0 || stock < 0) {
            return res.status(400).json({
                success: false,
                message: "Price and stock cannot be negative"
            });
        }

        const product = new ProductModel({
            seller: sellerId,
            title,
            description,
            category,
            subCategory,
            price,
            unit,
            minimumOrder,
            stock,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            tags: Array.isArray(tags) ? tags : [tags],
            isAvailable: stock > 0
        });

        await product.save();

        res.status(201).json({
            success: true,
            product,
            message: "Product created successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

module.exports.GetProductDetails = async (req, res) => {
    try {
        const { productId } = req.params;
        const sellerId = req.seller._id;

        console.log("This is for fetching produt Details ONLY")
        const product = await ProductModel.findOne({
            _id: productId,
            seller: sellerId
        });

        console.log(sellerId)
        console.log(productId)
        console.log(product)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product,
            message: "Product details fetched successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

module.exports.UpdateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const sellerId = req.seller._id;
        const updateData = req.body;

        // Find product and verify ownership
        const product = await ProductModel.findOne({
            _id: productId,
            seller: sellerId
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Fields that can be updated
        const allowedUpdates = [
            'title', 'description', 'category', 'subCategory',
            'price', 'unit', 'minimumOrder', 'stock', 'expiryDate', 'tags'
        ];

        // Update only allowed fields
        allowedUpdates.forEach(field => {
            if (updateData[field] !== undefined) {
                product[field] = updateData[field];
            }
        });

        // Update availability based on stock
        product.isAvailable = product.stock > 0;

        await product.save();

        res.status(200).json({
            success: true,
            product,
            message: "Product updated successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

module.exports.DeleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const sellerId = req.seller._id;

        const product = await ProductModel.findOneAndDelete({
            _id: productId,
            seller: sellerId
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

module.exports.UpdateStock = async (req, res) => {
    try {
        const { productId } = req.params;
        const sellerId = req.seller._id;
        const { stock } = req.body;

        if (stock === undefined || stock < 0) {
            return res.status(400).json({
                success: false,
                message: "Valid stock value is required"
            });
        }

        const product = await ProductModel.findOne({
            _id: productId,
            seller: sellerId
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product.stock = stock;
        product.isAvailable = stock > 0;

        await product.save();

        res.status(200).json({
            success: true,
            product,
            message: "Stock updated successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

module.exports.ToggleAvailability = async (req, res) => {
    try {
        const { productId } = req.params;
        const sellerId = req.seller._id;

        const product = await ProductModel.findOne({
            _id: productId,
            seller: sellerId
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product.isAvailable = !product.isAvailable;
        await product.save();

        res.status(200).json({
            success: true,
            product,
            message: `Product ${product.isAvailable ? 'enabled' : 'disabled'} successfully`
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};








module.exports.InitiatePayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const sellerId = req.seller._id;

        // Find order with customer details
        const order = await OrderModel.findOne({
            _id: orderId,
            seller: sellerId
        }).populate('customer', 'name email phone')
            .populate('seller', 'businessName');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if order is in a valid state for payment
        if (order.orderStatus === "completed") {
            return res.status(400).json({
                success: false,
                message: "Order is already completed"
            });
        }

        // Generate OTP (6-digit)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP in order
        order.otp = {
            code: otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            verified: false,
            initiatedBy: sellerId,
            initiatedAt: new Date()
        };

        // Update order status
        order.orderStatus = "ready_for_pickup";
        order.statusHistory.push({
            status: "ready_for_pickup",
            timestamp: new Date(),
            note: "Payment initiated - OTP sent to customer"
        });

        await order.save();

        // Send OTP email to customer
        await sendEmail(order.customer.email, "OTP for Order Payment - Loceal",
            `
            <html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #0F0E47; /* deep midnight blue background */
        }
        .container {
            width: 100%;
            text-align: center;
            padding: 20px;
        }
        .content {
            background-color: #272757; /* dark navy card */
            padding: 40px;
            margin: 20px auto;
            max-width: 600px;
            border-radius: 10px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
            text-align: left;
            color: #E8E8F0;
        }
        .title {
            font-size: 22px;
            font-weight: bold;
            color: #8686AC; /* accent title */
            text-align: center;
        }
        .message {
            font-size: 16px;
            color: #C9C9D8;
            margin-top: 10px;
            line-height: 1.6;
        }
        .otp-display {
            background-color: #505081;
            color: #FFFFFF;
            font-size: 32px;
            font-weight: bold;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
            letter-spacing: 8px;
        }
        .info-box {
            background-color: #3A3A6B;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            border-left: 4px solid #8686AC;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #A8A8C2;
            text-align: center;
        }
        .header-table {
            background-color: #505081; /* muted indigo header */
            color: white;
            text-align: center;
        }
        .warning {
            color: #FF6B6B;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <table width="100%" cellpadding="0" cellspacing="0" class="header-table">
            <tr>
                <td style="padding: 20px; font-size: 24px; font-weight: bold;">LOCEAL</td>
            </tr>
            <tr>
                <td style="font-size: 16px;">Local Marketplace</td>
            </tr>
        </table>

        <div class="content">
            <div class="title">ORDER PAYMENT OTP</div>
            
            <p class="message">Dear <b>${order.customer.name}</b>,</p>
            
            <p class="message">Your seller <b>${order.seller.businessName}</b> has initiated the payment process for your order.</p>
            
            <div class="info-box">
                <p style="margin: 5px 0;"><b>Order Number:</b> ${order.orderNumber}</p>
                <p style="margin: 5px 0;"><b>Amount:</b> ₹${order.totalAmount}</p>
                <p style="margin: 5px 0;"><b>Valid Until:</b> ${new Date(order.otp.expiresAt).toLocaleTimeString()}</p>
            </div>

            <p class="message">Please provide this OTP to the seller to complete your transaction:</p>

            <div class="otp-display">
                ${otp}
            </div>

            <p class="message warning">⚠️ Do not share this OTP with anyone except the verified seller during your physical meeting.</p>
            
            <p class="message">This OTP will expire in <b>10 minutes</b> for security reasons.</p>

            <p class="footer">
                If you did not initiate this payment request, please contact our support immediately.<br>
                Thank you for choosing Loceal!
            </p>
        </div>
    </div>
</body>
</html>
            `
        );

        // Send system message in chat room
        await MessageModel.create({
            chatRoom: order.chatRoom,
            senderType: "system",
            senderId: sellerId,
            content: `Payment initiated! OTP has been sent to customer's email. Please ask the customer to share the OTP with you to complete the transaction.`,
            messageType: "system"
        });

        // Log for development (remove in production)
        console.log(`📧 OTP sent to ${order.customer.email}: ${otp}`);
        console.log(`📱 Order: ${order.orderNumber}, Customer: ${order.customer.name}`);

        res.json({
            success: true,
            message: "OTP sent to customer successfully",
            order: {
                orderNumber: order.orderNumber,
                customerName: order.customer.name,
                customerPhone: order.customer.phone,
                totalAmount: order.totalAmount,
                otpExpiresAt: order.otp.expiresAt
            }
            // ❌ OTP not sent in response for security
        });
    } catch (err) {
        console.error("Initiate Payment Error:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};


module.exports.VerifyOTTP = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { otp } = req.body;
        const sellerId = req.seller._id;

        const order = await OrderModel.findOne({
            _id: orderId,
            seller: sellerId
        }).populate('customer', 'name');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // if (!order.otpVerification.code) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Payment not initiated for this order. Please initiate payment first."
        //     });
        // }

        // Check OTP expiration
        if (order.otpVerification.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please initiate payment again."
            });
        }

        console.log("Provided OTP:", otp.otp);
        console.log("Stored OTP:", order.otpVerification.code);

        // Verify OTP
        if (order.otpVerification.code !== otp.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please check the code with the customer."
            });
        }

        // Mark order as completed
        order.orderStatus = "completed";
        order.paymentStatus = "cod_completed";
        order.otpVerification.verified = true;
        order.paymentConfirmedBy = {
            userType: "seller",
            userId: sellerId,
            confirmedAt: new Date()
        };
        order.statusHistory.push({
            status: "completed",
            timestamp: new Date(),
            note: "OTP verified - Payment completed during physical meeting"
        });

        await order.save();

        // Update seller stats (you'll need to implement this)
        await updateSellerStats(order.seller, order.totalAmount);

        // Update product sales count
        await updateProductSales(order.product, order.quantity);

        // Send completion message in chat
        await MessageModel.create({
            chatRoom: order.chatRoom,
            senderType: "system",
            senderId: sellerId,
            content: `✅ Payment completed successfully! Order #${order.orderNumber} is now complete. Thank you for your business!`,
            messageType: "system"
        });

        res.json({
            success: true,
            message: "Payment verified successfully! Order completed.",
            order: {
                orderNumber: order.orderNumber,
                status: order.orderStatus,
                completedAt: new Date()
            }
        });

    } catch (err) {
        console.error("Verify OTP Error:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Helper function to update seller stats
async function updateSellerStats(sellerId, amount) {
    try {
        await SellerModel.findByIdAndUpdate(sellerId, {
            $inc: {
                totalSales: 1,
                totalOrders: 1,
                totalRevenue: amount
            }
        });
    } catch (error) {
        console.error("Error updating seller stats:", error);
    }
}

// Helper function to update product sales
async function updateProductSales(productId, quantity) {
    try {
        const ProductModel = require("../models/product.model");
        await ProductModel.findByIdAndUpdate(productId, {
            $inc: {
                totalSales: quantity,
                stock: -quantity
            }
        });
    } catch (error) {
        console.error("Error updating product sales:", error);
    }
}






// Get Seller's Orders
module.exports.GetOrders = async (req, res) => {
    try {
        const sellerId = req.seller._id;
        console.log(sellerId)

        // // Filter by status if provided
        // if (status && status !== 'all') {
        //     query.orderStatus = status;
        // }

        // console.log("Yo")
        
        const orders = await OrderModel.find({ seller: sellerId, orderStatus: "pending" })
        // .populate('customers', 'name phone defaultAddress')
        // .populate('products', 'title images price')
        // .sort({ createdAt: -1 });

        console.log("Yo")
        res.status(200).json({
            success: true,
            orders,
            total: orders.length,
            message: "Orders fetched successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Get Single Order Details
module.exports.GetOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const sellerId = req.seller._id;


        console.log("In Get Order Details + Chat for Seller:", sellerId, "Order ID:", orderId);

        const order = await OrderModel.findOne({
            _id: orderId,
            seller: sellerId
        })
            .populate('customer')
            .populate('product')
            .populate('chatRoom');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        console.log(order)
        res.status(200).json({
            success: true,
            order,
            message: "Order details fetched successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Update Order Status
module.exports.UpdateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const sellerId = req.seller._id;
        const { status, note } = req.body;

        const order = await OrderModel.findOne({
            _id: orderId,
            seller: sellerId
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Validate status transition
        const validTransitions = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['meeting_scheduled', 'cancelled'],
            'meeting_scheduled': ['ready_for_pickup', 'cancelled'],
            'ready_for_pickup': ['completed'] // OTP flow handles this
        };

        if (!validTransitions[order.orderStatus]?.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot change status from ${order.orderStatus} to ${status}`
            });
        }

        order.orderStatus = status;
        order.statusHistory.push({
            status,
            timestamp: new Date(),
            note: note || `Status updated by seller`
        });

        await order.save();

        // Send system message in chat
        await MessageModel.create({
            chatRoom: order.chatRoom,
            senderType: "system",
            senderId: sellerId,
            content: `Order status updated to: ${status}` + (note ? ` - ${note}` : ""),
            messageType: "system"
        });

        res.status(200).json({
            success: true,
            order,
            message: "Order status updated successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};


// module.exports.GetOrderWithChat = async (req, res) => {
//     try {
//         const { orderId } = req.params;
//         const sellerId = req.seller._id;
        
//         console.log("In Fetching order with chat for orderId:", orderId, "and sellerId:", sellerId);

//         const order = await OrderModel.findOne({
//             _id: orderId,
//             seller: sellerId
//         })
//             .populate('customer', 'name phone defaultAddress')
//             .populate('product')
//             .populate('chatRoom');

//         if (!order) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Order not found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             order
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// }






// Generate OTP for Order Completion - WITH REGENERATE SUPPORT
module.exports.GenerateOTP = async (req, res) => {
    try {
        const { orderId } = req.params;
        const sellerId = req.seller._id;

        // Find order and verify seller ownership
        const order = await OrderModel.findOne({
            _id: orderId,
            seller: sellerId
        }).populate('customer', 'name email phone');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // ✅ FIX: Allow OTP generation for pending orders OR orders with expired OTP
        if (order.orderStatus !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Can only generate OTP for pending orders"
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // ✅ FIX: Reset OTP verification data (for regenerate case)
        order.otpVerification = {
            code: otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            generatedAt: new Date(),
            verified: false,
            attempts: 0
        };

        // DO NOT CHANGE ORDER STATUS - keep it as pending
        order.statusHistory.push({
            status: order.orderStatus,
            timestamp: new Date(),
            note: "OTP generated for order verification"
        });

        await order.save();

        // Send OTP email to customer
        await sendEmail(order.customer.email, "OTP for Order Completion - Loceal",
            `
            <html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #0F0E47;
        }
        .container {
            width: 100%;
            text-align: center;
            padding: 20px;
        }
        .content {
            background-color: #272757;
            padding: 40px;
            margin: 20px auto;
            max-width: 600px;
            border-radius: 10px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
            text-align: left;
            color: #E8E8F0;
        }
        .title {
            font-size: 22px;
            font-weight: bold;
            color: #8686AC;
            text-align: center;
        }
        .message {
            font-size: 16px;
            color: #C9C9D8;
            margin-top: 10px;
            line-height: 1.6;
        }
        .otp-display {
            background-color: #505081;
            color: #FFFFFF;
            font-size: 32px;
            font-weight: bold;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
            letter-spacing: 8px;
        }
        .info-box {
            background-color: #3A3A6B;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            border-left: 4px solid #8686AC;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #A8A8C2;
            text-align: center;
        }
        .header-table {
            background-color: #505081;
            color: white;
            text-align: center;
        }
        .warning {
            color: #FF6B6B;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <table width="100%" cellpadding="0" cellspacing="0" class="header-table">
            <tr>
                <td style="padding: 20px; font-size: 24px; font-weight: bold;">LOCEAL</td>
            </tr>
            <tr>
                <td style="font-size: 16px;">Local Marketplace</td>
            </tr>
        </table>

        <div class="content">
            <div class="title">ORDER COMPLETION OTP</div>
            
            <p class="message">Dear <b>${order.customer.name}</b>,</p>
            
            <p class="message">Your seller <b>${req.seller.businessName}</b> has generated an OTP to complete your order.</p>
            
            <div class="info-box">
                <p style="margin: 5px 0;"><b>Order Number:</b> ${order.orderNumber}</p>
                <p style="margin: 5px 0;"><b>Amount:</b> ₹${order.totalAmount}</p>
                <p style="margin: 5px 0;"><b>Valid Until:</b> ${new Date(order.otpVerification.expiresAt).toLocaleTimeString()}</p>
            </div>

            <p class="message">Please share this OTP with the seller to complete your transaction:</p>

            <div class="otp-display">
                ${otp}
            </div>

            <p class="message warning">⚠️ Do not share this OTP with anyone except the verified seller during your physical meeting.</p>
            
            <p class="message">This OTP will expire in <b>10 minutes</b> for security reasons.</p>

            <p class="footer">
                If you did not request this OTP, please contact our support immediately.<br>
                Thank you for choosing Loceal!
            </p>
        </div>
    </div>
</body>
</html>
            `
        );

        // Send system message in chat room
        await MessageModel.create({
            chatRoom: order.chatRoom,
            senderType: "system",
            senderId: sellerId,
            content: `OTP has been generated and sent to customer's email. Please ask the customer to share the OTP with you to complete the order.`,
            messageType: "system"
        });

        // Log for development
        console.log(`📧 OTP sent to ${order.customer.email}: ${otp}`);

        res.json({
            success: true,
            message: "OTP sent to customer successfully",
            order: {
                orderNumber: order.orderNumber,
                customerName: order.customer.name,
                customerPhone: order.customer.phone,
                totalAmount: order.totalAmount,
                otpExpiresAt: order.otpVerification.expiresAt
            }
        });
    } catch (err) {
        console.error("Generate OTP Error:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};


// Verify OTP and Complete Order - CHANGE STATUS ONLY WHEN OTP VERIFIED
module.exports.VerifyOTP = async (req, res) => {
    try {
        console.log("Hitting Verify OTP Endpoint");
        const { orderId } = req.params;
        const { otp } = req.body;
        const sellerId = req.seller._id;
        
        console.log("Received OTP:", otp);

        // Find order and verify seller ownership
        const order = await OrderModel.findOne({
            _id: orderId,
            seller: sellerId
        }).populate('customer', 'name');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if OTP exists
        if (!order.otpVerification || !order.otpVerification.code) {
            return res.status(400).json({
                success: false,
                message: "No OTP generated for this order. Please generate OTP first."
            });
        }

        console.log("Stored OTP:", order.otpVerification.code);
        console.log("Received OTP:", otp.otp);

        // Check if OTP is already verified
        if (order.otpVerification.verified) {
            return res.status(400).json({
                success: false,
                message: "OTP already verified. Order is already completed."
            });
        }

        // Check OTP expiration
        if (order.otpVerification.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please generate a new OTP."
            });
        }

        // Check OTP attempts
        if (order.otpVerification.attempts >= 3) {
            return res.status(400).json({
                success: false,
                message: "Too many failed OTP attempts. Please generate a new OTP."
            });
        }

        // ✅ FIX: Remove .otp - Compare directly with code
        if (order.otpVerification.code !== otp.otp) {
            // Increment attempts
            order.otpVerification.attempts += 1;
            await order.save();

            return res.status(400).json({
                success: false,
                message: `Invalid OTP. ${3 - order.otpVerification.attempts} attempts remaining.`
            });
        }

        // ✅ OTP VERIFIED - NOW CHANGE STATUS TO COMPLETED
        order.otpVerification.verified = true;
        order.otpVerification.verifiedAt = new Date();
        order.orderStatus = "completed"; // Change from pending to completed
        order.paymentStatus = "cod_completed";
        order.paymentConfirmedBy = {
            userType: "seller",
            userId: sellerId,
            confirmedAt: new Date()
        };

        order.statusHistory.push({
            status: "completed",
            timestamp: new Date(),
            note: "OTP verified - Order completed successfully"
        });

        // Update seller stats
        await SellerModel.findByIdAndUpdate(sellerId, {
            $inc: {
                totalSales: 1,
                totalOrders: 1,
                totalRevenue: order.totalAmount
            }
        });

        // Update product sales count
        await ProductModel.findByIdAndUpdate(order.product, {
            $inc: {
                totalSales: order.quantity,
                stock: -order.quantity
            }
        });

        await order.save();

        // Send completion message in chat
        await MessageModel.create({
            chatRoom: order.chatRoom,
            senderType: "system",
            senderId: sellerId,
            content: `✅ Order completed successfully! Payment received and order marked as complete. Thank you for your business!`,
            messageType: "system"
        });

        res.json({
            success: true,
            message: "Order completed successfully!",
            order: {
                orderNumber: order.orderNumber,
                status: order.orderStatus,
                completedAt: new Date()
            }
        });

    } catch (err) {
        console.error("Verify OTP Error:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};