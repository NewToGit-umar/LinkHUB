const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * Public Routes
 */

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// OAuth
router.post('/google', authController.googleAuth);
router.post('/facebook', authController.facebookAuth);

// Logout
router.post('/logout', authController.logout);

// Refresh token
router.post('/refresh-token', authMiddleware.protect, authController.refreshToken);

/**
 * Protected Routes
 * Require authentication
 */

// Get current user
router.get('/me', authMiddleware.protect, authController.getMe);

// Update password
router.patch('/update-password', authMiddleware.protect, authController.updatePassword);

// Link OAuth account
router.post('/link-oauth', authMiddleware.protect, authController.linkOAuthAccount);

// Unlink OAuth account
router.post('/unlink-oauth', authMiddleware.protect, authController.unlinkOAuthAccount);

module.exports = router;
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
