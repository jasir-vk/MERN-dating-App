import React from 'react';
import styles from './profileCard.module.css';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ profileId, matchPercentage, compatibilityScore, imageUrl, distance, name, age, location }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (profileId) {
      navigate(`/profileview/${profileId}`);
    }
  };

  // Use compatibilityScore if available, otherwise fall back to matchPercentage
  const displayScore = compatibilityScore || matchPercentage;

  // Get badge color based on score
  const getBadgeClass = (score) => {
    if (typeof score === 'string') {
      // Remove '%' and parse
      score = parseInt(score.replace('%', ''));
    }
    if (score >= 80) return styles.matchBadgeHigh;
    if (score >= 60) return styles.matchBadgeMedium;
    return styles.matchBadgeLow;
  };

  return (
    <div className={styles.profileCard} onClick={handleNavigate} role="button" tabIndex={0}>
      {displayScore && (
        <div className={`${styles.matchBadge} ${getBadgeClass(displayScore)}`}>
          {typeof displayScore === 'number' ? `${displayScore}%` : displayScore} Match
        </div>
      )}
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={`${name}, ${age}`} className={styles.profileImage} />
      </div>
      <div className={styles.profileOverlay}>
        <div className={styles.profileDistance}>{distance} away</div>
        <div className={styles.profileName}>
          {name}, {age} <span className={styles.onlineStatus}></span>
        </div>
        <div className={styles.profileLocation}>{location}</div>
      </div>
    </div>
  );
};

export default ProfileCard;
