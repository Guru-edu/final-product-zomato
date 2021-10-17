const mongoose = require('mongoose');

// Initialising the mongoose Schema
const Schema = mongoose.Schema;

// Registering the City Schema
const LocationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    city_id: {
        type: Number,
        required: true
    },
    location_id: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country_name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('locations', LocationSchema, 'locations');   // exporting the model