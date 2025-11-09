import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Book, Shield, Coins, Users, Code, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

const Docs = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: Book },
    { id: 'how-it-works', title: 'How It Works', icon: Zap },
    { id: 'token-economy', title: 'Token Economy', icon: Coins },
    { id: 'verification', title: 'Verification Process', icon: Shield },
    { id: 'smart-contracts', title: 'Smart Contracts', icon: Code },
    { id: 'api-reference', title: 'API Reference', icon: Users },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center">
                <Book className="mr-3" size={32} />
                Getting Started
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Welcome to DeNews - the future of decentralized news verification. This guide will help you understand how to interact with our platform as a journalist, reader, or validator.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-100 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">For Journalists</h3>
                </div>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                    Register with cryptographic verification
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                    Purchase DNT tokens (minimum 0.0001 DNT)
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                    Stake tokens to submit articles
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                    Earn rewards for verified authentic news
                  </li>
                </ol>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-100 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">For Readers</h3>
                </div>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                    Connect your wallet to the platform
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                    Hold DNT tokens to participate in voting
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                    Vote on article authenticity
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                    Earn rewards for accurate voting
                  </li>
                </ol>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Quick Start</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Coins size={24} />
                  </div>
                  <p className="text-sm">Exchange Rate: 1 ETH = 1000 DNT</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Shield size={24} />
                  </div>
                  <p className="text-sm">Minimum Votes: 101 for verification</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <AlertTriangle size={24} />
                  </div>
                  <p className="text-sm">Penalty: 0.00005 DNT for fake news</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'how-it-works':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center">
                <Zap className="mr-3" size={32} />
                How It Works
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                DeNews operates on a decentralized verification system that combines blockchain technology with community governance to ensure news authenticity.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Article Submission",
                  description: "Journalists submit articles with token stakes, ensuring skin in the game for quality content.",
                  details: "Each article requires a minimum stake of 0.0001 DNT tokens. This stake acts as collateral and demonstrates the journalist's confidence in their content."
                },
                {
                  step: 2,
                  title: "Community Verification",
                  description: "Token holders vote on article authenticity through a democratic process.",
                  details: "Readers with DNT tokens can vote on whether an article is authentic or fake. A minimum of 101 votes is required for final verification."
                },
                {
                  step: 3,
                  title: "Consensus Mechanism",
                  description: "The system determines article authenticity based on majority voting.",
                  details: "Articles receiving majority 'real' votes are verified and published. Those deemed fake are flagged and removed from the platform."
                },
                {
                  step: 4,
                  title: "Reward Distribution",
                  description: "Honest participants receive rewards while dishonest actors face penalties.",
                  details: "Accurate voters earn token rewards, while journalists who submit fake news lose their staked tokens as penalties."
                }
              ].map((item, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-100 shadow-lg">
                  <div className="flex items-start">
                    <div className="bg-green-100 text-green-700 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold mr-4 mt-1">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-700 mb-3">{item.description}</p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{item.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'token-economy':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center">
                <Coins className="mr-3" size={32} />
                Token Economy
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                DNT (DeNews Token) powers the entire ecosystem, creating economic incentives for quality journalism and accurate verification.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-100 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Token Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Exchange Rate</span>
                    <span className="font-semibold text-green-700">1 ETH = 1000 DNT</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Minimum Stake</span>
                    <span className="font-semibold text-green-700">0.0001 DNT</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-gray-700">Fake News Penalty</span>
                    <span className="font-semibold text-red-700">0.00005 DNT</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Minimum Votes</span>
                    <span className="font-semibold text-blue-700">101 votes</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-100 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Token Utility</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Article submission staking</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Voting participation rights</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-purple-100 p-1 rounded-full mr-3 mt-1">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Reward distribution</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-orange-100 p-1 rounded-full mr-3 mt-1">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">Governance participation</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Economic Incentives</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Positive Incentives</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Rewards for authentic article verification</li>
                    <li>• Voting accuracy bonuses</li>
                    <li>• Reputation-based multipliers</li>
                    <li>• Early adopter benefits</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Penalty Mechanisms</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Stake loss for fake news submission</li>
                    <li>• Voting inconsistency penalties</li>
                    <li>• Reputation degradation</li>
                    <li>• Temporary platform restrictions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'verification':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center">
                <Shield className="mr-3" size={32} />
                Verification Process
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our multi-layered verification system ensures the highest standards of news authenticity through cryptographic proofs and community consensus.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-100 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Zero-Knowledge Proof Verification</h3>
                <p className="text-gray-700 mb-4">
                  Journalists undergo cryptographic identity verification without revealing personal information, ensuring both privacy and authenticity.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Verification Steps:</h4>
                  <ol className="space-y-2 text-sm text-green-700">
                    <li>1. Generate cryptographic proof of identity</li>
                    <li>2. Submit proof to verification smart contract</li>
                    <li>3. Receive verified journalist status</li>
                    <li>4. Maintain reputation through quality submissions</li>
                  </ol>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-100 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Community Voting Mechanism</h3>
                <p className="text-gray-700 mb-4">
                  Democratic verification through token-weighted voting ensures community consensus on article authenticity.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Voting Requirements</h4>
                    <ul className="space-y-1 text-sm text-green-700">
                      <li>• Must hold minimum DNT tokens</li>
                      <li>• Account must be verified</li>
                      <li>• Good reputation score required</li>
                      <li>• No conflicts of interest</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Consensus Rules</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Minimum 101 votes required</li>
                      <li>• Simple majority determines outcome</li>
                      <li>• Weighted by token holdings</li>
                      <li>• Time-limited voting period</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-100 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Reputation System</h3>
                <p className="text-gray-700 mb-4">
                  Dynamic reputation scoring for both journalists and voters ensures long-term platform quality.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Journalist Reputation</span>
                    <span className="text-sm text-gray-600">Based on article verification success rate</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Voter Reputation</span>
                    <span className="text-sm text-gray-600">Based on voting accuracy and consistency</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Platform Reputation</span>
                    <span className="text-sm text-gray-600">Overall ecosystem health metric</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'smart-contracts':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center">
                <Code className="mr-3" size={32} />
                Smart Contracts
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                DeNews is powered by secure, audited smart contracts deployed on Ethereum Sepolia testnet.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-100 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Contract Information</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Network</h4>
                    <p className="text-green-700">Ethereum Sepolia Testnet</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Contract Address</h4>
                    <p className="text-green-700 font-mono text-sm break-all">
                      0xBf14B1Ff209105aF7cBBb4bd2b32733bc9f859d0
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-100 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Core Functions</h3>
                <div className="space-y-4">
                  {[
                    {
                      name: "submitArticle()",
                      description: "Submit a news article with token stake",
                      parameters: "title, content, category, stake_amount"
                    },
                    {
                      name: "voteOnArticle()",
                      description: "Vote on article authenticity",
                      parameters: "article_id, vote (true/false)"
                    },
                    {
                      name: "buyTokens()",
                      description: "Purchase DNT tokens with ETH",
                      parameters: "amount (in ETH)"
                    },
                    {
                      name: "verifyJournalist()",
                      description: "Verify journalist identity with ZK proof",
                      parameters: "proof, public_key"
                    }
                  ].map((func, index) => (
                    <div key={index} className="border-l-4 border-green-400 pl-4 py-2">
                      <h4 className="font-semibold text-gray-800">{func.name}</h4>
                      <p className="text-gray-700 text-sm mb-1">{func.description}</p>
                      <p className="text-xs text-gray-500 font-mono">{func.parameters}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-100 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Events</h3>
                <div className="space-y-3">
                  {[
                    "ArticleSubmitted(uint256 articleId, address journalist, uint256 stake)",
                    "VoteCast(uint256 articleId, address voter, bool vote)",
                    "ArticleVerified(uint256 articleId, bool isAuthentic)",
                    "TokensPurchased(address buyer, uint256 amount)",
                    "JournalistVerified(address journalist, uint256 timestamp)"
                  ].map((event, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <code className="text-sm text-gray-700">{event}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'api-reference':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center">
                <Users className="mr-3" size={32} />
                API Reference
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Comprehensive API documentation for integrating with DeNews platform.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-100 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Base URL</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono">
                https://api.denews.io/v1
              </div>
            </div>

            <div className="space-y-6">
              {[
                {
                  method: "POST",
                  endpoint: "/articles",
                  description: "Submit a new article",
                  example: `{
  "title": "Breaking News Title",
  "content": "Article content...",
  "category": "politics",
  "stake": 0.0001
}`
                },
                {
                  method: "GET",
                  endpoint: "/articles",
                  description: "Retrieve articles list",
                  example: `{
  "page": 1,
  "limit": 10,
  "category": "all",
  "status": "verified"
}`
                },
                {
                  method: "POST",
                  endpoint: "/votes",
                  description: "Vote on article authenticity",
                  example: `{
  "article_id": 123,
  "vote": true,
  "voter_address": "0x..."
}`
                },
                {
                  method: "GET",
                  endpoint: "/tokens/balance",
                  description: "Get user token balance",
                  example: `{
  "address": "0x...",
  "token": "DNT"
}`
                }
              ].map((api, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-100 shadow-lg">
                  <div className="flex items-center mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full mr-3 ${
                      api.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {api.method}
                    </span>
                    <code className="text-lg font-mono text-gray-800">{api.endpoint}</code>
                  </div>
                  <p className="text-gray-700 mb-4">{api.description}</p>
                  <div className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{api.example}</pre>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Authentication</h3>
              <p className="mb-4">All API requests require authentication using Web3 wallet signatures:</p>
              <div className="bg-black/20 p-4 rounded-lg">
                <code className="text-sm">
                  Authorization: Bearer &lt;web3_signature&gt;
                </code>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 mt-15">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-green-100 min-h-screen sticky top-0">
          <div className="p-6 border-b border-green-100">
            <h1 className="text-2xl font-bold"><span className='text-primary'>De</span>News Docs</h1>
            <p className="text-sm text-gray-600 mt-2">Decentralized News Platform</p>
          </div>
          <nav className="p-4">
            <div className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} className="mr-3" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;