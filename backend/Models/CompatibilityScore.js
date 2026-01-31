const mongoose = require('mongoose');

const CompatibilityScoreSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    breakdown: [{
        name: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        icon: {
            type: String,
            required: true
        }
    }],
    calculatedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }
}, {
    timestamps: true
});

// Compound index for efficient lookups (ensures one score per user pair)
CompatibilityScoreSchema.index({ user1: 1, user2: 1 }, { unique: true });

// TTL index - automatically delete documents after expiresAt date
CompatibilityScoreSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Ensure user1 is always the smaller ObjectId for consistency
CompatibilityScoreSchema.pre('save', function(next) {
    if (this.user1.toString() > this.user2.toString()) {
        [this.user1, this.user2] = [this.user2, this.user1];
    }
    next();
});

const CompatibilityScore = mongoose.model('CompatibilityScore', CompatibilityScoreSchema);

module.exports = CompatibilityScore;
