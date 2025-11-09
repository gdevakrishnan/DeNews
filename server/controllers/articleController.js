const Article = require("../models/Article");
const User = require("../models/User");
require('dotenv').config();

// @desc    Create a new article
// @route   POST /api/article
// @access  Public
const createArticle = async (req, res) => {
    try {
        const { articleTitle, journalist, contentHash, tags = [], refImages = [] } = req.body;

        const newArticle = new Article({
            articleTitle,
            journalist,
            contentHash,
            tags,
            refImages
        });

        const savedArticle = await newArticle.save();
        res.status(201).json({ message: 'Article created successfully', article: savedArticle });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create article', error: error.message });
    }
};

// @desc    Support article
// @route   PUT /api/article/s/:articleId
// @access  Public
const supportRealVote = async (req, res) => {
    try {
        const { contentHash } = req.params;
        const { walletAddress } = req.body;

        const article = await Article.findOne({ contentHash });
        if (!article) return res.status(404).json({ message: 'Article not found' });

        const user = await User.findOne({ walletAddress });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (walletAddress == article.journalist) {
            return res.status(400).json({ message: 'Reverted: You are the author' });
        }

        if (article.voters.includes(walletAddress)) {
            return res.status(400).json({ message: 'You already voted' });
        }

        article.realVotes += 1;
        article.updated = true;
        article.voters.push(walletAddress);
        await article.save();

        // Add article to validatedArticles
        if (!user.validatedArticles.includes(article._id)) {
            user.validatedArticles.push(article._id);
            await user.save();
        }

        res.status(200).json({ message: 'Vote added as validated', article });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add vote', error: error.message });
    }
};

// @desc    Report spam
// @route   PUT /api/article/r/:articleId
// @access  Public
const reportSpam = async (req, res) => {
    try {
        const { contentHash } = req.params;
        const { walletAddress, spamString } = req.body;

        const article = await Article.findOne({ contentHash });
        if (!article) return res.status(404).json({ message: 'Article not found' });

        const user = await User.findOne({ walletAddress });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (walletAddress == article.journalist) {
            return res.status(400).json({ message: 'Reverted: You are the author' });
        }

        if (article.voters.includes(walletAddress)) {
            return res.status(400).json({ message: 'Wallet address has already voted' });
        }

        article.spam.push(spamString);
        article.fakeVotes += 1;
        article.voters.push(walletAddress);
        await article.save();

        if (!user.spammedArticles.includes(article._id)) {
            user.spammedArticles.push(article._id);
            await user.save();
        }

        res.status(200).json({ message: 'Article reported as spam', article });
    } catch (error) {
        res.status(500).json({ message: 'Failed to report spam', error: error.message });
    }
};


// @desc    Get all articles
// @route   GET /api/article
// @access  Public
const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch articles', error: error.message });
    }
};

// @desc    Get article by contentHash
// @route   GET /api/article/hash/:contentHash
// @access  Public
const getArticleByContentHash = async (req, res) => {
    try {
        const { contentHash } = req.params;

        const article = await Article.findOne({ contentHash });

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch article', error: error.message });
    }
};


// @desc    Get articles by journalist
// @route   GET /api/article/journalist/:journalist
// @access  Public
const getArticlesByJournalist = async (req, res) => {
    try {
        const { journalist } = req.params;
        const articles = await Article.find({ journalist }).sort({ createdAt: -1 });

        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch articles', error: error.message });
    }
};

// @desc    Verify article based on voting results
// @route   PUT /api/article/v/:contentHash
// @access  Public
const verifyArticle = async (req, res) => {
    const { contentHash } = req.params;
    const MIN_VOTE = parseInt(process.env.MIN_VOTE, 10);

    if (!contentHash) {
        return res.status(400).json({ error: 'Content hash is required' });
    }

    try {
        const article = await Article.findOne({ contentHash });

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        const { realVotes, fakeVotes } = article;

        const realVotePercentage = (realVotes / MIN_VOTE) * 100;
        const fakeVotePercentage = (fakeVotes / MIN_VOTE) * 100;


        if (fakeVotePercentage >= 51) {
            const updatedArticle = await Article.findOneAndUpdate(
                { contentHash },
                { $set: { deleted: true, verified: false, updated: true } },
                { new: true }
            );

            return res.status(200).json({
                message: 'Article verified was not legitimate, so deleted',
                article: updatedArticle
            });
        }

        if (realVotePercentage >= 51) {
            const updatedArticle = await Article.findOneAndUpdate(
                { contentHash },
                { $set: { verified: true, updated: true } },
                { new: true }
            );

            return res.status(200).json({
                message: 'Article verified as legitimate',
                article: updatedArticle
            });
        }

        return res.status(200).json({
            article,
            message: 'Votes are inconclusive (no 51% majority)',
        });
    } catch (err) {
        console.error('Error verifying article:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Reset the 'updated' flag to false for a specific article
// @route   PUT /api/article/reset-update/:contentHash
// @access  Public
const resetUpdateStatus = async (req, res) => {
    try {
        const { contentHash } = req.params;

        const article = await Article.findOne({ contentHash });
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        if (article.deleted) {
            await Article.deleteOne({ _id: article._id });
            return res.status(200).json({ message: 'Article was deleted', article: { ...article, deleted: true, updated: false } });
        }

        article.updated = false;
        const updatedArticle = await article.save();

        res.status(200).json({ message: 'Article update status reset successfully', article: updatedArticle });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reset update status', error: error.message });
    }
};


module.exports = {
    createArticle,
    supportRealVote,
    reportSpam,
    getAllArticles,
    getArticleByContentHash,
    getArticlesByJournalist,
    verifyArticle,
    resetUpdateStatus
};
