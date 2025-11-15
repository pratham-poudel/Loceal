// src/models/Cart.js (Corrected)
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
        // unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Seller',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        // IMPORTANT: Renamed 'price' to 'priceAtAdd' for clarity and stability
        priceAtAdd: { 
            type: Number,
            required: true,
        },
        addedAt: { // Added this field for better management
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

cartSchema.index({ customer: 1 });

// IMPORTANT: Correctly exporting the Cart model
module.exports = mongoose.model('Cart', cartSchema);