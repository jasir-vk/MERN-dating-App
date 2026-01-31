const asyncHandler = require('express-async-handler');
const Profile = require('../Models/ProfileDetails');
const User = require('../Models/User');


const FilterQualificationBackend = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Find the current user's profile directly by their ID
    const userProfile = await Profile.findOne({ userId: userId }).populate({
        path: 'userId',
        select: 'name gender userInterest'
    })
    if (!userProfile) {
        return res.status(404).json({ message: 'User not found' });
    }
    const userInterest = userProfile.userId.userInterest
    let genderFilter
    if (userInterest === 'MEN') {
        genderFilter = { gender: 'MEN' }
    } else if (userInterest === 'WOMEN') {
        genderFilter = { gender: 'WOMEN' }
    } else if (userInterest === 'BOTH') {
        genderFilter = { gender: { $in: ['MEN', 'WOMEN'] } }
    }

    const profiles = await Profile.find({
        qualification: { $regex: new RegExp('^' + userProfile.qualification + '$', 'i') },
        userId: { $ne: userId }
    }).populate({
        path: 'userId',
        select: 'name gender'
    })
    res.status(200).json({ FilterQualifications: profiles, success: true });
});

const FilterDesignationBackend = asyncHandler(async (req, res) => {
    const loggedInUser = req.user;

    // Find users with employer data
    let users = await User.find({
        _id: { $ne: loggedInUser._id },
        employer: { $exists: true, $ne: null }
    })
    .populate('profile')
    .populate('employer')
    .exec();

    // Filter by gender preference
    let filteredUsers;
    if (loggedInUser.userInterest === 'MEN') {
        filteredUsers = users.filter(user => user.profile?.gender === 'male');
    } else if (loggedInUser.userInterest === 'WOMEN') {
        filteredUsers = users.filter(user => user.profile?.gender === 'female');
    } else {
        filteredUsers = users;
    }

    res.status(200).json({
        success: true,
        FilterDesignations: filteredUsers,
        count: filteredUsers.length
    });
});

module.exports = { FilterQualificationBackend, FilterDesignationBackend };
