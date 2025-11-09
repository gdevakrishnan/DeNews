const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    articleTitle: {
        type: String,
        required: true,
    },
    journalist: {
        type: String,
        required: true,
    },
    contentHash: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    refImages: {
        type: [String],
        default: [],
    },
    spam: {
        type: [String],
        default: [],
    },
    verified: {
        type: Boolean,
        default: false,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    updated: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Number,
        default: () => Math.floor(Date.now() / 1000),
    },
    realVotes: {
        type: Number,
        default: 0,
    },
    fakeVotes: {
        type: Number,
        default: 0,
    },
    voters: {
        type: [String],
        default: [],
    },
}, {timestamps: true});

module.exports = mongoose.model('Article', articleSchema);
