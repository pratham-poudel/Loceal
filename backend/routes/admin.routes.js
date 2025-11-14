const express = require("express");
const router = express.Router();

const body = require("express-validator");

const adminController = require("../controllers/admin.controllers");
const {authAdmin} = require("../middlewares/auth.middleware");

router.post("/register", adminController.Register);
router.post("/login", adminController.Login);
router.get("/logout", adminController.Logout);

router.get("/profile", authAdmin, adminController.GetProfile);

module.exports = router;



