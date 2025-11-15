# TO BE DONE (Priority -> Late)
- integrate notification model later
- reuse mail code


# IF DONE PRODUCTION then
- build once logout user -> caching at REDIS jate login bea ke no
- rate limiter logam


// ❌ MISSING - Needed for OTP verification
module.exports.VerifyOTP = async (req, res) => {
    // Complete order after OTP verification
}

// ❌ MISSING - Order cancellation
module.exports.CancelOrder = async (req, res) => {
    // Cancel active orders
}


// otpSchema addtion later



// Have to implement this
router.get("/orders/completed", authCustomer, customerController.GetCompletedOrders);


// Proceeding from cart -> only one product added into the active order (bug) -> Have to fix this

// Same item adding to cart many times -> not allowed 😅 -> or future prespective😂

