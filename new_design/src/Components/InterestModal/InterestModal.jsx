import React from 'react';
import styles from './interestModal.module.css';

const InterestModal = ({ show, handleClose }) => {
  const handleSelectInterest = (interest) => {
    handleClose(interest);
  };

  if (!show) return null;

  return (
    <div className={styles.overlay} onClick={() => handleClose(null)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>I'm interested in</h2>
        <p className={styles.subtitle}>Choose who you'd like to meet</p>

        <div className={styles.optionsContainer}>
          {/* Option Card - MEN */}
          <div
            className={styles.optionCard}
            onClick={() => handleSelectInterest('MEN')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleSelectInterest('MEN')}
          >
            <div className={styles.optionIcon}>👨</div>
            <div className={styles.optionContent}>
              <div className={styles.optionTitle}>Men</div>
              <div className={styles.optionDescription}>I'm interested in men</div>
            </div>
          </div>

          {/* Option Card - WOMEN */}
          <div
            className={styles.optionCard}
            onClick={() => handleSelectInterest('WOMEN')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleSelectInterest('WOMEN')}
          >
            <div className={styles.optionIcon}>👩</div>
            <div className={styles.optionContent}>
              <div className={styles.optionTitle}>Women</div>
              <div className={styles.optionDescription}>I'm interested in women</div>
            </div>
          </div>

          {/* Option Card - BOTH/EVERYONE */}
          <div
            className={styles.optionCard}
            onClick={() => handleSelectInterest('BOTH')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleSelectInterest('BOTH')}
          >
            <div className={styles.optionIcon}>👥</div>
            <div className={styles.optionContent}>
              <div className={styles.optionTitle}>Everyone</div>
              <div className={styles.optionDescription}>I'm open to meeting everyone</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestModal;
