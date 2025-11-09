import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import appContext from '../context/appContext';
import { loginUser, registerUser, updateUserStake } from '../services/serviceWorker';

// Custom hooks for better code organization
const useMessages = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);
  
  return { error, success, setError, setSuccess, clearMessages };
};

const useUserManagement = (walletAddress) => {
  const [user, setUser] = useState(null);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [showUserForm, setShowUserForm] = useState(true);
  const [userFormData, setUserFormData] = useState({ name: '' });
  const [userFormLoading, setUserFormLoading] = useState(false);
  
  const handleFormInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  return {
    user, setUser,
    isUserRegistered, setIsUserRegistered,
    showUserForm, setShowUserForm,
    userFormData, setUserFormData,
    userFormLoading, setUserFormLoading,
    handleFormInputChange
  };
};

// Reusable UI Components
const LoadingSpinner = ({ size = 'h-12 w-12' }) => (
  <div className={`animate-spin rounded-full ${size} border-b-2 border-primary mx-auto`} />
);

const MessageAlert = ({ type, message, onClose }) => {
  const bgColor = type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700';
  const iconColor = type === 'error' ? 'text-red-500' : 'text-green-500';
  
  return (
    <div className={`${bgColor} border px-4 py-3 rounded-lg mb-6`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            {type === 'error' ? (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            )}
          </svg>
          <span>{message}</span>
        </div>
        <button onClick={onClose} className={`${iconColor} hover:opacity-70 ml-2 text-xl`}>×</button>
      </div>
    </div>
  );
};

const MetaMaskRequired = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">MetaMask Required</h2>
      <p className="text-gray-600 mb-6">Please install MetaMask to use this application.</p>
      <a
        href="https://metamask.io/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
      >
        Install MetaMask
      </a>
    </div>
  </div>
);

const WalletConnection = ({ onConnect }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
      <p className="text-gray-600 mb-6">Connect your MetaMask wallet to interact with DeNews Token.</p>
      <button
        onClick={onConnect}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
      >
        Connect Wallet
      </button>
    </div>
  </div>
);

const UserRegistrationForm = ({ 
  walletAddress, 
  userFormData, 
  userFormLoading, 
  error, 
  success, 
  onFormInputChange, 
  onSubmit, 
  clearMessages 
}) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 pt-20">
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Registration Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Join DeNews</h2>
          <p className="text-gray-600">
            Create your profile to start using DeNews tokens and participate in the ecosystem.
          </p>
        </div>

        {/* Wallet Info Alert */}
        <div className="bg-primary-50 border-l-4 border-primary p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-primary">
                <span className="font-medium">Connected Wallet:</span> {walletAddress}
              </p>
              <p className="text-xs text-primary mt-1">
                This wallet address will be linked to your profile.
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && <MessageAlert type="error" message={error} onClose={clearMessages} />}
        {success && <MessageAlert type="success" message={success} onClose={clearMessages} />}

        {/* Registration Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={userFormData.name}
                onChange={onFormInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              <span className="text-red-500">*</span> Required fields
            </p>
            <button
              type="submit"
              disabled={userFormLoading}
              className={`px-8 py-3 rounded-lg font-bold text-white transition duration-200 flex items-center space-x-2 ${
                userFormLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary transform hover:scale-105'
              }`}
            >
              {userFormLoading ? (
                <>
                  <LoadingSpinner size="h-4 w-4" />
                  <span>Creating Profile...</span>
                </>
              ) : (
                <>
                  <span>Create Profile</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Benefits Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What you'll get:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              'Buy & Trade DNT Tokens',
              'Participate in Staking',
              'Access Ecosystem Features'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MainProfile = ({ 
  user, 
  walletAddress,
  contractAddress,
  userBalance, 
  userStake, 
  contractBalance, 
  tokenPrice, 
  allStakers, 
  loading, 
  error, 
  success, 
  onBuyToken, 
  onRefresh, 
  clearMessages 
}) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 pt-20">
    <div className="max-w-4xl mx-auto">
      {/* User Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
            {user.uname.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user.uname}</h1>
            <p className="text-gray-600">{user.email}</p>
            {user.phno && <p className="text-gray-500 text-sm">{user.phno}</p>}
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Wallet Address:</span> {user.walletAddress}
          </p>
        </div>
      </div>

      {/* Messages */}
      {(error || success) && (
        <div className="mb-6">
          {error && <MessageAlert type="error" message={error} onClose={clearMessages} />}
          {success && <MessageAlert type="success" message={success} onClose={clearMessages} />}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buy Token Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Buy DNT Token</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-semibold">Token Price: {tokenPrice} ETH ($1)</p>
              <p className="text-blue-600 text-sm">You will receive 1 DNT token</p>
            </div>

            <button
              onClick={onBuyToken}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-bold text-white transition duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {loading ? 'Processing...' : 'Buy 1 DNT Token'}
            </button>
          </div>
        </div>

        {/* User Balance Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Balance</h2>
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold text-indigo-800">DNT Token Balance</h3>
              <p className="text-2xl font-bold text-indigo-600">{userBalance} DNT</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800">Your Stake</h3>
              <p className="text-2xl font-bold text-purple-600">{userStake} DNT</p>
            </div>

            <button
              onClick={onRefresh}
              className="w-full py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition duration-200"
            >
              Refresh Balance
            </button>
          </div>
        </div>
      </div>

      {/* Contract Information */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Contract Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-800">Contract ETH Balance</h3>
            <p className="text-xl font-bold text-yellow-600">{contractBalance} ETH</p>
          </div>

          <div className="p-4 bg-teal-50 rounded-lg">
            <h3 className="font-semibold text-teal-800">Total Stakers</h3>
            <p className="text-xl font-bold text-teal-600">{allStakers.length}</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Contract Address:</span> {contractAddress}
          </p>
        </div>
      </div>

      {/* All Stakers Section */}
      {allStakers.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">All Stakers</h2>
          <div className="max-h-60 overflow-y-auto">
            {allStakers.map((staker, index) => (
              <div key={index} className="p-3 border-b border-gray-200 last:border-b-0">
                <p className="text-sm font-mono text-gray-700">
                  {staker}
                  {staker.toLowerCase() === walletAddress.toLowerCase() && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      You
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const Profile = () => {
  const context = useContext(appContext);
  const { State } = context;

  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState('0');
  const [userStake, setUserStake] = useState('0');
  const [contractBalance, setContractBalance] = useState('0');
  const [tokenPrice, setTokenPrice] = useState('0');
  const [allStakers, setAllStakers] = useState([]);

  const { error, success, setError, setSuccess, clearMessages } = useMessages();
  const {
    user, setUser,
    isUserRegistered, setIsUserRegistered,
    showUserForm, setShowUserForm,
    userFormData, setUserFormData,
    userFormLoading, setUserFormLoading,
    handleFormInputChange
  } = useUserManagement(State.WalletAddress);

  // Memoized values
  const isWalletConnected = useMemo(() => Boolean(State.WalletAddress), [State.WalletAddress]);
  const hasMetaMask = useMemo(() => Boolean(State.WindowEthereum), [State.WindowEthereum]);

  // Optimized fetch functions with useCallback
  const fetchUserByWallet = useCallback(async () => {
    if (!State.WalletAddress) return;
    
    try {
      setLoading(true);
      const response = await loginUser({ walletAddress: State.WalletAddress });

      if (response.user) {
        setUser(response.user);
        setIsUserRegistered(true);
      } else {
        setIsUserRegistered(false);
        setShowUserForm(true);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      // setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  }, [State.WalletAddress, setUser, setIsUserRegistered, setShowUserForm, setError]);

  const fetchUserData = useCallback(async () => {
    if (!State.ReadContract || !State.WalletAddress) return;

    try {
      const [balance, stake] = await Promise.all([
        State.ReadContract.balanceOf(State.WalletAddress),
        State.ReadContract.getStakeBalance(State.WalletAddress)
      ]);

      const formattedBalance = ethers.utils.formatEther(balance);
      const formattedStake = ethers.utils.formatEther(stake);

      setUserBalance(formattedBalance);
      setUserStake(formattedStake);

      // Update user stake in background
      updateUserStake({
        walletAddress: State.WalletAddress,
        dntStake: formattedStake
      });
    } catch (err) {
      console.error('Error fetching user data:', err);
      // setError('Failed to fetch user data');
    }
  }, [State.ReadContract, State.WalletAddress, setError]);

  const fetchContractData = useCallback(async () => {
    if (!State.ReadContract) return;

    try {
      const [price, balance, stakers] = await Promise.all([
        State.ReadContract.getTokenPrice(),
        State.ReadContract.getContractBalance(),
        State.ReadContract.getAllStakers()
      ]);

      setTokenPrice(ethers.utils.formatEther(price));
      setContractBalance(ethers.utils.formatEther(balance));
      setAllStakers(stakers);
    } catch (err) {
      console.error('Error fetching contract data:', err);
      setError('Failed to fetch contract data');
    }
  }, [State.ReadContract, setError]);

  const refreshData = useCallback(async () => {
    await Promise.all([fetchUserData(), fetchContractData()]);
  }, [fetchUserData, fetchContractData]);

  // Event handlers
  const createUser = useCallback(async (e) => {
    e.preventDefault();
    try {
      setUserFormLoading(true);
      setError('');
      setSuccess('');

      const res = await registerUser({
        uname: userFormData.name,
        walletAddress: State.WalletAddress
      });
      
      // Set user data and update registration status
      const newUser = {
        uname: userFormData.name,
        walletAddress: State.WalletAddress,
        email: '', // Set default or get from response if available
        phno: ''   // Set default or get from response if available
      };
      
      setUser(newUser);
      setIsUserRegistered(true);
      setShowUserForm(false);
      setSuccess(res.message);
      
      // Clear form data
      setUserFormData({ name: '' });
      
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create user: ' + err.message);
    } finally {
      setUserFormLoading(false);
    }
  }, [userFormData.name, State.WalletAddress, setError, setSuccess, setUserFormLoading, setUser, setIsUserRegistered, setShowUserForm, setUserFormData]);

  const buyToken = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (!State.WriteContract) {
        throw new Error('Contract not connected');
      }

      const tokenPrice = await State.ReadContract.getTokenPrice();

      const tx = await State.WriteContract.buyToken({
        value: tokenPrice,
        gasLimit: 300000
      });

      setSuccess('Transaction submitted! Waiting for confirmation...');
      await tx.wait();
      setSuccess('Token purchased successfully!');

      // Refresh data after successful purchase
      await refreshData();
    } catch (err) {
      console.error('Error buying token:', err);
      setError(err.message || 'Failed to buy token');
    } finally {
      setLoading(false);
    }
  }, [State.WriteContract, State.ReadContract, setError, setSuccess, refreshData]);

  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        setError('MetaMask not found. Please install MetaMask.');
        return;
      }

      await context.getStateParameters();
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet');
    }
  }, [context, setError]);

  // Effects
  useEffect(() => {
    if (State.WalletAddress) {
      fetchUserByWallet();
    }
  }, [State.WalletAddress, fetchUserByWallet]);

  useEffect(() => {
    if (State.ReadContract && State.WalletAddress && isUserRegistered) {
      refreshData();
    }
  }, [State.ReadContract, State.WalletAddress, isUserRegistered, refreshData]);

  // Render logic
  if (!hasMetaMask) {
    return <MetaMaskRequired />;
  }

  if (!isWalletConnected) {
    return <WalletConnection onConnect={connectWallet} />;
  }

  if (loading && !isUserRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (showUserForm && !isUserRegistered) {
    return (
      <UserRegistrationForm
        walletAddress={State.WalletAddress}
        userFormData={userFormData}
        userFormLoading={userFormLoading}
        error={error}
        success={success}
        onFormInputChange={handleFormInputChange}
        onSubmit={createUser}
        clearMessages={clearMessages}
      />
    );
  }

  if (isUserRegistered && user) {
    return (
      <MainProfile
        user={user}
        walletAddress={State.WalletAddress}
        contractAddress={State.ContractAddress}
        userBalance={userBalance}
        userStake={userStake}
        contractBalance={contractBalance}
        tokenPrice={tokenPrice}
        allStakers={allStakers}
        loading={loading}
        error={error}
        success={success}
        onBuyToken={buyToken}
        onRefresh={refreshData}
        clearMessages={clearMessages}
      />
    );
  }

  return null;
};

export default Profile;