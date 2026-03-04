const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);
router.put('/me/password', protect, changePassword);
router.delete('/me', protect, deleteAccount);

module.exports = router;