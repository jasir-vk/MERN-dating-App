import axios from 'axios'
const API_URL = 'http://localhost:4000/users/'


const Upload = async (files) => {
    const token = localStorage.getItem('token')
    if (!token) {
        throw {
            success: false,
            error: "Authentication required. Please log in and try again."
        };
    }

    try {
        // Validate files before upload
        if (!files || files.length === 0) {
            throw {
                success: false,
                error: "No files selected for upload"
            };
        }

        const formData = new FormData();

        // Append each file to the formData
        files.forEach((file, index) => {
            formData.append(`file${index}`, file);
        });

        // Make the POST request to upload files
        const response = await axios.post(`${API_URL}upload`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        // Check for success in response
        if (!response.data.success) {
            throw {
                success: false,
                error: response.data.error || "File upload failed. Please try again."
            };
        }

        // Return the file URLs from the response
        return response.data.fileUrls;
    } catch (error) {
        console.error('File upload failed:', error);

        // Extract meaningful error message
        let errorMessage = "File upload failed. Please try again.";

        if (error.success === false && error.error) {
            // Our custom error format
            errorMessage = error.error;
        } else if (error.response?.data?.error) {
            // Backend error response
            errorMessage = error.response.data.error;
        } else if (error.response?.status === 401) {
            errorMessage = "Authentication failed. Please log in again.";
        } else if (error.response?.status === 413) {
            errorMessage = "Files are too large. Please upload smaller files.";
        } else if (error.message) {
            errorMessage = error.message;
        }

        throw {
            success: false,
            error: errorMessage,
            originalError: error
        };
    }
};



const Profile = async (profileData) => {
    const token = localStorage.getItem('token')
    if (!token) {
        throw {
            success: false,
            error: "Authentication required. Please log in and try again."
        };
    }

    try {
        const response = await axios.post(`${API_URL}profileDetails`, profileData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        // Check if response indicates failure
        if (response.data && response.data.error) {
            throw {
                success: false,
                error: response.data.error,
                details: response.data.details
            };
        }

        return response.data;
    } catch (error) {
        console.error('Profile submission failed:', error);

        // Extract meaningful error message
        let errorMessage = "Failed to save profile. Please try again.";

        if (error.success === false && error.error) {
            // Our custom error format
            errorMessage = error.error;
        } else if (error.response?.data?.error) {
            // Backend validation/server error
            errorMessage = error.response.data.error;
        } else if (error.response?.status === 401) {
            errorMessage = "Authentication failed. Please log in again.";
        } else if (error.response?.status === 400) {
            errorMessage = error.response.data.error || "Invalid profile data. Please check your inputs.";
        } else if (error.response?.status === 404) {
            errorMessage = "User not found. Please log in again.";
        } else if (error.response?.status === 500) {
            errorMessage = "Server error. Please try again later.";
        }

        throw {
            success: false,
            error: errorMessage,
            details: error.response?.data?.details,
            originalError: error
        };
    }
}

export { Profile, Upload }