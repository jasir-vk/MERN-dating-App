import React from 'react';
import styles from './SkeletonLoader.module.css';

export const SkeletonHeader = () => {
  return (
    <div className={styles.skeletonHeader}>
      <div className={styles.skeletonHeaderContainer}>
        <div className={`${styles.skeleton} ${styles.skeletonIconButton}`} />
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <div className={`${styles.skeleton} ${styles.skeletonIconButton}`} />
      </div>
    </div>
  );
};

const SkeletonLoader = ({ variant = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'receivedCard':
        return (
          <div className={styles.skeletonReceivedCard}>
            <div className={`${styles.skeleton} ${styles.skeletonImage}`} />
            <div className={styles.skeletonInfo}>
              <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '60%', height: '20px' }} />
              <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '40%', height: '16px', marginTop: '8px' }} />
              <div className={styles.skeletonButtonGroup}>
                <div className={`${styles.skeleton} ${styles.skeletonButton}`} />
                <div className={`${styles.skeleton} ${styles.skeletonButton}`} />
              </div>
            </div>
          </div>
        );

      case 'profileCard':
        return (
          <div className={styles.skeletonProfileCard}>
            <div className={`${styles.skeleton} ${styles.skeletonImage}`} style={{ aspectRatio: '3/4' }} />
            <div style={{ padding: '12px' }}>
              <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '70%', height: '18px' }} />
              <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '50%', height: '14px', marginTop: '8px' }} />
            </div>
          </div>
        );

      case 'list':
        return (
          <div className={styles.skeletonListItem}>
            <div className={`${styles.skeleton} ${styles.skeletonAvatar}`} />
            <div className={styles.skeletonListContent}>
              <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '60%', height: '16px' }} />
              <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '40%', height: '14px', marginTop: '6px' }} />
            </div>
          </div>
        );

      default:
        return (
          <div className={styles.skeletonCard}>
            <div className={`${styles.skeleton} ${styles.skeletonImage}`} />
            <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '70%' }} />
            <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '50%' }} />
          </div>
        );
    }
  };

  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className={styles.skeletonWrapper}>
            {renderSkeleton()}
          </div>
        ))}
    </>
  );
};

export default SkeletonLoader;
