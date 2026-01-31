import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faBriefcase, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import styles from './filters.module.css';
import { Link } from 'react-router-dom';

const filters = [
  { id: 'nearby', label: 'Nearby', icon: faLocationDot, path: '/near-by-user' },
  { id: 'designation', label: 'Designation', icon: faBriefcase, path: '/designation' },
  { id: 'qualification', label: 'Qualification', icon: faGraduationCap, path: '/qualification' },
];

const Filters = () => {
  const [activeFilter, setActiveFilter] = useState('nearby');

  return (
    <section className={styles.filtersSection}>
      <div className={styles.filtersContainer}>
        {filters.map((filter) => (
          <Link
            key={filter.id}
            to={filter.path}
            className={`${styles.filterPill} ${activeFilter === filter.id ? styles.filterPillActive : ''}`}
            onClick={() => setActiveFilter(filter.id)}
            role="button"
            tabIndex={0}
          >
            <FontAwesomeIcon icon={filter.icon} className={styles.filterIcon} />
            <span className={styles.filterLabel}>{filter.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Filters;
