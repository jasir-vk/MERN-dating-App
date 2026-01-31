import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCompass, faUserGroup, faComment } from '@fortawesome/free-solid-svg-icons';
import styles from './footer.module.css';

const navigationItems = [
  { icon: faHome, id: 0, path: '/userhome', label: 'Home' },
  { icon: faCompass, id: 1, path: '/explore', label: 'Explore' },
  { icon: 'nearby', id: 2, path: '/near-by-user', label: 'Nearby' },
  { icon: faUserGroup, id: 3, path: '/qualification', label: 'People' },
  { icon: faComment, id: 4, path: '/messages', label: 'Messages' },
];

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const determineActiveIndex = (pathname) => {
    if (pathname === '/location' || pathname === '/designation') {
      return 3;
    }
    return navigationItems.findIndex(item => item.path === pathname);
  };

  const [activeIndex, setActiveIndex] = useState(determineActiveIndex(location.pathname));

  useEffect(() => {
    setActiveIndex(determineActiveIndex(location.pathname));
  }, [location.pathname]);

  const handleNavClick = (index, path) => {
    setActiveIndex(index);
    navigate(path);
  };

  return (
    <footer className={styles.footerContainer}>
      <nav className={styles.footerNav} role="navigation" aria-label="Main navigation">
        {navigationItems.map((item, index) => (
          <button
            key={item.id}
            className={`${styles.navButton} ${activeIndex === index ? styles.active : ''}`}
            onClick={() => handleNavClick(index, item.path)}
            aria-label={item.label}
            aria-current={activeIndex === index ? 'page' : undefined}
            title={item.label}
          >
            {item.icon === 'nearby' ? (
              <div className={styles.nearbyIcon}>
                <div className={styles.nearbyGradient} />
              </div>
            ) : (
              <FontAwesomeIcon icon={item.icon} className={styles.navIcon} />
            )}
            {activeIndex === index && <div className={styles.activeIndicator} />}
          </button>
        ))}
      </nav>
    </footer>
  );
};

export default Footer;
