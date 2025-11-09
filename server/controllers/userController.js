const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Adjust the path if needed

// @desc    Register a new user
// @route   POST /api/user/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { uname, walletAddress } = req.body;

    if (!uname || !walletAddress) {
        res.status(400);
        throw new Error("Please provide both 'uname' and 'walletAddress'");
    }

    const userExists = await User.findOne({ walletAddress });

    if (userExists) {
        res.status(400);
        throw new Error('User with this wallet address already exists');
    }

    const newUser = await User.create({ uname, walletAddress });

    res.status(201).json({
        message: 'User registered successfully',
        user: newUser,
    });
});

// @desc    Login user by wallet address
// @route   POST /api/user/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { walletAddress } = req.body;

    if (!walletAddress) {
        res.status(400);
        throw new Error("Please provide 'walletAddress'");
    }

    const user = await User.findOne({ walletAddress });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({
        message: 'User logged in successfully',
        user,
    });
});

// @desc    Update user's DNT stake
// @route   PUT /api/user/stake
// @access  Public or Protected (depending on use case)
const updateUserStake = asyncHandler(async (req, res) => {
    const { walletAddress, dntStake } = req.body;

    if (!walletAddress || dntStake === undefined) {
        res.status(400);
        throw new Error("Please provide both 'walletAddress' and 'dntStake'");
    }

    const user = await User.findOne({ walletAddress });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.dntStake = dntStake;
    const updatedUser = await user.save();

    res.status(200).json({
        message: 'User stake updated successfully',
        user: updatedUser,
    });
});

module.exports = {
    registerUser,
    loginUser,
    updateUserStake
};
