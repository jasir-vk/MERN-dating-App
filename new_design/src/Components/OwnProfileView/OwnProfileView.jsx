import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPen, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import styles from '../ProfileView/ProfileView.module.css';
import { UserContext } from '../Context/UserContext';
import default_profile from '../../assets/default_profile.jpg';
import { Link } from 'react-router-dom';

const OwnProfileView = () => {
    const { user } = useContext(UserContext);

    const profileCompletion = 80; // Calculate based on filled fields
    const userLocation = user?.profile?.location
        ? (typeof user.profile.location === 'object' && 'name' in user.profile.location
            ? user.profile.location.name
            : user.profile.location)
        : 'Not specified';

    return (
        <div className={styles.profileViewContainer}>
            {/* Hero Section with Background Image */}
            <div
                className={styles.heroSection}
                style={{
                    backgroundImage: `url(${user?.profile?.profile_image_urls?.[0] || default_profile})`,
                }}
            >
                <div className={styles.heroOverlay}>
                    {/* Top Navigation */}
                    <div className={styles.topNav}>
                        <Link to='/userhome' className={styles.backButton} aria-label="Back to home">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Link>
                        <Link to='/edit-my-profile' className={styles.editButton} aria-label="Edit profile">
                            <FontAwesomeIcon icon={faPen} />
                            <span>Edit</span>
                        </Link>
                    </div>

                    {/* User Info */}
                    <div className={styles.userInfo}>
                        <h1 className={styles.userName}>
                            {user?.name || 'Guest'}
                            {user?.profile?.age && <span className={styles.userAge}>, {user.profile.age}</span>}
                        </h1>
                        <p className={styles.userLocation}>{userLocation}</p>

                        {/* Profile Completion Badge */}
                        <div className={styles.completionBadge}>
                            <div className={styles.completionCircle}>
                                <svg className={styles.completionSvg} viewBox="0 0 36 36">
                                    <defs>
                                        <linearGradient id="completionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#4B134F" />
                                            <stop offset="100%" stopColor="#FF4081" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        className={styles.completionBg}
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path
                                        className={styles.completionFill}
                                        strokeDasharray={`${profileCompletion}, 100`}
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                </svg>
                                <div className={styles.completionText}>
                                    <span className={styles.completionNumber}>{profileCompletion}</span>
                                    <span className={styles.completionPercent}>%</span>
                                </div>
                            </div>
                            <span className={styles.completionLabel}>Profile Complete</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className={styles.contentSection}>
                {/* About Card */}
                <div className={styles.card}>
                    <h2 className={styles.cardHeading}>About</h2>
                    <p className={styles.cardContent}>
                        {user?.profile?.about || 'A good listener. I love having a good talk to know each other\'s side 😍.'}
                    </p>
                </div>

                {/* Interests Card */}
                <div className={styles.card}>
                    <h2 className={styles.cardHeading}>Interests</h2>
                    <div className={styles.interestTags}>
                        {user?.profile?.interest?.map((interest, index) => (
                            <span key={index} className={styles.interestTag}>
                                <FontAwesomeIcon icon={faCircleCheck} className={styles.interestIcon} />
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnProfileView;
