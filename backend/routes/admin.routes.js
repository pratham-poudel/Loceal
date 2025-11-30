const express = require("express");
const router = express.Router();

const body = require("express-validator");

const adminController = require("../controllers/admin.controllers");
const {authAdmin} = require("../middlewares/auth.middleware");

router.post("/register", adminController.Register);
router.post("/login", adminController.Login);
router.get("/logout", authAdmin, adminController.Logout);

router.get("/profile", authAdmin, adminController.GetProfile);

// User management routes
router.get("/customers", authAdmin, adminController.GetAllCustomers);
router.get("/sellers", authAdmin, adminController.GetAllSellers);
router.post("/block-user", authAdmin, adminController.BlockUser);
router.post("/unblock-user", authAdmin, adminController.UnblockUser);

module.exports = router;



