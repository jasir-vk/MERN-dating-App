import React, { useState } from "react";
import PersonalStyles from "./PersonalDetails.module.css"
import LandingPage from "../LandingPage/LandingPage";
import { Profile, Upload } from "../../Services/PersonalDetails";
import { useNavigate } from "react-router-dom";
// import { Uploads } from "../../../../backend/Controllers/Uploads";

const PersonalDetail = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    age: '',
    dateofbirth: '',
    hobbies: '',
    interest: '',
    qualification: '',
    smokingHabits: '',
    drinkingHabits: '',
    profile_image_urls: ['', '', '', ''],
    profile_video_urls: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleReelChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prevData => ({
        ...prevData,
        profile_video_urls: file
      }));
    }
  };

  // Validation function to check minimum image count
  const validateFileSelection = () => {
    const uploadedImages = formData.profile_image_urls.filter(file => file instanceof File);

    if (uploadedImages.length < 3) {
      const remaining = 3 - uploadedImages.length;
      setError(`Please upload at least 3 images. You need ${remaining} more image(s).`);
      return false;
    }

    // Clear error if validation passes
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate minimum images before proceeding
      if (!validateFileSelection()) {
        return;
      }

      setIsLoading(true);
      setError('');
      setMessage('');

      // Split hobbies and interests by commas into arrays
      const hobbiesArray = formData.hobbies
        .split(',')
        .map(hobby => hobby.trim())
        .filter(hobby => hobby.length > 0);

      const interestArray = formData.interest
        .split(',')
        .map(interest => interest.trim())
        .filter(interest => interest.length > 0);

      // Validate hobbies and interests
      if (hobbiesArray.length === 0) {
        setError('Please enter at least one hobby');
        setIsLoading(false);
        return;
      }

      if (interestArray.length === 0) {
        setError('Please enter at least one interest');
        setIsLoading(false);
        return;
      }

      // Prepare image and video files for upload
      const imagesToUpload = formData.profile_image_urls.filter(file => file instanceof File);
      const reelToUpload = formData.profile_video_urls instanceof File ? [formData.profile_video_urls] : [];
      const allFiles = [...imagesToUpload, ...reelToUpload];

      console.log("Files to upload:", allFiles);

      // Upload the files to Cloudinary and get back the URLs
      let fileUrls = [];
      try {
        fileUrls = await Upload(allFiles);
        console.log("Uploaded file URLs:", fileUrls);

        if (fileUrls.length === 0) {
          throw {
            success: false,
            error: "No file URLs received from upload."
          };
        }
      } catch (uploadError) {
        console.error('Upload error:', uploadError);

        // Extract error message from structured error response
        const errorMessage = uploadError?.error ||
          uploadError?.message ||
          "File upload failed. Please check your files and try again.";

        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Split the URLs into image URLs and video URL
      const imageUrls = fileUrls.slice(0, imagesToUpload.length);
      const videoUrl = reelToUpload.length > 0 ? fileUrls[imagesToUpload.length] : null;

      if (reelToUpload.length > 0 && !videoUrl) {
        setError("Video URL not received. Please try uploading again.");
        setIsLoading(false);
        return;
      }

      // Prepare the final form data with the correct URLs and split arrays
      const finalFormData = {
        ...formData,
        profile_image_urls: imageUrls,
        profile_video_urls: videoUrl,
        hobbies: hobbiesArray,
        interest: interestArray
      };

      console.log("Final form data:", finalFormData);

      // Submit the profile data
      let response;
      try {
        response = await Profile(finalFormData);
        console.log("Profile successfully added", response);

        if (response.success) {
          setMessage(response.message);

          // Navigate after a brief delay to show success message
          setTimeout(() => {
            navigate('/employement');
          }, 1500);
        } else {
          throw {
            success: false,
            error: response.error || "Unexpected response from server"
          };
        }
      } catch (profileError) {
        console.error('Profile submission error:', profileError);

        // Extract error message from structured error response
        const errorMessage = profileError?.error ||
          profileError?.message ||
          "Failed to save profile. Please try again.";

        setError(errorMessage);
        setIsLoading(false);
        return;
      }

    } catch (error) {
      console.error('Registration failed:', error);

      const errorMessage = error?.error ||
        error?.response?.data?.error ||
        error?.message ||
        "An unexpected error occurred. Please try again.";

      setError(errorMessage);
      setIsLoading(false);
    }
  };


  const handleSpecificImageChange = (index) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prevData => ({
        ...prevData,
        profile_image_urls: prevData.profile_image_urls.map((item, i) =>
          i === index ? file : item
        )
      }));
    }
  };

  return <>
    <LandingPage />
    <form className={PersonalStyles.modalOverlay} onSubmit={handleSubmit}>
      <div className={PersonalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={PersonalStyles.personalDetailsForm}>
          {/* Progress Indicator */}
          <div className={PersonalStyles.progressIndicator}>
            <div className={`${PersonalStyles.progressDot} ${PersonalStyles.active}`}></div>
            <div className={PersonalStyles.progressDot}></div>
            <div className={PersonalStyles.progressDot}></div>
            <div className={PersonalStyles.progressDot}></div>
            <div className={PersonalStyles.progressDot}></div>
          </div>

          <h2>Let's Create Your Profile</h2>
          <div className={PersonalStyles.stepIndicator}>Step 1 of 5</div>
          <input type="text" placeholder="Age"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />

          <input type="date" placeholder="DOB"
            name="dateofbirth"
            value={formData.dateofbirth}
            onChange={handleChange}
          />

          <input type="text" placeholder="Hobbies"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
          />

          <input type="text" placeholder="Interests"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
          />

          <input type="text" placeholder="Smoking Habits"
            name="smokingHabits"
            value={formData.smokingHabits}
            onChange={handleChange}
          />

          <input type="text" placeholder="Drinking Habits"
            name="drinkingHabits"
            value={formData.drinkingHabits}
            onChange={handleChange}
          />

          <input type="text" placeholder="Qualifications"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
          />

          {/* Image uploader */}

          <div className={PersonalStyles.sectionHeader}>
            Photo Gallery (Upload at least 3 images)
          </div>

          <div className={PersonalStyles.imageUploadersContainer}>
            {formData.profile_image_urls.map((url, index) => (
              <div key={index} className={`${PersonalStyles.imageUploaderWrapper} ${url ? PersonalStyles.hasImage : ''}`}>
                <label htmlFor={`image-${index}`} className={PersonalStyles.imageUploader}>
                  <input
                    type="file"
                    id={`image-${index}`}
                    accept="image/*"
                    onChange={handleSpecificImageChange(index)}
                    style={{ display: 'none' }}
                  />
                  {url ? (
                    <img src={URL.createObjectURL(url)} alt={`Uploaded ${index}`} className={PersonalStyles.uploadedImage} />
                  ) : (
                    <span className={PersonalStyles.uploadIcon}>+</span>
                  )}
                </label>
              </div>
            ))}
          </div>

          {/* Video uploader */}

          <div className={PersonalStyles.reelUploaderWrapper}>
            <label htmlFor="reel-upload" className={PersonalStyles.reelUploader}>
              <input
                type="file"
                id="reel-upload"
                accept="video/*"
                onChange={handleReelChange}
                style={{ display: 'none' }}
              />
              {formData.profile_video_urls ? (
                <video src={URL.createObjectURL(formData.profile_video_urls)} className={PersonalStyles.uploadedReel} controls />
              ) : (
                <>
                  <span className={PersonalStyles.uploadIcon}>▶</span>
                  <span className={PersonalStyles.reelLabel}>Add Video</span>
                </>
              )}
            </label>
          </div>
          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Next'}
          </button>
        </div>
      </div>
    </form>

  </>
}
export default PersonalDetail;