import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHeart, faTimes, faUndo, faStar } from '@fortawesome/free-solid-svg-icons';
import styles from './forYouFeed.module.css';
import Footer from '../../Components/Footer/Footer.jsx';
import { useNavigate } from 'react-router-dom';
import default_profile from '../../assets/default_profile.jpg';
import { getForYouFeed, recordSwipe, undoSwipe } from '../../Services/RecommendationAPI';

const ForYouFeed = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState([]);
  const [showUndoMessage, setShowUndoMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPersonalizedFeed();
  }, []);

  const fetchPersonalizedFeed = async () => {
    try {
      const data = await getForYouFeed(20);

      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (action) => {
    if (!currentProfile) return;

    try {
      await recordSwipe(currentProfile._id, action);

      // Add to history for undo functionality
      setSwipeHistory([...swipeHistory, {
        profileId: currentProfile._id,
        action,
        index: activeIndex
      }]);

      // Move to next profile
      setActiveIndex(activeIndex + 1);

      // Fetch more when running low
      if (activeIndex >= recommendations.length - 5) {
        fetchPersonalizedFeed();
      }
    } catch (error) {
      console.error('Failed to record swipe:', error);
    }
  };

  const handleUndo = async () => {
    if (swipeHistory.length === 0) return;

    try {
      const data = await undoSwipe();

      if (data.success) {
        const lastSwipe = swipeHistory[swipeHistory.length - 1];
        setSwipeHistory(swipeHistory.slice(0, -1));
        setActiveIndex(lastSwipe.index);
      } else {
        // Show premium message
        setShowUndoMessage(true);
        setTimeout(() => setShowUndoMessage(false), 3000);
      }
    } catch (error) {
      console.error('Failed to undo swipe:', error);
      setShowUndoMessage(true);
      setTimeout(() => setShowUndoMessage(false), 3000);
    }
  };

  const handleLeftArrowClick = () => {
    navigate('/userhome');
  };

  const currentProfile = recommendations[activeIndex];

  if (loading) {
    return (
      <Container fluid className={styles.userPages}>
        <div className={styles.loadingContainer}>Loading your personalized feed...</div>
      </Container>
    );
  }

  if (!currentProfile) {
    return (
      <Container fluid className={styles.userPages}>
        <div className={styles.header}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            transform="shrink-8"
            className={styles.roundButton}
            onClick={handleLeftArrowClick}
          />
          <div className={styles.pageTitle}>For You</div>
          <div className={styles.roundButton}></div>
        </div>

        <div className={styles.emptyState}>
          <FontAwesomeIcon icon={faStar} className={styles.emptyIcon} />
          <h2>You've seen all recommendations!</h2>
          <p>Check back later for fresh matches</p>
          <button onClick={fetchPersonalizedFeed} className={styles.refreshButton}>
            Refresh Feed
          </button>
        </div>
        <Footer />
      </Container>
    );
  }

  return (
    <Container fluid className={styles.userPages}>
      <div className={styles.header}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          transform="shrink-8"
          className={styles.roundButton}
          onClick={handleLeftArrowClick}
        />
        <div className={styles.pageTitle}>For You</div>
        <div className={styles.roundButton}></div>
      </div>

      <div className={styles.feedHeader}>
        <h1 className={styles.title}>
          <span className={styles.gradientText}>Personalized For You</span>
        </h1>
        <p className={styles.subtitle}>
          {recommendations.length - activeIndex} matches remaining
        </p>
      </div>

      {showUndoMessage && (
        <div className={styles.premiumMessage}>
          Undo is a Premium feature! Upgrade to use this feature.
        </div>
      )}

      <div className={styles.cardContainer}>
        <div className={styles.profileCard}>
          <div className={styles.imageContainer}>
            <img
              src={currentProfile.profile?.profile_image_urls?.[0] || default_profile}
              alt={currentProfile.name}
              className={styles.profileImage}
            />

            {currentProfile.compatibilityScore && (
              <div className={styles.compatibilityBadge}>
                {Math.round(currentProfile.compatibilityScore)}% Match
              </div>
            )}
          </div>

          <div className={styles.cardContent}>
            <div className={styles.profileHeader}>
              <h2 className={styles.profileName}>
                {currentProfile.name}
                {currentProfile.profile?.age && `, ${currentProfile.profile.age}`}
              </h2>
            </div>

            {currentProfile.profile?.location?.name && (
              <div className={styles.location}>
                <span className={styles.locationIcon}>📍</span>
                {currentProfile.profile.location.name}
              </div>
            )}

            {currentProfile.recommendationReason && (
              <div className={styles.recommendationReason}>
                ✨ {currentProfile.recommendationReason}
              </div>
            )}

            {currentProfile.interests && currentProfile.interests.length > 0 && (
              <div className={styles.interests}>
                {currentProfile.interests.slice(0, 3).map((interest, idx) => (
                  <span key={idx} className={styles.interestTag}>
                    {interest.interest_name || interest}
                  </span>
                ))}
              </div>
            )}

            {currentProfile.profile?.bio && (
              <p className={styles.bio}>{currentProfile.profile.bio}</p>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${((activeIndex + 1) / recommendations.length) * 100}%`
            }}
          ></div>
        </div>

        {/* Action buttons */}
        <div className={styles.actions}>
          <button
            onClick={() => handleSwipe('pass')}
            className={`${styles.actionButton} ${styles.passButton}`}
            title="Pass"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <button
            onClick={handleUndo}
            className={`${styles.actionButton} ${styles.undoButton}`}
            title="Undo (Premium)"
            disabled={swipeHistory.length === 0}
          >
            <FontAwesomeIcon icon={faUndo} />
          </button>

          <button
            onClick={() => handleSwipe('like')}
            className={`${styles.actionButton} ${styles.likeButton}`}
            title="Like"
          >
            <FontAwesomeIcon icon={faHeart} />
          </button>
        </div>
      </div>

      <Footer />
    </Container>
  );
};

export default ForYouFeed;
