const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const bcrypt = require('bcryptjs');

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name },
    { new: true, runValidators: true }
  );
  res.json({ success: true, user });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password changed successfully!' });
});

const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: 'Account deleted successfully' });
});

module.exports = { getProfile, updateProfile, changePassword, deleteAccount };