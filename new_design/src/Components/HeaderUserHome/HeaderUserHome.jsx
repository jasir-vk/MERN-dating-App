import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell as faBellRegular } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import styles from './HeaderUserHome.module.css';
import LeftSideMenu from '../LeftSideMenu/LeftSideMenu';
import { ModalContext } from '../../StateManagement/ModalContext';
import { UserContext } from '../Context/UserContext';
import default_profile from '../../assets/default_profile.jpg'


const Header = ({ setNotificationView }) => {
  const { user } = useContext(UserContext)
  const { toggleModal } = useContext(ModalContext)
  const [service, setService] = useState(false)

  const profileImage = user?.profile?.profile_image_urls?.[0] || default_profile;
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <FontAwesomeIcon
            icon={faBars}
            className={styles.menuIcon}
            onClick={() => setService(prev => !prev)}
            aria-label="Menu"
          />
          <h1 className={styles.title}>BuddyPair</h1>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.notificationIcon}>
            <div
              className={styles.iconCircle}
              onClick={() => setNotificationView(true)}
              role="button"
              aria-label="Notifications"
              tabIndex={0}
            >
              <FontAwesomeIcon icon={faBellRegular} />
              <div className={styles.notificationDot}></div>
            </div>
          </div>
          <img
            src={profileImage}
            alt="User Avatar"
            className={styles.avatar}
            onClick={toggleModal}
            role="button"
            tabIndex={0}
          />
        </div>
      </header>
      <LeftSideMenu isService={service} />
    </>
  );
};

export default Header;
