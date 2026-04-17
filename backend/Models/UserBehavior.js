const mongoose = require('mongoose');

const UserBehaviorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Profile views tracking
  profileViews: [{
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    duration: Number, // seconds spent viewing
    source: String // 'discovery', 'search', 'forYou', etc.
  }],

  // Likes (right swipes / friend requests)
  likes: [{
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    source: String
  }],

  // Passes (left swipes / skipped profiles)
  passes: [{
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    reason: String // optional
  }],

  // Messaging patterns
  messages: [{
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    firstMessageAt: Date,
    lastMessageAt: Date,
    messageCount: Number,
    responseRate: Number // 0-1
  }],

  // Search behavior
  searches: [{
    filters: Object,
    timestamp: {
      type: Date,
      default: Date.now
    },
    resultsViewed: Number
  }],

  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
UserBehaviorSchema.index({ userId: 1 });
UserBehaviorSchema.index({ 'likes.profileId': 1 });
UserBehaviorSchema.index({ 'profileViews.timestamp': -1 });
UserBehaviorSchema.index({ 'passes.profileId': 1 });

// Update lastUpdated on save
UserBehaviorSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.models.UserBehavior || mongoose.model('UserBehavior', UserBehaviorSchema);
