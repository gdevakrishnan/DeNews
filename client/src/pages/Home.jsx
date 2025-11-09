import React, { useContext, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Link } from "react-router-dom";

import {
    Eye,
    User,
    Calendar,
    ThumbsUp,
    ThumbsDown,
    CheckCircle,
    AlertTriangle,
    Hash,
    TrendingUp,
    TrendingDown,
    Users,
    Tag,
    Filter,
    X
} from 'lucide-react';
import appContext from '../context/appContext';
import { getAllArticles } from '../services/serviceWorker';

const Home = () => {
    // For demo purposes, using mock context. Replace with: const { State } = useContext(appContext);
    const { State } = useContext(appContext);
    const { WalletAddress, ReadContract } = State;
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const y = useMotionValue(0);
    const yRange = useTransform(y, [0, 1], ['0%', '50%']);

    const handleArticleClick = (id) => {
        console.log(`Navigate to article ${id}`);
        // Replace with: navigate(`/read/${id}`);
    };

    const fetchAllArticles = async () => {
        try {
            setLoading(true);

            if (!ReadContract || !WalletAddress) return;

            const response = await getAllArticles();

            const mappedArticles = response.map(item => ({
                id: item.id,
                journalist: item.journalist,
                contentHash: item.contentHash,
                verified: item.verified,
                flagged: item.flagged,
                createdAt: item.createdAt,
                realVotes: item.realVotes,
                fakeVotes: item.fakeVotes,
                likes: item.likes,
                dislikes: item.dislikes,
                voters: item.voters,
                tags: item.tags,
                articleTitle: item.articleTitle,
            }));

            console.log(mappedArticles);

            setArticles(mappedArticles);
            setFilteredArticles(mappedArticles);

            // Extract and sort unique tags
            const tagsSet = new Set();
            mappedArticles.forEach(article => {
                article.tags?.forEach(tag => {
                    const trimmedTag = tag?.trim();
                    if (trimmedTag) tagsSet.add(trimmedTag);
                });
            });

            setAllTags([...tagsSet].sort());

        } catch (err) {
            console.error("Error fetching articles:", err.message || err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        ReadContract && WalletAddress && fetchAllArticles();
    }, [WalletAddress]);

    // Filter articles based on selected tags
    useEffect(() => {
        if (selectedTags.length === 0) {
            setFilteredArticles(articles);
        } else {
            const filtered = articles.filter(article => {
                if (!article.tags || !Array.isArray(article.tags)) return false;
                return selectedTags.every(selectedTag =>
                    article.tags.some(articleTag =>
                        articleTag && articleTag.trim().toLowerCase() === selectedTag.toLowerCase()
                    )
                );
            });
            setFilteredArticles(filtered);
        }
    }, [selectedTags, articles]);

    const handleTagToggle = (tag) => {
        setSelectedTags(prev => {
            if (prev.includes(tag)) {
                return prev.filter(t => t !== tag);
            } else {
                return [...prev, tag];
            }
        });
    };

    const clearFilters = () => {
        setSelectedTags([]);
    };

    const getVerificationBadge = (verified, flagged) => {
        if (flagged) {
            return (
                <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    Flagged
                </div>
            );
        }
        if (verified) {
            return (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                </div>
            );
        }
        return (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                <Eye className="w-3 h-3" />
                Pending
            </div>
        );
    };

    const getCredibilityScore = (realVotes, fakeVotes) => {
        const total = realVotes + fakeVotes;
        if (total === 0) return { score: 0, label: 'No votes', color: 'text-gray-500' };

        const percentage = (realVotes / total) * 100;
        if (percentage >= 80) return { score: percentage, label: 'Highly Credible', color: 'text-green-600' };
        if (percentage >= 60) return { score: percentage, label: 'Credible', color: 'text-blue-600' };
        if (percentage >= 40) return { score: percentage, label: 'Mixed', color: 'text-yellow-600' };
        return { score: percentage, label: 'Low Credibility', color: 'text-red-600' };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded-lg w-48 mb-8"></div>
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl p-6 h-96 shadow-sm"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 pt-20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-gray-900 mb-2"
                    >
                        Latest Articles
                    </motion.h1>
                    <p className="text-gray-600 text-lg">
                        Discover and verify news articles on the blockchain
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                        <span>{filteredArticles.length} articles found</span>
                        {selectedTags.length > 0 && (
                            <span>• Filtered by {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''}</span>
                        )}
                    </div>
                </div>

                {/* Tags Filter Section */}
                {allTags.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Filter className="w-5 h-5 text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Filter by Tags</h3>
                            {selectedTags.length > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="ml-auto flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                    Clear filters
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {allTags.map((tag, index) => (
                                <motion.button
                                    key={tag}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleTagToggle(tag)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${selectedTags.includes(tag)
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {tag}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Error State */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
                    >
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="font-medium">{error}</span>
                        </div>
                    </motion.div>
                )}

                {/* Articles Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                >
                    {filteredArticles.map((article, index) => {
                        const credibility = getCredibilityScore(article.realVotes, article.fakeVotes);

                        return (
                            <motion.div
                                key={article._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleArticleClick(article.id)}
                                className="group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-sm"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        {/* <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                            {article.id}
                                        </div> */}
                                        <Link
                                            to={`/read/${article.contentHash}`}
                                            className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {article.articleTitle.slice(0, 35)}...
                                        </Link>
                                    </div>
                                    {getVerificationBadge(article.verified, article.flagged)}
                                </div>

                                {/* Journalist */}
                                <div className="flex items-center gap-2 mb-4 text-gray-700">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium truncate">
                                        {article.journalist.slice(0, 8)}...{article.journalist.slice(-6)}
                                    </span>
                                </div>

                                {/* Content Hash */}
                                {/* <div className="flex items-center gap-2 mb-4 text-gray-500">
                                    <Hash className="w-4 h-4" />
                                    <span className="text-xs font-mono truncate">
                                        {article.contentHash.slice(0, 15)}...
                                    </span>
                                </div> */}

                                {/* Tags */}
                                {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Tag className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-600">Tags</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {article.tags.slice(0, 3).map((tag, tagIndex) => (
                                                <span
                                                    key={tagIndex}
                                                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {article.tags.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                    +{article.tags.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Credibility Score */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">Credibility</span>
                                        <span className={`text-sm font-bold ${credibility.color}`}>
                                            {credibility.score.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${credibility.score >= 80 ? 'bg-green-500' :
                                                credibility.score >= 60 ? 'bg-blue-500' :
                                                    credibility.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${credibility.score}%` }}
                                        ></div>
                                    </div>
                                    <span className={`text-xs ${credibility.color} mt-1 block`}>
                                        {credibility.label}
                                    </span>
                                </div>

                                {/* Voting Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                            <span className="text-xs text-gray-600">Verified</span>
                                        </div>
                                        <div className="text-lg font-bold text-green-600">
                                            {article.realVotes}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <TrendingDown className="w-4 h-4 text-red-600" />
                                            <span className="text-xs text-gray-600">Spam</span>
                                        </div>
                                        <div className="text-lg font-bold text-red-600">
                                            {article.fakeVotes}
                                        </div>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(article.createdAt * 1000).toLocaleDateString()}</span>
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Empty State */}
                {filteredArticles.length === 0 && !loading && !error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                    >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Eye className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {selectedTags.length > 0 ? 'No articles found with selected tags' : 'No articles found'}
                        </h3>
                        <p className="text-gray-500">
                            {selectedTags.length > 0
                                ? 'Try adjusting your tag filters or clear all filters to see more articles.'
                                : 'Articles will appear here once they are published to the blockchain.'
                            }
                        </p>
                        {selectedTags.length > 0 && (
                            <button
                                onClick={clearFilters}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Clear all filters
                            </button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Home;