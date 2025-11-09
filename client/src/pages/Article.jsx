import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import appContext from '../context/appContext';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import useAxios from '../hooks/useAxios';
import { getArticleByContentHash, reportSpam, supportRealVote, updateArticleStatus, verifyArticle } from '../services/serviceWorker';

const Article = () => {
    const { State } = useContext(appContext);
    const { WalletAddress, ReadContract, WriteContract } = State;
    const { id } = useParams();
    const { api } = useAxios();
    const [articleContent, setArticleContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [articleData, setArticleData] = useState(null);
    const [articles, setArticles] = useState([]);
    const [showSpamReport, setShowSpamReport] = useState(false);
    const [spamReportText, setSpamReportText] = useState('');
    const [spamReports, setSpamReports] = useState([]);
    const [hasVoted, setHasVoted] = useState(false);

    const nav = useNavigate();

    const writeOnContract = async (e) => {
        e.preventDefault();

        if (!articleData) return alert("Article not found");

        try {
            const tx = await WriteContract.updateArticle(
                articleData.articleTitle,
                articleData.contentHash,
                articleData.refImages,
                articleData.verified,
                articleData.realVotes,
                articleData.fakeVotes,
                articleData.voters,
                articleData.deleted
            );
            await tx.wait();

            await updateArticleStatus({ contentHash: articleData.contentHash })
                .then(response => {
                    console.log(response);
                    console.log(response.message);

                    if (response.article.deleted) {
                        nav('/read');
                    }
                    
                    setArticleData(response.article);
                })
                .catch (e => console.log(e.message));
        }   catch (e) {
            console.log(e.message);
        }
    }

    const fetchArticleData = () => {
        if (!articles || !id) return;
        console.log(id);

        getArticleByContentHash({ contentHash: id })
            .then((response) => {
                console.log(response);
                console.log("contentHash: " + response.contentHash);
                fetchArticleContent(response.contentHash);
                setArticleData(response);
            })
            .catch(e => console.log(e.message));
    }

    const fetchArticleStatus = async () => {
        try {
            await verifyArticle({ contentHash: id })
                .then(response => console.log("Verification response:", response))
                .catch(e => console.log(e.message));
        } catch (e) {
            console.log(e.message);
        }
    }

    useEffect(() => {
        fetchArticleData();
    }, [id, articles]);

    useEffect(() => {
        fetchArticleStatus();
    }, [id, articles]);

    const checkIfVoted = (voters, address) => {
        if (!voters || !address) return false;

        const normalizedAddress = address.toLowerCase();
        const normalizedVoters = voters.map(v => v.toLowerCase());
        return normalizedVoters.includes(normalizedAddress);
    }

    useEffect(() => {
        if (!articleData || !WalletAddress) return;

        console.log("articleData");
        console.log(articleData);

        const result = checkIfVoted(articleData.voters, WalletAddress);
        setHasVoted(result);
    }, [articleData, articleContent, WalletAddress]);

    const fetchArticleContent = async (contentHash) => {
        try {
            setLoading(true);
            const response = await fetch(`https://gateway.pinata.cloud/ipfs/${contentHash}`);

            console.log(response);

            if (!response.ok) {
                throw new Error('Failed to fetch article content');
            }

            const content = await response.json();
            console.log(content);
            setArticleContent(content);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatAddress = (address) => {
        if (!address) return 'Unknown';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const handleActions = async (contentHash, isReal) => {
        try {
            if (!contentHash || !WalletAddress || !isReal) {
                alert("Error occurred: Missing data");
                return;
            }

            await supportRealVote({ contentHash, WalletAddress })
                .then(response => {
                    console.log("Vote response:");
                    console.log(response);
                    setSuccess(response?.message);
                    setArticleData(response.article);
                    alert(response?.message);
                    fetchArticleData();
                })
                .catch(e => console.log(e.message));

            fetchArticleData();

        } catch (error) {
            console.error("handleActions error:", error);

            let errorMessage = "Transaction failed: An error occurred. Please try again.";

            if (error?.error?.message) {
                errorMessage = error.error.message;
            } else if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            alert(errorMessage);
        }
    };

    const handleSpamClick = (e) => {
        e.preventDefault();
        setShowSpamReport(true);
    };

    const fetchSpamReports = async () => {
        const fetchedReports = [];
        for (const cid of (articleData.spam)) {
            const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
            if (!response.ok) {
                console.warn(`Failed to fetch spam report from CID: ${cid}`);
                continue;
            }

            const spamData = await response.json();

            if (typeof spamData === 'string') {
                fetchedReports.push(spamData);
            } else if (spamData?.spam_report) {
                fetchedReports.push(spamData.spam_report);
            } else {
                console.warn(`Unexpected spam data format from CID: ${cid}`, spamData);
            }
            setSpamReports(fetchedReports);
        }
    }

    useEffect(() => {
        if (!articleData || !articleData.spam) return;
        fetchSpamReports();
    }, [articleData, articleContent]);

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        try {
            const task = await api.post('/spam-report', {
                "spam_report": spamReportText
            });

            task && task.cid && console.log(task.cid);
            if (task && task.cid == "") {
                alert("Error occured");
                return;
            }

            reportSpam({
                contentHash: articleData.contentHash,
                WalletAddress,
                spamString: task.cid
            })
                .then(response => {
                    console.log("Spam article response: ");
                    console.log(response);
                    setArticleData(response.article);
                })
                .catch(e => console.log(e.message));

            return;
        } catch (error) {
            console.error('Transaction failed:', error);

            // Attempt to extract revert reason
            let errorMessage = 'Transaction failed: An error occurred. Please try again.';

            if (error?.error?.message) {
                errorMessage = error.error.message;
            } else if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            alert(`${errorMessage}`);
        }
    };

    const handleCancelReport = () => {
        setSpamReportText('');
        setShowSpamReport(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading article...</p>
                </div>
            </div>
        );
    }

    if (!articleContent || !articleData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 mt-15">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Article Header */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {articleContent.title}
                        </h1>

                        {/* Article Metadata */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                            <div className="flex items-center">
                                <span className="font-medium">Journalist:</span>
                                <span className="ml-1 font-mono bg-gray-100 px-2 py-1 rounded">
                                    {formatAddress(articleData.journalist)}
                                </span>
                            </div>

                            <div className="flex items-center">
                                <span className="font-medium">Created At:</span>
                                <span className="ml-1">{new Date(articleData.createdAt * 1000).toLocaleDateString()}</span>
                            </div>

                            <div className="flex items-center">
                                <span className="font-medium">Article ID:</span>
                                <span className="ml-1">#{articleData._id.toString()}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {
                                articleData.tags && articleData.tags.map((item, index) => (
                                    <h1
                                        key={index}
                                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-normal"
                                    >
                                        {item}
                                    </h1>
                                ))
                            }
                        </div>

                        {/* Verification and Status Badges */}
                        <div className="flex flex-wrap gap-2 mb-6 justify-end">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${articleData.verified
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {articleData.verified ? 'Verified' : 'Pending Verification'}
                            </span>
                        </div>

                        {/* Article Content */}
                        <div className="prose max-w-none">
                            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
                                {articleContent.text}
                            </div>
                        </div>

                        {/* Reference images */}
                        {articleData?.refImages?.length > 0 && (
                            <div className="flex flex-col mt-4">
                                <span className="font-medium">Reference Images</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {articleData.refImages.map((cid, index) => (
                                        <div
                                            key={cid}
                                            className="w-24 sm:w-32 md:w-40 aspect-square bg-gray-200 rounded overflow-hidden"
                                        >
                                            <img
                                                src={`https://gateway.pinata.cloud/ipfs/${cid}`}
                                                alt={`Reference image ${index + 1}`}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {
                            !hasVoted ? (
                                <div className="flex items-center gap-4 mt-6">
                                    {/* Like Button */}
                                    <button
                                        onClick={() => handleActions(articleData.contentHash, true)} // Replace with your handler
                                        className="flex items-center px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded shadow transition"
                                    >
                                        <ThumbsUp className="w-5 h-5 mr-2" />
                                        Verify & validate
                                    </button>

                                    {/* Dislike Button */}
                                    <button
                                        onClick={(e) => handleSpamClick(e)}
                                        className="flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded shadow transition"
                                    >
                                        <ThumbsDown className="w-5 h-5 mr-2" />
                                        Spam
                                    </button>
                                </div>
                            ) : <p className='mt-4 px-2 py-1 rounded bg-gray-200 inline-block'>Already Voted</p>
                        }

                        {/* Spam Report Section */}
                        {showSpamReport && (
                            <div className="mt-6 p-4 bg-white border border-gray-300 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Report Spam</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Please describe why you think this article is spam (minimum 30 characters):
                                </p>
                                <textarea
                                    value={spamReportText}
                                    onChange={(e) => setSpamReportText(e.target.value)}
                                    placeholder="Enter your reason for reporting this article as spam..."
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                                    rows="4"
                                />
                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={handleReportSubmit}
                                        disabled={spamReportText.trim().length < 40}
                                        className="px-4 py-2 bg-gray-700 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded shadow transition"
                                    >
                                        Report
                                    </button>
                                    <button
                                        onClick={handleCancelReport}
                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded shadow transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* IPFS Hash */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">IPFS Hash:</span>
                                <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded break-all">
                                    {articleData.contentHash}
                                </span>
                            </div>
                        </div>

                        {
                            (articleData.updated && (articleData.deleted || articleData.verified)) && 
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-blue-900 mb-2">Earn Rewards for Updates</h3>
                                            <p className="text-sm text-blue-800">
                                                Help improve this article and earn rewards as 5DNT! Click the update button to contribute
                                                additional information or corrections and receive compensation for your efforts.
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => writeOnContract(e)}
                                            className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow transition whitespace-nowrap"
                                        >
                                            Update Article
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }

                        {/* Spam Reports Section */}
                        {spamReports.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Spam Reports ({spamReports.length})</h3>
                                <div className="space-y-3">
                                    {spamReports.map((report, index) => (
                                        <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <p className="text-sm text-red-800">{report}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Article;