const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// GET request to fetch content for a specific page and language
router.get('/page/:page/:lang', async (req, res) => {
    const { page, lang } = req.params;
    try {
        const data = await Content.findOne({ page, lang });
        if (!data) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST request to update or create content
router.post('/admin/content', async (req, res) => {
    const { page, lang, content } = req.body;
    try {
        let existingContent = await Content.findOne({ page, lang });
        if (existingContent) {
            existingContent.content = content;
            await existingContent.save();
            res.json({ message: 'Content updated successfully' });
        } else {
            const newContent = new Content({ page, lang, content });
            await newContent.save();
            res.status(201).json({ message: 'Content created successfully' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
