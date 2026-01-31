const asyncHandler = require('express-async-handler');
const User = require('../Models/User');
const ProfileDetails = require('../Models/ProfileDetails');
const CompatibilityScore = require('../Models/CompatibilityScore');
const CompatibilityEngine = require('../services/CompatibilityEngine');

/**
 * @desc    Get compatibility score between current user and another user
 * @route   GET /users/compatibility/:userId
 * @access  Private
 */
const getCompatibilityScore = asyncHandler(async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const targetUserId = req.params.userId;

        // Validate target user exists
        if (currentUserId.toString() === targetUserId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot calculate compatibility with yourself'
            });
        }

        // Normalize user IDs for lookup (smaller ID always first)
        const [user1Id, user2Id] = [currentUserId.toString(), targetUserId].sort();

        // Check cache first
        let cachedScore = await CompatibilityScore.findOne({
            user1: user1Id,
            user2: user2Id,
            expiresAt: { $gt: new Date() } // Not expired
        });

        if (cachedScore) {
            return res.json({
                success: true,
                score: cachedScore.score,
                breakdown: cachedScore.breakdown,
                cached: true,
                calculatedAt: cachedScore.calculatedAt
            });
        }

        // Fetch both users with populated profiles
        const currentUser = await User.findById(currentUserId).populate('profile');
        const targetUser = await User.findById(targetUserId).populate('profile');

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: 'Target user not found'
            });
        }

        if (!currentUser.profile || !targetUser.profile) {
            return res.status(400).json({
                success: false,
                message: 'Both users must have complete profiles'
            });
        }

        // Calculate compatibility score
        const { score, breakdown } = CompatibilityEngine.calculateScore(
            currentUser,
            targetUser
        );

        // Cache the result
        const compatibilityScore = new CompatibilityScore({
            user1: user1Id,
            user2: user2Id,
            score,
            breakdown
        });

        await compatibilityScore.save();

        res.json({
            success: true,
            score,
            breakdown,
            cached: false,
            calculatedAt: new Date()
        });

    } catch (error) {
        console.error('Error calculating compatibility score:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate compatibility score',
            error: error.message
        });
    }
});

/**
 * @desc    Get top N compatible matches for current user
 * @route   GET /users/top-matches?limit=20
 * @access  Private
 */
const getTopMatches = asyncHandler(async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const limit = parseInt(req.query.limit) || 20;

        // Fetch current user with profile
        const currentUser = await User.findById(currentUserId).populate('profile');

        if (!currentUser.profile) {
            return res.status(400).json({
                success: false,
                message: 'Please complete your profile first'
            });
        }

        // Fetch all users matching preferences (excluding self)
        const userInterest = currentUser.userInterest?.toUpperCase();
        const genderFilter = {};

        if (userInterest === 'MEN') {
            genderFilter['profile.gender'] = { $regex: /^male$/i };
        } else if (userInterest === 'WOMEN') {
            genderFilter['profile.gender'] = { $regex: /^female$/i };
        }
        // If 'BOTH', no gender filter

        const potentialMatches = await User.find({
            _id: { $ne: currentUserId },
            profile: { $exists: true },
            ...genderFilter
        })
        .populate('profile')
        .limit(limit * 2); // Get more to filter and sort

        // Calculate scores for all potential matches
        const matchesWithScores = await Promise.all(
            potentialMatches.map(async (match) => {
                try {
                    // Check cache first
                    const [user1Id, user2Id] = [currentUserId.toString(), match._id.toString()].sort();
                    let cachedScore = await CompatibilityScore.findOne({
                        user1: user1Id,
                        user2: user2Id,
                        expiresAt: { $gt: new Date() }
                    });

                    let score, breakdown;

                    if (cachedScore) {
                        score = cachedScore.score;
                        breakdown = cachedScore.breakdown;
                    } else {
                        // Calculate new score
                        const result = CompatibilityEngine.calculateScore(
                            currentUser,
                            match
                        );
                        score = result.score;
                        breakdown = result.breakdown;

                        // Cache it
                        const newScore = new CompatibilityScore({
                            user1: user1Id,
                            user2: user2Id,
                            score,
                            breakdown
                        });
                        await newScore.save().catch(err => {
                            console.error('Error caching score:', err);
                        });
                    }

                    return {
                        _id: match._id,
                        name: match.name,
                        age: match.profile?.age,
                        profile: match.profile,
                        compatibilityScore: score,
                        compatibilityBreakdown: breakdown
                    };
                } catch (err) {
                    console.error(`Error calculating score for user ${match._id}:`, err);
                    return null;
                }
            })
        );

        // Filter out nulls and sort by score (descending)
        const sortedMatches = matchesWithScores
            .filter(match => match !== null)
            .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
            .slice(0, limit);

        res.json({
            success: true,
            count: sortedMatches.length,
            matches: sortedMatches
        });

    } catch (error) {
        console.error('Error getting top matches:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get top matches',
            error: error.message
        });
    }
});

/**
 * @desc    Recalculate compatibility score (force refresh)
 * @route   POST /users/recalculate-compatibility/:userId
 * @access  Private
 */
const recalculateCompatibility = asyncHandler(async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const targetUserId = req.params.userId;

        // Normalize user IDs
        const [user1Id, user2Id] = [currentUserId.toString(), targetUserId].sort();

        // Delete existing cache
        await CompatibilityScore.deleteOne({
            user1: user1Id,
            user2: user2Id
        });

        // Fetch and calculate new score
        const currentUser = await User.findById(currentUserId).populate('profile');
        const targetUser = await User.findById(targetUserId).populate('profile');

        if (!currentUser.profile || !targetUser.profile) {
            return res.status(400).json({
                success: false,
                message: 'Both users must have complete profiles'
            });
        }

        const { score, breakdown } = CompatibilityEngine.calculateScore(
            currentUser,
            targetUser
        );

        // Save new score
        const newScore = new CompatibilityScore({
            user1: user1Id,
            user2: user2Id,
            score,
            breakdown
        });

        await newScore.save();

        res.json({
            success: true,
            message: 'Compatibility score recalculated',
            score,
            breakdown,
            calculatedAt: new Date()
        });

    } catch (error) {
        console.error('Error recalculating compatibility:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to recalculate compatibility',
            error: error.message
        });
    }
});

module.exports = {
    getCompatibilityScore,
    getTopMatches,
    recalculateCompatibility
};
