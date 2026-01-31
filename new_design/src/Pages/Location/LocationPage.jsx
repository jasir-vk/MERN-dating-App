import React, { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlidersH, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './locationPage.module.css';
import Footer from '../../Components/Footer/Footer.jsx';
import LikeAndConnect from '../../Components/LikeAndConnect/LikeAndConnect.jsx';
import { Link, useNavigate } from 'react-router-dom';
import ProfileCard from '../../Components/ProfileCard/ProfileCard.jsx';
import { fetchAllProfiles } from '../../Services/userHomeProfilesAPI';
import default_profile from '../../assets/default_profile.jpg';

const LocationPage = () => {
  const [showNavigation, setShowNavigation] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocationProfiles = async () => {
      try {
        const response = await fetchAllProfiles(false);
        if (response && response.success) {
          console.log('Location Profiles:', response.profiles);
          setProfiles(response.profiles);
        }
      } catch (error) {
        console.log('Fetching errors');
      } finally {
        setLoading(false);
      }
    };
    fetchLocationProfiles();
  }, []);

  const handleSliderClick = () => {
    setShowNavigation(!showNavigation);
  };
  const handleLeftArrowClick = () => {
    navigate('/userhome');
  }

  return (
    <Container fluid className={styles.userPages}>
      <div className={styles.header}>
        <FontAwesomeIcon icon={faChevronLeft} transform="shrink-8" className={styles.roundButton} onClick={handleLeftArrowClick}/>
        <div className={styles.pageTitle}>Location</div>
        <FontAwesomeIcon icon={faSlidersH} transform="shrink-8" className={styles.roundButton} onClick={handleSliderClick} />
      </div>

      {showNavigation && (
        <div className={styles.navigationList}>
          <div className={styles.navigationItem}><Link to='/qualification' className={styles.navigationLink}>Qualification</Link></div>
          <div className={styles.navigationItem}><Link to='/designation' className={styles.navigationLink}>Designation</Link></div>
        </div>
      )}

      <LikeAndConnect />
      <div className={styles.matchCount}>
        Your Matches <span className={styles.matchCountNumber}>{profiles.length}</span>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>Loading...</div>
      ) : (
        <Row className={styles.matchContainer}>
          {profiles.map((profile, index) => (
            <div key={profile._id || index} className={`${styles.col} ${styles['col-xs-6']} ${styles['col-md-4']} ${styles['col-lg-2']} ${styles.marginBottom4}`}>
              <ProfileCard
                profileId={profile._id}
                matchPercentage={profile.compatibilityScore || '85%'}
                imageUrl={profile.profile?.profile_image_urls?.[0] || default_profile}
                distance="2 km away"
                name={profile.name}
                age={profile.profile?.age}
                location={profile.profile?.location?.name}
              />
            </div>
          ))}
        </Row>
      )}

      <Footer />
    </Container>
  );
};

export default LocationPage;
