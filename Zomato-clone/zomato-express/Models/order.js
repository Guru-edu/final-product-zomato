const mongoose = require('mongoose');

// Initialising the mongoose Schema
const Schema = mongoose.Schema;

// Registering the Users Schema
const OrderSchema = new Schema({
    RestaurantName: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    placedBy: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('orderlist', OrderSchema, 'orderlist');   // exporting the model