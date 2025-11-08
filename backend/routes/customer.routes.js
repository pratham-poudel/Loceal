const express = require("express");
const router = express.Router();

const body = require("express-validator");

const customerController = require("../controllers/customer.controllers");
const {authCustomer} = require("../middlewares/auth.middleware");


router.post("/register", customerController.Register);
router.get("/verifyCustomer/:token", customerController.VerifyCustomer);   
router.post("/login", customerController.Login);
router.get("/logout", customerController.Logout);


// browse all products
router.get("/products", authCustomer, customerController.GetProducts)
// get single product details
router.get("/products/:productId", authCustomer, customerController.GetProductDetails)


// get cart details
router.get("/cart", authCustomer, customerController.GetCart);
// add to cart
router.get("/cart/add", authCustomer, customerController.AddToCart);
// remove from cart
router.delete("/cart/remove/:productId", authCustomer, customerController.RemoveFromCart);
// update cart item quantity
router.put("/cart/update/:productId", authCustomer, customerController.UpdateCartItem);
// clear cart
router.delete("/cart/clear", authCustomer, customerController.ClearCart);


// create order from specific cart item
router.post("/orders", authCustomer, customerController.CreateOrder); 
// Pending/active orders
router.get("/orders/active", authCustomer, customerController.GetActiveOrders); 
// Get Single Order Details with Chat
router.get("/orders/:orderId", authCustomer, customerController.GetOrderWithChat); 



module.exports = router;