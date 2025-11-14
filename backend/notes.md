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