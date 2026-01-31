const asyncHandler = require('express-async-handler');
const Profile = require('../Models/ProfileDetails')
const User = require('../Models/User')



const Uploads = asyncHandler(async (req, res) => {
    const files = req.files;
    const fileUrls = [];

    if (!files || Object.keys(files).length === 0) {
        return res.status(400).json({
            success: false,
            error: "No files uploaded. Please upload at least 3 images."
        });
    }

    try {
        for (let key in files) {
            // If files[key] is not an array, convert it to an array
            const fileArray = Array.isArray(files[key]) ? files[key] : [files[key]];

            fileArray.forEach(file => {
                // Validate file MIME type
                const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/x-msvideo'];
                if (!validTypes.includes(file.mimetype)) {
                    throw new Error(`Invalid file type: ${file.mimetype}. Only images and videos are allowed.`);
                }
                fileUrls.push(file.path);
            });
        }

        if (fileUrls.length === 0) {
            return res.status(400).json({
                success: false,
                error: "No valid files were uploaded."
            });
        }

        res.json({
            success: true,
            message: "Files successfully uploaded",
            fileUrls
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(400).json({
            success: false,
            error: error.message || "File upload failed. Please check your files and try again."
        });
    }
});


const validateProfileData = (data) => {
    const { age, dateofbirth, hobbies, interest, qualification, smokingHabits, drinkingHabits, profile_image_urls, profile_video_urls } = data;

    // Check all required text fields
    if (!age || !dateofbirth || !hobbies || !interest || !qualification || !smokingHabits || !drinkingHabits) {
        return { error: "All text fields are required" };
    }

    // Validate profile_image_urls is an array with at least 3 URLs
    if (!Array.isArray(profile_image_urls) || profile_image_urls.length < 3) {
        return { error: "At least 3 profile images are required" };
    }

    // Validate all image URLs are non-empty strings
    if (!profile_image_urls.every(url => typeof url === 'string' && url.trim().length > 0)) {
        return { error: "Invalid image URLs provided" };
    }

    // Video is optional, but if provided must be a valid string
    if (profile_video_urls && typeof profile_video_urls !== 'string') {
        return { error: "Invalid video URL provided" };
    }

    // Hobbies and interests should be non-empty arrays
    if (!Array.isArray(hobbies) || hobbies.length === 0) {
        return { error: "At least one hobby is required" };
    }
    if (!Array.isArray(interest) || interest.length === 0) {
        return { error: "At least one interest is required" };
    }

    return null;
};


const ProfileDetails = asyncHandler(async (req, res) => {
    const validationError = validateProfileData(req.body);
    if (validationError) {
        return res.status(400).json(validationError);
    }

    const { age, dateofbirth, hobbies, interest, qualification, smokingHabits, drinkingHabits, profile_image_urls, profile_video_urls } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const profile = new Profile({
            userId,
            age,
            dateofbirth,
            hobbies,
            interest,
            qualification,
            smokingHabits,
            drinkingHabits,
            profile_image_urls,
            profile_video_urls,
            email: user.email,
        });
        await profile.save();
        
        user.profile = profile._id
        await user.save()

        return res.json({ success: true, message: "Profile added successfully", profile });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message, details: error.errors });
        } else {
            return res.status(500).json({ error: "Server error, please try again later" });
        }
    }
});

module.exports = { Uploads, ProfileDetails };