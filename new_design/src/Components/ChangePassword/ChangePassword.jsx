import React, { useState } from 'react';
import styles from './ChangePassword.module.css';
import { Link } from 'react-router-dom';
import { changePasswordAPI } from '../../Services/changePasswordAPI';

const ChangePassword = () => {
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  // Calculate password strength
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return '';

    let strength = 0;

    // Length check
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;

    // Character variety checks
    if (/[a-z]/.test(pwd)) strength++; // lowercase
    if (/[A-Z]/.test(pwd)) strength++; // uppercase
    if (/[0-9]/.test(pwd)) strength++; // numbers
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++; // special characters

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassword({
      ...password,
      [name]: value
    });

    // Update password strength for new password field
    if (name === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };
  // const togglePasswordVisibility = () => {
  //   setShowPassword(!showPassword)
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmNewPassword) {
      setError('New Password does not match with Confirm Password');
      setTimeout(() => {
        setError('');
      }, 2000)
      return;
    }
    try {
      const response = await changePasswordAPI({
        currentPassword: password.currentPassword,
        newPassword: password.newPassword
      });

      if (response.success) {
        setMessage(response.message);
        setTimeout(() => {
          setMessage('');
        }, 2000);
      } else {
        setError(response.error || 'Failed to change the password');
        setTimeout(() => {
          setError('');
        }, 2000);
      }
    } catch (error) {
      setError(error);
      setTimeout(() => {
        setError('');
      }, 2000);
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to='/edit-my-profile' style={{ textDecoration: 'none' }}>
          <button className={styles.backButton}>&lt;</button>
        </Link>
        <h1>Change Password</h1>
      </div>
      <div className={styles.content}>
        <p className={styles.message}>
          Feeling worried about your account been easily preyed on? Then change that password now!
        </p>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              name='currentPassword'
              value={password.currentPassword}
              onChange={handleChange}
              placeholder="Current Password"
            />
            <span className={styles.eyeButton}
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
              {showCurrentPassword ? '👁' : '👁‍🗨'}
            </span>
          </div>

          <div className={styles.inputGroup}>
            <input
              type={showNewPassword ? 'text' : 'password'}
              name='newPassword'
              value={password.newPassword}
              onChange={handleChange}
              placeholder="New Password"
            />
            <span className={styles.eyeButton}
              onClick={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? '👁' : '👁‍🗨'}
            </span>
            {/* Password Strength Meter */}
            {password.newPassword && (
              <>
                <div className={styles.strengthMeter}>
                  <div className={`${styles.strengthBar} ${styles[passwordStrength]}`}></div>
                </div>
                <div className={`${styles.strengthText} ${styles[passwordStrength]}`}>
                  {passwordStrength === 'weak' && 'Weak password - Add more characters and variety'}
                  {passwordStrength === 'medium' && 'Medium password - Consider adding special characters'}
                  {passwordStrength === 'strong' && 'Strong password'}
                </div>
              </>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input
              type={showConfirmNewPassword ? 'text' : 'password'}
              name='confirmNewPassword'
              value={password.confirmNewPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
            />
            <span className={styles.eyeButton}
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
              {showConfirmNewPassword ? '👁' : '👁‍🗨'}
            </span>
          </div>

          <button type="submit" className={styles.updateButton}>Update Password</button>

          {error && (
            <div className={styles.errorMessage}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div className={styles.successMessage}>
              <span>✓</span>
              <span>{message}</span>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default ChangePassword;