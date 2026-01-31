import React, { useEffect, useState } from 'react';
import styles from './RelationshipGoals.module.css';
import LandingPage from '../LandingPage/LandingPage';
import { RelationStatus, getLocationName } from '../../Services/relationShipAPI';
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../../Components/LoadingPage/LoadingPage';

const RelationshipGoals = () => {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState('shortTerm');
  const [currentStep, setCurrentStep] = useState(1);
  const [location, setLocation] = useState(null);
  const [gender, setGender] = useState('');
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [manualLocation, setManualLocation] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentStep === 2 && !locationPermissionDenied) {
      setIsLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
              const locationName = await getLocationName(lat, lon);
              setLocation({
                lat,
                lon,
                name: locationName
              });
            } catch (error) {
              console.error('Error fetching location name:', error);
              setError('Unable to fetch location. Please enter manually.');
              setLocationPermissionDenied(true);
            } finally {
              setIsLoading(false);
            }
          },
          (error) => {
            console.error('GeoLocation error', error);
            setError('Location permission denied. Please enter manually.');
            setLocationPermissionDenied(true);
            setIsLoading(false);
          }
        );
      } else {
        console.error('Geo Location not supported by this Browser');
        setError('Geolocation not supported. Please enter location manually.');
        setLocationPermissionDenied(true);
        setIsLoading(false);
      }
    }
  }, [currentStep, locationPermissionDenied]);


  const handleNext = async () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setIsLoading(true);
      const relationStatus = {
        relationShipGoal: selectedGoal,
        location: location && typeof location === 'object' ? location : { name: location },
        gender,
      };
      try {
        const response = await RelationStatus(relationStatus);
        console.log('Successfully added goal and details', response);
        if (response.success) {
          navigate('/choose-app');
        } else {
          setError('Unexpected response from server');
        }
      } catch (error) {
        console.error('Server not responded', error);
        setError('Failed to save data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <LandingPage />
      <div className={styles.overlay}>
        <div className={styles.modal}>
          {isLoading ? (
            <LoadingPage />
          ) : (
            <>
              {/* Progress Indicator */}
              <div className={styles.progressIndicator}>
                <div className={styles.progressDot}></div>
                <div className={styles.progressDot}></div>
                <div className={`${styles.progressDot} ${styles.active}`}></div>
                <div className={styles.progressDot}></div>
                <div className={styles.progressDot}></div>
              </div>

              {currentStep === 1 && (
                <>
                  <h2>What are you looking for?</h2>
                  <div className={styles.stepIndicator}>Step 3 of 5</div>

                  <div className={styles.radioContainer}>
                    {/* Short Term Option Card */}
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="relationshipGoal"
                        value="shortTerm"
                        checked={selectedGoal === 'shortTerm'}
                        onChange={() => setSelectedGoal('shortTerm')}
                      />
                      <div className={`${styles.optionCard} ${selectedGoal === 'shortTerm' ? styles.selected : ''}`}>
                        <div className={styles.optionIcon}>💫</div>
                        <div className={styles.optionContent}>
                          <div className={styles.optionTitle}>Short Term</div>
                          <div className={styles.optionDescription}>Casual dating & fun connections</div>
                        </div>
                      </div>
                    </label>

                    {/* Long Term Option Card */}
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="relationshipGoal"
                        value="longTerm"
                        checked={selectedGoal === 'longTerm'}
                        onChange={() => setSelectedGoal('longTerm')}
                      />
                      <div className={`${styles.optionCard} ${selectedGoal === 'longTerm' ? styles.selected : ''}`}>
                        <div className={styles.optionIcon}>💕</div>
                        <div className={styles.optionContent}>
                          <div className={styles.optionTitle}>Long Term</div>
                          <div className={styles.optionDescription}>Serious relationship & commitment</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <h2>Tell us about yourself</h2>
                  <div className={styles.stepIndicator}>Step 3 of 5</div>

                  <div className={styles.inputContainer}>
                    <label>
                      Location
                      {locationPermissionDenied ? (
                        <input
                          type="text"
                          placeholder='Enter your location (e.g., New York, NY)'
                          value={manualLocation}
                          onChange={(e) => {
                            setManualLocation(e.target.value);
                            setLocation(e.target.value);
                          }}
                        />
                      ) : (
                        <p>{location?.name || 'Detecting location...'}</p>
                      )}
                    </label>
                  </div>

                  <div className={styles.genderSection}>
                    <h5>Your Gender</h5>
                    <div className={styles.genderOptions}>
                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={gender === 'male'}
                          onChange={() => setGender('male')}
                        />
                        <div className={`${styles.genderPill} ${gender === 'male' ? styles.selected : ''}`}>
                          Male
                        </div>
                      </label>

                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={gender === 'female'}
                          onChange={() => setGender('female')}
                        />
                        <div className={`${styles.genderPill} ${gender === 'female' ? styles.selected : ''}`}>
                          Female
                        </div>
                      </label>

                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="other"
                          checked={gender === 'other'}
                          onChange={() => setGender('other')}
                        />
                        <div className={`${styles.genderPill} ${gender === 'other' ? styles.selected : ''}`}>
                          Other
                        </div>
                      </label>
                    </div>
                  </div>
                </>
              )}

              <button
                className={styles.nextButton}
                onClick={handleNext}
                disabled={isLoading || (currentStep === 2 && !gender)}
              >
                {currentStep === 1 ? 'Continue' : 'Complete'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};


export default RelationshipGoals;
