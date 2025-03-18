const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['message', 'profile_view', 'startup_view', 'pitchdeck_view', 'system'],
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  link: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Notification', notificationSchema);