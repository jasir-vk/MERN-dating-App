const Profile = require('../Models/ProfileDetails');
const asyncHandler = require('express-async-handler');
const User = require('../Models/User');
const CompatibilityScore = require('../Models/CompatibilityScore');
const CompatibilityEngine = require('../services/CompatibilityEngine');



const UserHomeProfilesBackend = asyncHandler(async (req, res) => {
    const loggedInUser = req.user; // Assuming you're using middleware to set the logged-in user

    // Step 1: Find users excluding the logged-in user
    let users = await User.find({
        _id: { $ne: loggedInUser._id }  // Exclude the logged-in user
    })
        .populate({
            path: 'profile',
            select: 'gender age profile_image_urls bio location',  // Select fields from profile
        })
        .populate({
            path: 'employer',
            select: 'type jobTitle companyName designation location',  // Select fields from employer
        })
        .exec();

    let filteredUsers;
    if (loggedInUser.userInterest === 'MEN') {
        filteredUsers = users.filter(user => user.profile && user.profile.gender === 'male');
    } else if (loggedInUser.userInterest === 'WOMEN') {
        filteredUsers = users.filter(user => user.profile && user.profile.gender === 'female');
    } else {
        // If userInterest is 'BOTH', no need to filter
        filteredUsers = users;
    }

    // Step 3: Calculate compatibility scores for each profile
    const sortBy = req.query.sortBy; // 'compatibility' or undefined

    const profilesWithScores = await Promise.all(
        filteredUsers.map(async (user) => {
            try {
                // Skip if user doesn't have a profile
                if (!user.profile) {
                    return { ...user.toObject(), compatibilityScore: null };
                }

                // Normalize user IDs for cache lookup
                const [user1Id, user2Id] = [loggedInUser._id.toString(), user._id.toString()].sort();

                // Check cache first
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
                    const result = CompatibilityEngine.calculateScore(loggedInUser, user);
                    score = result.score;
                    breakdown = result.breakdown;

                    // Cache it (non-blocking)
                    const newScore = new CompatibilityScore({
                        user1: user1Id,
                        user2: user2Id,
                        score,
                        breakdown
                    });
                    newScore.save().catch(err => console.error('Error caching score:', err));
                }

                return {
                    ...user.toObject(),
                    compatibilityScore: score,
                    compatibilityBreakdown: breakdown
                };
            } catch (err) {
                console.error(`Error calculating score for user ${user._id}:`, err);
                return { ...user.toObject(), compatibilityScore: null };
            }
        })
    );

    // Step 4: Sort by compatibility if requested
    if (sortBy === 'compatibility') {
        profilesWithScores.sort((a, b) => {
            const scoreA = a.compatibilityScore || 0;
            const scoreB = b.compatibilityScore || 0;
            return scoreB - scoreA; // Descending order
        });
    }

    // Step 5: Send the profiles with compatibility scores
    res.status(200).json({ success: true, profiles: profilesWithScores });

})
module.exports = { UserHomeProfilesBackend }