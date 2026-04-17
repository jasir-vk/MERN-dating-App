const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const UserBehavior = require('../models/UserBehavior');
const CompatibilityScore = require('../models/CompatibilityScore');

// @desc    Get personalized "For You" feed
// @route   GET /users/for-you-feed
// @access  Private
const getForYouFeed = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const limit = parseInt(req.query.limit) || 20;

  try {
    // Get or create user behavior
    let userBehavior = await UserBehavior.findOne({ userId });
    if (!userBehavior) {
      userBehavior = await UserBehavior.create({ userId });
    }

    // Get user's profile for filtering
    const currentUser = await User.findById(userId).populate('profile');

    // Get list of profiles to exclude (already liked, passed, or own profile)
    const likedProfileIds = userBehavior.likes.map(l => l.profileId.toString());
    const passedProfileIds = userBehavior.passes.map(p => p.profileId.toString());
    const viewedProfileIds = userBehavior.profileViews.map(v => v.profileId.toString());
    const excludedIds = [...new Set([...likedProfileIds, ...passedProfileIds, userId.toString()])];

    // Get all potential matches (exclude rejected/already liked)
    const candidates = await User.find({
      _id: { $nin: excludedIds },
      'profile.looking_for': currentUser.profile?.gender, // Basic gender filter
      'profile.gender': currentUser.profile?.looking_for
    })
      .populate('profile')
      .populate('interests')
      .limit(limit * 3); // Get more candidates for scoring

    if (candidates.length === 0) {
      return res.json({
        success: true,
        recommendations: [],
        count: 0,
        message: 'No new profiles available. Check back later!'
      });
    }

    // Score candidates using existing compatibility scores or calculate new ones
    const scoredCandidates = await Promise.all(
      candidates.map(async (candidate) => {
        // Try to get existing compatibility score
        let compatibility = await CompatibilityScore.findOne({
          user1: userId,
          user2: candidate._id
        });

        // If no score exists, create basic score based on interests
        if (!compatibility) {
          const userInterests = currentUser.interests || [];
          const candidateInterests = candidate.interests || [];
          const commonInterests = userInterests.filter(i =>
            candidateInterests.some(ci => ci.toString() === i.toString())
          );

          // Simple scoring: 50% base + 5% per common interest (max 100%)
          const baseScore = 50;
          const interestBonus = Math.min(commonInterests.length * 5, 50);
          const calculatedScore = baseScore + interestBonus;

          compatibility = {
            score: calculatedScore,
            breakdown: {
              interests: commonInterests.length,
              location: 0,
              lifestyle: 0,
              values: 0
            }
          };
        }

        // Generate recommendation reason
        let reason = '';
        if (compatibility.breakdown?.interests > 0) {
          reason = `You have ${compatibility.breakdown.interests} common interests`;
        } else if (compatibility.score >= 80) {
          reason = 'Highly compatible match';
        } else {
          reason = 'Recommended for you';
        }

        return {
          ...candidate.toObject(),
          compatibilityScore: compatibility.score || 75,
          compatibilityBreakdown: compatibility.breakdown,
          recommendationReason: reason
        };
      })
    );

    // Sort by compatibility score (descending)
    scoredCandidates.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    // Apply diversity filter - ensure variety in recommendations
    const diversified = [];
    const usedLocations = new Set();

    for (const profile of scoredCandidates) {
      if (diversified.length >= limit) break;

      const location = profile.profile?.location?.name;

      // Prefer different locations for variety
      if (!usedLocations.has(location)) {
        diversified.push(profile);
        if (location) usedLocations.add(location);
      } else if (profile.compatibilityScore >= 85) {
        // Always include very high compatibility
        diversified.push(profile);
      }
    }

    // If we still need more profiles, add remaining high-score ones
    if (diversified.length < limit) {
      const remaining = scoredCandidates
        .filter(p => !diversified.includes(p))
        .slice(0, limit - diversified.length);
      diversified.push(...remaining);
    }

    res.json({
      success: true,
      recommendations: diversified,
      count: diversified.length
    });
  } catch (error) {
    console.error('Error fetching For You feed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations',
      error: error.message
    });
  }
});

// @desc    Record swipe action (like or pass)
// @route   POST /users/record-swipe
// @access  Private
const recordSwipe = asyncHandler(async (req, res) => {
  const { profileId, action } = req.body; // action: 'like' or 'pass'
  const userId = req.user._id;

  try {
    if (!profileId || !action) {
      return res.status(400).json({
        success: false,
        message: 'profileId and action are required'
      });
    }

    if (!['like', 'pass'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'action must be either "like" or "pass"'
      });
    }

    // Get or create user behavior
    let userBehavior = await UserBehavior.findOne({ userId });
    if (!userBehavior) {
      userBehavior = await UserBehavior.create({ userId });
    }

    // Record the action
    if (action === 'like') {
      // Check if already liked
      const alreadyLiked = userBehavior.likes.some(
        l => l.profileId.toString() === profileId
      );

      if (!alreadyLiked) {
        userBehavior.likes.push({
          profileId,
          timestamp: new Date(),
          source: 'forYou'
        });
      }
    } else if (action === 'pass') {
      // Check if already passed
      const alreadyPassed = userBehavior.passes.some(
        p => p.profileId.toString() === profileId
      );

      if (!alreadyPassed) {
        userBehavior.passes.push({
          profileId,
          timestamp: new Date()
        });
      }
    }

    await userBehavior.save();

    res.json({
      success: true,
      message: `Swipe ${action} recorded successfully`
    });
  } catch (error) {
    console.error('Error recording swipe:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record swipe',
      error: error.message
    });
  }
});

// @desc    Undo last swipe (premium feature)
// @route   POST /users/undo-swipe
// @access  Private
const undoSwipe = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    // Check if user is premium (assuming isPremium field exists)
    if (!req.user.isPremium) {
      return res.status(403).json({
        success: false,
        message: 'Undo is a Premium feature. Upgrade to use this feature.'
      });
    }

    const userBehavior = await UserBehavior.findOne({ userId });

    if (!userBehavior) {
      return res.status(404).json({
        success: false,
        message: 'No swipe history found'
      });
    }

    // Determine which was the last action
    const lastLike = userBehavior.likes[userBehavior.likes.length - 1];
    const lastPass = userBehavior.passes[userBehavior.passes.length - 1];

    let undoneProfile = null;

    if (!lastLike && !lastPass) {
      return res.status(400).json({
        success: false,
        message: 'No recent swipes to undo'
      });
    }

    // Compare timestamps to find the most recent action
    if (lastLike && lastPass) {
      if (lastLike.timestamp > lastPass.timestamp) {
        undoneProfile = userBehavior.likes.pop();
      } else {
        undoneProfile = userBehavior.passes.pop();
      }
    } else if (lastLike) {
      undoneProfile = userBehavior.likes.pop();
    } else {
      undoneProfile = userBehavior.passes.pop();
    }

    await userBehavior.save();

    res.json({
      success: true,
      message: 'Last swipe undone successfully',
      undoneProfileId: undoneProfile?.profileId
    });
  } catch (error) {
    console.error('Error undoing swipe:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to undo swipe',
      error: error.message
    });
  }
});

// @desc    Track profile view (can be called when user opens a profile)
// @route   POST /users/track-profile-view
// @access  Private
const trackProfileView = asyncHandler(async (req, res) => {
  const { profileId, duration, source } = req.body;
  const userId = req.user._id;

  try {
    let userBehavior = await UserBehavior.findOne({ userId });
    if (!userBehavior) {
      userBehavior = await UserBehavior.create({ userId });
    }

    userBehavior.profileViews.push({
      profileId,
      timestamp: new Date(),
      duration: duration || 0,
      source: source || 'unknown'
    });

    await userBehavior.save();

    res.json({
      success: true,
      message: 'Profile view tracked'
    });
  } catch (error) {
    console.error('Error tracking profile view:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track profile view',
      error: error.message
    });
  }
});

module.exports = {
  getForYouFeed,
  recordSwipe,
  undoSwipe,
  trackProfileView
};
