import React, { useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = ({
  message,
  type = 'info', // 'success' | 'error' | 'info' | 'warning'
  duration = 3000,
  onClose
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    info: 'info-circle',
    warning: 'exclamation-triangle'
  };

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.iconContainer}>
        <i className={`fas fa-${icons[type]}`}></i>
      </div>
      <span className={styles.message}>{message}</span>
      {onClose && (
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close notification">
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};

export default Toast;
