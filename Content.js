const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true
    },
    lang: {
        type: String,
        required: true,
        enum: ['en', 'ar', 'fr', 'es', 'tr']
    },
    content: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model('Content', ContentSchema);
