import React from 'react';
import styles from './EmptyState.module.css';

const EmptyState = ({
  icon = '💬',
  title = 'Nothing here yet',
  subtitle = 'Check back soon!',
  actionText,
  onAction
}) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.iconContainer}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.subtitle}>{subtitle}</p>
      {actionText && onAction && (
        <button className={styles.actionButton} onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
