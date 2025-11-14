const AdminModel = require("../models/admin.model");
const jwt = require("jsonwebtoken");

module.exports.Register = async (req, res) => {
    res.status(200).json({ message: "Customer registered successfully" });
}

module.exports.Login = async (req, res) => {
    res.status(200).json({ message: "Customer registered successfully" });
}

module.exports.Logout = async (req, res) => {
    res.status(200).json({ message: "Customer registered successfully" });
}

module.exports.GetProfile = async (req, res) => {
    try {
    res.json({
      success: true,
      customer: req.admin
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}