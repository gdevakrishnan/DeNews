const express = require('express');
const router = express.Router();

const {
    createArticle,
    supportRealVote,
    reportSpam,
    getAllArticles,
    getArticleByContentHash,
    getArticlesByJournalist,
    verifyArticle,
    resetUpdateStatus
} = require('../controllers/articleController'); // Adjust path if needed

// @route   POST /api/article
// @desc    Create a new article
router.post('/', createArticle);

// @route   PUT /api/article/s/:articleId
// @desc    Support article (real vote)
router.put('/s/:contentHash', supportRealVote);

// @route   PUT /api/article/r/:articleId
// @desc    Report article as spam
router.put('/r/:contentHash', reportSpam);

// @desc    Verify article based on voting results
// @route   PUT /api/articles/v/:contentHash
// @access  Public
router.put('/v/:contentHash', verifyArticle);


// @route   GET /api/article
// @desc    Get all articles
router.get('/', getAllArticles);

// @route   GET /api/article/:articleId
// @desc    Get article by ID
router.get('/:contentHash', getArticleByContentHash);

// @route   GET /api/article/journalist/:journalist
// @desc    Get articles by journalist
router.get('/journalist/:journalist', getArticlesByJournalist);

// @desc    Reset the 'updated' flag to false for a specific article
// @route   PUT /api/article/reset-update/:contentHash
router.put('/reset-update/:contentHash', resetUpdateStatus);

module.exports = router;
