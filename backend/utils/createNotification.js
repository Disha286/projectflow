const Notification = require('../models/Notification');

const createNotification = async ({ userId, type, title, message, link, createdBy }) => {
  try {
    await Notification.create({
      user: userId,
      type,
      title,
      message,
      link,
      createdBy
    });
  } catch (error) {
    console.error('Notification error:', error.message);
  }
};

module.exports = createNotification;