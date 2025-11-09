const express = require('express');
const { registerUser, loginUser, updateUserStake } = require('../controllers/userController');
const router = express.Router();

// @route   POST /api/user/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/user/login
// @desc    Login an existing user
router.post('/login', loginUser);

// @route   PUT /api/user/stake
// @desc    Update user's DNT stake
router.put('/update-stake', updateUserStake);

module.exports = router;
