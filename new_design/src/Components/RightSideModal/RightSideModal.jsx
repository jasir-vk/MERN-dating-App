import React, { useContext } from "react";
import { FaSignOutAlt, FaTimes, FaUser, FaPaperPlane, FaEye, FaCheck, FaTimes as FaReject, FaInbox, FaStar, FaHeart, FaEnvelope, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./RightSideModal.module.css";
import { ModalContext } from "../../StateManagement/ModalContext";
import { UserContext } from "../Context/UserContext";
import default_profile from '../../assets/default_profile.jpg';

const menuItems = [
    { path: '/ownProfileview', label: 'My Profile', icon: FaUser, name: 'My Profile' },
    { path: '/sent', label: 'Sent Request', icon: FaPaperPlane, name: 'Sent' },
    { path: '/viewed-my-profile', label: 'Viewed My Profile', icon: FaEye, name: 'Viewed My Profile' },
    { path: '/accepted', label: 'Accept Request', icon: FaCheck, name: 'Accept' },
    { path: '/rejected', label: 'Reject', icon: FaReject, name: 'Reject' },
    { path: '/received', label: 'Received', icon: FaInbox, name: 'Received' },
    { path: '/shortlistedBy', label: 'Shortlisted By', icon: FaStar, name: 'Shortlisted By' },
    { path: '/shortlisted', label: 'Shortlisted', icon: FaHeart, name: 'Shortlisted' },
    { path: '/messages', label: 'Message', icon: FaEnvelope, name: 'Message' },
    { path: '/settings', label: 'Settings', icon: FaCog, name: 'Settings' },
];

const RightSideModal = () => {
    const { user, logout } = useContext(UserContext);
    const { isModalOpen, toggleModal, handlePageNameChange } = useContext(ModalContext);

    const handleLinkClick = (name) => {
        handlePageNameChange(name);
        toggleModal();
    };

    const handleLogout = () => {
        logout();
        toggleModal();
    };

    const profileImageUrl = user?.profile?.profile_image_urls?.[0] || default_profile;

    return (
        <>
            {isModalOpen && (
                <div
                    className={styles.overlay}
                    onClick={toggleModal}
                    role="presentation"
                    aria-hidden="true"
                />
            )}
            <div
                className={`${styles.rightSideModal} ${isModalOpen ? styles.open : ""}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className={styles.modalContent}>
                    {/* Header */}
                    <div className={styles.modalHeader}>
                        <div className={styles.profileSection}>
                            <div className={styles.profileImageContainer}>
                                <img
                                    src={profileImageUrl}
                                    alt={`${user?.name || 'Guest'}'s profile`}
                                    className={styles.profilePic}
                                />
                                <span className={styles.onlineStatus} aria-label="Online"></span>
                            </div>
                            <div className={styles.profileInfo}>
                                <h3 id="modal-title" className={styles.userName}>{user?.name || 'Guest'}</h3>
                                <span className={styles.primeBadge}>Prime Member</span>
                                <p className={styles.onlineText}>Online</p>
                            </div>
                        </div>
                        <button
                            className={styles.closeIcon}
                            onClick={toggleModal}
                            aria-label="Close modal"
                            title="Close"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className={styles.modalBody}>
                        <ul className={styles.menuList}>
                            {menuItems.map((item, index) => (
                                <li key={index} className={styles.menuItem}>
                                    <Link
                                        to={item.path}
                                        className={styles.menuLink}
                                        onClick={() => handleLinkClick(item.name)}
                                    >
                                        <item.icon className={styles.menuIcon} />
                                        <span className={styles.menuLabel}>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className={styles.modalFooter}>
                        <button
                            className={styles.logoutButton}
                            onClick={handleLogout}
                            aria-label="Logout"
                        >
                            <FaSignOutAlt className={styles.logoutIcon} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RightSideModal;
