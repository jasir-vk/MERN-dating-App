import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faEllipsisH, faSort } from '@fortawesome/free-solid-svg-icons';
import styles from './profiles.module.css';
import { Link } from 'react-router-dom';
import { fetchAllProfiles } from '../../Services/userHomeProfilesAPI';
import { UserContext } from '../Context/UserContext';
import default_profile from '../../assets/default_profile.jpg';

const Profiles = () => {
  const { user } = useContext(UserContext);
  const [allProfiles, setAllProfiles] = useState([]);
  const [sortByCompatibility, setSortByCompatibility] = useState(false);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetchAllProfiles(sortByCompatibility);
        if (response && response.success) {
          console.log("Fetched Profiles:", response.profiles);
          setAllProfiles(response.profiles);
        }
      } catch (error) {
        console.log('Fetching errors');
      }
    };
    fetchAllUsers();
  }, [sortByCompatibility]);

  return (
    <section className={styles.profilesSection}>
      <div className={styles.profilesHeader}>
        <h2 className={styles.profilesTitle}>Discover Matches</h2>
        <button
          className={`${styles.sortButton} ${sortByCompatibility ? styles.sortButtonActive : ''}`}
          onClick={() => setSortByCompatibility(!sortByCompatibility)}
        >
          <FontAwesomeIcon icon={faSort} />
          {sortByCompatibility ? 'Sorted by Compatibility' : 'Sort by Compatibility'}
        </button>
      </div>
      <div className={styles.profilesGrid}>
        {allProfiles.map((profile, index) => (
          <div key={index} className={styles.profileCardWrapper}>
            <div className={styles.profileCard}>
              <Link to={`/profileView/${profile._id}`} className={styles.profileImageLink}>
                <div className={styles.profileImageContainer}>
                  <img
                    src={profile?.profile?.profile_image_urls?.[0] || default_profile}
                    alt={profile.name}
                    className={styles.profileImage}
                  />
                  <div className={styles.imageOverlay}></div>
                </div>
              </Link>

              <div className={styles.statusBadge}>
                <span className={styles.statusDot}></span>
                Online
              </div>

              {profile.compatibilityScore && (
                <div className={styles.compatibilityBadge}>
                  {profile.compatibilityScore}% Match
                </div>
              )}

              <div className={styles.profileInfo}>
                <div className={styles.profileName}>
                  <span className={styles.name}>{profile.name}</span>
                  <span className={styles.ageGender}>
                    {profile?.profile?.gender}, {profile?.profile?.age}
                  </span>
                </div>
                {profile.employer && (
                  <p className={styles.role}>
                    {profile.employer.type === 'employer'
                      ? `${profile.employer.designation}, ${profile.employer.location}`
                      : profile.employer.jobTitle}
                  </p>
                )}
              </div>

              <div className={styles.actionButtons}>
                <button
                  className={styles.iconButton}
                  aria-label="Like"
                  title="Like"
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <button
                  className={styles.iconButton}
                  aria-label="Message"
                  title="Message"
                >
                  <FontAwesomeIcon icon={faComment} />
                </button>
                <button
                  className={styles.iconButton}
                  aria-label="More options"
                  title="More options"
                >
                  <FontAwesomeIcon icon={faEllipsisH} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Profiles;
