import React, { useState } from 'react';
import styles from './ChooseApp.module.css';
import LandingPage from '../LandingPage/LandingPage';
import { ChooseAppAPI } from '../../Services/chooseAppAPI'
import { useNavigate } from 'react-router-dom';

const ChooseApp = () => {
  const navigate = useNavigate()
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionClick = async (option) => {
    const ChooseApp = {
      chooseApp: option
    }
    console.log("Selected Option:", option);
    setSelectedOption(option);
    try {
      const response = await ChooseAppAPI(ChooseApp)
      console.log("Saved Successfully", response);
      if (response.success) {
        navigate('/userhome')
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Server not responded', error)
    }
  };

  return (
    <>
      <LandingPage />
      <div className={styles.overlay}>
        <div className={styles.modal}>
          {/* Progress Indicator - All Steps Complete! */}
          <div className={styles.progressIndicator}>
            <div className={styles.progressDot}></div>
            <div className={styles.progressDot}></div>
            <div className={styles.progressDot}></div>
            <div className={styles.progressDot}></div>
            <div className={`${styles.progressDot} ${styles.active}`}></div>
          </div>

          <h2>Choose Your Journey 💕</h2>
          <div className={styles.stepIndicator}>Final Step - Almost there!</div>
          <p className={styles.celebrationText}>
            You're one step away from finding your perfect match. Choose what brings you here!
          </p>

          <div className={styles.buttonContainer}>
            {/* Dating Option Card */}
            <button
              className={`${styles.optionButton} ${selectedOption === 'Dating' ? styles.selected : ''}`}
              onClick={() => handleOptionClick('Dating')}
            >
              <div className={styles.optionIcon}>❤️</div>
              <div className={styles.optionTitle}>Dating Mode</div>
              <div className={styles.optionDescription}>
                Explore connections, meet new people, and have fun dating!
              </div>
            </button>

            {/* Matrimony Option Card */}
            <button
              className={`${styles.optionButton} ${selectedOption === 'Matrimony' ? styles.selected : ''}`}
              onClick={() => handleOptionClick('Matrimony')}
            >
              <div className={styles.optionIcon}>💍</div>
              <div className={styles.optionTitle}>Matrimony Mode</div>
              <div className={styles.optionDescription}>
                Find your life partner and build a future together
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChooseApp;