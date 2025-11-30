const AdminModel = require("../models/admin.model");
const CustomerModel = require("../models/customer.model");
const SellerModel = require("../models/seller.model");
const jwt = require("jsonwebtoken");

module.exports.Register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const adminExists = await AdminModel.findOne({ email });

        if (adminExists) {
            return res.status(400).json({
                message: "Admin with this email already exists"
            });
        }

        const hashedPassword = await AdminModel.hashPassword(password);

        const admin = new AdminModel({
            name,
            email,
            password: hashedPassword,
            phone
        });

        await admin.save();

        const token = admin.generateAuthToken();
        res.cookie("token", token);

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone
            },
            token
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports.Login = async (req, res) => {
    try {
        console.log("Admin Login Route Hit - Request Body:", req.body);
        const { email, password } = req.body;

        const admin = await AdminModel.findOne({ email }).select("+password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await admin.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = admin.generateAuthToken();
        res.cookie("token", token);

        res.status(200).json({
            success: true,
            message: "Login successful",
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone
            },
            token
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports.Logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports.GetProfile = async (req, res) => {
    try {
        res.json({
            success: true,
            admin: req.admin
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports.GetAllCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const customers = await CustomerModel.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalCustomers = await CustomerModel.countDocuments();

        res.status(200).json({
            success: true,
            customers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCustomers / limit),
                totalCustomers,
                limit
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports.GetAllSellers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const sellers = await SellerModel.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalSellers = await SellerModel.countDocuments();

        res.status(200).json({
            success: true,
            sellers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalSellers / limit),
                totalSellers,
                limit
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports.BlockUser = async (req, res) => {
    try {
        const { userType, userId } = req.body;

        if (!userType || !userId) {
            return res.status(400).json({
                success: false,
                message: "User type and user ID are required"
            });
        }

        let user;
        if (userType === 'customer') {
            user = await CustomerModel.findByIdAndUpdate(
                userId,
                { isBlocked: true },
                { new: true }
            ).select('-password');
        } else if (userType === 'seller') {
            user = await SellerModel.findByIdAndUpdate(
                userId,
                { isBlocked: true },
                { new: true }
            ).select('-password');
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid user type. Must be 'customer' or 'seller'"
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `${userType} not found`
            });
        }

        res.status(200).json({
            success: true,
            message: `${userType} blocked successfully`,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports.UnblockUser = async (req, res) => {
    try {
        const { userType, userId } = req.body;

        if (!userType || !userId) {
            return res.status(400).json({
                success: false,
                message: "User type and user ID are required"
            });
        }

        let user;
        if (userType === 'customer') {
            user = await CustomerModel.findByIdAndUpdate(
                userId,
                { isBlocked: false },
                { new: true }
            ).select('-password');
        } else if (userType === 'seller') {
            user = await SellerModel.findByIdAndUpdate(
                userId,
                { isBlocked: false },
                { new: true }
            ).select('-password');
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid user type. Must be 'customer' or 'seller'"
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `${userType} not found`
            });
        }

        res.status(200).json({
            success: true,
            message: `${userType} unblocked successfully`,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}