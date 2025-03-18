const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['entrepreneur', 'investor', 'mentor'],
    required: true,
  },
  profileDetails: {
    experience: { type: String, default: '' },
    bio: { type: String, default: '' },
    profilePhoto: { type: String, default: '' },
  },
  expertiseAreas: {
    type: [String],
    default: []
  },
  notificationPreferences: {
    messages: {
      type: Boolean,
      default: true
    },
    profileViews: {
      type: Boolean,
      default: true
    },
    startupUpdates: {
      type: Boolean,
      default: true
    }
  },
});

// Hash the password before saving the user model
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;