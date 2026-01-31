import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlidersH, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './matchesPage.module.css';
import Footer from '../../Components/Footer/Footer.jsx';
import LikeAndConnect from '../../Components/LikeAndConnect/LikeAndConnect.jsx';
import Toast from '../../Components/Toast/Toast.jsx';
import LoadingPage from '../../Components/LoadingPage/LoadingPage.jsx';
import { Link, useNavigate } from 'react-router-dom';
import ProfileCard from '../../Components/ProfileCard/ProfileCard.jsx';
import { fetchAllProfiles } from '../../Services/userHomeProfilesAPI.js'; 

function MatchesPage() {
  const [showNavigation, setShowNavigation] = useState(false);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      try {
        const response = await fetchAllProfiles();
        if (response && response.success) {
          setMatches(response.profiles || []);
        } else {
          setToast({ show: true, message: 'Failed to load matches', type: 'error' });
        }
      } catch (error) {
        console.error('Error loading matches:', error);
        setToast({ show: true, message: 'Network error. Please try again.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  const handleSliderClick = () => {
    setShowNavigation(!showNavigation);
  };

  const handleLeftArrowClick = () => {
    navigate('/userhome');
  };
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className={styles.userPages}>
      <div className={styles.header}>
        <button className={styles.roundButton} onClick={handleLeftArrowClick} aria-label="Back to home">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <h1 className={styles.pageTitle}>Matches</h1>
        <button className={styles.roundButton} onClick={handleSliderClick} aria-label="Filter options">
          <FontAwesomeIcon icon={faSlidersH} />
        </button>
      </div>

      {showNavigation && (
        <div className={styles.navigationList}>
          <Link to='/qualification' className={styles.navigationItem}>
            <span className={styles.navigationLink}>Qualification</span>
          </Link>
          <Link to='/location' className={styles.navigationItem}>
            <span className={styles.navigationLink}>Location</span>
          </Link>
          <Link to='/designation' className={styles.navigationItem}>
            <span className={styles.navigationLink}>Designation</span>
          </Link>
        </div>
      )}

      <LikeAndConnect />

      <div className={styles.matchCount}>
        Your Matches <span className={styles.matchCountNumber}>{matches.length}</span>
      </div>

      <div className={styles.matchContainer}>
        {matches.map((match, index) => (
          <ProfileCard
            key={match._id || index}
            profileId={match._id}
            matchPercentage={match.matchPercentage || "85%"}
            imageUrl={match.profile?.profile_image_urls?.[0] || match.img}
            distance={match.distance || "2 km"}
            name={match.name}
            age={match.profile?.age || match.age}
            location={match.profile?.location?.name || match.location}
          />
        ))}
      </div>

      <Footer />

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
  )
}

export default MatchesPage