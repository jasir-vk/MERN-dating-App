import React, { useContext, useEffect, useState } from 'react';
import styles from './ProfileView.module.css';
import default_profile from '../../assets/default_profile.jpg';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { FetchIndividualProfile } from '../../Services/IndividualProfileGetAPI';
import LoadingPage from '../LoadingPage/LoadingPage';
import { sentFriendRequest } from '../../Services/FriendRequestAPI';
import { getAcceptRequest } from '../../Services/getAcceptRequestAPI';
import { ShortListedProfiles } from '../../Services/ShortListAPI';
import Toast from '../Toast/Toast';

const ProfileView = () => {
    const { profileId } = useParams();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [requestAccepted, setRequestAccepted] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const fetchAcceptUsers = async () => {
        try {
            const response = await getAcceptRequest(profileId);
            if (response && response.success) {
                if (response.status) {
                    setRequestAccepted(response.status === 'accepted');
                }
            }
        } catch (error) {
            console.error('Error checking friend request status:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAcceptUsers();
    }, [profileId, user]);

    const handleSentFriendRequest = async (receiverId) => {
        try {
            const response = await sentFriendRequest(receiverId);
            if (response && response.success) {
                setToast({ show: true, message: response.message || 'Friend request sent!', type: 'success' });
                await fetchAcceptUsers();
            } else {
                setToast({ show: true, message: response.error || 'Failed to send friend request', type: 'error' });
            }
        } catch (error) {
            setToast({ show: true, message: 'Network error. Please try again.', type: 'error' });
        }
    };

    useEffect(() => {
        if (user === null || user === undefined) {
            return;
        }
        const fetchUserProfile = async () => {
            if (!user || !user._id) {
                setLoading(false);
                return;
            }
            try {
                const response = await FetchIndividualProfile(profileId, user._id);
                if (response.success) {
                    setProfile(response.profile);
                } else {
                    setToast({ show: true, message: 'Failed to fetch profile', type: 'error' });
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setToast({ show: true, message: 'An error occurred while fetching the profile', type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [profileId, user]);

    const handleShortList = async (profileId) => {
        try {
            const response = await ShortListedProfiles(profileId);
            if (response && response.success) {
                setToast({ show: true, message: response.message || 'Added to shortlist!', type: 'success' });
            } else {
                setToast({ show: true, message: response.error || 'Failed to shortlist', type: 'error' });
            }
        } catch (error) {
            console.error('Error in shortlist API:', error);
            setToast({ show: true, message: 'Network error. Please try again.', type: 'error' });
        }
    };

    const handleDislike = () => {
        setToast({ show: true, message: 'Profile passed', type: 'info' });
        setTimeout(() => {
            navigate('/userhome');
        }, 1000);
    };

    const handleImageNavigation = (index) => {
        setCurrentImageIndex(index);
    };

    const calculateMatchPercentage = () => {
        if (!profile || !user) return 80;

        let matchScore = 0;
        let totalFactors = 0;

        // Interest matching (40% weight)
        if (profile.profile?.interest && user.profile?.interest) {
            const userInterests = user.profile.interest;
            const profileInterests = profile.profile.interest;
            const commonInterests = profileInterests.filter(interest =>
                userInterests.includes(interest)
            );
            const interestMatch = (commonInterests.length / Math.max(profileInterests.length, 1)) * 40;
            matchScore += interestMatch;
            totalFactors += 40;
        }

        // Age compatibility (20% weight)
        if (profile.profile?.age && user.profile?.age) {
            const ageDiff = Math.abs(profile.profile.age - user.profile.age);
            const ageMatch = Math.max(0, 20 - (ageDiff * 2));
            matchScore += ageMatch;
            totalFactors += 20;
        }

        // Location proximity (20% weight) - if both have locations
        if (profile.profile?.location && user.profile?.location) {
            matchScore += 15; // Simplified - would need actual distance calculation
            totalFactors += 20;
        }

        // Relationship goals (20% weight)
        if (profile.profile?.relationship_goals && user.profile?.relationship_goals) {
            if (profile.profile.relationship_goals === user.profile.relationship_goals) {
                matchScore += 20;
            }
            totalFactors += 20;
        }

        // Return percentage (minimum 60%, maximum 99%)
        const percentage = totalFactors > 0 ? Math.round((matchScore / totalFactors) * 100) : 80;
        return Math.min(99, Math.max(60, percentage));
    };

    if (user === null || user === undefined) {
        return <LoadingPage />;
    }
    if (loading) return <LoadingPage />;
    if (!loading && !profile) return <LoadingPage />;

    const profileImages = profile?.profile?.profile_image_urls || [default_profile];
    const matchPercentage = calculateMatchPercentage();

    return (
        <div className={styles.profileViewContainer}>
            {/* Hero Section with Image Gallery */}
            <div
                className={styles.heroSection}
                style={{
                    backgroundImage: `url(${profileImages[currentImageIndex]})`,
                }}
            >
                <div className={styles.heroOverlay}>
                    {/* Top Navigation */}
                    <div className={styles.topNav}>
                        <Link to='/userhome' className={styles.backButton}>
                            <i className="fas fa-chevron-left"></i>
                        </Link>
                    </div>

                    {/* Image Dots Indicator */}
                    {profileImages.length > 1 && (
                        <div className={styles.imageDots}>
                            {profileImages.map((_, index) => (
                                <div
                                    key={index}
                                    className={`${styles.dot} ${index === currentImageIndex ? styles.activeDot : ''}`}
                                    onClick={() => handleImageNavigation(index)}
                                />
                            ))}
                        </div>
                    )}

                    {/* User Info */}
                    <div className={styles.userInfo}>
                        <h1 className={styles.userName}>
                            {profile.name}, <span className={styles.userAge}>{profile.profile?.age}</span>
                        </h1>
                        <p className={styles.userLocation}>
                            <i className="fa-solid fa-location-dot"></i> {profile.profile?.location?.name || 'Unknown'}
                        </p>

                        {/* Match Percentage Badge */}
                        <div className={styles.completionBadge}>
                            <div className={styles.completionCircle}>
                                <svg className={styles.completionSvg} viewBox="0 0 36 36">
                                    <defs>
                                        <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#4B134F" />
                                            <stop offset="100%" stopColor="#FF4081" />
                                        </linearGradient>
                                    </defs>
                                    <circle className={styles.completionBg} cx="18" cy="18" r="16" />
                                    <circle
                                        className={styles.completionFill}
                                        cx="18"
                                        cy="18"
                                        r="16"
                                        strokeDasharray={`${matchPercentage}, 100`}
                                    />
                                </svg>
                                <div className={styles.completionText}>
                                    <span className={styles.completionNumber}>{matchPercentage}</span>
                                    <span className={styles.completionPercent}>%</span>
                                </div>
                            </div>
                            <span className={styles.completionLabel}>Match</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className={styles.contentSection}>
                {/* About Card */}
                <div className={styles.card}>
                    <h3 className={styles.cardHeading}>About</h3>
                    <p className={styles.cardContent}>
                        {profile.profile?.bio || 'No bio available for this profile.'}
                    </p>
                </div>

                {/* Interests Card */}
                <div className={styles.card}>
                    <h3 className={styles.cardHeading}>Interests</h3>
                    <div className={styles.interestTags}>
                        {profile.profile?.interest && profile.profile.interest.length > 0 ? (
                            profile.profile.interest.map((interest, index) => (
                                <span key={index} className={styles.interestTag}>
                                    <span className={styles.interestIcon}>🌿</span>
                                    {interest}
                                </span>
                            ))
                        ) : (
                            <span className={styles.cardContent}>No interests listed</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className={styles.footerContainer}>
                <div className={styles.buttonWrapper}>
                    <button
                        className={`${styles.footerButton} ${styles.dislikeButton}`}
                        onClick={handleDislike}
                        aria-label="Dislike profile"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                    <div className={styles.hoverText}>Pass</div>
                </div>

                <div className={styles.buttonWrapper}>
                    <button
                        className={`${styles.footerButton} ${styles.starButton}`}
                        onClick={() => handleShortList(profileId)}
                        aria-label="Add to shortlist"
                    >
                        <i className="fas fa-star"></i>
                    </button>
                    <div className={styles.hoverText}>Shortlist</div>
                </div>

                <div className={styles.buttonWrapper}>
                    {!requestAccepted ? (
                        <>
                            <button
                                className={`${styles.footerButton} ${styles.likeButton}`}
                                onClick={() => handleSentFriendRequest(profileId)}
                                aria-label="Send friend request"
                            >
                                <i className="fas fa-heart"></i>
                            </button>
                            <div className={styles.hoverText}>Send Request</div>
                        </>
                    ) : (
                        <>
                            <Link to={`/personal-messages/${profileId}`}>
                                <button
                                    className={`${styles.footerButton} ${styles.chatButton}`}
                                    aria-label="Send message"
                                >
                                    <i className="fas fa-comment"></i>
                                </button>
                            </Link>
                            <div className={styles.hoverText}>Message</div>
                        </>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={3000}
                    onClose={() => setToast({ show: false, message: '', type: '' })}
                />
            )}
        </div>
    );
};

export default ProfileView;

