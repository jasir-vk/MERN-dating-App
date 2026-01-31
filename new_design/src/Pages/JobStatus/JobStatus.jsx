import React, { useState } from 'react';
import JobStyles from './jobstatusModal.module.css'; // Import the CSS module
import LandingPage from '../LandingPage/LandingPage';
import { JobStatusAPI } from '../../Services/jobStatusAPI';
import { useNavigate } from 'react-router-dom';



const JobStatusComponent = () => {
  const navigate = useNavigate()
  const [selectedOption, setSelectedOption] = useState('');
  const [step, setStep] = useState(0);
  // const [expertiseLevel, setExpertiseLevel] = useState('');
  const [employer, setEmployer] = useState({
    companyName: '',
    designation: '',
    location: ''
  })

  const [jobSeeker, setJobSeeker] = useState({
    jobTitle: '',
    expertiseLevel: ''
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleRadioChange = (event) => {
    console.log("value:", event.target.value);
    setSelectedOption(event.target.value);
  };

  const handleNext = () => {
    if (selectedOption) {
      setStep(1);
    }
  };

  const handleExpertiseChange = (event) => {
    setJobSeeker({
      ...jobSeeker,
      expertiseLevel: event.target.value // Update expertiseLevel directly in jobSeeker state
    });
  };

  const handleEmployerChange = (e) => {
    setEmployer({
      ...employer,
      [e.target.name]: e.target.value
    })
  }

  const handleJobSeekerChange = (e) => {
    setJobSeeker({
      ...jobSeeker,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedOption === 'employer') {
        await JobStatusAPI({ type: 'employer', ...employer })
      } else if (selectedOption === 'jobSeeker') {
        await JobStatusAPI({ type: 'jobSeeker', ...jobSeeker })
      }
      setMessage('Saved')
      navigate('/relationship-goals')
    } catch (error) {
      console.error('Error saving job status:', error);
      setError('Error saving job status')
    }
  }

  return (
    <>
      <LandingPage />
      <div>
        {step === 0 && (
          <div className={JobStyles.modalOverlay}>
            <div className={JobStyles.modal}>
              {/* Progress Indicator */}
              <div className={JobStyles.progressIndicator}>
                <div className={JobStyles.progressDot}></div>
                <div className={`${JobStyles.progressDot} ${JobStyles.active}`}></div>
                <div className={JobStyles.progressDot}></div>
                <div className={JobStyles.progressDot}></div>
                <div className={JobStyles.progressDot}></div>
              </div>

              <h2>What's your work situation?</h2>
              <div className={JobStyles.stepIndicator}>Step 2 of 5</div>

              <form>
                {/* Employer Option Card */}
                <label>
                  <input
                    type="radio"
                    name="jobStatus"
                    value="employer"
                    checked={selectedOption === 'employer'}
                    onChange={handleRadioChange}
                  />
                  <div className={`${JobStyles.optionCard} ${selectedOption === 'employer' ? JobStyles.selected : ''}`}>
                    <div className={JobStyles.optionIcon}>💼</div>
                    <div className={JobStyles.optionContent}>
                      <div className={JobStyles.optionTitle}>I'm employed</div>
                      <div className={JobStyles.optionDescription}>Full time work</div>
                    </div>
                  </div>
                </label>

                {/* Job Seeker Option Card */}
                <label>
                  <input
                    type="radio"
                    name="jobStatus"
                    value="jobSeeker"
                    checked={selectedOption === 'jobSeeker'}
                    onChange={handleRadioChange}
                  />
                  <div className={`${JobStyles.optionCard} ${selectedOption === 'jobSeeker' ? JobStyles.selected : ''}`}>
                    <div className={JobStyles.optionIcon}>🔍</div>
                    <div className={JobStyles.optionContent}>
                      <div className={JobStyles.optionTitle}>Looking for job</div>
                      <div className={JobStyles.optionDescription}>Open to work</div>
                    </div>
                  </div>
                </label>

                <button type="button" className={JobStyles.btnNext} onClick={handleNext} disabled={!selectedOption}>
                  Continue
                </button>
              </form>
            </div>
          </div>
        )}

        {step === 1 && selectedOption === 'employer' && (
          <div className={JobStyles.modalOverlay}>
            <div className={JobStyles.modal}>
              {/* Progress Indicator */}
              <div className={JobStyles.progressIndicator}>
                <div className={JobStyles.progressDot}></div>
                <div className={`${JobStyles.progressDot} ${JobStyles.active}`}></div>
                <div className={JobStyles.progressDot}></div>
                <div className={JobStyles.progressDot}></div>
                <div className={JobStyles.progressDot}></div>
              </div>

              <h2>Tell us about your job</h2>
              <div className={JobStyles.stepIndicator}>Step 2 of 5</div>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="companyName"
                  value={employer.companyName}
                  onChange={handleEmployerChange}
                  placeholder="Company Name"
                  required
                />
                <input
                  type="text"
                  name="designation"
                  value={employer.designation}
                  onChange={handleEmployerChange}
                  placeholder="Designation"
                  required
                />
                <input
                  type="text"
                  name="location"
                  value={employer.location}
                  onChange={handleEmployerChange}
                  placeholder="Location"
                  required
                />
                <button type="submit" className={JobStyles.btnNext}>
                  Continue
                </button>
              </form>
            </div>
          </div>
        )}

        {step === 1 && selectedOption === 'jobSeeker' && (
          <div className={JobStyles.modalOverlay}>
            <div className={JobStyles.modal}>
              {/* Progress Indicator */}
              <div className={JobStyles.progressIndicator}>
                <div className={JobStyles.progressDot}></div>
                <div className={`${JobStyles.progressDot} ${JobStyles.active}`}></div>
                <div className={JobStyles.progressDot}></div>
                <div className={JobStyles.progressDot}></div>
                <div className={JobStyles.progressDot}></div>
              </div>

              <h2>What are you looking for?</h2>
              <div className={JobStyles.stepIndicator}>Step 2 of 5</div>

              <form onSubmit={handleSubmit}>
                <input type="text"
                  name="jobTitle"
                  placeholder="Desired Job Title"
                  value={jobSeeker.jobTitle}
                  onChange={handleJobSeekerChange}
                  required
                />

                <h3 className={JobStyles.expertiseHeading}>Your Expertise Level</h3>

                <div className={JobStyles.expertiseOptions}>
                  <label>
                    <input
                      type="radio"
                      name="expertiseLevel"
                      value="beginner"
                      checked={jobSeeker.expertiseLevel === 'beginner'}
                      onChange={handleExpertiseChange}
                    />
                    <div className={`${JobStyles.expertisePill} ${jobSeeker.expertiseLevel === 'beginner' ? JobStyles.selected : ''}`}>
                      Beginner
                    </div>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="expertiseLevel"
                      value="intermediate"
                      checked={jobSeeker.expertiseLevel === 'intermediate'}
                      onChange={handleExpertiseChange}
                    />
                    <div className={`${JobStyles.expertisePill} ${jobSeeker.expertiseLevel === 'intermediate' ? JobStyles.selected : ''}`}>
                      Intermediate
                    </div>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="expertiseLevel"
                      value="expert"
                      checked={jobSeeker.expertiseLevel === 'expert'}
                      onChange={handleExpertiseChange}
                    />
                    <div className={`${JobStyles.expertisePill} ${jobSeeker.expertiseLevel === 'expert' ? JobStyles.selected : ''}`}>
                      Expert
                    </div>
                  </label>
                </div>

                <button type="submit" className={JobStyles.btnNext} disabled={!jobSeeker.expertiseLevel}>
                  Continue
                </button>

                {message && <div className={JobStyles.successMessage}>{message}</div>}
                {error && <div className={JobStyles.errorMessage}>{error}</div>}
              </form>
            </div>
          </div>
        )}
      </div>
    </>);
};

export default JobStatusComponent;