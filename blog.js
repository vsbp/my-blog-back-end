const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String,
        required: true
    },
    texto: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    calendar: {
        type: Date,
        required: false,
        default: Date.now
    }
})

module.exports = mongoose.model('quotes', blogSchema)